from flask import Flask, jsonify

import gpiod 
import time

app = Flask(__name__)

chip = gpiod.Chip('gpiochip0')

gate_open = False

def toggle_gate():
    global gate_open
    try:

        pin = chip.get_line(27)

        pin.request(consumer="LED", type=gpiod.LINE_REQ_DIR_OUT)

        pin.set_value(1)
        print("on")
        time.sleep(0.5)

        pin.set_value(0)
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