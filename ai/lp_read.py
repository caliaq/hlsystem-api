import cv2 as cv
import numpy as np
import easyocr
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# EasyOCR model directory
EASYOCR_MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "easyocr_models")
os.makedirs(EASYOCR_MODEL_DIR, exist_ok=True)
print(f"Using EasyOCR model directory: {EASYOCR_MODEL_DIR}")

# Define allowed license plates
license_plates = ["EL106AC", "8AN4277", "BLBECEK", "B2228HM"]

# Initialize EasyOCR reader
def initialize_reader():
    print("Initializing EasyOCR with custom model directory...")
    reader = easyocr.Reader(['en'], gpu=False, model_storage_directory=EASYOCR_MODEL_DIR, download_enabled=True)
    print("EasyOCR initialization complete")
    return reader

# Global reader instance
reader = initialize_reader()

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

def process_license_plate(frame, left, top, width, height, confidence, auth_state_handler=None, pad=10):
    # Add padding to the license plate region
    padded_left = max(left - pad, 0)
    padded_top = max(top - pad, 0)
    padded_right = min(left + width + pad, frame.shape[1])
    padded_bottom = min(top + height + pad, frame.shape[0])

    license_plate = frame[padded_top:padded_bottom, padded_left:padded_right].copy()
    print(license_plate.size)
    if license_plate.size == 0:
        return None
        
    # Scale down for faster processing if plate is large
    original_license_plate = license_plate.copy()
    max_width = 300  # Maximum processing width
    if license_plate.shape[1] > max_width:
        scale = max_width / license_plate.shape[1]
        new_height = int(license_plate.shape[0] * scale)
        license_plate = cv.resize(license_plate, (max_width, new_height))

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
        print(f"Recognized text: {clean_text}")
        access_granted, matched_plate = check_license_plate_access(clean_text)
        
        if auth_state_handler:
            auth_state_handler(access_granted, matched_plate)
        
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