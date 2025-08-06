#!/bin/bash

echo "=== Docker Camera Connectivity Debug Script ==="
echo

# Test basic connectivity to camera IP
CAMERA_IP="109.164.15.139"
echo "Testing ping to camera IP: $CAMERA_IP"
ping -c 3 $CAMERA_IP

echo
echo "Testing telnet to RTSP ports..."
echo "Port 6001 (exit camera):"
timeout 5 telnet $CAMERA_IP 6001 <<< ""
echo
echo "Port 6002 (enter camera):"
timeout 5 telnet $CAMERA_IP 6002 <<< ""

echo
echo "=== Network interface information ==="
ip addr show

echo
echo "=== Route information ==="
ip route

echo
echo "=== DNS resolution test ==="
nslookup $CAMERA_IP

echo
echo "=== Testing from host system ==="
echo "Please run this command from your host system to test:"
echo "ffplay -rtsp_transport tcp rtsp://admin:123456@109.164.15.139:6002/h264"
echo "ffplay -rtsp_transport tcp rtsp://admin:123456@109.164.15.139:6001/h264"
