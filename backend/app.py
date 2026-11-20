import os
import sys
import mimetypes

# Fix Windows Registry issue where .js files are served as text/plain
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("image/svg+xml", ".svg")

# Ensure backend directory is in sys.path regardless of execution CWD
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

import logging
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Explicitly load .env from backend directory and workspace root
env_path = os.path.join(current_dir, ".env")
load_dotenv(env_path)
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("EmailReplyAssistantBackend")

from services.gemini_service import generate_email_replies

# Path to built frontend static files
frontend_dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.exists(frontend_dist_path):
    app = Flask(__name__, static_folder=frontend_dist_path, static_url_path="")
    logger.info(f"Serving built frontend from {frontend_dist_path}")
else:
    app = Flask(__name__)
    logger.info("Running in API-only mode (frontend dist not found).")

# Enable CORS for all routes so React dev server can communicate seamlessly
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify backend status and API key configuration."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    is_configured = bool(api_key and api_key.strip() and api_key != "your_gemini_api_key_here")
    return jsonify({
        "status": "online",
        "service": "Email Reply Assistant API",
        "api_key_configured": is_configured,
        "version": "1.0.0"
    }), 200

@app.route("/api/generate-replies", methods=["POST"])
def generate_replies():
    """
    Generate three email reply drafts (Formal, Friendly, Short) using Gemini API.
    
    Expected JSON payload:
    {
        "email": "Original received email text",
        "apiKey": "optional user-provided api key override"
    }
    """
    if not request.is_json:
        return jsonify({
            "success": False,
            "error": "Request body must be valid JSON with 'Content-Type: application/json'."
        }), 400

    data = request.get_json()
    if not data or "email" not in data:
        return jsonify({
            "success": False,
            "error": "Missing 'email' field in request payload."
        }), 400

    email_text = data.get("email", "")
    custom_api_key = data.get("apiKey", None)

    logger.info(f"Received email response request of length: {len(email_text.strip())}")

    success, result, status_code = generate_email_replies(email_text, custom_api_key)

    if success:
        return jsonify({
            "success": True,
            "replies": result.get("replies", {})
        }), 200
    else:
        return jsonify({
            "success": False,
            "error": result.get("error", "An unexpected error occurred while generating replies."),
            "details": result.get("details", None),
            "is_auth_error": result.get("is_auth_error", False)
        }), status_code

@app.route("/api/set-api-key", methods=["POST"])
def set_api_key():
    """Allows updating the Gemini API key in the backend environment runtime and .env file."""
    if not request.is_json:
        return jsonify({"success": False, "error": "Invalid JSON"}), 400
    
    data = request.get_json()
    key = data.get("apiKey", "").strip()
    
    if not key:
        return jsonify({"success": False, "error": "API key cannot be empty"}), 400

    # Set in os.environ for current runtime
    os.environ["GEMINI_API_KEY"] = key

    # Persist in .env
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    try:
        content = ""
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                content = f.read()
        
        if "GEMINI_API_KEY=" in content:
            import re
            content = re.sub(r"GEMINI_API_KEY=.*", f"GEMINI_API_KEY={key}", content)
        else:
            content += f"\nGEMINI_API_KEY={key}\n"
            
        with open(env_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        return jsonify({"success": True, "message": "API key updated successfully!"}), 200
    except Exception as e:
        logger.error(f"Failed to persist API key to .env: {e}")
        return jsonify({"success": True, "message": "API key updated in memory for this session."}), 200

# Catch-all route to serve React frontend SPA
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if os.path.exists(frontend_dist_path):
        target = os.path.join(frontend_dist_path, path)
        if path != "" and os.path.exists(target):
            mimetype = None
            if path.endswith(".js"):
                mimetype = "application/javascript"
            elif path.endswith(".css"):
                mimetype = "text/css"
            elif path.endswith(".svg"):
                mimetype = "image/svg+xml"
            return send_from_directory(frontend_dist_path, path, mimetype=mimetype)
        return send_from_directory(frontend_dist_path, "index.html", mimetype="text/html")
    return jsonify({
        "status": "online",
        "message": "Email Reply Assistant API is running. Build the frontend or use Vite dev server."
    })

@app.errorhandler(404)
def not_found(e):
    if request.path.startswith("/api/"):
        return jsonify({"success": False, "error": "API endpoint not found"}), 404
    if os.path.exists(frontend_dist_path):
        return send_from_directory(frontend_dist_path, "index.html")
    return jsonify({"success": False, "error": "Not found"}), 404

@app.errorhandler(500)
def server_error(e):
    logger.error(f"Internal server error: {e}")
    return jsonify({"success": False, "error": "Internal server error occurred."}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "127.0.0.1")
    debug = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
    print(f"Starting Email Reply Assistant backend server on http://{host}:{port}")
    app.run(host=host, port=port, debug=debug)
