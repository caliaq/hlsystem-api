from flask import Flask, jsonify
import subprocess
import os
import sys

app = Flask(__name__)

gate_open = False

def toggle_gate():
    """
    Spustí oddělený GPIO script pro sepnutí brány
    """
    global gate_open
    
    try:
        # Cesta k GPIO scriptu
        script_path = os.path.join(os.path.dirname(__file__), 'gpio_control.py')
        
        # Spusť GPIO script s sudo právy
        result = subprocess.run([
            'sudo', 'python3', script_path, '27', '0.5'
        ], capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            # Script byl úspěšný
            gate_open = not gate_open
            print(f"Gate toggled successfully. New state: {'open' if gate_open else 'closed'}")
            print(f"GPIO script output: {result.stderr.strip()}")
            return True
        else:
            # Script selhal
            print(f"GPIO script failed with return code: {result.returncode}")
            print(f"GPIO script stderr: {result.stderr}")
            print(f"GPIO script stdout: {result.stdout}")
            return False
            
    except subprocess.TimeoutExpired:
        print("GPIO script timed out")
        return False
    except Exception as e:
        print(f"Error running GPIO script: {e}")
        return False

@app.route('/686eb0ee9984cab163af5d5b/toggle', methods=['GET'])
def open_gate_endpoint():
    try:
        success = toggle_gate()
        
        if success:
            return jsonify({
                "status": "success", 
                "data": {"is_open": gate_open}
            }), 200
        else:
            return jsonify({
                "status": "error", 
                "data": {"is_open": gate_open}, 
                "message": "Failed to toggle gate - check GPIO script logs"
            }), 500
            
    except Exception as e:
        error_msg = str(e)
        print(f"Gate control error: {error_msg}")
        return jsonify({
            "status": "error", 
            "data": {"is_open": gate_open}, 
            "message": f"Server Error: {error_msg}"
        }), 500

@app.route('/686eb0ee9984cab163af5d5b/status', methods=['GET'])
def gate_status():
    return jsonify({"status": "success", "data": {"is_open": gate_open}}), 200

@app.route('/686eb0ee9984cab163af5d5b/info', methods=['GET'])
def gate_info():
    """Informační endpoint o systému"""
    script_path = os.path.join(os.path.dirname(__file__), 'gpio_control.py')
    script_exists = os.path.exists(script_path)
    
    return jsonify({
        "status": "success",
        "data": {
            "is_open": gate_open,
            "gpio_script_path": script_path,
            "gpio_script_exists": script_exists,
            "python_version": sys.version,
            "current_user": os.getenv('USER', 'unknown')
        }
    }), 200

if __name__ == '__main__':
    print("Starting Gate Controller Server")
    print(f"GPIO script location: {os.path.join(os.path.dirname(__file__), 'gpio_control.py')}")
    app.run(host='0.0.0.0', port=3001, debug=True)