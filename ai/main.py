from ultralytics import YOLO
import cv2
import numpy as np
import time
import requests
import threading
import logging
from queue import Queue

# Constants
DETECTION_THRESHOLD = 5  # Number of times LP must be detected before triggering
COUNTER_RESET_TIME = 30  # Reset detection counters after 30 seconds of no detection
API = "http://192.168.1.107/api"  # Replace with your actual API endpoint
gate_id = "686eb0ee9984cab163af5d5b"

# Ensure logs directory exists
import os
os.makedirs('/app/logs', exist_ok=True)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/logs/ai_service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

CHAR_MAP = {
        0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
        10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F', 16: 'G', 17: 'H', 18: 'I', 19: 'J',
        20: 'K', 21: 'L', 22: 'M', 23: 'N', 24: 'O', 25: 'P', 26: 'Q', 27: 'R', 28: 'S', 29: 'T',
        30: 'U', 31: 'V', 32: 'W', 33: 'X', 34: 'Y', 35: 'Z'
    }

CAM_ENTER_URL = "rtsp://admin:123456@109.164.15.139:6002/h264"
CAM_EXIT_URL = "rtsp://admin:123456@109.164.15.139:6001/h264"

class ThreadedCamera:
    def __init__(self, src, queue_size=2):
        self.src = src
        logger.info(f"Initializing camera with source: {src}")
        
        # Support both RTSP and HTTP streams
        if isinstance(src, str) and (src.startswith('rtsp') or src.startswith('http')):
            # For RTSP/HTTP streams, use FFMPEG
            self.cap = cv2.VideoCapture(src, cv2.CAP_FFMPEG)
            if src.startswith('rtsp'):
                self.cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'H264'))
        else:
            # For other sources, use default backend
            self.cap = cv2.VideoCapture(src)
        
        # Set properties for all streams
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # Reduce buffer size to minimize delay
        self.cap.set(cv2.CAP_PROP_FPS, 30)  # Try to set FPS
        
        self.q = Queue(maxsize=queue_size)
        self.running = True
        self.reconnect_attempts = 0
        self.max_reconnect_attempts = 5
        self.thread = threading.Thread(target=self._reader)
        self.thread.daemon = True
        self.thread.start()
    
    def _reader(self):
        consecutive_failures = 0
        max_consecutive_failures = 10
        
        while self.running:
            ret, frame = self.cap.read()
            if not ret:
                consecutive_failures += 1
                if consecutive_failures >= max_consecutive_failures:
                    self._reconnect()
                    consecutive_failures = 0
                time.sleep(0.1)  # Wait before retry
                continue
            
            consecutive_failures = 0  # Reset on successful read
            
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
    
    def _reconnect(self):
        if self.reconnect_attempts < self.max_reconnect_attempts:
            self.cap.release()
            time.sleep(1)  # Wait before reconnecting
            
            logger.warning(f"Attempting to reconnect to camera: {self.src} (attempt {self.reconnect_attempts + 1})")
            
            # Support both RTSP and HTTP streams
            if isinstance(self.src, str) and (self.src.startswith('rtsp') or self.src.startswith('http')):
                # For RTSP/HTTP streams, use FFMPEG
                self.cap = cv2.VideoCapture(self.src, cv2.CAP_FFMPEG)
                if self.src.startswith('rtsp'):
                    self.cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'H264'))
            else:
                # For other sources, use default backend
                self.cap = cv2.VideoCapture(self.src)
            
            self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            self.reconnect_attempts += 1
        else:
            logger.error(f"Max reconnection attempts reached for camera: {self.src}")
            print(f"❌ Max reconnection attempts reached for camera: {self.src}")
    
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
        if self.thread.is_alive():
            self.thread.join(timeout=1)
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
    
    for result in char_results:
        if result.boxes is not None:
            boxes = result.boxes.cpu().numpy()
            for box in boxes:
                cx1, cy1, cx2, cy2 = map(int, box.xyxy[0])
                if box.cls is not None:
                    cls_id = int(box.cls[0])
                    # Map class ID to actual character
                    char = CHAR_MAP.get(cls_id, f'class{cls_id}')
                    detected_chars.append((char, cx1))
    
    detected_chars.sort(key=lambda x: x[1])
    lp_text = ''.join([char for char, _ in detected_chars])
    
    logger.debug(f"Detected characters: {detected_chars}")
    logger.debug(f"Final license plate text: {lp_text}")
    
    return lp_text

def process_license_plates(frame, lp_results, roi_points, char_recognizer, camera_type="enter", detection_counters=None, last_seen_times=None):
    """Process detected license plates"""
    if not lp_results or len(lp_results) == 0 or not lp_results[0].boxes or len(lp_results[0].boxes) <= 0:
        return
        
    logger.debug(f"Processing {len(lp_results[0].boxes)} license plate detections for {camera_type} camera")
        
    for box in lp_results[0].boxes:
        box_coords = box.xyxy[0]
        
        if is_inside_roi(box_coords, roi_points):
            plate_image, box_coords = extract_license_plate(frame, box_coords)
            logger.debug(f"License plate detected in ROI for {camera_type} camera at coordinates: {box_coords}")
            
            if plate_image.size > 0:
                char_results = char_recognizer(plate_image, verbose=False)
                lp_text = process_characters(char_results, plate_image)
                
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
                        
                        # Log license plate detection
                        logger.info(f"License plate detected: {lp_text} ({camera_type} camera) - Count: {detection_counters[lp_text]}/{DETECTION_THRESHOLD}")
                        
                        # Check if threshold reached
                        if detection_counters[lp_text] == DETECTION_THRESHOLD and check_whitelist(lp_text):
                            if camera_type == "enter":
                                send_lp(plate_image)
                                detected_entry(lp_text)
                            elif camera_type == "exit":
                                detected_exit(lp_text)
        else:
            logger.debug(f"License plate detected outside ROI for {camera_type} camera")

def check_whitelist(lp_text):
    try:
        lps = requests.get(f"{API}/license-plates").json()
        is_whitelisted = lp_text in list(map(lambda x: x["text"], lps["data"]))
        if is_whitelisted:
            logger.info(f"License plate {lp_text} is WHITELISTED")
        else:
            logger.warning(f"License plate {lp_text} is NOT whitelisted")
        return is_whitelisted
    except Exception as e:
        logger.error(f"Error checking whitelist: {e}")
        return False

def send_lp(plate_image):
    logger.info("Sending license plate image to server...")
    try:
        # Encode the image as JPEG
        success, encoded_image = cv2.imencode('.jpg', plate_image)
        if not success:
            logger.error("Failed to encode image")
            return
        
        # Convert to bytes
        image_bytes = encoded_image.tobytes()
        
        # Send to server
        files = {'file': ('plate.jpg', image_bytes, 'image/jpeg')}
        req = requests.post(f"{API}/license-plate", files=files)
        logger.info(f"Server response: {req.status_code}")
    except Exception as e:
        logger.error(f"Error sending image to server: {e}")

def detected_entry(lp_text):
    """Handle when a license plate is detected at entry"""
    try:
        res = requests.get(f"{API}/gates/{gate_id}/status").json()
        logger.debug(f"Gate status response: {res}")
        if res["data"]["isOpen"]:
            logger.info(f"GATE ALREADY OPEN for ENTRY: {lp_text}")
            return
        requests.get(f"{API}/gates/{gate_id}/toggle")
        logger.info(f"GATE OPENING for ENTRY: {lp_text}")
    except Exception as e:
        logger.error(f"Error handling entry for {lp_text}: {e}")

def detected_exit(lp_text):
    """Handle when a license plate is detected at exit"""
    try:
        res = requests.get(f"{API}/gates/{gate_id}/status").json()
        logger.debug(f"Gate status response: {res}")
        if res["data"]["isOpen"]:
            logger.info(f"GATE ALREADY OPEN for EXIT: {lp_text}")
            return
        requests.get(f"{API}/gates/{gate_id}/toggle")
        logger.info(f"GATE OPENING for EXIT: {lp_text}")
    except Exception as e:
        logger.error(f"Error handling exit for {lp_text}: {e}")

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
        logger.debug(f"Cleaned up old detection counter for: {lp_text}")

def main():
    logger.info("Starting AI License Plate Recognition Service...")
    
    # Create logs directory if it doesn't exist
    import os
    os.makedirs('/app/logs', exist_ok=True)
    
    lp_detector = YOLO('lpd-edgetpu.tflite', task='detect')
    char_recognizer = YOLO('lpc-edgetpu.tflite', task='detect')
    
    logger.info("Models loaded successfully")

    # Always use RTSP cameras for server deployment
    logger.info(f"Using RTSP cameras - Enter: {CAM_ENTER_URL}, Exit: {CAM_EXIT_URL}")
    cap_enter = ThreadedCamera(CAM_ENTER_URL)
    cap_exit = ThreadedCamera(CAM_EXIT_URL)
    
    # Wait a moment for cameras to initialize
    time.sleep(2)
    
    if not cap_enter.isOpened():
        logger.error("Could not open enter camera stream")
        raise ValueError("Could not open enter camera stream")
    if not cap_exit.isOpened():
        logger.error("Could not open exit camera stream")
        raise ValueError("Could not open exit camera stream")
        
    logger.info("Cameras initialized successfully")
        
    # Get frame dimensions from enter camera
    width = int(cap_enter.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap_enter.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    logger.info(f"Camera resolution: {width}x{height}")
    
    # Define ROI for both cameras (same relative positioning)
    roi = [
        (width // 8, height // 4),         # top-left
        (4 * width // 5, height // 6),    # top-right
        (12 * width // 13, 3 * height // 4), # bottom-right
        (width // 6, 9 * height // 10)     # bottom-left
    ]
    roi_points = np.array(roi, dtype=np.int32)
    
    logger.info(f"ROI defined: {roi}")
    
    # Initialize detection counters for tracking license plates
    enter_detection_counters = {}
    exit_detection_counters = {}
    
    # Initialize last seen times
    enter_last_seen_times = {}
    exit_last_seen_times = {}
    last_cleanup_time = time.time()
    
    frame_count = 0
    start_time = time.time()
    last_frame_enter = None
    last_frame_exit = None
    camera_retry_count = 0
    max_retry_attempts = 10
    
    logger.info("Starting main processing loop...")
    
    try:
        while True:
            ret_enter, frame_enter = cap_enter.read()
            ret_exit, frame_exit = cap_exit.read()
            
            # Handle frame reading with fallback to last known good frame
            if not ret_enter and last_frame_enter is not None:
                frame_enter = last_frame_enter
                ret_enter = True
            elif ret_enter:
                last_frame_enter = frame_enter.copy()
                camera_retry_count = 0  # Reset retry count on successful read
                
            if not ret_exit and last_frame_exit is not None:
                frame_exit = last_frame_exit
                ret_exit = True
            elif ret_exit:
                last_frame_exit = frame_exit.copy()
                camera_retry_count = 0  # Reset retry count on successful read
            
            # Skip frames if both cameras don't have frames and no fallback
            if not ret_enter and not ret_exit:
                camera_retry_count += 1
                if camera_retry_count > max_retry_attempts:
                    logger.error("Both cameras failed to read frames for too long, exiting...")
                    break
                time.sleep(0.1)  # Longer delay when both cameras fail
                continue
            elif not ret_enter or not ret_exit:
                camera_retry_count += 1
                time.sleep(0.01)
                continue
            
            current_time = time.time()
            frame_count += 1
            
            # Log processing stats every 100 frames
            if frame_count % 100 == 0:
                elapsed_time = current_time - start_time
                fps = frame_count / elapsed_time
                logger.info(f"Processed {frame_count} frames in {elapsed_time:.2f}s (FPS: {fps:.2f})")
            
            # Cleanup old detection counters every 10 seconds
            if current_time - last_cleanup_time > 10:
                cleanup_old_detections(enter_detection_counters, enter_last_seen_times, current_time)
                cleanup_old_detections(exit_detection_counters, exit_last_seen_times, current_time)
                last_cleanup_time = current_time

            # Detect and process license plates for enter camera
            lp_results_enter = lp_detector(frame_enter, verbose=False)
            process_license_plates(frame_enter, lp_results_enter, roi_points, char_recognizer, "enter", enter_detection_counters, enter_last_seen_times)
            
            # Detect and process license plates for exit camera
            lp_results_exit = lp_detector(frame_exit, verbose=False)
            process_license_plates(frame_exit, lp_results_exit, roi_points, char_recognizer, "exit", exit_detection_counters, exit_last_seen_times)
            
            # Small delay to prevent excessive CPU usage
            time.sleep(0.01)
            
    except KeyboardInterrupt:
        logger.info("Received interrupt signal, shutting down...")
    except Exception as e:
        logger.error(f"Unexpected error in main loop: {e}")
    finally:
        logger.info("Cleaning up resources...")
        cap_enter.release()
        cap_exit.release()
        logger.info("AI License Plate Recognition Service stopped")

if __name__ == "__main__":
    main()
