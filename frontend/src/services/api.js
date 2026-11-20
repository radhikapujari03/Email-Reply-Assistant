/**
 * API Service for Email Reply Assistant
 * Communicates with the Flask REST Backend
 */

const API_BASE = '/api';

/**
 * Check backend health and API key status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn('Backend health check warning:', error.message);
    return { status: 'offline', api_key_configured: false, error: error.message };
  }
}

/**
 * Send incoming email to backend for Gemini AI reply generation
 * @param {string} email - The original incoming email text
 * @param {string} [apiKey] - Optional custom API key override
 */
export async function generateReplies(email, apiKey = null) {
  const payload = { email: email.trim() };
  if (apiKey && apiKey.trim()) {
    payload.apiKey = apiKey.trim();
  }

  const response = await fetch(`${API_BASE}/generate-replies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({
    success: false,
    error: 'Failed to parse JSON response from server.',
  }));

  if (!response.ok || !data.success) {
    const errorMessage = data.error || `Request failed with status ${response.status}`;
    const err = new Error(errorMessage);
    err.status = response.status;
    err.details = data.details;
    err.isAuthError = data.is_auth_error || response.status === 401;
    throw err;
  }

  return data.replies;
}

/**
 * Update the Gemini API key in backend
 * @param {string} apiKey 
 */
export async function updateBackendApiKey(apiKey) {
  const response = await fetch(`${API_BASE}/set-api-key`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ apiKey }),
  });
  return await response.json();
}
