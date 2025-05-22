import cv2 as cv
import numpy as np
import easyocr
import time, os
# Add Flask imports
from flask import Flask, Response
import threading
from dotenv import load_dotenv

load_dotenv()
PORT = int(os.getenv("PORT", 3000))
MODEL_CONFIG_PATH = os.getenv("MODEL_CONFIG_PATH", "model/darknet-yolov3.cfg")
MODEL_WEIGHTS_PATH = os.getenv("MODEL_WEIGHTS_PATH", "model/model.weights")

# initialize the parameters
confThreshold = 0.5  # confidence threshold
nmsThreshold = 0.4   # non-maximum suppression threshold
inpWidth = 416       # width of network's input image
inpHeight = 416      # height of network's input image

classes = ["License Plate"]
license_plates = ["EL106AC", "8AN4277", "BLBECEK", "B2228HM"]

net = cv.dnn.readNetFromDarknet(MODEL_CONFIG_PATH, MODEL_WEIGHTS_PATH)
net.setPreferableBackend(cv.dnn.DNN_BACKEND_OPENCV)
net.setPreferableTarget(cv.dnn.DNN_TARGET_CPU)

# initialize EasyOCR reader for license plate recognition
reader = easyocr.Reader(['en'], gpu=False)

# Authentication system states and variables
AUTH_STATE_IDLE = 0
AUTH_STATE_RECOGNIZING = 1
AUTH_STATE_ACCESS_GRANTED = 2
auth_state = AUTH_STATE_IDLE
auth_start_time = 0
access_granted_time = 0
recognition_timeout = 5  # seconds
access_timeout = 10  # seconds
plate_matches = {}  # Counter for each detected plate
required_matches = 3  # Number of matches required to grant access
access_granted_plate = ""

def check_license_plate_access(recognized_plate):
    """
    Check if the recognized license plate should be granted access based on allowed plates.
    Returns: (access_granted, matched_plate)
    """
    if not recognized_plate:
        return False, ""
    
    # First check for direct matches (plate is contained in recognized text)
    for allowed_plate in license_plates:
        if allowed_plate in recognized_plate:
            return True, allowed_plate
    
    # Then check for matches with one extra character tolerance
    for allowed_plate in license_plates:
        # Check if lengths differ by at most 1 character
        if len(recognized_plate) == len(allowed_plate) + 1:
            # Try removing each character of recognized_plate one by one
            for i in range(len(recognized_plate)):
                # Remove the character at position i
                modified = recognized_plate[:i] + recognized_plate[i+1:]
                # Check if this matches the allowed plate
                if modified == allowed_plate:
                    return True, allowed_plate
                
        # Check if recognized text contains the plate with one character inserted
        if len(recognized_plate) > len(allowed_plate):
            for i in range(len(recognized_plate) - len(allowed_plate) + 1):
                substring = recognized_plate[i:i+len(allowed_plate)]
                # Calculate edit distance (should be 1 if just one character differs)
                edits = sum(1 for a, b in zip(substring, allowed_plate) if a != b)
                # Add remaining length difference to edit count
                edits += abs(len(substring) - len(allowed_plate))
                if edits <= 1:
                    return True, allowed_plate

    return False, ""

def process_license_plate(frame, left, top, width, height, confidence, pad=10):
    global auth_state, auth_start_time, plate_matches, access_granted_time, access_granted_plate
    
    # Add padding to the license plate region
    padded_left = max(left - pad, 0)
    padded_top = max(top - pad, 0)
    padded_right = min(left + width + pad, frame.shape[1])
    padded_bottom = min(top + height + pad, frame.shape[0])

    license_plate = frame[padded_top:padded_bottom, padded_left:padded_right].copy()

    if license_plate.size == 0:
        return None

    # Convert to grayscale
    gray = cv.cvtColor(license_plate, cv.COLOR_BGR2GRAY)

    # CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    gray = clahe.apply(gray)

    # Bilateral filter for noise removal
    gray = cv.bilateralFilter(gray, 11, 17, 17)

    # Sharpen the image to enhance edges
    kernel_sharpen = np.array([[0, -1, 0],
                               [-1, 5,-1],
                               [0, -1, 0]])
    gray = cv.filter2D(gray, -1, kernel_sharpen)

    # Deskew using improved method
    angle = detect_skew_angle(gray)
    if angle != 0:
        gray = rotate_image(gray, angle)

    # Adaptive Thresholding (better for variable lighting)
    thresh = cv.adaptiveThreshold(gray, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C,
                                  cv.THRESH_BINARY_INV, 19, 9)

    # Morphological operations to connect characters
    kernel = cv.getStructuringElement(cv.MORPH_RECT, (3, 3))
    processed = cv.morphologyEx(thresh, cv.MORPH_CLOSE, kernel)

    # OCR and access check
    clean_text = get_text_from_license_plate(processed)

    if clean_text:
        access_granted, matched_plate = check_license_plate_access(clean_text)
        
        if access_granted and auth_state == AUTH_STATE_IDLE:
            # Start recognition countdown
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
        
        # Display detected plate in top-right corner
        plate_width = 200
        plate_height = int(license_plate.shape[0] * (plate_width / license_plate.shape[1]))
        
        x_offset = frame.shape[1] - plate_width - 10
        y_offset = 70  # Below title bar
        
        resized_plate = cv.resize(license_plate, (plate_width, plate_height))
        frame[y_offset:y_offset+plate_height, x_offset:x_offset+plate_width] = resized_plate
        
        # Display processed version
        processed_color = cv.cvtColor(processed, cv.COLOR_GRAY2BGR)
        processed_height = int(processed.shape[0] * (plate_width / processed.shape[1]))
        frame[y_offset+plate_height+5:y_offset+plate_height+5+processed_height, x_offset:x_offset+plate_width] = cv.resize(processed_color, (plate_width, processed_height))
        
        # Draw OCR text
        cv.rectangle(frame, (x_offset, y_offset+plate_height+processed_height+5), 
                    (x_offset+plate_width, y_offset+plate_height+processed_height+35), 
                    (60, 60, 60), -1)
        cv.putText(frame, clean_text, (x_offset+5, y_offset+plate_height+processed_height+25), 
                   cv.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        return clean_text
    
    return None

def get_text_from_license_plate(license_plate):
    results = reader.readtext(license_plate, detail=0, paragraph=False, allowlist='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
    clean_text = ''.join(filter(str.isalnum, ''.join(results))).upper()
    return clean_text

def detect_skew_angle(image):
    # Apply edge detection
    edges = cv.Canny(image, 50, 150, apertureSize=3)
    
    # Use probabilistic Hough Line Transform
    lines = cv.HoughLinesP(edges, 1, np.pi/180, 
                           threshold=100, 
                           minLineLength=100, 
                           maxLineGap=10)
    
    # If no lines detected, return 0 (no rotation needed)
    if lines is None or len(lines) == 0:
        return 0
    
    # Calculate angles of lines
    angles = []
    for line in lines:
        x1, y1, x2, y2 = line[0]
        # Skip vertical lines (would cause division by zero)
        if x2 - x1 == 0:
            continue
        angle = np.arctan2(y2 - y1, x2 - x1) * 180.0 / np.pi
        # Consider only angles close to horizontal (-30 to 30 degrees)
        if abs(angle) < 30:
            angles.append(angle)
    
    # If no valid angles found, return 0
    if not angles:
        return 0
    
    # Return the median angle (more robust than mean)
    return np.median(angles)

def rotate_image(image, angle):
    # Get image dimensions
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    
    # Calculate rotation matrix
    M = cv.getRotationMatrix2D(center, angle, 1.0)
    
    # Perform the rotation
    rotated = cv.warpAffine(image, M, (w, h), 
                            flags=cv.INTER_CUBIC, 
                            borderMode=cv.BORDER_REPLICATE)
    
    return rotated

# Get the names of the output layers
def getOutputsNames(net):
    layersNames = net.getLayerNames()
    unconnected_out_layers = net.getUnconnectedOutLayers()
    if isinstance(unconnected_out_layers, np.ndarray):
        return [layersNames[i - 1] for i in unconnected_out_layers.flatten()]
    else:
        return [layersNames[unconnected_out_layers - 1]]

# Draw the predicted bounding box
def drawPred(frame, classId, conf, left, top, right, bottom):
    if classes:
        assert(classId < len(classes))
        if classes[classId].lower() in ['license plate', 'license-plate', 'licenseplate', 'number plate', 'plate']:
            # Draw bounding box
            cv.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            process_license_plate(frame, left, top, right-left, bottom-top, conf)

# Remove low-confidence bounding boxes
def postprocess(frame, outs):
    frameHeight = frame.shape[0]
    frameWidth = frame.shape[1]
    classIds = []
    confidences = []
    boxes = []

    for out in outs:
        for detection in out:
            scores = detection[5:]
            classId = np.argmax(scores)
            confidence = scores[classId]
            if confidence > confThreshold:
                center_x = int(detection[0] * frameWidth)
                center_y = int(detection[1] * frameHeight)
                width = int(detection[2] * frameWidth)
                height = int(detection[3] * frameHeight)
                left = int(center_x - width / 2)
                top = int(center_y - height / 2)
                classIds.append(classId)
                confidences.append(float(confidence))
                boxes.append([left, top, width, height])

    indices = cv.dnn.NMSBoxes(boxes, confidences, confThreshold, nmsThreshold)
    if len(indices) > 0:
        for i in indices.flatten():
            box = boxes[i]
            left, top, width, height = box
            drawPred(frame, classIds[i], confidences[i], left, top, left + width, top + height)

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


# Function to process frames and update the global outputFrame
def process_frames():
    global outputFrame, lock, auth_state, auth_start_time, plate_matches, access_granted_time, access_granted_plate
    
    # Initialize video stream
    cap = cv.VideoCapture(0)
    
    while True:
        hasFrame, frame = cap.read()
        if not hasFrame:
            time.sleep(1)
            continue

        # Only process frames if not in access granted state
        if auth_state != AUTH_STATE_ACCESS_GRANTED:
            blob = cv.dnn.blobFromImage(frame, 1/255, (inpWidth, inpHeight), [0,0,0], 1, crop=False)
            net.setInput(blob)
            outs = net.forward(getOutputsNames(net))
            postprocess(frame, outs)

        # Draw authentication UI
        draw_auth_ui(frame)

        # Display performance info
        t, _ = net.getPerfProfile()
        inference_time = t * 1000.0 / cv.getTickFrequency()
        cv.putText(frame, f"Inference: {inference_time:.1f}ms", 
                (frame.shape[1] - 250, 30), cv.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)

        # Update the output frame
        with lock:
            outputFrame = frame.copy()
            
        # Short delay to reduce CPU usage
        time.sleep(0.03)
    
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