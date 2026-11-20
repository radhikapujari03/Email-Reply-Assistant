import sys
import os
import time
import threading
import urllib.request
import json

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app

def run_server():
    app.run(host="127.0.0.1", port=5055, debug=False, use_reloader=False)

def test_live_server():
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    time.sleep(1.5)

    # 1. Health endpoint test
    with urllib.request.urlopen("http://127.0.0.1:5055/api/health") as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode())
        print("PASS: /api/health returned:", data)
        assert data["status"] == "online"

    # 2. Static React app serving test
    with urllib.request.urlopen("http://127.0.0.1:5055/") as resp:
        assert resp.status == 200
        html = resp.read().decode()
        print("PASS: / served index.html, size:", len(html))
        assert "Email Reply Assistant" in html or "root" in html

    # 3. Validation test for empty input
    post_data = json.dumps({"email": ""}).encode("utf-8")
    req = urllib.request.Request(
        "http://127.0.0.1:5055/api/generate-replies",
        data=post_data,
        headers={"Content-Type": "application/json"}
    )
    try:
        urllib.request.urlopen(req)
        assert False, "Should have failed with 400"
    except urllib.error.HTTPError as err:
        assert err.code == 400
        err_data = json.loads(err.read().decode())
        print("PASS: /api/generate-replies rejected empty email with 400:", err_data["error"])

    print("ALL LIVE SERVER INTEGRATION TESTS PASSED!")

if __name__ == "__main__":
    test_live_server()
