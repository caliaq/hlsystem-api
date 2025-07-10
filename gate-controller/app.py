from gpiozero import LED, Device
from gpiozero.pins.mock import MockFactory
from flask import Flask, jsonify
import time

# Use mock pins instead of real GPIO
Device.pin_factory = MockFactory()

app = Flask(__name__)

DELAY = 0.5
PINS = [LED(x) for x in [17, 27]]

gate_open = False

def toggle_gate():
    global gate_open 
    [pin.on() for pin in PINS]
    time.sleep(DELAY)
    [pin.off() for pin in PINS]

    gate_open = not gate_open

@app.route('/gate/686eb0ee9984cab163af5d5b/toggle', methods=['POST', 'GET'])
def open_gate_endpoint():
    print(f"[DEBUG] Gate toggle endpoint called")
    try:
        toggle_gate()
        return jsonify({"status": "success", "data": {"is_open": gate_open}}), 200
    except Exception as e:
        print(f"[DEBUG] Error in gate toggle: {e}")
        return jsonify({"status": "error", "data": {"is_open": gate_open}}), 500

@app.route('/health', methods=['GET'])
def health_check():
    print(f"[DEBUG] Health check endpoint called")
    return jsonify({"status": "healthy", "service": "gate-controller", "port": 3001}), 200

@app.route('/gate/686eb0ee9984cab163af5d5b/status', methods=['GET'])
def gate_status():
    print(f"[DEBUG] Gate status endpoint called")
    return jsonify({"status": "success", "data": {"is_open": gate_open}}), 200

# Přidám root endpoint pro testování
@app.route('/')
def root():
    print(f"[DEBUG] Root endpoint called")
    return jsonify({"status": "running", "service": "gate-controller", "available_endpoints": [
        "/health",
        "/gate/686eb0ee9984cab163af5d5b/status",
        "/gate/686eb0ee9984cab163af5d5b/toggle"
    ]}), 200

if __name__ == '__main__':
    print("🚪 Starting Gate Controller...")
    print(f"📍 Server will run on host='0.0.0.0', port=3001")
    print(f"🔗 Available endpoints:")
    print(f"   - GET  /health")
    print(f"   - GET  /gate/686eb0ee9984cab163af5d5b/status")
    print(f"   - POST /gate/686eb0ee9984cab163af5d5b/toggle")
    print(f"   - GET  /gate/686eb0ee9984cab163af5d5b/toggle")
    app.run(host='0.0.0.0', port=3001, debug=True)