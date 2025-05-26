import cv2 as cv
from flask import Flask, Response
from dotenv import load_dotenv
import time, os, threading

# import our license plate modules
from lp_detect import load_model, detect_license_plates
from lp_read import process_license_plate

# load environment variables
load_dotenv()
PORT = int(os.getenv("AI_PORT", 3000)) # streaming port
CAMERA = os.getenv("CAMERA", 0) # camera source, can be a URL or an index

# states
AUTH_STATE_IDLE = 0
AUTH_STATE_RECOGNIZING = 1
AUTH_STATE_ACCESS_GRANTED = 2

# variables for authentication state
auth_state = AUTH_STATE_IDLE
auth_start_time = 0
access_granted_time = 0
recognition_timeout = 5  # seconds
access_timeout = 10  # seconds
plate_matches = {}  # Counter for each detected plate
required_matches = 3  # Number of matches required to grant access
access_granted_plate = ""

# load YOLO model
net = load_model()

def handle_auth_state(access_granted, matched_plate):
    global auth_state, auth_start_time, plate_matches, access_granted_time, access_granted_plate
    
    if access_granted and auth_state == AUTH_STATE_IDLE:
        # start recognition countdown
        auth_state = AUTH_STATE_RECOGNIZING
        auth_start_time = time.time()
        plate_matches = {matched_plate: 1}
    
    elif access_granted and auth_state == AUTH_STATE_RECOGNIZING:
        # Count matches during recognition phase
        if matched_plate in plate_matches:
            plate_matches[matched_plate] += 1
        else:
            plate_matches[matched_plate] = 1
            
        # Check if we have enough matches for any plate
        for plate, count in plate_matches.items():
            if count >= required_matches:
                auth_state = AUTH_STATE_ACCESS_GRANTED
                access_granted_time = time.time()
                access_granted_plate = plate
                break

# Process license plate wrapper that includes auth state handling
def process_plate_with_auth(frame, left, top, width, height, confidence):
    return process_license_plate(frame, left, top, width, height, confidence, handle_auth_state)

# Draw the authentication system state UI
def draw_auth_ui(frame):
    global auth_state, auth_start_time, access_granted_time, access_granted_plate
    
    # Draw title bar
    cv.rectangle(frame, (0, 0), (frame.shape[1], 60), (40, 40, 40), -1)
    cv.putText(frame, "LICENSE PLATE AUTHENTICATION SYSTEM", 
               (30, 40), cv.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
    
    # Draw status bar at bottom
    overlay = frame.copy()
    cv.rectangle(overlay, (0, frame.shape[0] - 100), (frame.shape[1], frame.shape[0]), (40, 40, 40), -1)
    cv.addWeighted(overlay, 0.8, frame, 0.2, 0, frame)
    
    # Draw authentication state
    if auth_state == AUTH_STATE_IDLE:
        status_text = "WAITING FOR VEHICLE"
        status_color = (255, 255, 255)
    elif auth_state == AUTH_STATE_RECOGNIZING:
        elapsed = time.time() - auth_start_time
        remaining = max(0, recognition_timeout - elapsed)
        
        if remaining == 0:
            auth_state = AUTH_STATE_IDLE
            plate_matches.clear()
            
        status_text = f"RECOGNIZING LICENSE PLATE: {remaining:.1f}s"
        status_color = (0, 255, 255)
        
        # Show match counts
        y_pos = frame.shape[0] - 60
        for plate, count in plate_matches.items():
            match_text = f"{plate}: {count}/{required_matches} MATCHES"
            cv.putText(frame, match_text, (50, y_pos), cv.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
            y_pos += 30
            
    elif auth_state == AUTH_STATE_ACCESS_GRANTED:
        elapsed = time.time() - access_granted_time
        remaining = max(0, access_timeout - elapsed)
        
        if remaining == 0:
            auth_state = AUTH_STATE_IDLE
            access_granted_plate = ""
            
        status_text = f"ACCESS GRANTED FOR {access_granted_plate} - {remaining:.1f}s"
        status_color = (0, 255, 0)
    
    # Draw main status text
    cv.putText(frame, status_text, (30, frame.shape[0] - 30), 
               cv.FONT_HERSHEY_SIMPLEX, 1.2, status_color, 3)

# Create Flask app
app = Flask(__name__)

# Global variables for streaming
outputFrame = None
lock = threading.Lock()

# Generate frames for the stream
def generate():
    global outputFrame, lock
    
    while True:
        with lock:
            if outputFrame is None:
                continue
                
            # Encode the frame as JPEG
            _, buffer = cv.imencode('.jpg', outputFrame)
            frame_bytes = buffer.tobytes()
            
        # Yield the frame in HTTP multipart format
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# Route for the video stream
@app.route('/')
def video_feed():
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

class VideoCaptureThreaded:
    def __init__(self, src):
        self.stream = cv.VideoCapture(src)
        self.ret = False
        self.frame = None
        self.lock = threading.Lock()
        self.running = True

        thread = threading.Thread(target=self.update, daemon=True)
        thread.start()

    def update(self):
        while self.running:
            if not self.stream.isOpened():
                time.sleep(1)
                continue
            ret, frame = self.stream.read()
            with self.lock:
                self.ret = ret
                self.frame = frame

    def read(self):
        with self.lock:
            return self.ret, self.frame

    def release(self):
        self.running = False
        self.stream.release()

# Function to process frames and update the global outputFrame
def process_frames():
    global outputFrame, lock, auth_state, auth_start_time, plate_matches, access_granted_time, access_granted_plate
    
    # Initialize video stream
    cap = VideoCaptureThreaded("http://localhost:5001")  # For macOS

    while True:
        ret, frame = cap.read()  # Properly unpack the return values
        
        if not ret or frame is None:
            continue  # Skip this iteration if the frame is invalid
            
        # Only process frames if not in access granted state
        if auth_state != AUTH_STATE_ACCESS_GRANTED:
            inference_time = detect_license_plates(frame, net, process_plate_with_auth)
        else:
            inference_time = 0

        # Draw authentication UI
        draw_auth_ui(frame)

        # Display performance info
        cv.putText(frame, f"Inference: {inference_time:.1f}ms", 
                (frame.shape[1] - 250, 30), cv.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)

        # Update the output frame
        with lock:
            outputFrame = frame.copy()
    
    cap.release()

# Entry point
if __name__ == '__main__':
    # Start frame processing in a separate thread
    frame_thread = threading.Thread(target=process_frames)
    frame_thread.daemon = True
    frame_thread.start()

    app.run(host='0.0.0.0', port=PORT, debug=False, threaded=True)

# Release resources on exit
cv.destroyAllWindows()