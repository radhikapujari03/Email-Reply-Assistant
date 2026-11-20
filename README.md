# Email Reply Assistant – Generative AI Response Generator

A modern, responsive, and full-stack Generative AI application that turns received emails into three context-aware, professionally tailored reply drafts (**Formal**, **Friendly**, and **Short**) using the **Google Gemini API**.

Designed with a **Midnight Blue + Cyan** dark-mode AI SaaS theme, resilient error handling, prompt injection safeguards, and individual clipboard copy controls.

---

## 🌟 Key Features

- **Context-Aware Generative AI Replies**: Uses Google's Gemini models (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`) via the modern `google-genai` SDK.
- **Three Distinct Tone Variations in One Generation**:
  - 🏛️ **Formal Reply**: Professional, polite, and respectful. Ideal for executives, managers, clients, teachers, and official business.
  - 🤝 **Friendly Reply**: Warm, approachable, natural, and conversational. Perfect for coworkers, teammates, classmates, and familiar contacts.
  - ⚡ **Short Reply**: Brief, direct, and concise (2–4 sentences) preserving the core message for quick acknowledgments or mobile triage.
- **One-Click Individual Copy**: Each reply card features an individual Copy button with animated clipboard feedback and a floating toast notification.
- **Quick Test Presets**: Includes realistic email presets (Meeting Reschedule, Project Status, Academic Extension, Interview Invitation) for instant demonstration.
- **Security & Prompt Injection Protection**:
  - Untrusted emails are enclosed in structured `<incoming_email>` XML delimiters.
  - Strict guardrails prevent the AI from adopting user text as override instructions.
  - No hallucinated commitments: Missing dates, names, or specifics automatically use placeholders like `[Your Name]`, `[Proposed Time]`, or `[Details]`.
  - Zero data persistence: Emails are processed purely in-memory and never logged to external databases.
- **Production-Ready Unified Serving**: Flask serves both the REST API and the optimized React production bundle from a single port (`5000`), or supports live hot-reloading development with Vite (`5173`).

---

## 🎨 UI/UX Design System (Midnight Blue + Cyan Theme)

| Element | Color Hex | Preview / Purpose |
| :--- | :--- | :--- |
| **Main Background** | `#0B1220` | Deep midnight canvas with subtle radial grid |
| **Card Background** | `#152238` | Elevated dark navy cards |
| **Secondary Background** | `#1B2C45` | Button and input containers |
| **Border Color** | `#263B58` | Crisp structural borders |
| **Primary Accent** | `#16BFD0` | Cyan brand highlight & Formal card accent |
| **Secondary Accent** | `#6FA8FF` | Electric blue & Friendly card accent |
| **Optional Highlight** | `#A78BFA` | Soft violet & Short card accent |
| **Primary Text** | `#F1F7FF` | Clean white text for readability |
| **Secondary Text** | `#A9B8CC` | Slate gray supporting text |

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    User["👤 User (Browser)"]
    
    subgraph Frontend ["React + Tailwind CSS Client (Port 5173 / 5000)"]
        UI["Modern Dark UI"]
        Input["Email Input Area & Presets"]
        Cards["Formal, Friendly & Short Reply Cards"]
        Clipboard["Browser Clipboard API & Toast"]
    end
    
    subgraph Backend ["Python Flask REST API (Port 5000)"]
        Routes["Flask Router & CORS"]
        Sanitizer["Input Validation & Delimitation"]
        PromptEngine["Structured Prompt Engine"]
        JSONParser["Robust JSON Parser & Sanitizer"]
    end
    
    subgraph AI ["Google Generative AI Cloud"]
        Gemini["Google Gemini API (google-genai / google-generativeai)"]
    end

    User -->|Pastes incoming email| Input
    Input -->|POST /api/generate-replies| Routes
    Routes --> Sanitizer
    Sanitizer --> PromptEngine
    PromptEngine -->|Secure Prompt with XML isolation| Gemini
    Gemini -->|Structured JSON Response| JSONParser
    JSONParser -->|{ formal, friendly, short }| Routes
    Routes -->|200 OK JSON| Cards
    Cards -->|One-click Copy| Clipboard
    Clipboard -->|Toast Notification| User
```

---

## 🛠️ Technology Stack

- **Frontend**:
  - React.js 18
  - Tailwind CSS 3
  - Lucide React (modern icon suite)
  - Vite (build tool & dev server)
- **Backend**:
  - Python 3.10+ (tested on Python 3.12)
  - Flask 3.1 & Flask-CORS
  - python-dotenv (environment variable management)
- **Generative AI**:
  - Official Google GenAI SDK (`google-genai` & `google-generativeai`)
  - Target Models: `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`
  - Structured JSON Output (`response_mime_type="application/json"`)

---

## 📁 Project Structure

```
Email _Reply_Assistant/
├── backend/
│   ├── app.py                      # Flask application & REST endpoints
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Environment template
│   ├── .env                        # Local environment configuration
│   ├── services/
│   │   ├── __init__.py
│   │   └── gemini_service.py       # Prompt engineering & Gemini API integration
│   └── tests/
│       ├── test_api.py             # REST API unit tests (unittest)
│       ├── test_mock_generation.py # Mock generation tests
│       └── test_live_server.py     # Live server integration test suite
├── frontend/
│   ├── index.html                  # HTML5 entry with Inter font
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite config & API reverse proxy
│   ├── tailwind.config.js          # Midnight Blue + Cyan theme tokens
│   ├── postcss.config.js
│   ├── dist/                       # Production build (served by Flask)
│   └── src/
│       ├── App.jsx                 # Main state & application coordinator
│       ├── main.jsx                # React DOM root
│       ├── index.css               # Global styles, scrollbars, glows
│       ├── components/
│       │   ├── Navbar.jsx          # Top brand bar & live API indicator
│       │   ├── Hero.jsx            # Header & feature tags
│       │   ├── EmailInput.jsx      # Input textarea, counters & controls
│       │   ├── SampleSelector.jsx  # Quick test preset emails
│       │   ├── ReplyCard.jsx       # Individual reply card with Copy & Edit
│       │   ├── ResultsSection.jsx  # 3-column responsive card grid & skeletons
│       │   ├── SettingsModal.jsx   # In-app Gemini API Key configuration
│       │   └── Toast.jsx           # Floating copy & error notifications
│       └── services/
│           └── api.js              # Frontend API client
├── start_app.py                    # Cross-platform one-command launcher
├── run.bat                         # Windows 1-click launcher
├── run_dev.bat                     # Windows live development launcher
└── README.md                       # Comprehensive project documentation
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
1. **Python 3.10+** (Python 3.12 recommended)
2. **Node.js 18+** and **npm**
3. A **Google Gemini API Key** (Free from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

### Step 1: Clone or Navigate to the Workspace
```bash
cd "c:\Users\user5\Desktop\LY\Gen AI\Email _Reply_Assistant"
```

---

### Step 2: Configure Your Gemini API Key

Open `backend/.env` (or copy from `backend/.env.example`):
```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
PORT=5000
HOST=127.0.0.1
FLASK_DEBUG=True
```
*(Note: You can also configure the API key directly in the web UI using the "Configure API" button in the navigation header).*

---

### Step 3: Run the Application

#### Option A: Quick One-Click Launcher (Windows)
Double-click `run.bat` or run:
```cmd
.\run.bat
```
*This starts the Flask server and opens `http://127.0.0.1:5000` in your default browser.*

#### Option B: Python Launcher (Cross-Platform)
```bash
python start_app.py
```

#### Option C: Live Development Mode (Concurrent Flask + Vite)
If you want to edit React code with hot-reloading:
```cmd
.\run_dev.bat
```
Or manually in two terminals:
- **Terminal 1 (Backend)**:
  ```bash
  .\backend\venv\Scripts\python.exe backend/app.py
  ```
- **Terminal 2 (Frontend)**:
  ```bash
  cd frontend
  npm run dev
  ```
  Visit: `http://localhost:5173`

---

## 🧪 Testing and Verification

Run the automated backend test suite:

```bash
# Unit & Validation Tests
.\backend\venv\Scripts\python.exe backend/tests/test_api.py

# Prompt & Generation Logic Mock Tests
.\backend\venv\Scripts\python.exe backend/tests/test_mock_generation.py

# Live Server & Static File Integration Test
.\backend\venv\Scripts\python.exe backend/tests/test_live_server.py
```

---

## 📡 REST API Documentation

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "online",
  "service": "Email Reply Assistant API",
  "api_key_configured": true,
  "version": "1.0.0"
}
```

### 2. Generate Replies
- **Endpoint**: `POST /api/generate-replies`
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "Hi Alex,\n\nCould we reschedule our 2:00 PM call to Thursday at 11:00 AM?\n\nBest,\nSarah"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "replies": {
    "formal": "Dear Sarah,\n\nThank you for reaching out. Thursday at 11:00 AM EST works perfectly for our discussion.\n\nSincerely,\n[Your Name]",
    "friendly": "Hi Sarah,\n\nNo problem at all! Thursday at 11:00 AM sounds great. Talk to you then!\n\nBest,\n[Your Name]",
    "short": "Hi Sarah, Thursday at 11:00 AM works for me. See you then!"
  }
}
```

### 3. Update API Key Runtime
- **Endpoint**: `POST /api/set-api-key`
- **Request Body**:
```json
{
  "apiKey": "AIzaSy..."
}
```

---

## 🔒 Security & Prompt Engineering Guardrails

1. **Prompt Injection Mitigation**: Incoming email content is treated as untrusted data by wrapping it inside XML tags (`<incoming_email>...</incoming_email>`). System instructions explicitly forbid executing directives within that block.
2. **Zero Inventions / Placeholders**: Gemini is instructed never to invent dates, agreements, or commitments. Missing data is replaced with clear placeholders like `[Your Name]`, `[Specific Date]`.
3. **Structured JSON Validation**: Generation responses are strictly validated through regex and `json.loads` to guarantee valid `formal`, `friendly`, and `short` reply fields before returning to the frontend.
4. **Credential Isolation**: The Gemini API key is maintained strictly server-side in `backend/.env` and runtime memory; it is never exposed to the client.

---

## 🚀 Future Enhancements Compatibility

The architecture is prepared for seamless expansion into:
- **Multilingual Support**: Tone drafts in Hindi, Marathi, Spanish, etc.
- **Custom Tone Sliders**: Adjust humor, assertiveness, or length.
- **Email Summarizer**: Extract key action items and deadline bullets before replying.
- **Local History & Starred Replies**: Store favorite drafts locally using `IndexedDB`.
