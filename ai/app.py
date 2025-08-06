from ultralytics import YOLO
import cv2
import numpy as np
import time
import requests
import threading
from queue import Queue
import os

# Configure OpenCV for better RTSP handling
os.environ['OPENCV_FFMPEG_CAPTURE_OPTIONS'] = 'rtsp_transport;tcp'

# Constants
MARGIN_X = 20
MARGIN_Y = 20
CHAR_DISPLAY_SIZE = (300, 120)
DETECTION_THRESHOLD = 5  # Number of times LP must be detected before triggering
COUNTER_RESET_TIME = 30  # Reset detection counters after 30 seconds of no detection
API = os.getenv("API_URL", "http://api:8080")  # Use Docker service name

CHAR_MAP = {
        0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
        10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F', 16: 'G', 17: 'H', 18: 'I', 19: 'J',
        20: 'K', 21: 'L', 22: 'M', 23: 'N', 24: 'O', 25: 'P', 26: 'Q', 27: 'R', 28: 'S', 29: 'T',
        30: 'U', 31: 'V', 32: 'W', 33: 'X', 34: 'Y', 35: 'Z'
    }

CAM_ENTER_URL = os.getenv("CAM_ENTER_URL", "rtsp://admin:123456@109.164.15.139:6002/h264")
CAM_EXIT_URL = os.getenv("CAM_EXIT_URL", "rtsp://admin:123456@109.164.15.139:6001/h264")
USE_WEBCAM = os.getenv("USE_WEBCAM", "false").lower() == "true"

class ThreadedCamera:
    def __init__(self, src, queue_size=2):
        self.src = src
        self.cap = None
        self.q = Queue(maxsize=queue_size)
        self.running = True
        self.connected = False
        self.reconnect_attempts = 0
        self.max_reconnect_attempts = 10
        self.reconnect_delay = 5  # seconds
        
        self._initialize_camera()
        
        self.thread = threading.Thread(target=self._reader)
        self.thread.daemon = True
        self.thread.start()
    
    def _initialize_camera(self):
        """Initialize camera with proper timeout settings"""
        try:
            print(f"Attempting to connect to camera: {self.src}")
            
            # For RTSP streams, try with specific options
            if isinstance(self.src, str) and self.src.startswith('rtsp'):
                # Try with TCP transport first
                rtsp_url_tcp = f"{self.src}?tcp"
                self.cap = cv2.VideoCapture(rtsp_url_tcp, cv2.CAP_FFMPEG)
                
                # If TCP fails, try original URL
                if not self.cap.isOpened():
                    print(f"TCP transport failed, trying original URL: {self.src}")
                    self.cap = cv2.VideoCapture(self.src, cv2.CAP_FFMPEG)
            else:
                self.cap = cv2.VideoCapture(self.src)
            
            # Set aggressive timeout settings for network streams
            if isinstance(self.src, str) and self.src.startswith('rtsp'):
                # Connection timeouts
                self.cap.set(cv2.CAP_PROP_OPEN_TIMEOUT_MSEC, 30000)  # 30 second connection timeout
                self.cap.set(cv2.CAP_PROP_READ_TIMEOUT_MSEC, 15000)  # 15 second read timeout
                
                # Buffer settings to reduce latency
                self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                
                # Additional RTSP settings
                self.cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc('H', '2', '6', '4'))
                
                # Try to set FPS to reduce load
                self.cap.set(cv2.CAP_PROP_FPS, 10)
                
            # Test the connection with multiple attempts
            connection_attempts = 3
            for attempt in range(connection_attempts):
                if self.cap.isOpened():
                    print(f"Camera opened, testing frame read (attempt {attempt + 1}/{connection_attempts})...")
                    ret, frame = self.cap.read()
                    if ret and frame is not None:
                        self.connected = True
                        self.reconnect_attempts = 0
                        print(f"✅ Successfully connected to camera: {self.src}")
                        print(f"   Frame shape: {frame.shape}")
                        return
                    else:
                        print(f"Camera opened but cannot read frames (attempt {attempt + 1}/{connection_attempts})")
                        if attempt < connection_attempts - 1:
                            time.sleep(2)  # Wait before next attempt
                else:
                    print(f"Failed to open camera (attempt {attempt + 1}/{connection_attempts}): {self.src}")
                    if attempt < connection_attempts - 1:
                        time.sleep(2)  # Wait before next attempt
                        # Recreate the capture object for next attempt
                        if self.cap:
                            self.cap.release()
                        if isinstance(self.src, str) and self.src.startswith('rtsp'):
                            self.cap = cv2.VideoCapture(self.src, cv2.CAP_FFMPEG)
                        else:
                            self.cap = cv2.VideoCapture(self.src)
            
            print(f"❌ All connection attempts failed for camera: {self.src}")
            self.connected = False
                
        except Exception as e:
            print(f"❌ Error initializing camera {self.src}: {e}")
            self.connected = False
    
    def _reader(self):
        while self.running:
            if not self.connected or not self.cap or not self.cap.isOpened():
                if self.reconnect_attempts < self.max_reconnect_attempts:
                    print(f"Attempting to reconnect to camera {self.src} (attempt {self.reconnect_attempts + 1}/{self.max_reconnect_attempts})")
                    time.sleep(self.reconnect_delay)
                    self.reconnect_attempts += 1
                    self._initialize_camera()
                    continue
                else:
                    print(f"Max reconnection attempts reached for camera {self.src}")
                    time.sleep(30)  # Wait longer before retrying
                    self.reconnect_attempts = 0  # Reset counter
                    continue
            
            try:
                ret, frame = self.cap.read()
                if not ret:
                    print(f"Failed to read frame from camera {self.src}")
                    self.connected = False
                    continue
                
                # Keep only the latest frame
                if not self.q.empty():
                    try:
                        self.q.get_nowait()  # Remove old frame
                    except:
                        pass
                
                try:
                    self.q.put_nowait(frame)
                except:
                    pass  # Queue is full, skip this frame
                    
            except Exception as e:
                print(f"Error reading from camera {self.src}: {e}")
                self.connected = False
                time.sleep(1)
    
    def read(self):
        if not self.q.empty():
            return True, self.q.get()
        return False, None
    
    def isOpened(self):
        return self.cap.isOpened()
    
    def get(self, prop):
        return self.cap.get(prop)
    
    def release(self):
        self.running = False
        self.thread.join()
        self.cap.release()

def is_inside_roi(box, roi_points):
    if roi_points is None:
        return True
    
    x1, y1, x2, y2 = box
    center_x = float((x1 + x2) / 2)
    center_y = float((y1 + y2) / 2)

    point = (center_x, center_y)
    
    return cv2.pointPolygonTest(roi_points, point, False) >= 0

def extract_license_plate(frame, box_coords):
    x1, y1, x2, y2 = map(int, box_coords)
    return frame[y1:y2, x1:x2], (x1, y1, x2, y2)

def process_characters(char_results, plate_image):
    detected_chars = []
    char_vis = plate_image.copy()
    
    for result in char_results:
        if result.boxes is not None:
            boxes = result.boxes.cpu().numpy()
            for box in boxes:
                cx1, cy1, cx2, cy2 = map(int, box.xyxy[0])
                cv2.rectangle(char_vis, (cx1, cy1), (cx2, cy2), (0, 255, 0), 2)
                if box.cls is not None:
                    cls_id = int(box.cls[0])
                    # Map class ID to actual character
                    char = CHAR_MAP.get(cls_id, f'class{cls_id}')
                    cv2.putText(char_vis, char, (cx1, cy1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                    detected_chars.append((char, cx1))
    
    detected_chars.sort(key=lambda x: x[1])
    lp_text = ''.join([char for char, _ in detected_chars])
    
    return char_vis, lp_text

def render_preview(display, preview_img, x, y):
    preview_h, preview_w = preview_img.shape[:2]
    preview_region = display[y:y+preview_h, x:x+preview_w]
    if preview_region.shape == (preview_h, preview_w, 3):
        display[y:y+preview_h, x:x+preview_w] = preview_img

def render_text_with_background(display, text, x, y, font_scale=1.0, thickness=2):
    text_size = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, thickness)[0]
    text_w, text_h = text_size
    cv2.rectangle(display, (x, y), (x + text_w + 10, y + text_h + 10), (0, 0, 0), -1)
    cv2.putText(display, text, (x + 5, y + text_h + 5), cv2.FONT_HERSHEY_SIMPLEX, 
                font_scale, (255, 255, 255), thickness)

def visualize_detection(display, box_coords, color=(255, 0, 0), thickness=3):
    """Draw bounding box for detection"""
    x1, y1, x2, y2 = map(int, box_coords)
    cv2.rectangle(display, (x1, y1), (x2, y2), color, thickness)

def process_license_plates(frame, lp_results, roi_points, char_recognizer, display, offset_x=0, offset_y=0, camera_type="enter", detection_counters=None, last_seen_times=None):
    """Process detected license plates"""
    if len(lp_results[0].boxes) <= 0:
        return
        
    for box in lp_results[0].boxes:
        box_coords = box.xyxy[0]
        
        if is_inside_roi(box_coords, roi_points):
            plate_image, box_coords = extract_license_plate(frame, box_coords)
            display_coords = (box_coords[0] + offset_x, box_coords[1] + offset_y, 
                            box_coords[2] + offset_x, box_coords[3] + offset_y)
            visualize_detection(display, display_coords, (255, 0, 0), 3)
            
            if plate_image.size > 0:
                char_results = char_recognizer(plate_image, verbose=False)
                char_vis, lp_text = process_characters(char_results, plate_image)
                
                if lp_text:
                    # Track detections
                    if detection_counters is not None:
                        current_time = time.time()
                        if lp_text not in detection_counters:
                            detection_counters[lp_text] = 0
                        detection_counters[lp_text] += 1
                        
                        # Update last seen time
                        if last_seen_times is not None:
                            last_seen_times[lp_text] = current_time
                        
                        # Print current detection count
                        print(f"📊 {camera_type.upper()} camera: {lp_text} detected {detection_counters[lp_text]}/{DETECTION_THRESHOLD} times")
                        
                        # Check if threshold reached
                        if detection_counters[lp_text] == DETECTION_THRESHOLD and check_whitelist(lp_text):
                            if camera_type == "enter":
                                send_lp(plate_image)
                                detected_entry(lp_text)
                            elif camera_type == "exit":
                                detected_exit(lp_text)
                    
                    if char_vis.size > 0:
                        char_display = cv2.resize(char_vis, CHAR_DISPLAY_SIZE)
                        render_preview(display, char_display, MARGIN_X + offset_x, MARGIN_Y + offset_y)
                    
                    # Display LP text with detection count
                    display_text = f"{lp_text}"
                    if detection_counters is not None and lp_text in detection_counters:
                        display_text += f" ({detection_counters[lp_text]}/{DETECTION_THRESHOLD})"
                    
                    render_text_with_background(display, display_text, MARGIN_X + offset_x, 
                                              2 * MARGIN_Y + CHAR_DISPLAY_SIZE[1] + offset_y, 1.0, 2)
        else:
            display_coords = (box_coords[0] + offset_x, box_coords[1] + offset_y, 
                            box_coords[2] + offset_x, box_coords[3] + offset_y)
            visualize_detection(display, display_coords, (0, 0, 255), 1)

def check_whitelist(lp_text):
    print(f"Checking whitelist for license plate: {lp_text}")
    try:
        lps = requests.get(f"{API}/license-plates").json()
        print(f"Whitelist data: {lps}")
        print(f"License plate {lp_text} in whitelist: {lp_text in list(map(lambda x: x['text'], lps['data']))}")
        return lp_text in list(map(lambda x: x["text"], lps["data"]))
    except Exception as e:
        print(f"Error checking whitelist: {e}")
        return False

def send_lp(plate_image):
    print("Sending license plate image to server...")
    try:
        # Encode the image as JPEG
        success, encoded_image = cv2.imencode('.jpg', plate_image)
        if not success:
            print("❌ Failed to encode image")
            return
        
        # Convert to bytes
        image_bytes = encoded_image.tobytes()
        
        # Send to server
        files = {'file': ('plate.jpg', image_bytes, 'image/jpeg')}
        req = requests.post(f"{API}/license-plate", files=files)
        print(f"✅ Server response: {req.status_code} - {req.text}")
    except Exception as e:
        print(f"❌ Error sending image to server: {e}")

def detected_entry(lp_text):
    """Handle when a license plate is detected at entry"""
    print(f"🚗 ENTRY detected: {lp_text}")
    # Add any additional entry logic here

def detected_exit(lp_text):
    """Handle when a license plate is detected at exit"""
    print(f"🚪 EXIT detected: {lp_text}")
    # Add any additional exit logic here

def cleanup_old_detections(detection_counters, last_seen_times, current_time):
    """Remove detection counters for license plates not seen recently"""
    plates_to_remove = []
    for lp_text, last_seen in last_seen_times.items():
        if current_time - last_seen > COUNTER_RESET_TIME:
            plates_to_remove.append(lp_text)
    
    for lp_text in plates_to_remove:
        if lp_text in detection_counters:
            del detection_counters[lp_text]
        del last_seen_times[lp_text]
        print(f"🧹 Cleaned up old detection counter for: {lp_text}")

def main():
    print("🚀 Starting License Plate Recognition System...")
    print(f"📡 API endpoint: {API}")
    print(f"📹 Using webcam: {USE_WEBCAM}")
    
    # Check if models exist
    if not os.path.exists('lpd-edgetpu.tflite'):
        print("❌ License plate detection model not found: lpd-edgetpu.tflite")
        print("Please add the model files to the ai directory")
        return
    
    if not os.path.exists('lpc-edgetpu.tflite'):
        print("❌ License plate character recognition model not found: lpc-edgetpu.tflite")
        print("Please add the model files to the ai directory")
        return

    try:
        lp_detector = YOLO('lpd-edgetpu.tflite')
        char_recognizer = YOLO('lpc-edgetpu.tflite')
        print("✅ Models loaded successfully")
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return

    if USE_WEBCAM:
        print("📹 Initializing webcam cameras...")
        cap_enter = ThreadedCamera(0)
        cap_exit = ThreadedCamera(1)
    else:
        print("📹 Initializing RTSP cameras...")
        print(f"   Enter camera: {CAM_ENTER_URL}")
        print(f"   Exit camera: {CAM_EXIT_URL}")
        cap_enter = ThreadedCamera(CAM_ENTER_URL)
        cap_exit = ThreadedCamera(CAM_EXIT_URL)
    
    # Wait a moment for cameras to initialize
    time.sleep(2)
    
    if not cap_enter.isOpened():
        print("❌ Could not open enter camera stream")
        if not USE_WEBCAM:
            print("💡 Try setting USE_WEBCAM=true environment variable to use webcam instead")
        return
    if not cap_exit.isOpened():
        print("❌ Could not open exit camera stream")
        if not USE_WEBCAM:
            print("💡 Try setting USE_WEBCAM=true environment variable to use webcam instead")
        return
    
    print("✅ Cameras initialized successfully")
        
    # Get frame dimensions from enter camera
    width = int(cap_enter.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap_enter.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # Define ROI for both cameras (same relative positioning)
    roi = [
        (width // 8, height // 4),         # top-left
        (4 * width // 5, height // 6),    # top-right
        (12 * width // 13, 3 * height // 4), # bottom-right
        (width // 6, 9 * height // 10)     # bottom-left
    ]
    roi_points = np.array(roi, dtype=np.int32)
    
    # Initialize detection counters for tracking license plates
    enter_detection_counters = {}
    exit_detection_counters = {}
    
    # Initialize last seen times
    enter_last_seen_times = {}
    exit_last_seen_times = {}
    last_cleanup_time = time.time()
    
    frame_count = 0
    start_time = time.time()
    
    while True:
        ret_enter, frame_enter = cap_enter.read()
        ret_exit, frame_exit = cap_exit.read()
        
        # Skip frames if both cameras don't have new frames
        if not ret_enter and not ret_exit:
            time.sleep(0.01)  # Small delay to prevent busy waiting
            continue
        elif not ret_enter or not ret_exit:
            print("One camera failed to read frame, continuing...")
            continue
        
        current_time = time.time()
        frame_count += 1
        
        # Print FPS every 30 frames
        if frame_count % 30 == 0:
            fps = frame_count / (current_time - start_time)
            print(f"📈 Processing at {fps:.1f} FPS")
        
        # Cleanup old detection counters every 10 seconds
        if current_time - last_cleanup_time > 10:
            cleanup_old_detections(enter_detection_counters, enter_last_seen_times, current_time)
            cleanup_old_detections(exit_detection_counters, exit_last_seen_times, current_time)
            last_cleanup_time = current_time
        
        # Create side-by-side display
        display_width = width * 2
        display_height = height
        display = np.zeros((display_height, display_width, 3), dtype=np.uint8)
        
        # Copy frames to display
        display[0:height, 0:width] = frame_enter
        display[0:height, width:width*2] = frame_exit
        
        # Create offset ROI points for exit camera
        roi_exit = [
            (5 * width // 16, 2 * height // 5),         # top-left
            (width // 2, 2 * height // 5),              # top-right
            (12 * width // 13, 3 * height // 4),        # bottom-right
            (width // 6, 9 * height // 10)              # bottom-left
        ]
        roi_points_exit = np.array(roi_exit, dtype=np.int32)
        roi_points_exit[:, 0] += width  # Shift x coordinates by width
        
        # Visualize ROI on both sides
        cv2.polylines(display, [roi_points], True, (0, 255, 255), 2)
        cv2.polylines(display, [roi_points_exit], True, (0, 255, 255), 2)

        # Detect and process license plates for enter camera
        lp_results_enter = lp_detector(frame_enter, verbose=False)
        process_license_plates(frame_enter, lp_results_enter, roi_points, char_recognizer, display, 0, 0, "enter", enter_detection_counters, enter_last_seen_times)
        
        # Detect and process license plates for exit camera
        lp_results_exit = lp_detector(frame_exit, verbose=False)
        process_license_plates(frame_exit, lp_results_exit, roi_points, char_recognizer, display, width, 0, "exit", exit_detection_counters, exit_last_seen_times)
        
        cv2.imshow('License Plate Recognition - Enter & Exit', display)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap_enter.release()
    cap_exit.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Application error: {e}")
        import traceback
        traceback.print_exc()
