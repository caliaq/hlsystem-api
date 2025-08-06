from gpiozero import LED
import time

from flask import Flask, jsonify

app = Flask(__name__)

gate_open = False

def toggle_gate():
    pin = LED(27)

    pin.on()
    print("on")
    time.sleep(0.5)

    pin.off()
    print("off")
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