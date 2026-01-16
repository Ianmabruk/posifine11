
// Updated API Service Layer - Connected to Deployed Backend

const getBaseUrl = () => {
  // Priority 1: Environment variable
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  
  // Priority 2: If running on localhost/127.0.0.1, use local backend
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
    return 'http://127.0.0.1:5000/api';
  }
  
  // Priority 3: Production Render URL
  return 'https://posifine22.onrender.com/api';
};

const BASE_API_URL = getBaseUrl();

console.log('🌐 API Base URL:', BASE_API_URL);
const getToken = () => localStorage.getItem('token');

// Retry logic for network failures (handles Render free tier spindown)
const requestWithRetry = async (endpoint, options = {}, retryCount = 0, maxRetries = 3) => {
  const token = getToken();
  
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && !(cleanEndpoint.startsWith('/auth') && cleanEndpoint !== '/auth/me') && !cleanEndpoint.includes('/main-admin/auth/login') && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${BASE_API_URL}${cleanEndpoint}`, config);

    if (response.status === 401) {
      // Remove both token types
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('ownerToken');
      localStorage.removeItem('ownerUser');
      const path = window.location.pathname || '';
      // Only redirect if on protected pages (not login/signup/auth/main.admin)
      if (!path.includes('/login') && !path.includes('/signup') && !path.includes('/auth') && !path.includes('/main.admin')) {
        try {
          window.location.href = '/login';
        } catch (e) {}
      }
      const err = new Error('Unauthorized');
      err.status = 401;
      throw err;
    }

    if (response.status === 423) {
      // Screen locked - don't throw immediately, return the response
      // Components will handle showing the unlock dialog
      const errorData = await response.json().catch(() => ({ error: 'Screen locked' }));
      const err = new Error(errorData.error || 'Screen locked');
      err.status = 423;
      err.isScreenLocked = true;
      throw err;
    }

    if (response.status === 500) {
      throw new Error('Server error 500 - Backend unavailable');
    }

    if (response.ok) {
      if (response.status === 204) {
        return { success: true };
      }
      return await response.json();
    }

    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);

  } catch (error) {
    // Retry on network errors (fetch failures)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error(`API Fetch Error (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);
      console.error("Attempted URL:", `${BASE_API_URL}${cleanEndpoint}`);
      
      // If not max retries, wait and retry
      if (retryCount < maxRetries) {
        const delayMs = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff: 1s, 2s, 4s
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return requestWithRetry(endpoint, options, retryCount + 1, maxRetries);
      }
      
      // All retries failed
      throw new Error('Cannot connect to server. The server may be waking up. Please try again in a moment.');
    }
    throw error;
  }
};

const request = (endpoint, options = {}) => {
  return requestWithRetry(endpoint, options, 0, 3);
};


// Authentication API
export const auth = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  pinLogin: (credentials) => request('/auth/pin-login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  signup: (data) => request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  signupWithPayment: (data) => request('/signup-with-payment', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  me: () => request('/auth/me'),
  
  // Subscription management
  getSubscriptionStatus: () => request('/user/subscription-status'),
  
  renewSubscription: (durationDays = 30) => request('/subscriptions/renew', {
    method: 'POST',
    body: JSON.stringify({ duration_days: durationDays })
  })
};


// Subscriptions API
export const subscriptions = {
  getPlans: () => request('/subscriptions/plans'),
  
  getOverview: () => {
    const token = localStorage.getItem('ownerToken');
    return request('/subscriptions/overview', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  },
  
  checkExpiry: () => {
    const token = localStorage.getItem('ownerToken');
    return request('/subscriptions/check-expiry', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  },
  
  getUserSubscriptionStatus: (userId) => {
    const token = localStorage.getItem('ownerToken');
    return request(`/user/subscription-status`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
};


// Users API
export const users = {
  getAll: () => request('/users'),
  
  create: (userData) => request('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  update: (id, userData) => request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  
  delete: (id) => request(`/users/${id}`, {
    method: 'DELETE'
  }),
  
  setPin: (id, pin) => request(`/users/${id}/set-pin`, {
    method: 'POST',
    body: JSON.stringify({ pin })
  }),
  
  lock: (id, locked) => request(`/users/${id}/lock`, {
    method: 'POST',
    body: JSON.stringify({ locked })
  })
};

// Products API
export const products = {
  getAll: () => request('/products'),
  
  create: (productData) => request('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  
  update: (id, productData) => request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  }),
  
  delete: (id) => request(`/products/${id}`, {
    method: 'DELETE'
  }),
  
  // Update product stock/inventory
  updateStock: (id, stockData) => request(`/products/${id}/stock`, {
    method: 'PUT',
    body: JSON.stringify(stockData)
  }),
  
  getMaxProducible: (id) => request(`/products/${id}/max-producible`),
  
  // Get detailed stock status for all products
  getStockStatus: () => request('/products/stock-status')
};

// Sales API - FIXED: Now calls actual backend instead of hardcoded demo
export const sales = {
  getAll: () => request('/sales'),
  
  create: (saleData) => request('/sales', {
    method: 'POST',
    body: JSON.stringify(saleData)
  }),
  
  delete: (id) => request(`/sales/${id}`, {
    method: 'DELETE'
  })
};

// Expenses API - FIXED: Now calls actual backend instead of hardcoded demo
export const expenses = {
  getAll: () => request('/expenses'),
  
  create: (expenseData) => request('/expenses', {
    method: 'POST',
    body: JSON.stringify(expenseData)
  }),
  
  update: (id, expenseData) => request(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expenseData)
  }),
  
  delete: (id) => request(`/expenses/${id}`, {
    method: 'DELETE'
  })
};

// Statistics API
export const stats = {
  get: () => request('/stats')
};

// Raw Materials API - For composite product system
export const rawMaterials = {
  getAll: () => request('/raw-materials'),
  
  create: (materialData) => request('/raw-materials', {
    method: 'POST',
    body: JSON.stringify(materialData)
  }),
  
  update: (id, materialData) => request(`/raw-materials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(materialData)
  }),
  
  delete: (id) => request(`/raw-materials/${id}`, {
    method: 'DELETE'
  })
};

// Reminders API
export const reminders = {
  getAll: async () => {
    return [];
  },
  getToday: async () => {
    return [];
  },
  create: async (reminderData) => {
    return { id: Date.now(), ...reminderData };
  },
  update: async (id, reminderData) => {
    return { id, ...reminderData };
  },
  delete: async (id) => {
    return { success: true };
  }
};

// Time Entries API (Clock-in/Clock-out)
export const timeEntries = {
  getAll: () => request('/time-entries'),
  
  clockIn: (notes) => request('/clock-in', {
    method: 'POST',
    body: JSON.stringify({ notes: notes || '' })
  }),
  
  clockOut: () => request('/clock-out', {
    method: 'POST',
    body: JSON.stringify({})
  })
};

// Price History API
export const priceHistory = {
  getAll: () => request('/price-history'),
  create: (priceData) => request('/price-history', {
    method: 'POST',
    body: JSON.stringify(priceData)
  })
};

// Service Fees API
export const serviceFees = {
  getAll: () => request('/service-fees'),
  create: (feeData) => request('/service-fees', {
    method: 'POST',
    body: JSON.stringify(feeData)
  }),
  update: (id, feeData) => request(`/service-fees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(feeData)
  }),
  delete: (id) => request(`/service-fees/${id}`, {
    method: 'DELETE'
  })
};

// Discounts API
export const discounts = {
  getAll: () => request('/discounts'),
  create: (discountData) => request('/discounts', {
    method: 'POST',
    body: JSON.stringify(discountData)
  }),
  update: (id, discountData) => request(`/discounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(discountData)
  }),
  delete: (id) => request(`/discounts/${id}`, {
    method: 'DELETE'
  })
};

// Credit Requests API
export const creditRequests = {
  getAll: () => request('/credit-requests'),
  create: (requestData) => request('/credit-requests', {
    method: 'POST',
    body: JSON.stringify(requestData)
  }),
  approve: (id) => request(`/credit-requests/${id}/approve`, {
    method: 'POST'
  }),
  reject: (id) => request(`/credit-requests/${id}/reject`, {
    method: 'POST'
  })
};

// Settings API
export const settings = {
  get: async () => {
    return {
      screenLockPassword: '2005',
      businessName: 'My Business'
    };
  },
  update: async (settingsData) => {
    return settingsData;
  }
};

// Batches API
export const batches = {
  getAll: (productId) => {
    const url = productId ? `/batches?productId=${productId}` : '/batches';
    return request(url);
  },
  create: (batchData) => request('/batches', {
    method: 'POST',
    body: JSON.stringify(batchData)
  })
};

// Production API
export const production = {
  getAll: () => request('/production'),
  create: (productionData) => request('/production', {
    method: 'POST',
    body: JSON.stringify(productionData)
  })
};

// Categories API
export const categories = {
  generateCode: (data) => request('/categories/generate-code', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// Admin Data Management API
export const admin = {
  clearData: (type = 'all') => request('/clear-data', {
    method: 'POST',
    body: JSON.stringify({ type })
  })
};

// Image Upload API
export const uploadImage = (imageData) => request('/upload-image', {
  method: 'POST',
  body: JSON.stringify(imageData)
});

// Main Admin API (for owner dashboard)
export const mainAdmin = {
  login: (credentials) => {
    // Use owner token for main admin requests
    return request('/main-admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  getUsers: () => {
    const token = localStorage.getItem('ownerToken');
    return request('/main-admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  },
  getStats: () => {
    const token = localStorage.getItem('ownerToken');
    return request('/main-admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  },
  getActivities: () => {
    const token = localStorage.getItem('ownerToken');
    return request('/main-admin/activities', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getSalesAll: () => {
    const token = localStorage.getItem('ownerToken');
    return request('/main-admin/sales-all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getTimeEntriesAll: () => {
    const token = localStorage.getItem('ownerToken');
    return request('/main-admin/time-entries-all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  lockUser: (userId, locked) => {
    const token = localStorage.getItem('ownerToken');
    return request(`/main-admin/users/${userId}/lock`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ locked })
    });
  },
  changePlan: (userId, plan) => {
    const token = localStorage.getItem('ownerToken');
    return request(`/main-admin/users/${userId}/plan`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ plan })
    });
  },
  deleteUser: (userId) => {
    const token = localStorage.getItem('ownerToken');
    return request(`/main-admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  clearData: (type) => {
    const token = localStorage.getItem('ownerToken');
    return request('/main-admin/system/clear-data', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type })
    });
  },
  lockUserScreen: (userId) => {
    const token = localStorage.getItem('ownerToken');
    return request(`/admin/lock-user-screen/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Utility function to check if backend is available
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${BASE_API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${getToken() || 'invalid'}`
      }
    });
    // If we get 200 or 401, the backend is alive. 
    // If we get connection refused, it throws.
    return response.status < 500;
  } catch (error) {
    return false;
  }
};

// Export base URL for other components to use
export { BASE_API_URL };

// WebSocket-backed product subscription helper
let __ws = null;
let __wsCallbacks = new Set();

function _getWsUrl() {
  const wsBase = BASE_API_URL.replace(/\/api$/, '');
  const proto = wsBase.startsWith('https') ? 'wss' : 'ws';
  return `${proto}://${wsBase.replace(/^https?:\/\//, '')}/api/ws/products`;
}

function _ensureWs() {
  if (__ws && (__ws.readyState === WebSocket.OPEN || __ws.readyState === WebSocket.CONNECTING)) return;
  const token = getToken();
  const url = _getWsUrl() + (token ? `?token=${encodeURIComponent(token)}` : '');
  __ws = new WebSocket(url);
  __ws.onopen = () => {
    console.debug('Products WS connected');
  };
  __ws.onmessage = (ev) => {
    let data = null;
    try { data = JSON.parse(ev.data); } catch (e) { return; }
    __wsCallbacks.forEach(cb => {
      try { cb(data); } catch (e) { console.error('ws callback error', e); }
    });
  };
  __ws.onclose = () => {
    console.debug('Products WS closed');
    __ws = null;
  };
  __ws.onerror = (e) => {
    console.error('Products WS error', e);
  };
}

export function subscribeProducts(onMessage) {
  if (typeof onMessage !== 'function') throw new Error('subscribeProducts requires a callback');
  __wsCallbacks.add(onMessage);
  _ensureWs();
  // return unsubscribe
  return () => {
    __wsCallbacks.delete(onMessage);
    if (__ws && __wsCallbacks.size === 0) {
      try { __ws.close(); } catch (e) {}
      __ws = null;
    }
  };
}

export function unsubscribeAllProductSubscriptions() {
  __wsCallbacks.clear();
  if (__ws) {
    try { __ws.close(); } catch (e) {}
    __ws = null;
  }
}

// Recipes API - Composite product recipes/BOMs with ingredient deduction support
export const recipes = {
  getAll: () => request('/recipes'),
  
  getByProduct: (productId) => request(`/recipes/${productId}`),
  
  create: (data) => request('/recipes', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/recipes/${id}`, {
    method: 'DELETE'
  })
};

// Cashier Notes API
export const cashierNotes = {
  getAll: () => request('/cashier-notes'),
  create: (data) => request('/cashier-notes', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  markAsRead: (id) => request(`/cashier-notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ read: true })
  }),
  delete: (id) => request(`/cashier-notes/${id}`, {
    method: 'DELETE'
  })
};

