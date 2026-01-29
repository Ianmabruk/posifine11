/**
 * Dashboard Routing Utility
 * 
 * Determines the correct dashboard route based on user attributes:
 * - subscription (basic, ultra, pro, custom)
 * - role (owner, admin, cashier)
 * - businessType (bar, clinic, hotel, supermarket, etc.)
 * - businessRole (doctor, waiter, reception, etc.)
 */

/**
 * Get the correct dashboard route for a user
 * 
 * @param {Object} user - User object with subscription, role, businessType
 * @returns {string} - Dashboard route path
 */
export function getDashboardRoute(user) {
  if (!user) {
    console.warn('[getDashboardRoute] No user provided');
    return '/auth/login';
  }

  const subscription = user.subscription || user.plan || 'basic';
  const role = user.role || 'cashier';
  const businessType = user.businessType || user.business_type;
  const businessRole = user.businessRole || user.business_role;

  console.log('[getDashboardRoute] Evaluating:', {
    subscription,
    role,
    businessType,
    businessRole,
    user: user.email
  });

  // ============================================================
  // 1. OWNER/SUPER ADMIN - Always goes to /main.admin
  // ============================================================
  if (role === 'owner') {
    console.log('[getDashboardRoute] → /main.admin (Owner)');
    return '/main.admin';
  }

  // ============================================================
  // 2. PRO/CUSTOM SUBSCRIPTION with BUSINESS TYPE
  // ============================================================
  const isPro = subscription === 'pro' || subscription === 'custom' || subscription === 3400 || subscription === 3000;

  if (isPro && businessType) {
    // Pro Admin with Business Type → Business-specific admin dashboard
    if (role === 'admin') {
      console.log(`[getDashboardRoute] → /admin/${businessType} (Pro Admin - ${businessType})`);
      return `/admin/${businessType}`;
    }
    
    // Pro User with Business Role → Role-specific dashboard
    if (businessRole && businessRole !== 'admin') {
      console.log(`[getDashboardRoute] → /dashboard/${businessType}/${businessRole} (Pro ${businessRole})`);
      return `/dashboard/${businessType}/${businessRole}`;
    }
    
    // Pro Cashier/User with Business Type → Business-specific cashier interface
    if (role === 'cashier') {
      console.log(`[getDashboardRoute] → /cashier/${businessType} (Pro Cashier - ${businessType})`);
      return `/cashier/${businessType}`;
    }
  }

  // ============================================================
  // 3. PRO/CUSTOM SUBSCRIPTION WITHOUT BUSINESS TYPE
  // ============================================================
  if (isPro && !businessType) {
    // Pro Admin without business type → Select business type first
    if (role === 'admin') {
      console.log('[getDashboardRoute] → /select-business-type (Pro Admin - No business type)');
      return '/select-business-type';
    }
    
    // Pro Cashier without business type → Default cashier dashboard
    if (role === 'cashier') {
      console.log('[getDashboardRoute] → /cashier (Pro Cashier - No business type)');
      return '/cashier';
    }
  }

  // ============================================================
  // 4. BASIC/ULTRA SUBSCRIPTION - Standard Dashboards
  // ============================================================
  if (role === 'admin') {
    console.log(`[getDashboardRoute] → /admin (${subscription} Admin)`);
    return '/admin';
  }

  if (role === 'cashier') {
    console.log(`[getDashboardRoute] → /cashier (${subscription} Cashier)`);
    return '/cashier';
  }

  // ============================================================
  // 5. FALLBACK - Default dashboard
  // ============================================================
  console.warn('[getDashboardRoute] → /dashboard (Fallback)');
  return '/dashboard';
}

/**
 * Check if user should see Pro dashboard features
 * @param {Object} user - User object
 * @returns {boolean}
 */
export function isProUser(user) {
  if (!user) return false;
  const subscription = user.subscription || user.plan;
  return subscription === 'pro' || subscription === 'custom';
}

/**
 * Check if user has a business type configured
 * @param {Object} user - User object
 * @returns {boolean}
 */
export function hasBusinessType(user) {
  if (!user) return false;
  return !!(user.businessType || user.business_type);
}

/**
 * Get business-specific dashboard component name
 * @param {Object} user - User object
 * @returns {string} - Component name or null
 */
export function getBusinessDashboardComponent(user) {
  if (!user) return null;
  
  const businessType = user.businessType || user.business_type;
  const businessRole = user.businessRole || user.business_role;
  
  if (!businessType) return null;

  // Map business types to dashboard components
  const dashboardMap = {
    bar: 'BarDashboard',
    clinic: businessRole === 'doctor' ? 'DoctorDashboard' :
            businessRole === 'pharmacy' ? 'PharmacyDashboard' :
            'ReceptionDashboard',
    hotel: 'HotelDashboard',
    supermarket: 'SupermarketDashboard',
    restaurant: 'RestaurantDashboard',
    pharmacy: 'PharmacyDashboard',
    hospital: 'HospitalDashboard',
    petrol: 'PetrolDashboard',
    school: 'SchoolDashboard',
    gym: 'GymDashboard',
    salon: 'SalonDashboard',
    retail: 'RetailDashboard'
  };

  return dashboardMap[businessType] || 'AdminDashboard';
}

/**
 * Debug helper: Log complete routing decision
 * @param {Object} user - User object
 */
export function debugRoutingDecision(user) {
  console.group('🔍 Dashboard Routing Debug');
  console.log('User:', user?.email);
  console.log('Subscription:', user?.subscription || user?.plan);
  console.log('Role:', user?.role);
  console.log('Business Type:', user?.businessType || user?.business_type);
  console.log('Business Role:', user?.businessRole || user?.business_role);
  console.log('→ Route:', getDashboardRoute(user));
  console.log('→ Component:', getBusinessDashboardComponent(user));
  console.groupEnd();
}
