import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, TrendingDown, Package } from 'lucide-react';

export default function StockUpdateListener() {
  const [updates, setUpdates] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [autoHideTimeout, setAutoHideTimeout] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  useEffect(() => {
    let ws = null;
    let reconnectTimeout = null;

    const connectWebSocket = () => {
      try {
        // Only attempt connection if not too many failures
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.warn('⚠️ Max reconnection attempts reached - giving up');
          return;
        }

        ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/api/live`);
        
        ws.onopen = () => {
          console.log('✅ Real-time stock listener connected');
          setReconnectAttempts(0); // Reset on successful connection
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📡 WebSocket message received:', data.type);
            
            // Handle STOCK_UPDATED events
            if (data.type === 'STOCK_UPDATED') {
              console.log('📦 Stock updated:', data.data);
              setUpdates(data.data?.deductions || []);
              setIsVisible(true);

              // Dispatch custom event for ProductsContext to listen to
              window.dispatchEvent(new CustomEvent('STOCK_UPDATED', { 
                detail: data.data 
              }));

              // Auto-hide after 8 seconds
              if (autoHideTimeout) {
                clearTimeout(autoHideTimeout);
              }
              const timeout = setTimeout(() => {
                setIsVisible(false);
              }, 8000);
              setAutoHideTimeout(timeout);
            }
            
            // Handle product creation events
            else if (data.type === 'product_created') {
              console.log('➕ Product created:', data.data?.product?.name);
              window.dispatchEvent(new CustomEvent('productCreated', { 
                detail: data.data 
              }));
              window.dispatchEvent(new CustomEvent('PRODUCT_ADDED', { 
                detail: data.data 
              }));
            }
            
            // Handle product update events
            else if (data.type === 'product_updated') {
              console.log('✏️ Product updated:', data.data?.product?.name);
              window.dispatchEvent(new CustomEvent('productUpdated', { 
                detail: data.data 
              }));
              window.dispatchEvent(new CustomEvent('PRODUCT_UPDATED', { 
                detail: data.data 
              }));
            }
            
            // Handle stock update events
            else if (data.type === 'stock_updated') {
              console.log('📦 Stock updated (via update_stock endpoint):', data.data?.product?.name);
              window.dispatchEvent(new CustomEvent('STOCK_UPDATED', { 
                detail: data.data 
              }));
            }
            
            // Handle product deletion events
            else if (data.type === 'product_deleted') {
              console.log('🗑️ Product deleted');
              window.dispatchEvent(new CustomEvent('productDeleted', { 
                detail: data.data 
              }));
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('⚠️ Real-time stock listener disconnected');
          // Try to reconnect after delay (NO PAGE RELOAD!)
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff
            console.log(`🔄 Reconnecting in ${delay}ms... (attempt ${reconnectAttempts + 1})`);
            reconnectTimeout = setTimeout(() => {
              setReconnectAttempts(prev => prev + 1);
              connectWebSocket();
            }, delay);
          }
        };
      } catch (err) {
        console.error('Failed to create WebSocket:', err);
        // Silently fail - don't break the app
      }
    };

    connectWebSocket();

    return () => {
      if (autoHideTimeout) {
        clearTimeout(autoHideTimeout);
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  if (!isVisible || updates.length === 0) {
    return null;
  }

  const productUpdates = updates.products || [];
  const expenseUpdates = updates.expenses || [];
  const totalUpdates = productUpdates.length + expenseUpdates.length;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-40 animate-slideIn">
      <div className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 border-b border-blue-200 flex items-start gap-3">
          <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-blue-900 text-sm">Stock Updated</p>
            <p className="text-xs text-blue-700 mt-0.5">
              {totalUpdates} item{totalUpdates !== 1 ? 's' : ''} deducted atomically
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-blue-700 hover:text-blue-900 text-xl flex-shrink-0 ml-1"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
          {/* Product Updates */}
          {productUpdates.length > 0 && (
            <div className="space-y-1.5">
              {productUpdates.slice(0, 3).map((item, idx) => (
                <div key={idx} className="text-xs bg-blue-50 rounded p-2 border border-blue-100">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-blue-600">
                    -{item.deducted} {item.unit} ({item.before_qty} → {item.after_qty})
                  </p>
                </div>
              ))}
              {productUpdates.length > 3 && (
                <p className="text-xs text-gray-600 italic p-2">
                  +{productUpdates.length - 3} more product{productUpdates.length - 3 !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {/* Expense Updates */}
          {expenseUpdates.length > 0 && (
            <div className="space-y-1.5">
              {expenseUpdates.slice(0, 2).map((item, idx) => (
                <div key={idx} className="text-xs bg-amber-50 rounded p-2 border border-amber-200">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-amber-600">
                    -{item.deducted} {item.unit} (expense)
                  </p>
                </div>
              ))}
              {expenseUpdates.length > 2 && (
                <p className="text-xs text-gray-600 italic p-2">
                  +{expenseUpdates.length - 2} more expense{expenseUpdates.length - 2 !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-blue-50 border-t border-blue-200 p-2 flex items-center gap-2 text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700">Inventory synchronized across dashboards</span>
        </div>
      </div>
    </div>
  );
}
