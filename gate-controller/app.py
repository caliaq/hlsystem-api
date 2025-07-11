from gpiozero import LED, Device
from gpiozero.pins.mock import MockFactory
from flask import Flask, jsonify
import time

Device.pin_factory = MockFactory()

app = Flask(__name__)

DELAY = 10
PINS = [LED(x) for x in [17, 27]]

gate_open = False

def toggle_gate():
    global gate_open 
    [pin.on() for pin in PINS]
    time.sleep(DELAY)
    [pin.off() for pin in PINS]

    gate_open = not gate_open

@app.route('/gate/686eb0ee9984cab163af5d5b/toggle', methods=['GET'])
def open_gate_endpoint():
    try:
        toggle_gate()
        return jsonify({"status": "success", "data": {"is_open": gate_open}}), 200
    except Exception as e:
        return jsonify({"status": "error", "data": {"is_open": gate_open}}), 500

@app.route('/gate/686eb0ee9984cab163af5d5b/status', methods=['GET'])
def gate_status():
    return jsonify({"status": "success", "data": {"is_open": gate_open}}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)