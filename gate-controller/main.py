from flask import Flask, jsonify
import subprocess
import os

app = Flask(__name__)

gate_open = False

def toggle_gate():
    global gate_open
    try:
        # Run the external gate_control.py script natively on Raspberry Pi
        script_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gate_control.py')
        result = subprocess.run(['python3', script_path], capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            gate_open = not gate_open
            print(f"Gate control executed successfully: {result.stdout}")
        else:
            print(f"Gate control failed: {result.stderr}")
            raise Exception(f"Gate control script failed: {result.stderr}")
            
    except subprocess.TimeoutExpired:
        raise Exception("Gate control script timed out")
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