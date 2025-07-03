import cv2 as cv
import numpy as np
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
MODEL_CONFIG_PATH = os.getenv("MODEL_CONFIG_PATH", "model/darknet-yolov3.cfg")
MODEL_WEIGHTS_PATH = os.getenv("MODEL_WEIGHTS_PATH", "model/model.weights")

# Initialize parameters
confThreshold = 0.5  # confidence threshold
nmsThreshold = 0.4   # non-maximum suppression threshold
inpWidth = 416       # width of network's input image
inpHeight = 416      # height of network's input image

classes = ["License Plate"]

# Load YOLO model
def load_model():
    net = cv.dnn.readNetFromDarknet(MODEL_CONFIG_PATH, MODEL_WEIGHTS_PATH)
    net.setPreferableBackend(cv.dnn.DNN_BACKEND_OPENCV)
    net.setPreferableTarget(cv.dnn.DNN_TARGET_CPU)
    return net

# Get the names of the output layers
def getOutputsNames(net):
    layersNames = net.getLayerNames()
    unconnected_out_layers = net.getUnconnectedOutLayers()
    if isinstance(unconnected_out_layers, np.ndarray):
        return [layersNames[i - 1] for i in unconnected_out_layers.flatten()]
    else:
        return [layersNames[unconnected_out_layers - 1]]

# Draw the predicted bounding box
def drawPred(frame, classId, conf, left, top, right, bottom, process_plate_func=None):
    if classes:
        assert(classId < len(classes))
        if classes[classId].lower() in ['license plate', 'license-plate', 'licenseplate', 'number plate', 'plate']:
            # Draw bounding box
            cv.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            if process_plate_func:
                process_plate_func(frame, left, top, right-left, bottom-top, conf)

# Remove low-confidence bounding boxes
def postprocess(frame, outs, process_plate_func=None):
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
            drawPred(frame, classIds[i], confidences[i], left, top, left + width, top + height, process_plate_func)

# Process a frame to detect license plates
def detect_license_plates(frame, net, process_plate_func=None):
    blob = cv.dnn.blobFromImage(frame, 1/255, (inpWidth, inpHeight), [0,0,0], 1, crop=False)
    net.setInput(blob)
    outs = net.forward(getOutputsNames(net))
    postprocess(frame, outs, process_plate_func)
    
    # Get performance info
    t, _ = net.getPerfProfile()
    inference_time = t * 1000.0 / cv.getTickFrequency()
    return inference_time