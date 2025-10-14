#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
import json
import urllib.parse

# ポート番号
PORT = 8000

# 現在のディレクトリを設定
web_dir = os.path.dirname(os.path.realpath(__file__))
os.chdir(web_dir)

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS ヘッダーを追加
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # APIエンドポイントの処理
        if self.path == '/api/articles':
            self.handle_articles_list()
        elif self.path.startswith('/api/articles/'):
            self.handle_article_file()
        else:
            # 通常のファイル配信
            super().do_GET()

    def handle_articles_list(self):
        """記事ファイル一覧を返す"""
        try:
            articles_dir = os.path.join(os.getcwd(), 'articles')
            if not os.path.exists(articles_dir):
                os.makedirs(articles_dir)
            
            # JSONファイルのみをリスト
            json_files = [f for f in os.listdir(articles_dir) 
                         if f.endswith('.json') and f != 'README.md']
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(json_files, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {'error': str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))

    def handle_article_file(self):
        """個別の記事ファイルを返す"""
        try:
            # URLから記事ファイル名を取得
            filename = urllib.parse.unquote(self.path.split('/')[-1])
            file_path = os.path.join(os.getcwd(), 'articles', filename)
            
            if not os.path.exists(file_path) or not filename.endswith('.json'):
                self.send_response(404)
                self.end_headers()
                return
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # JSONの妥当性をチェック
            json.loads(content)  # バリデーション用
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(content.encode('utf-8'))
            
        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {'error': 'Invalid JSON format'}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {'error': str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))

    def log_message(self, format, *args):
        # ログメッセージをカスタマイズ
        print(f"[{self.date_time_string()}] {format % args}")

def get_ip():
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Google DNS に接続してローカルIPを取得
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

if __name__ == "__main__":
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        local_ip = get_ip()
        
        print("=" * 60)
        print("🌐 地域ニュースキュレーションサイト サーバー起動中...")
        print("=" * 60)
        print(f"📱 このPCから: http://localhost:{PORT}")
        print(f"📱 このPCから: http://{local_ip}:{PORT}")
        print("=" * 60)
        print("📱 同じWiFi内の他デバイスから:")
        print(f"   スマホ・タブレット: http://{local_ip}:{PORT}")
        print(f"   他のPC: http://{local_ip}:{PORT}")
        print("=" * 60)
        print("⚠️  停止するには Ctrl+C を押してください")
        print("=" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 サーバーを停止しています...")
            httpd.shutdown()
            print("✅ サーバーが停止されました")