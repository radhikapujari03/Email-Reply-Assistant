import unittest
import json
import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app
from services.gemini_service import extract_json_from_text

class TestEmailReplyAssistantBackend(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_health_endpoint(self):
        """Verify health endpoint returns 200 and expected schema."""
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "online")
        self.assertIn("api_key_configured", data)
        self.assertIn("version", data)

    def test_empty_email_validation(self):
        """Verify empty email returns 400 error."""
        response = self.client.post(
            "/api/generate-replies",
            data=json.dumps({"email": ""}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data["success"])
        self.assertIn("error", data)

    def test_whitespace_email_validation(self):
        """Verify whitespace-only email returns 400 error."""
        response = self.client.post(
            "/api/generate-replies",
            data=json.dumps({"email": "     "}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data["success"])

    def test_missing_email_field(self):
        """Verify missing email field returns 400 error."""
        response = self.client.post(
            "/api/generate-replies",
            data=json.dumps({"wrong_key": "some text"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data["success"])

    def test_short_email_validation(self):
        """Verify too short email (<10 chars) returns 400 error."""
        response = self.client.post(
            "/api/generate-replies",
            data=json.dumps({"email": "Hey"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data["success"])

    def test_json_extractor_handles_markdown_fences(self):
        """Verify extract_json_from_text strips markdown blocks properly."""
        raw = """```json
        {
          "formal": "Formal text",
          "friendly": "Friendly text",
          "short": "Short text"
        }
        ```"""
        parsed = extract_json_from_text(raw)
        self.assertIsNotNone(parsed)
        self.assertEqual(parsed["formal"], "Formal text")
        self.assertEqual(parsed["friendly"], "Friendly text")
        self.assertEqual(parsed["short"], "Short text")

    def test_json_extractor_handles_raw_text_around_json(self):
        """Verify extract_json_from_text extracts JSON even with preamble/postamble."""
        raw = """Here is your JSON response:
        {
          "formal": "Dear Sir...",
          "friendly": "Hey there...",
          "short": "Got it."
        }
        Hope this helps!"""
        parsed = extract_json_from_text(raw)
        self.assertIsNotNone(parsed)
        self.assertEqual(parsed["formal"], "Dear Sir...")
        self.assertEqual(parsed["short"], "Got it.")

    def test_set_api_key_endpoint(self):
        """Verify set-api-key endpoint updates key."""
        response = self.client.post(
            "/api/set-api-key",
            data=json.dumps({"apiKey": "test_key_12345"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(os.environ.get("GEMINI_API_KEY"), "test_key_12345")

        # Cleanup
        os.environ["GEMINI_API_KEY"] = ""

if __name__ == "__main__":
    unittest.main()
