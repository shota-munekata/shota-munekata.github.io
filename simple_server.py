#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser
from threading import Timer

PORT = 8000

def get_local_ip():
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def open_browser():
    webbrowser.open(f'http://localhost:{PORT}')

if __name__ == "__main__":
    # プロジェクトディレクトリに移動
    web_dir = os.path.dirname(os.path.realpath(__file__))
    os.chdir(web_dir)
    
    # カスタムハンドラー
    class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            super().end_headers()
    
    Handler = MyHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            local_ip = get_local_ip()
            
            print("\n" + "="*50)
            print("🌐 地域ニュースサイト サーバー起動!")
            print("="*50)
            print(f"🔗 ローカル: http://localhost:{PORT}")
            print(f"🔗 ネットワーク: http://{local_ip}:{PORT}")
            print("="*50)
            print("📱 スマホでアクセス:")
            print(f"   {local_ip}:{PORT} をブラウザで開く")
            print("="*50)
            print("⛔ 停止: Ctrl+C")
            print("="*50)
            
            # 3秒後にブラウザを開く
            Timer(3.0, open_browser).start()
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ ポート {PORT} は既に使用されています")
            print("   他のサーバーを停止してから再試行してください")
        else:
            print(f"❌ サーバー起動エラー: {e}")
    except KeyboardInterrupt:
        print("\n🛑 サーバーを停止しました")