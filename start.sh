#!/bin/bash

echo "🚀 地域ニュースサイトを起動しています..."
echo ""

# プロジェクトディレクトリに移動
cd "$(dirname "$0")"

# IPアドレスを取得
IP=$(ifconfig | grep "inet " | grep -v "127.0.0.1" | head -1 | awk '{print $2}')

echo "📡 ネットワーク情報:"
echo "   ローカル: http://localhost:8000"
echo "   ネットワーク: http://$IP:8000"
echo ""
echo "📱 スマホでアクセスするには:"
echo "   ブラウザで http://$IP:8000 を開いてください"
echo ""
echo "⛔ 停止するには Ctrl+C を押してください"
echo ""

# Pythonでサーバー起動
if command -v python3 &> /dev/null; then
    echo "🌐 Python3でサーバーを起動中..."
    python3 -m http.server 8000 --bind 0.0.0.0
elif command -v python &> /dev/null; then
    echo "🌐 Pythonでサーバーを起動中..."  
    python -m http.server 8000 --bind 0.0.0.0
else
    echo "❌ Pythonが見つかりません"
    echo "   Homebrewでインストール: brew install python3"
    exit 1
fi