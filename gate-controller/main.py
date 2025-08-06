import os
from flask import Flask, jsonify

import time

app = Flask(__name__)

gate_open = False

def write_to_pin(pin, value):
    try: 
        os.system(f"gpioset gpiochip0 {pin}={value}")
    except Exception as e:
        raise Exception(f"Failed to write to pin {pin}: {str(e)}")

def toggle_gate():
    global gate_open
    try:
        write_to_pin(27, 1)
        print("on")
        time.sleep(0.5)

        write_to_pin(27, 0)
        print("off")

        gate_open = not gate_open

    except Exception as e:
        raise Exception(f"Failed to execute gate control: {str(e)}")

@app.route('/686eb0ee9984cab163af5d5b/toggle', methods=['GET'])
def open_gate_endpoint():
    try:
        toggle_gate()
        return jsonify({"status": "success", "data": {"is_open": gate_open}}), 200
    except Exception as e:
        return jsonify({"status": "error", "data": {"is_open": gate_open}, "message": str(e)}), 500

@app.route('/686eb0ee9984cab163af5d5b/status', methods=['GET'])
def gate_status():
    return jsonify({"status": "success", "data": {"is_open": gate_open}}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)