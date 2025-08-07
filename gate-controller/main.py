import os
from flask import Flask, jsonify
import time

app = Flask(__name__)

gate_open = False

# GPIO handling
def write_to_pin(pin, value):
    """ Function to write value to GPIO pin """
    try:
        os.system(f"gpioset gpiochip0 {pin}={value}")
    except Exception as e:
        raise Exception(f"Failed to write to pin {pin}: {str(e)}")

# Toggle gate function
def toggle_gate():
    """Function to toggle the gate open/close"""
    global gate_open
    try:
        # Simulate the gate opening/closing logic
        write_to_pin(27, 1)  # Turn on
        print("on")
        time.sleep(0.5)

        write_to_pin(27, 0)  # Turn off
        print("off")
        time.sleep(5)  # Time when motors are on

        write_to_pin(27, 1)  # Turn on again
        print("on")
        time.sleep(0.5)

        write_to_pin(27, 0)  # Turn off
        print("off")

        if gate_open:
            print("gate is open")
        else:
            print("gate is closed")

        # Toggle gate status
        gate_open = not gate_open

    except Exception as e:
        raise Exception(f"Failed to execute gate control: {str(e)}")

@app.route('/686eb0ee9984cab163af5d5b/toggle', methods=['GET'])
def open_gate_endpoint():
    """Endpoint to toggle gate and return status"""
    try:
        toggle_gate()  # Toggle gate
        return jsonify({"status": "success", "data": {"is_open": gate_open}}), 200
    except Exception as e:
        return jsonify({"status": "error", "data": {"is_open": gate_open}, "message": str(e)}), 500

@app.route('/686eb0ee9984cab163af5d5b/status', methods=['GET'])
def gate_status():
    """Endpoint to get current gate status"""
    return jsonify({"status": "success", "data": {"is_open": gate_open}}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
