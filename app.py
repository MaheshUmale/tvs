from flask import Flask, jsonify
from tradingview_screener import Query
from waitress import serve

app = Flask(__name__, static_folder='static', static_url_path='')

@app.route('/api/scan', methods=['GET'])
def scan():
    try:
        _, data = (
            Query()
            .select('ticker', 'name', 'close', 'volume', 'market_cap_basic')
            .order_by('market_cap_basic', ascending=False)
            .limit(50)
            .get_scanner_data()
        )
        return jsonify(data.to_dict('records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5002)
