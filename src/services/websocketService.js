// WebSocket Service for Real-Time Product Updates

const getWebSocketUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE || 'https://posifine22.onrender.com/api';
  // Convert https to wss, http to ws
  return baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
};

class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = {
      stock_updated: [],
      heartbeat: [],
      initial: [],
      error: [],
      sale_deleted: [],
      sale_created: [],
      product_deleted: [],
      product_created: [],
      product_updated: [],
      user_deleted: [],
      data_cleared: [],
      products_cleared: [],
      cashier_clocked_in: [],
      cashier_clocked_out: []
    };
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.isManualClose = false;
  }

  /**
   * Connect to WebSocket and listen for product updates
   */
  connect(token, onStockUpdate) {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (!token) {
        reject(new Error('No token provided for WebSocket connection'));
        return;
      }

      const wsUrl = `${getWebSocketUrl()}/ws/products?token=${encodeURIComponent(token)}`;

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected for real-time updates');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            // Handle different message types
            if (message.type === 'stock_updated') {
              console.log('📦 Stock update received:', message.data);
              // Call the provided callback with stock update
              if (onStockUpdate) {
                onStockUpdate(message.data);
              }
              this.emit('stock_updated', message.data);
            } else if (message.type === 'product_created') {
              console.log('✨ New product created:', message.data.product);
              this.emit('product_created', message.data);
              // Trigger dashboard refresh
              window.dispatchEvent(new Event('productCreated'));
            } else if (message.type === 'product_updated') {
              console.log('📝 Product updated:', message.data.product);
              this.emit('product_updated', message.data);
              // Trigger dashboard refresh
              window.dispatchEvent(new Event('productUpdated'));
            } else if (message.type === 'initial') {
              console.log('📦 Initial products loaded via WebSocket');
              this.emit('initial', message.products);
            } else if (message.type === 'heartbeat') {
              // Silent heartbeat - keep connection alive
              this.emit('heartbeat', message);
            } else if (message.type === 'sale_deleted') {
              console.log('🗑️ Sale deleted:', message.data);
              this.emit('sale_deleted', message.data);
              // Trigger dashboard refresh
              window.dispatchEvent(new Event('saleDeleted'));
            } else if (message.type === 'product_deleted') {
              console.log('🗑️ Product deleted:', message.data);
              this.emit('product_deleted', message.data);
              // Trigger dashboard refresh
              window.dispatchEvent(new Event('dataUpdated'));
            } else if (message.type === 'user_deleted') {
              console.log('🗑️ User deleted:', message.data);
              this.emit('user_deleted', message.data);
              // Trigger dashboard refresh
              window.dispatchEvent(new Event('userDeleted'));
            } else if (message.type === 'data_cleared') {
              console.log('🗑️ Data cleared:', message.data);
              this.emit('data_cleared', message.data);
              // Trigger dashboard refresh
              window.dispatchEvent(new Event('dataUpdated'));
            } else if (message.type === 'products_cleared') {
              console.log('🗑️ Products cleared:', message.data);
              this.emit('products_cleared', message.data);
              // Force immediate product refresh
              window.dispatchEvent(new CustomEvent('productsCleared', { detail: message.data }));
            } else if (message.type === 'sale_created') {
              console.log('💰 New sale recorded:', message.data.sale);
              this.emit('sale_created', message.data);
              // Trigger dashboard refresh for sales
              window.dispatchEvent(new CustomEvent('saleCreated', { detail: message.data }));
            } else if (message.type === 'cashier_clocked_in') {
              console.log('⏰ Cashier clocked in:', message.data.entry);
              this.emit('cashier_clocked_in', message.data);
              // Trigger admin dashboard refresh
              window.dispatchEvent(new CustomEvent('cashierClockIn', { detail: message.data }));
            } else if (message.type === 'cashier_clocked_out') {
              console.log('⏰ Cashier clocked out:', message.data.entry);
              this.emit('cashier_clocked_out', message.data);
              // Trigger admin dashboard refresh
              window.dispatchEvent(new CustomEvent('cashierClockOut', { detail: message.data }));
            }
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.emit('error', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          if (!this.isManualClose) {
            this.attemptReconnect(token, onStockUpdate);
          }
        };
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  attemptReconnect(token, onStockUpdate) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect(token, onStockUpdate).catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Register a listener for a specific message type
   */
  on(messageType, callback) {
    if (!this.listeners[messageType]) {
      this.listeners[messageType] = [];
    }
    this.listeners[messageType].push(callback);
  }

  /**
   * Emit a message to all listeners
   */
  emit(messageType, data) {
    if (this.listeners[messageType]) {
      this.listeners[messageType].forEach((callback) => {
        try {
          callback(data);
        } catch (e) {
          console.error(`Error in ${messageType} listener:`, e);
        }
      });
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    this.isManualClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export default new WebSocketService();
