#!/usr/bin/env python3
"""
Test script to check camera connectivity from within Docker container
"""
import cv2
import os
import subprocess
import time

def test_network_connectivity():
    """Test basic network connectivity"""
    print("=== Testing Network Connectivity ===")
    
    # Test ping to camera IP
    camera_ip = "109.164.15.139"
    try:
        result = subprocess.run(['ping', '-c', '3', camera_ip], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"✓ Ping to {camera_ip} successful")
        else:
            print(f"✗ Ping to {camera_ip} failed")
            print(f"Error: {result.stderr}")
    except subprocess.TimeoutExpired:
        print(f"✗ Ping to {camera_ip} timed out")
    except Exception as e:
        print(f"✗ Ping test failed: {e}")

def test_rtsp_connection(url, timeout=30):
    """Test RTSP connection with detailed logging"""
    print(f"\n=== Testing RTSP Connection: {url} ===")
    
    try:
        cap = cv2.VideoCapture(url)
        
        # Set timeouts
        cap.set(cv2.CAP_PROP_OPEN_TIMEOUT_MSEC, timeout * 1000)
        cap.set(cv2.CAP_PROP_READ_TIMEOUT_MSEC, 10000)
        
        print(f"Attempting to open stream (timeout: {timeout}s)...")
        start_time = time.time()
        
        if cap.isOpened():
            elapsed = time.time() - start_time
            print(f"✓ Stream opened successfully in {elapsed:.2f}s")
            
            # Try to read a frame
            print("Attempting to read frame...")
            ret, frame = cap.read()
            
            if ret:
                print(f"✓ Frame read successfully! Frame shape: {frame.shape}")
                return True
            else:
                print("✗ Failed to read frame from stream")
        else:
            elapsed = time.time() - start_time
            print(f"✗ Failed to open stream after {elapsed:.2f}s")
            
        cap.release()
        return False
        
    except Exception as e:
        print(f"✗ Exception during RTSP test: {e}")
        return False

def main():
    print("Camera Connectivity Test")
    print("=" * 50)
    
    # Test basic network connectivity
    test_network_connectivity()
    
    # Get camera URLs from environment
    cam_enter_url = os.getenv("CAM_ENTER_URL", "rtsp://admin:123456@109.164.15.139:6002/h264")
    cam_exit_url = os.getenv("CAM_EXIT_URL", "rtsp://admin:123456@109.164.15.139:6001/h264")
    
    # Test both camera streams
    enter_result = test_rtsp_connection(cam_enter_url)
    exit_result = test_rtsp_connection(cam_exit_url)
    
    print("\n=== Summary ===")
    print(f"Enter Camera: {'✓ Connected' if enter_result else '✗ Failed'}")
    print(f"Exit Camera:  {'✓ Connected' if exit_result else '✗ Failed'}")
    
    if not (enter_result or exit_result):
        print("\n=== Troubleshooting Tips ===")
        print("1. Check if camera IPs are reachable from host system")
        print("2. Verify RTSP credentials are correct")
        print("3. Check firewall settings")
        print("4. Try using host networking mode in docker-compose")
        print("5. Verify camera RTSP ports are accessible")

if __name__ == "__main__":
    main()
