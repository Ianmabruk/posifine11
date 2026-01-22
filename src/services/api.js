/**
 * Centralized API Service Layer
 * Handles all HTTP requests, error handling, and response parsing
 * This is the single source of truth for all API interactions
 */

// ============================================================
// BASE CONFIGURATION
// ============================================================

// Get API base URL from environment or default to localhost
export const BASE_API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// ============================================================
// CORE REQUEST FUNCTION
// ============================================================

/**
 * Universal fetch wrapper with error handling and auth
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} options - Fetch options (method, body, headers)
 * @returns {Promise<any>} - Parsed JSON response
 * @throws {Error} - With descriptive message for debugging
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_API_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`[API] 📤 ${options.method || 'GET'} ${endpoint}`, options.body ? JSON.parse(options.body) : '');
    
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Read response body once
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log(`[API] 📥 ${response.status} ${endpoint}`, data);

    // Check for HTTP errors
    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP ${response.status}`;
      console.error(`[API] ❌ Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // Ensure we have a successful response structure
    if (typeof data === 'object' && data !== null) {
      return data;
    }

    return data;
  } catch (error) {
    console.error(`[API] ❌ Request failed: ${endpoint}`, error);
    throw error;
  }
}

// ============================================================
// PRODUCTS API
// ============================================================

export const products = {
  getAll: () => {
    console.log('[PRODUCTS] Fetching all products...');
    return request('/products');
  },

  create: (productData) => {
    console.log('[PRODUCTS] Creating product:', productData);
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  update: (id, productData) => {
    console.log(`[PRODUCTS] Updating product ${id}:`, productData);
    return request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  delete: (id) => {
    console.log(`[PRODUCTS] Deleting product ${id}`);
    return request(`/products/${id}`, {
      method: 'DELETE'
    });
  }
};

// ============================================================
// SALES API - CRITICAL FOR SALE COMPLETION
// ============================================================

export const sales = {
  /**
   * Fetch all sales for the current account
   */
  getAll: () => {
    console.log('[SALES] Fetching all sales...');
    return request('/sales');
  },

  /**
   * Create a new sale - THIS IS THE CRITICAL FUNCTION
   * 
   * Flow:
   * 1. Send cart items, totals, and payment info to backend
   * 2. Backend validates stock availability
   * 3. Backend deducts stock from inventory
   * 4. Backend creates sale record
   * 5. Backend creates auto-expenses
   * 6. Return { success: true, saleId, ... }
   * 7. Frontend clears cart and reloads data
   */
  create: (saleData) => {
    console.log('[SALES] 🛒 Creating sale with data:', saleData);
    
    return request('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData)
    }).then(response => {
      console.log('[SALES] ✅ Sale created successfully:', response);
      
      // CRITICAL: Verify success flag
      if (response.success === false) {
        console.error('[SALES] ❌ Server returned success: false');
        throw new Error(response.error || 'Sale creation failed');
      }
      
      return response;
    });
  },

  /**
   * Delete a sale
   */
  delete: (id) => {
    console.log(`[SALES] Deleting sale ${id}`);
    return request(`/sales/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Admin complete sale endpoint
   */
  adminComplete: (saleData) => {
    console.log('[SALES] 👨‍💼 Admin creating sale:', saleData);
    
    return request('/admin-complete-sale', {
      method: 'POST',
      body: JSON.stringify(saleData)
    }).then(response => {
      console.log('[SALES] ✅ Admin sale created:', response);
      
      if (response.success === false) {
        throw new Error(response.error || 'Admin sale creation failed');
      }
      
      return response;
    });
  }
};

// ============================================================
// EXPENSES API
// ============================================================

export const expenses = {
  getAll: () => {
    console.log('[EXPENSES] Fetching all expenses...');
    return request('/expenses');
  },

  create: (expenseData) => {
    console.log('[EXPENSES] Creating expense:', expenseData);
    return request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData)
    });
  },

  update: (id, expenseData) => {
    console.log(`[EXPENSES] Updating expense ${id}:`, expenseData);
    return request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData)
    });
  },

  delete: (id) => {
    console.log(`[EXPENSES] Deleting expense ${id}`);
    return request(`/expenses/${id}`, {
      method: 'DELETE'
    });
  }
};

// ============================================================
// STATS API - FOR DASHBOARD TOTALS
// ============================================================

export const stats = {
  /**
   * Get dashboard statistics
   * Returns: { totalSales, totalExpenses, profit }
   */
  get: () => {
    console.log('[STATS] Fetching dashboard statistics...');
    return request('/stats').catch(err => {
      console.warn('[STATS] Stats fetch failed, returning zeros:', err);
      // Return default stats if fetch fails
      return {
        totalSales: 0,
        totalExpenses: 0,
        profit: 0
      };
    });
  }
};

// ============================================================
// BATCHES API
// ============================================================

export const batches = {
  getAll: (productId) => {
    const url = productId ? `/batches?productId=${productId}` : '/batches';
    console.log('[BATCHES] Fetching batches:', url);
    return request(url);
  },

  create: (batchData) => {
    console.log('[BATCHES] Creating batch:', batchData);
    return request('/batches', {
      method: 'POST',
      body: JSON.stringify(batchData)
    });
  }
};

// ============================================================
// DISCOUNTS API
// ============================================================

export const discounts = {
  getAll: () => {
    console.log('[DISCOUNTS] Fetching discounts...');
    return request('/discounts');
  },

  create: (discountData) => {
    console.log('[DISCOUNTS] Creating discount:', discountData);
    return request('/discounts', {
      method: 'POST',
      body: JSON.stringify(discountData)
    });
  }
};

// ============================================================
// TIME ENTRIES API
// ============================================================

export const timeEntries = {
  getAll: () => {
    console.log('[TIME ENTRIES] Fetching time entries...');
    return request('/time-entries');
  },

  create: (action) => {
    console.log(`[TIME ENTRIES] Clock ${action}...`);
    return request('/time-entries', {
      method: 'POST',
      body: JSON.stringify({ action })
    });
  }
};

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
  request,
  products,
  sales,
  expenses,
  stats,
  batches,
  discounts,
  timeEntries,
  BASE_API_URL
};
