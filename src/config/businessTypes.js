/**
 * Business Type Templates & Feature Configuration
 * Defines all business types with their feature presets
 */

export const BUSINESS_TYPES = {
  BAR: 'bar',
  HOSPITAL: 'hospital',
  SCHOOL: 'school',
  SHOP: 'shop',
  PETROL: 'petrol',
  CLOTHING: 'clothing'
};

export const BUSINESS_TEMPLATES = {
  [BUSINESS_TYPES.BAR]: {
    id: BUSINESS_TYPES.BAR,
    name: '🍺 Bar / Alcohol Business',
    description: 'Optimized for bars, pubs, and alcohol retail',
    icon: '🍺',
    defaultFeatures: [
      'stock_by_bottle',
      'happy_hour_pricing',
      'staff_shift_clock',
      'age_verification',
      'sales_by_category',
      'profit_per_brand'
    ]
  },
  [BUSINESS_TYPES.HOSPITAL]: {
    id: BUSINESS_TYPES.HOSPITAL,
    name: '🏥 Hospital / Clinic',
    description: 'For healthcare facilities with patient billing',
    icon: '🏥',
    defaultFeatures: [
      'patient_billing',
      'service_medicine_separation',
      'doctor_commission',
      'stock_batch_expiry',
      'invoice_per_patient'
    ]
  },
  [BUSINESS_TYPES.SCHOOL]: {
    id: BUSINESS_TYPES.SCHOOL,
    name: '🎓 School',
    description: 'For educational institutions',
    icon: '🎓',
    defaultFeatures: [
      'student_accounts',
      'term_based_billing',
      'canteen_pos',
      'fees_tracking',
      'stock_uniform_books'
    ]
  },
  [BUSINESS_TYPES.SHOP]: {
    id: BUSINESS_TYPES.SHOP,
    name: '🏪 Small Shop / Kiosk',
    description: 'For retail shops and kiosks',
    icon: '🏪',
    defaultFeatures: [
      'fast_item_scanning',
      'supplier_tracking',
      'daily_profit_report',
      'low_stock_alerts'
    ]
  },
  [BUSINESS_TYPES.PETROL]: {
    id: BUSINESS_TYPES.PETROL,
    name: '⛽ Petrol / Gas Station',
    description: 'For fuel stations and gas distribution',
    icon: '⛽',
    defaultFeatures: [
      'pump_sales_tracking',
      'fuel_type_breakdown',
      'shift_reconciliation',
      'tank_stock_monitoring'
    ]
  },
  [BUSINESS_TYPES.CLOTHING]: {
    id: BUSINESS_TYPES.CLOTHING,
    name: '👕 Shoe / Clothing Store',
    description: 'For clothing and shoe retail',
    icon: '👕',
    defaultFeatures: [
      'size_color_variants',
      'barcode_scanning',
      'margin_per_product',
      'return_refund_system'
    ]
  }
};

/**
 * All available features across all business types
 * These can be enabled/disabled per subscription
 */
export const AVAILABLE_FEATURES = {
  // Common Features (available to all)
  basic_pos: {
    id: 'basic_pos',
    name: 'Basic POS',
    category: 'Core',
    description: 'Point of sale system with cart and checkout',
    icon: '🛒'
  },
  inventory_management: {
    id: 'inventory_management',
    name: 'Inventory Management',
    category: 'Core',
    description: 'Track products, stock levels, and batches',
    icon: '📦'
  },
  sales_tracking: {
    id: 'sales_tracking',
    name: 'Sales Tracking',
    category: 'Core',
    description: 'Record and track all sales transactions',
    icon: '💰'
  },
  admin_dashboard: {
    id: 'admin_dashboard',
    name: 'Admin Dashboard',
    category: 'Core',
    description: 'Full admin controls and analytics',
    icon: '📊'
  },
  user_management: {
    id: 'user_management',
    name: 'User Management',
    category: 'Core',
    description: 'Add and manage team members',
    icon: '👥'
  },

  // Bar Features
  stock_by_bottle: {
    id: 'stock_by_bottle',
    name: 'Stock by Bottle Type',
    category: 'Bar',
    description: 'Organize stock by bottle type, size, and brand',
    icon: '🍾'
  },
  happy_hour_pricing: {
    id: 'happy_hour_pricing',
    name: 'Happy Hour Pricing',
    category: 'Bar',
    description: 'Set time-based dynamic pricing rules',
    icon: '⏰'
  },
  staff_shift_clock: {
    id: 'staff_shift_clock',
    name: 'Staff Shift Clock-In/Out',
    category: 'Bar',
    description: 'Track staff hours and shifts',
    icon: '⏱️'
  },
  age_verification: {
    id: 'age_verification',
    name: 'Age Verification Prompt',
    category: 'Bar',
    description: 'Prompt for age verification on alcohol sales',
    icon: '🆔'
  },
  sales_by_category: {
    id: 'sales_by_category',
    name: 'Sales by Category',
    category: 'Bar',
    description: 'Break down sales by beer, spirits, wine, etc.',
    icon: '📈'
  },
  profit_per_brand: {
    id: 'profit_per_brand',
    name: 'Profit per Brand',
    category: 'Bar',
    description: 'Track profitability by brand',
    icon: '💵'
  },

  // Hospital Features
  patient_billing: {
    id: 'patient_billing',
    name: 'Patient Billing',
    category: 'Hospital',
    description: 'Create patient accounts and invoices',
    icon: '🏥'
  },
  service_medicine_separation: {
    id: 'service_medicine_separation',
    name: 'Service + Medicine Separation',
    category: 'Hospital',
    description: 'Separate billing for services and medicines',
    icon: '💊'
  },
  doctor_commission: {
    id: 'doctor_commission',
    name: 'Doctor Commission Tracking',
    category: 'Hospital',
    description: 'Track commissions for doctors',
    icon: '👨‍⚕️'
  },
  stock_batch_expiry: {
    id: 'stock_batch_expiry',
    name: 'Stock by Batch & Expiry',
    category: 'Hospital',
    description: 'Manage stock with batch numbers and expiry dates',
    icon: '📋'
  },
  invoice_per_patient: {
    id: 'invoice_per_patient',
    name: 'Invoice per Patient',
    category: 'Hospital',
    description: 'Generate invoices for each patient',
    icon: '📄'
  },

  // School Features
  student_accounts: {
    id: 'student_accounts',
    name: 'Student Accounts',
    category: 'School',
    description: 'Create and manage student accounts',
    icon: '📚'
  },
  term_based_billing: {
    id: 'term_based_billing',
    name: 'Term-Based Billing',
    category: 'School',
    description: 'Bill students per term/semester',
    icon: '📅'
  },
  canteen_pos: {
    id: 'canteen_pos',
    name: 'Canteen POS',
    category: 'School',
    description: 'Dedicated canteen point of sale',
    icon: '🍽️'
  },
  fees_tracking: {
    id: 'fees_tracking',
    name: 'Fees Tracking',
    category: 'School',
    description: 'Track school fees and payments',
    icon: '💳'
  },
  stock_uniform_books: {
    id: 'stock_uniform_books',
    name: 'Uniform/Books Stock',
    category: 'School',
    description: 'Track uniforms and books inventory',
    icon: '👔'
  },

  // Shop Features
  fast_item_scanning: {
    id: 'fast_item_scanning',
    name: 'Fast Item Scanning',
    category: 'Shop',
    description: 'Barcode scanning for quick checkout',
    icon: '🔍'
  },
  supplier_tracking: {
    id: 'supplier_tracking',
    name: 'Supplier Tracking',
    category: 'Shop',
    description: 'Manage suppliers and purchase orders',
    icon: '🚚'
  },
  daily_profit_report: {
    id: 'daily_profit_report',
    name: 'Daily Profit Report',
    category: 'Shop',
    description: 'Generate daily profit/loss reports',
    icon: '📊'
  },
  low_stock_alerts: {
    id: 'low_stock_alerts',
    name: 'Low-Stock Alerts',
    category: 'Shop',
    description: 'Automatic alerts for low inventory',
    icon: '⚠️'
  },

  // Petrol Features
  pump_sales_tracking: {
    id: 'pump_sales_tracking',
    name: 'Pump Sales Tracking',
    category: 'Petrol',
    description: 'Track sales per pump',
    icon: '⛽'
  },
  fuel_type_breakdown: {
    id: 'fuel_type_breakdown',
    name: 'Fuel Type Breakdown',
    category: 'Petrol',
    description: 'Separate reporting by fuel type',
    icon: '🔥'
  },
  shift_reconciliation: {
    id: 'shift_reconciliation',
    name: 'Shift-Based Reconciliation',
    category: 'Petrol',
    description: 'Reconcile sales per shift',
    icon: '🔐'
  },
  tank_stock_monitoring: {
    id: 'tank_stock_monitoring',
    name: 'Tank Stock Monitoring',
    category: 'Petrol',
    description: 'Monitor fuel tank levels',
    icon: '📈'
  },

  // Clothing Features
  size_color_variants: {
    id: 'size_color_variants',
    name: 'Size & Color Variants',
    category: 'Clothing',
    description: 'Manage products by size and color',
    icon: '🎨'
  },
  barcode_scanning: {
    id: 'barcode_scanning',
    name: 'Barcode Scanning',
    category: 'Clothing',
    description: 'Scan product barcodes at checkout',
    icon: '📱'
  },
  margin_per_product: {
    id: 'margin_per_product',
    name: 'Margin per Product',
    category: 'Clothing',
    description: 'Track profit margin by product',
    icon: '💹'
  },
  return_refund_system: {
    id: 'return_refund_system',
    name: 'Return/Refund System',
    category: 'Clothing',
    description: 'Process returns and refunds',
    icon: '↩️'
  }
};

/**
 * Feature availability by plan
 * Maps subscription plan to available features
 */
export const PLAN_FEATURES = {
  basic: {
    name: 'Basic',
    price: 1000,
    features: [
      'basic_pos',
      'inventory_management',
      'sales_tracking',
      'admin_dashboard'
    ]
  },
  ultra: {
    name: 'Ultra',
    price: 2500,
    features: [
      'basic_pos',
      'inventory_management',
      'sales_tracking',
      'admin_dashboard',
      'user_management'
    ]
  },
  pro: {
    name: 'Pro',
    price: 3400,
    features: [
      'basic_pos',
      'inventory_management',
      'sales_tracking',
      'admin_dashboard',
      'user_management'
    ]
  },
  custom: {
    name: 'Custom',
    price: 3500,
    features: 'all', // All features unlocked
    description: 'Unlock Business Builder to customize features'
  }
};

/**
 * Get features for a business type
 */
export function getBusinessTypeFeatures(businessType) {
  const template = BUSINESS_TEMPLATES[businessType];
  if (!template) return [];
  
  return template.defaultFeatures.map(featureId => 
    AVAILABLE_FEATURES[featureId]
  ).filter(Boolean);
}

/**
 * Get all features for a plan
 */
export function getPlanFeatures(planId) {
  const plan = PLAN_FEATURES[planId];
  if (!plan) return [];
  
  if (plan.features === 'all') {
    return Object.values(AVAILABLE_FEATURES);
  }
  
  return plan.features.map(featureId => 
    AVAILABLE_FEATURES[featureId]
  ).filter(Boolean);
}

/**
 * Get selectable features for custom plan
 */
export function getSelectableFeatures() {
  return Object.values(AVAILABLE_FEATURES);
}
