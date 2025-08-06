#!/usr/bin/env python3
"""
Startup script for AI service that waits for API availability
"""

import sys
import os
import time

def test_camera_connectivity():
    """Test camera connectivity before starting main application"""
    print("🔍 Testing camera connectivity...")
    
    # Only test if not using webcam
    use_webcam = os.getenv("USE_WEBCAM", "false").lower() == "true"
    if use_webcam:
        print("📹 Using webcam mode, skipping network camera tests")
        return True
    
    try:
        from test_camera_connection import test_rtsp_connection
        
        cam_enter_url = os.getenv("CAM_ENTER_URL", "rtsp://admin:123456@109.164.15.139:6002/h264")
        cam_exit_url = os.getenv("CAM_EXIT_URL", "rtsp://admin:123456@109.164.15.139:6001/h264")
        
        print(f"🎯 Testing enter camera: {cam_enter_url}")
        enter_ok = test_rtsp_connection(cam_enter_url, timeout=20)
        
        print(f"🎯 Testing exit camera: {cam_exit_url}")
        exit_ok = test_rtsp_connection(cam_exit_url, timeout=20)
        
        if enter_ok or exit_ok:
            print("✅ At least one camera is accessible")
            return True
        else:
            print("⚠️  No cameras are accessible, but continuing anyway...")
            print("   The application will continue to retry connections")
            return True  # Continue anyway, let the app handle retries
            
    except Exception as e:
        print(f"⚠️  Camera connectivity test failed: {e}")
        print("   Continuing anyway - the application will handle connection issues")
        return True

def main():
    print("🚀 Starting license plate recognition system...")
    print("=" * 60)
    
    # Test camera connectivity first
    test_camera_connectivity()
    
    print("🔄 Starting main application...")
    
    try:
        from app import main as app_main
        app_main()
    except KeyboardInterrupt:
        print("\n🛑 Application stopped by user")
    except Exception as e:
        print(f"❌ Application error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
