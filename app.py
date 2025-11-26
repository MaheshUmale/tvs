import os
from flask import Flask, request, jsonify, send_from_directory
import requests
from waitress import serve

app = Flask(__name__, static_folder='static', static_url_path='')

@app.route('/api/scan', methods=['POST'])
def scan():
    data = request.get_json()
    print("Received data:", data)
    response = requests.post('https://scanner.tradingview.com/america/scan', json=data)
    print("TradingView response:", response.status_code, response.text)
    return jsonify(response.json())

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5002)
