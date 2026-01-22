// Optimized API service for faster product updates with optimistic UI
// This service handles:
// - Optimistic updates (update UI immediately)
// - Request deduplication
// - Debouncing for rapid updates
// - Automatic rollback on failure

let pendingUpdates = new Map(); // Track pending updates
let updateTimeouts = new Map(); // Track debounce timeouts

export const optimizedProductAPI = {
  // Fast update with optimistic UI
  updateProductFast: async (productId, updates, onOptimisticUpdate) => {
    // Cancel previous pending update for same product
    if (updateTimeouts.has(productId)) {
      clearTimeout(updateTimeouts.get(productId));
    }

    // Store original for rollback
    const originalData = pendingUpdates.get(productId);

    // Update UI immediately (optimistic)
    onOptimisticUpdate(updates);

    // Store the pending update
    pendingUpdates.set(productId, updates);

    // Debounce the actual API call (wait 300ms for more changes)
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(async () => {
        try {
          // Make the API call
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE}/products/${productId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(updates)
            }
          );

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }

          const result = await response.json();
          pendingUpdates.delete(productId);
          updateTimeouts.delete(productId);
          
          resolve(result);
        } catch (error) {
          // Rollback on failure
          if (originalData) {
            onOptimisticUpdate(originalData);
          }
          pendingUpdates.delete(productId);
          updateTimeouts.delete(productId);
          
          console.error('Failed to update product:', error);
          reject(error);
        }
      }, 300); // 300ms debounce

      updateTimeouts.set(productId, timeoutId);
    });
  },

  // Fast stock update
  updateStockFast: async (productId, quantityChange, onOptimisticUpdate) => {
    // Cancel previous pending update
    if (updateTimeouts.has(`stock-${productId}`)) {
      clearTimeout(updateTimeouts.get(`stock-${productId}`));
    }

    const key = `stock-${productId}`;
    const originalData = pendingUpdates.get(key);

    // Optimistic update
    onOptimisticUpdate({ quantity: quantityChange });

    pendingUpdates.set(key, { quantity: quantityChange });

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE}/products/${productId}/stock`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ quantity: quantityChange })
            }
          );

          if (!response.ok) {
            throw new Error(`Stock update failed: ${response.status}`);
          }

          const result = await response.json();
          pendingUpdates.delete(key);
          updateTimeouts.delete(key);
          
          resolve(result);
        } catch (error) {
          if (originalData) {
            onOptimisticUpdate(originalData);
          }
          pendingUpdates.delete(key);
          updateTimeouts.delete(key);
          
          reject(error);
        }
      }, 200); // 200ms debounce for stock (faster)

      updateTimeouts.set(key, timeoutId);
    });
  },

  // Update image with immediate preview
  updateImageFast: async (productId, base64Image, onOptimisticUpdate) => {
    if (updateTimeouts.has(`image-${productId}`)) {
      clearTimeout(updateTimeouts.get(`image-${productId}`));
    }

    const key = `image-${productId}`;
    const originalData = pendingUpdates.get(key);

    // Show preview immediately
    onOptimisticUpdate({ image: base64Image });

    pendingUpdates.set(key, { image: base64Image });

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE}/products/${productId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ image: base64Image })
            }
          );

          if (!response.ok) {
            throw new Error(`Image update failed: ${response.status}`);
          }

          const result = await response.json();
          pendingUpdates.delete(key);
          updateTimeouts.delete(key);
          
          resolve(result);
        } catch (error) {
          if (originalData) {
            onOptimisticUpdate(originalData);
          }
          pendingUpdates.delete(key);
          updateTimeouts.delete(key);
          
          reject(error);
        }
      }, 500); // 500ms debounce for images

      updateTimeouts.set(key, timeoutId);
    });
  },

  // Clear all pending updates
  clearPendingUpdates: () => {
    pendingUpdates.forEach((_, key) => {
      if (updateTimeouts.has(key)) {
        clearTimeout(updateTimeouts.get(key));
      }
    });
    pendingUpdates.clear();
    updateTimeouts.clear();
  }
};
