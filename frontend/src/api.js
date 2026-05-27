// API & Real-time WebSocket Service for TaskFlow

const API_BASE = (import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : 'http://localhost:5000/api';
const WS_BASE = ((import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000').replace('http', 'ws');

let ws = null;
let reconnectTimer = null;

// Standard API fetch wrapper
export async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('taskflow_token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
}

// WebSocket initialization with hooks for real-time app state updates
export function initWebSocket(onMessageReceived) {
  const token = localStorage.getItem('taskflow_token');
  if (!token) return;

  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return;
  }

  try {
    ws = new WebSocket(`${WS_BASE}?token=${token}`);

    ws.onopen = () => {
      console.log('Real-time synchronization connected.');
      if (reconnectTimer) {
        clearInterval(reconnectTimer);
        reconnectTimer = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageReceived(data);
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    ws.onclose = () => {
      console.log('Real-time synchronization connection closed. Retrying in 5s...');
      ws = null;
      // Reconnect after 5 seconds
      if (!reconnectTimer) {
        reconnectTimer = setTimeout(() => {
          initWebSocket(onMessageReceived);
        }, 5000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket connection error:', error);
    };
  } catch (e) {
    console.error('Failed to establish WebSocket:', e);
  }
}

export function closeWebSocket() {
  if (ws) {
    ws.close();
    ws = null;
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}
