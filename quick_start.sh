#!/bin/bash

# プロジェクトディレクトリに移動
cd "$(dirname "$0")"

# IPアドレスを取得
IP=$(ifconfig | grep "inet " | grep -v "127.0.0.1" | head -1 | awk '{print $2}')

echo ""
echo "🌐 ========================================"
echo "   地域ニュースサイト サーバー起動"
echo "========================================"
echo ""
echo "📡 アクセス方法:"
echo "   このPC: http://localhost:3000"
echo "   スマホ: http://$IP:3000"
echo ""
echo "⛔ 停止: Ctrl+C"
echo ""

# ポート3000でサーバー起動
python3 -c "
import http.server
import socketserver
import webbrowser
from threading import Timer

PORT = 3000
Handler = http.server.SimpleHTTPRequestHandler

def open_browser():
    webbrowser.open('http://localhost:3000')

Timer(2.0, open_browser).start()

with socketserver.TCPServer(('', PORT), Handler) as httpd:
    print('🚀 サーバー起動完了!')
    httpd.serve_forever()
"