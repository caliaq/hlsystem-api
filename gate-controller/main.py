from flask import Flask, jsonify
import subprocess
import os

app = Flask(__name__)

gate_open = False

def toggle_gate():
    global gate_open
    try:
        # Run the external gate_control.py script using Docker with volume mounting
        # This runs the script natively on the Raspberry Pi with GPIO access
        gate_control_path = "/gate_control.py"  # Path to mounted script inside Docker
        host_script_path = "/Users/e.japrrr/Developer/lom/api/gate_control.py"  # Adjust this path for your Raspberry Pi
        
        docker_cmd = [
            'docker', 'run', '--rm', '-it',
            '--privileged',  # Required for GPIO access
            '--device', '/dev/gpiomem',  # Give access to GPIO
            '-v', f'{host_script_path}:{gate_control_path}',
            'python:3.11-slim',
            'sh', '-c', f'pip install gpiozero && python {gate_control_path}'
        ]
        
        result = subprocess.run(docker_cmd, capture_output=True, text=True, timeout=30)
        
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