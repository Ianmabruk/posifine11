// Business Type Configuration - Defines all dashboards, models, and workflows

export const BUSINESS_TYPES = {
  BAR: 'bar',
  HOSPITAL: 'hospital',
  SCHOOL: 'school',
  KIOSK: 'kiosk',
  PETROL: 'petrol',
  SHOES: 'shoes'
};

export const BUSINESS_METADATA = {
  bar: {
    id: 'bar',
    name: 'Bar / Alcohol Business',
    description: 'Drinks, happy hour pricing, brand tracking, staff shifts',
    icon: 'Wine',
    color: 'amber',
    features: [
      'Bottle size + brand management',
      'Happy hour pricing rules',
      'Staff shift tracking',
      'Profit by brand',
      'Low stock alerts',
      'Age-check functionality'
    ],
    productFields: ['name', 'brand', 'size', 'category', 'price', 'cost', 'stock'],
    categories: ['Beer', 'Wine', 'Spirits', 'Beverages', 'Mixers'],
    adminModules: ['inventory', 'staff', 'shifts', 'pricing', 'reports'],
    cashierModules: ['categories', 'quick-tap', 'age-check', 'shift-view']
  },
  hospital: {
    id: 'hospital',
    name: 'Hospital / Clinic',
    description: 'Patient billing, services, medicines, doctor commission',
    icon: 'Heart',
    color: 'red',
    features: [
      'Services + medicines separation',
      'Patient search + billing',
      'Doctor commission tracking',
      'Batch + expiry tracking',
      'Medicine inventory',
      'Invoice printing'
    ],
    productFields: ['name', 'type', 'category', 'price', 'batchNo', 'expiryDate', 'stock'],
    categories: ['Services', 'Medicines', 'Lab Tests', 'Equipment'],
    adminModules: ['patients', 'services', 'medicines', 'doctors', 'inventory'],
    cashierModules: ['patient-search', 'add-services', 'add-medicines', 'print']
  },
  school: {
    id: 'school',
    name: 'School',
    description: 'Student billing, term fees, canteen, uniform/books',
    icon: 'BookOpen',
    color: 'blue',
    features: [
      'Student management',
      'Term fees tracking',
      'Canteen inventory',
      'Uniform + books stock',
      'Fee payment receipts',
      'Student balance'
    ],
    productFields: ['name', 'type', 'category', 'price', 'stock', 'description'],
    categories: ['Fees', 'Canteen', 'Uniforms', 'Books', 'Supplies'],
    adminModules: ['students', 'fees', 'canteen', 'inventory', 'reports'],
    cashierModules: ['student-lookup', 'fee-payment', 'canteen-sales', 'receipts']
  },
  kiosk: {
    id: 'kiosk',
    name: 'Kiosk / Small Shop',
    description: 'Simple inventory, supplier tracking, fast POS',
    icon: 'Store',
    color: 'green',
    features: [
      'Simple inventory management',
      'Supplier tracking',
      'Price rules',
      'Profit reports',
      'Low stock alerts',
      'Fast checkout'
    ],
    productFields: ['name', 'category', 'price', 'cost', 'stock', 'supplier'],
    categories: ['General', 'Electronics', 'Food', 'Drinks', 'Supplies'],
    adminModules: ['inventory', 'suppliers', 'pricing', 'reports'],
    cashierModules: ['search', 'quick-scan', 'low-stock-alerts']
  },
  petrol: {
    id: 'petrol',
    name: 'Petrol / Gas Station',
    description: 'Fuel types, pump tracking, tank stock, shift reconciliation',
    icon: 'Fuel',
    color: 'yellow',
    features: [
      'Fuel type management',
      'Pump tracking',
      'Tank stock management',
      'Shift reconciliation',
      'Pump totals',
      'Attendant management'
    ],
    productFields: ['name', 'fuelType', 'pricePerLiter', 'tankCapacity', 'pumpId', 'stock'],
    categories: ['Petrol', 'Diesel', 'Premium', 'LPG'],
    adminModules: ['fuel-types', 'pumps', 'tanks', 'staff', 'reconciliation'],
    cashierModules: ['pump-selector', 'fuel-buttons', 'shift-totals', 'attendant-view']
  },
  shoes: {
    id: 'shoes',
    name: 'Shoe / Clothing Store',
    description: 'Size & color variants, margin tracking, returns/refunds',
    icon: 'Shirt',
    color: 'pink',
    features: [
      'Size + color variants',
      'Margin per product',
      'Returns + refunds',
      'Variant inventory',
      'Barcode + search POS',
      'Stock by variant'
    ],
    productFields: ['name', 'category', 'price', 'cost', 'size', 'color', 'stock', 'margin'],
    categories: ['Shoes', 'Shirts', 'Pants', 'Dresses', 'Accessories'],
    adminModules: ['variants', 'inventory', 'returns', 'pricing', 'reports'],
    cashierModules: ['variant-selector', 'search', 'barcode', 'returns']
  }
};

// Get metadata for a business type
export const getBusinessMetadata = (businessType) => {
  return BUSINESS_METADATA[businessType] || BUSINESS_METADATA.kiosk;
};

// Get dashboard component path for admin
export const getAdminDashboardPath = (businessType) => {
  const paths = {
    bar: 'BarAdminDashboard',
    hospital: 'HospitalAdminDashboard',
    school: 'SchoolAdminDashboard',
    kiosk: 'KioskAdminDashboard',
    petrol: 'PetrolAdminDashboard',
    shoes: 'ShoesAdminDashboard'
  };
  return paths[businessType] || 'AdminDashboard';
};

// Get dashboard component path for cashier
export const getCashierDashboardPath = (businessType) => {
  const paths = {
    bar: 'BarCashierDashboard',
    hospital: 'HospitalCashierDashboard',
    school: 'SchoolCashierDashboard',
    kiosk: 'KioskCashierDashboard',
    petrol: 'PetrolCashierDashboard',
    shoes: 'ShoesCashierDashboard'
  };
  return paths[businessType] || 'CashierPOS';
};

// Product model template for each business type
export const getProductTemplate = (businessType) => {
  const templates = {
    bar: {
      name: '',
      brand: '',
      size: '',
      category: '',
      price: 0,
      cost: 0,
      stock: 0,
      sku: ''
    },
    hospital: {
      name: '',
      type: 'service', // service | medicine
      category: '',
      price: 0,
      batchNo: '',
      expiryDate: '',
      stock: 0,
      description: ''
    },
    school: {
      name: '',
      type: 'product',
      category: '',
      price: 0,
      stock: 0,
      description: ''
    },
    kiosk: {
      name: '',
      category: '',
      price: 0,
      cost: 0,
      stock: 0,
      supplier: ''
    },
    petrol: {
      name: '',
      fuelType: '',
      pricePerLiter: 0,
      tankCapacity: 0,
      pumpId: '',
      stock: 0
    },
    shoes: {
      name: '',
      category: '',
      price: 0,
      cost: 0,
      size: '',
      color: '',
      stock: 0,
      margin: 0
    }
  };
  return templates[businessType] || templates.kiosk;
};

// Sales item model for each business type
export const getSalesItemTemplate = (businessType) => {
  const templates = {
    bar: {
      productId: '',
      name: '',
      quantity: 1,
      price: 0,
      total: 0,
      category: '',
      brand: ''
    },
    hospital: {
      productId: '',
      name: '',
      quantity: 1,
      price: 0,
      total: 0,
      type: 'service',
      doctorId: ''
    },
    school: {
      productId: '',
      name: '',
      quantity: 1,
      price: 0,
      total: 0,
      studentId: ''
    },
    kiosk: {
      productId: '',
      name: '',
      quantity: 1,
      price: 0,
      total: 0,
      category: ''
    },
    petrol: {
      productId: '',
      name: '',
      quantity: 0,
      price: 0,
      total: 0,
      pumpId: '',
      liters: 0
    },
    shoes: {
      productId: '',
      name: '',
      quantity: 1,
      price: 0,
      total: 0,
      size: '',
      color: ''
    }
  };
  return templates[businessType] || templates.kiosk;
};

export default {
  BUSINESS_TYPES,
  BUSINESS_METADATA,
  getBusinessMetadata,
  getAdminDashboardPath,
  getCashierDashboardPath,
  getProductTemplate,
  getSalesItemTemplate
};
