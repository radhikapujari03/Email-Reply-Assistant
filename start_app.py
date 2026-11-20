"""
Email Reply Assistant Launcher
Starts the Flask server (which serves both the API and the React frontend)
and opens the application in your default web browser.
"""

import os
import sys
import time
import webbrowser
import subprocess

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    
    # Path to virtual environment python
    if sys.platform == "win32":
        venv_python = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
    else:
        venv_python = os.path.join(backend_dir, "venv", "bin", "python")
        
    python_bin = venv_python if os.path.exists(venv_python) else sys.executable
    app_script = os.path.join(backend_dir, "app.py")

    print("=" * 65)
    print("           EMAIL REPLY ASSISTANT - AI RESPONSE GENERATOR         ")
    print("=" * 65)
    print(f"Using Python interpreter: {python_bin}")
    print("Serving on: http://127.0.0.1:5000")
    print("Press Ctrl+C to stop the server.")
    print("=" * 65)

    # Launch browser after slight delay
    def open_browser():
        time.sleep(1.8)
        webbrowser.open("http://127.0.0.1:5000")

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    # Run Flask server
    try:
        subprocess.run([python_bin, app_script], cwd=backend_dir)
    except KeyboardInterrupt:
        print("\nStopping Email Reply Assistant. Goodbye!")

if __name__ == "__main__":
    main()
