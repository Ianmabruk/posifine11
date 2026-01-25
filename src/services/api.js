
// Updated API Service Layer - Connected to Deployed Backend

const getBaseUrl = () => {
  // Use environment variable if available, otherwise use localhost for development
  return import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
};

const BASE_API_URL = getBaseUrl();

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
      // For login endpoints, return the error response instead of throwing
      if (cleanEndpoint.includes('/auth/login') || cleanEndpoint.includes('/main-admin/auth/login')) {
        const errorData = await response.json().catch(() => ({ error: 'Unauthorized' }));
        throw new Error(errorData.error || 'Invalid credentials');
      }
      
      // For other endpoints, clear tokens and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const path = window.location.pathname || '';
      
      // Public pages that should NOT redirect on 401
      const publicPaths = ['/', '/get-started', '/choose-subscription', '/plans', '/subscription', '/build-pos', '/login', '/signup', '/auth', '/main.admin'];
      const isPublicPage = publicPaths.some(p => path === p || path.startsWith(p));
      
      if (!isPublicPage) {
        try {
          window.location.href = '/auth/login';
        } catch (e) {}
      }
      const err = new Error('Unauthorized');
      err.status = 401;
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
  
  updatePin: (pin) => request('/auth/update-pin', {
    method: 'POST',
    body: JSON.stringify({ pin })
  })
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
  
  // Get low-stock warnings (products below threshold)
  getLowStockWarnings: () => request('/products/low-stock-warnings'),
  
  // Update product stock/inventory
  updateStock: (id, stockData) => request(`/products/${id}/stock`, {
    method: 'PUT',
    body: JSON.stringify(stockData)
  }),
  
  getMaxProducible: (id) => request(`/products/${id}/max-producible`),
  
  // Weight-based pricing management
  getWeightPricing: (id) => request(`/products/${id}/weight-pricing`),
  
  addWeightPrice: (id, weight, price) => request(`/products/${id}/weight-pricing`, {
    method: 'POST',
    body: JSON.stringify({ weight, price })
  }),
  
  updateWeightPrice: (id, weight, price) => request(`/products/${id}/weight-pricing`, {
    method: 'PUT',
    body: JSON.stringify({ weight, price })
  }),
  
  deleteWeightPrice: (id, weight) => request(`/products/${id}/weight-pricing`, {
    method: 'DELETE',
    body: JSON.stringify({ weight })
  })
};

// Sales API
export const sales = {
  getAll: () => request('/sales'),
  
  create: (saleData) => request('/sales', {
    method: 'POST',
    body: JSON.stringify(saleData)
  }),
  
  delete: (id) => request(`/sales/${id}`, {
    method: 'DELETE'
  }),
  
  // Admin complete sale with immediate deduction
  adminComplete: (saleData) => request('/admin-complete-sale', {
    method: 'POST',
    body: JSON.stringify(saleData)
  })
};

// Expenses API
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

// Reminders API
export const reminders = {
  getAll: () => request('/reminders'),
  getToday: () => request('/reminders/today'),
  create: (reminderData) => request('/reminders', {
    method: 'POST',
    body: JSON.stringify(reminderData)
  }),
  update: (id, reminderData) => request(`/reminders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reminderData)
  }),
  delete: (id) => request(`/reminders/${id}`, {
    method: 'DELETE'
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
  update: (id, data) => request(`/credit-requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
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
  get: () => request('/settings'),
  update: (settingsData) => request('/settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData)
  })
};

// Time Entries API - for clock in/out tracking
export const timeEntries = {
  getAll: () => request('/time-entries'),
  
  getStatus: () => request('/clock-status'),
  
  create: (action) => request('/time-entries', {
    method: 'POST',
    body: JSON.stringify({ action })
  }),
  
  update: (id, data) => request(`/time-entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (id) => request(`/time-entries/${id}`, {
    method: 'DELETE'
  })
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
    const token = localStorage.getItem('token') || localStorage.getItem('ownerToken') || localStorage.getItem('mainAdminToken');
    return request('/main-admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getStats: () => {
    const token = localStorage.getItem('token') || localStorage.getItem('ownerToken') || localStorage.getItem('mainAdminToken');
    return request('/main-admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getActivities: () => {
    const token = localStorage.getItem('token') || localStorage.getItem('ownerToken') || localStorage.getItem('mainAdminToken');
    return request('/main-admin/activities', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getSalesAll: () => {
    const token = localStorage.getItem('token') || localStorage.getItem('ownerToken') || localStorage.getItem('mainAdminToken');
    return request('/main-admin/sales-all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getTimeEntriesAll: () => {
    const token = localStorage.getItem('token') || localStorage.getItem('ownerToken') || localStorage.getItem('mainAdminToken');
    return request('/main-admin/time-entries-all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  lockUser: (userId, locked) => {
    const token = localStorage.getItem('token') || localStorage.getItem('ownerToken') || localStorage.getItem('mainAdminToken');
    return request(`/main-admin/users/${userId}/lock`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ locked })
    });
  },
  changePlan: (userId, plan) => {
    const token = localStorage.getItem('token') || localStorage.getItem('ownerToken') || localStorage.getItem('mainAdminToken');
    return request(`/main-admin/users/${userId}/plan`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ plan })
    });
  },
  clearData: (type) => {
    const token = localStorage.getItem('token') || localStorage.getItem('ownerToken') || localStorage.getItem('mainAdminToken');
    return request('/main-admin/system/clear-data', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type })
    });
  },
  getSubscribers: () => {
    const token = localStorage.getItem('token') || localStorage.getItem('ownerToken') || localStorage.getItem('mainAdminToken');
    return request('/main-admin/subscribers', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getSubscribersAnalytics: () => {
    const token = localStorage.getItem('token') || localStorage.getItem('ownerToken') || localStorage.getItem('mainAdminToken');
    return request('/main-admin/subscribers/analytics', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getUsersWithSubscriptions: () => {
    const token = localStorage.getItem('token') || localStorage.getItem('ownerToken') || localStorage.getItem('mainAdminToken');
    return request('/main-admin/users-with-subscriptions', {
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

// Recipes API
export const recipes = {
  getAll: () => request('/recipes'),
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
