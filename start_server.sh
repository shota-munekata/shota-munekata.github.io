#!/bin/bash

# 地域ニュースキュレーションサイト ローカルサーバー起動スクリプト

echo "🚀 地域ニュースキュレーションサイト サーバーを起動しています..."
echo ""

# プロジェクトディレクトリに移動
cd "$(dirname "$0")"

# Pythonでサーバー起動
if command -v python3 &> /dev/null; then
    python3 server.py
elif command -v python &> /dev/null; then
    python server.py
else
    echo "❌ Python が見つかりません。Pythonをインストールしてください。"
    exit 1
fi