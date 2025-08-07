# AI License Plate Recognition Service

This Docker container runs the AI license plate recognition service that processes camera feeds and detects license plates.

## Prerequisites

### Model Files

Before running the container, you need to place the following model files in the `ai/` directory:

- `lpd-edgetpu.tflite` - License plate detection model
- `lpc-edgetpu.tflite` - License plate character recognition model

### Camera Setup

The service supports both:

- **Webcam mode** (USE_WEBCAM = True): Uses local USB cameras
- **RTSP mode** (USE_WEBCAM = False): Uses IP cameras with RTSP streams

## Building and Running

### Build the container:

```bash
docker-compose build ai
```

### Run the service:

```bash
docker-compose up ai
```

### Run in development mode with hot reload:

```bash
docker-compose up
```

## Configuration

### Environment Variables

- `API`: API endpoint (default: http://192.168.1.107/api)
- `DISPLAY`: X11 display for GUI (if needed)

### Camera URLs

Update the camera URLs in `main.py`:

- `CAM_ENTER_URL`: RTSP URL for entrance camera
- `CAM_EXIT_URL`: RTSP URL for exit camera

## Volume Mounts

The container mounts:

- `./ai:/app` - Source code (for development)
- `/dev/video0:/dev/video0` - First camera device
- `/dev/video1:/dev/video1` - Second camera device

## Network Mode

The container uses `host` network mode to access RTSP cameras on the local network.

## Troubleshooting

### Camera Access Issues

If you have camera access issues:

1. Ensure the user has permission to access video devices
2. Check if cameras are not being used by other applications
3. Verify RTSP URLs are correct and accessible

### Model File Issues

If model files are missing:

1. Ensure `lpd-edgetpu.tflite` and `lpc-edgetpu.tflite` are in the ai directory
2. Check file permissions
3. Verify model file formats are compatible with ultralytics YOLO
