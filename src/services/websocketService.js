/**
 * WebSocket Service for Real-Time Updates
 * Handles connection to backend WebSocket for live stock, sales, and dashboard updates
 */

class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = null;
    this.callbacks = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect(token, onMessage) {
    console.log('[WebSocket] 🔌 Connecting...');
    
    // Determine WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    this.url = `${protocol}//${host}/ws`;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[WebSocket] ✅ Connected');
        this.reconnectAttempts = 0;
        
        // Send auth token
        this.ws.send(JSON.stringify({ 
          type: 'auth', 
          token 
        }));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[WebSocket] 📥 Received:', data);
          
          if (onMessage) {
            onMessage(data);
          }
          
          // Notify all subscribers
          this.callbacks.forEach(callback => {
            try {
              callback(data);
            } catch (err) {
              console.error('[WebSocket] Callback error:', err);
            }
          });
        } catch (err) {
          console.error('[WebSocket] Parse error:', err);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] ❌ Error:', error);
      };

      this.ws.onclose = () => {
        console.warn('[WebSocket] ❌ Disconnected');
        
        // Auto-reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`[WebSocket] Reconnecting in ${this.reconnectDelay}ms... (Attempt ${this.reconnectAttempts})`);
          setTimeout(() => {
            this.connect(token, onMessage);
          }, this.reconnectDelay);
        }
      };

      return Promise.resolve();
    } catch (error) {
      console.error('[WebSocket] Connection failed:', error);
      return Promise.reject(error);
    }
  }

  disconnect() {
    console.log('[WebSocket] 🔌 Disconnecting...');
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] 📤 Sending:', data);
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('[WebSocket] Not connected, cannot send:', data);
    }
  }

  subscribe(callback) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }
}

export default new WebSocketService();
