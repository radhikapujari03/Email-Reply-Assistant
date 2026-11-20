import unittest
from unittest.mock import patch
import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.gemini_service import generate_email_replies

class TestGeminiServiceMock(unittest.TestCase):
    @patch("services.gemini_service.generate_with_rest_api")
    def test_successful_gemini_generation(self, mock_rest):
        mock_rest.return_value = (
            {
                "formal": "Dear Dr. Smith,\n\nThank you for the update. I have reviewed the requirements and will proceed accordingly.\n\nSincerely,\n[Your Name]",
                "friendly": "Hi Alex,\n\nThanks for keeping me in the loop! Sounds like a great plan, I'll take a look this afternoon.\n\nCheers,\n[Your Name]",
                "short": "Received and noted with thanks. Will review shortly."
            },
            None
        )

        success, result, status_code = generate_email_replies(
            "Hi team, please review the latest sprint updates by tomorrow morning.",
            custom_api_key="AIzaSy_fake_test_key_for_unit_tests"
        )

        self.assertTrue(success)
        self.assertEqual(status_code, 200)
        self.assertIn("replies", result)
        replies = result["replies"]
        self.assertEqual(len(replies), 3)
        self.assertIn("formal", replies)
        self.assertIn("friendly", replies)
        self.assertIn("short", replies)
        self.assertTrue(replies["formal"].startswith("Dear"))
        self.assertTrue(replies["friendly"].startswith("Hi"))
        self.assertTrue(len(replies["short"]) > 0)

if __name__ == "__main__":
    unittest.main()
