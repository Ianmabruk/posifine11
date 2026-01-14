import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { users, products, sales, expenses, stats, admin } from '../services/api';
import { Package, DollarSign, TrendingUp, TrendingDown, Plus, Edit2, Trash2, LogOut, Search, Filter, BarChart3, ShoppingBag, Layers, Users, Truck, Trash } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState({ products: [], sales: [], expenses: [], stats: {}, users: [], vendors: [] });
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '', category: 'raw' });
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'cashier' });
  const [newVendor, setNewVendor] = useState({ supplierName: '', details: '', orderDate: '', expectedDelivery: '', amount: '' });
  
  const handleClearData = async () => {
    if (window.confirm('⚠️ Are you sure you want to clear ALL data?\n\nThis will delete:\n- All products\n- All sales\n- All expenses\n\nThis action CANNOT be undone!')) {
      try {
        await admin.clearData('all');
        // Refresh all data
        loadData();
        // Clear localStorage cache
        localStorage.removeItem('products');
        localStorage.removeItem('sales');
        localStorage.removeItem('expenses');
        alert('✅ All data cleared successfully!');
      } catch (error) {
        console.error('Failed to clear data:', error);
        alert('❌ Failed to clear data: ' + error.message);
      }
    }
  };

  useEffect(() => {
    loadData();

    // Listen for product creation and update events
    const handleProductCreated = () => {
      console.log('🎉 Product created - refreshing dashboard');
      loadData();
    };

    const handleProductUpdated = () => {
      console.log('📝 Product updated - refreshing dashboard');
      loadData();
    };

    const handleDataUpdated = () => {
      console.log('🔄 Data updated - refreshing dashboard');
      loadData();
    };

    const handleProductsCleared = () => {
      console.log('🗑️ Products cleared - refreshing all data');
      loadData();
    };

    const handleSaleCreated = (event) => {
      console.log('💰 Sale recorded - refreshing sales');
      // Immediately refresh only sales instead of everything
      sales.getAll().then(s => {
        setData(prev => ({ ...prev, sales: Array.isArray(s) ? s : [] }));
      });
    };

    const handleCashierClockIn = (event) => {
      console.log('⏰ Cashier clocked in - refreshing users');
      users.getAll().then(u => {
        setData(prev => ({ ...prev, users: Array.isArray(u) ? u : [] }));
      });
    };

    const handleCashierClockOut = (event) => {
      console.log('⏰ Cashier clocked out - refreshing users');
      users.getAll().then(u => {
        setData(prev => ({ ...prev, users: Array.isArray(u) ? u : [] }));
      });
    };

    window.addEventListener('productCreated', handleProductCreated);
    window.addEventListener('productUpdated', handleProductUpdated);
    window.addEventListener('dataUpdated', handleDataUpdated);
    window.addEventListener('productsCleared', handleProductsCleared);
    window.addEventListener('saleCreated', handleSaleCreated);
    window.addEventListener('cashierClockIn', handleCashierClockIn);
    window.addEventListener('cashierClockOut', handleCashierClockOut);

    return () => {
      window.removeEventListener('productCreated', handleProductCreated);
      window.removeEventListener('productUpdated', handleProductUpdated);
      window.removeEventListener('dataUpdated', handleDataUpdated);
      window.removeEventListener('productsCleared', handleProductsCleared);
      window.removeEventListener('saleCreated', handleSaleCreated);
      window.removeEventListener('cashierClockIn', handleCashierClockIn);
      window.removeEventListener('cashierClockOut', handleCashierClockOut);
    };
  }, []);

  const loadData = async () => {
    try {
      const [p, s, e, st, u] = await Promise.all([
        products.getAll(),
        sales.getAll(),
        expenses.getAll(),
        stats.get(),
        users.getAll()
      ]);
      
      // Load vendors from localStorage - account-specific storage
      const vendorKey = `vendors_${user?.email || 'default'}`;
      const vendors = JSON.parse(localStorage.getItem(vendorKey) || '[]');
      
      setData({ 
        products: Array.isArray(p) ? p : [], 
        sales: Array.isArray(s) ? s : [], 
        expenses: Array.isArray(e) ? e : [], 
        stats: st || {},
        users: Array.isArray(u) ? u : [],
        vendors: vendors
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      setData({ products: [], sales: [], expenses: [], stats: {}, users: [], vendors: [] });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await products.create({ ...newProduct, price: parseFloat(newProduct.price), quantity: parseInt(newProduct.quantity) });
    setNewProduct({ name: '', price: '', quantity: '', category: 'raw' });
    setShowAddProduct(false);
    loadData();
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      if (!newUser.password) {
        alert('Password is required');
        return;
      }
      if (newUser.password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }
      await users.create(newUser);
      setNewUser({ name: '', email: '', password: '', role: 'cashier' });
      setShowAddUser(false);
      loadData();
      alert(`✅ User created successfully!\n\n📧 Email: ${newUser.email}\n🔑 Password: ${newUser.password}\n👤 Role: ${newUser.role}\n\nUser can now login with these credentials.`);
    } catch (error) {
      alert('Failed to create user: ' + error.message);
    }
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const vendor = {
        id: Math.random().toString(36).substr(2, 9),
        supplierName: newVendor.supplierName,
        details: newVendor.details,
        orderDate: newVendor.orderDate,
        expectedDelivery: newVendor.expectedDelivery,
        amount: parseFloat(newVendor.amount),
        createdBy: user?.id || user?.name,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage for account - account-specific storage
      const vendorKey = `vendors_${user?.email || 'default'}`;
      const vendors = JSON.parse(localStorage.getItem(vendorKey) || '[]');
      vendors.push(vendor);
      localStorage.setItem(vendorKey, JSON.stringify(vendors));
      
      setNewVendor({ supplierName: '', details: '', orderDate: '', expectedDelivery: '', amount: '' });
      setShowAddVendor(false);
      loadData();
      alert('Vendor added successfully!');
    } catch (error) {
      alert('Failed to add vendor: ' + error.message);
    }
  };

  const filteredProducts = data.products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory', icon: Layers },
    { id: 'vendors', label: 'Vendors', icon: Truck },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'sales', label: 'Sales', icon: ShoppingBag },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {user?.plan === 'basic' ? 'Professional Plan - KSH 1,500/month (Up to 3 Users)' : 'Ultra Plan - KSH 3,000/month (Unlimited Users)'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button onClick={handleClearData} className="btn-secondary flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200" title="Clear all data">
              <Trash className="w-4 h-4" />
              Clear Data
            </button>
            <button onClick={logout} className="btn-secondary flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100 mb-1">Total Sales</p>
                <p className="text-3xl font-bold">KSH {data.stats.totalSales?.toLocaleString() || 0}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-red-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-100 mb-1">Expenses</p>
                <p className="text-3xl font-bold">KSH {data.stats.totalExpenses?.toLocaleString() || 0}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <TrendingDown className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100 mb-1">Net Profit</p>
                <p className="text-3xl font-bold">KSH {data.stats.profit?.toLocaleString() || 0}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100 mb-1">Products</p>
                <p className="text-3xl font-bold">{data.products.length}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-lg">
          <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  Recent Sales
                </h3>
                {data.sales.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-600 font-medium text-lg">No sales yet</p>
                    <p className="text-gray-500 text-sm mt-2">Your sales will appear here once you start processing transactions from the cashier dashboard</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.sales.slice(-10).reverse().map((sale, i) => (
                          <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm">{new Date(sale.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm">{sale.items?.length || 0} items</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="badge badge-success">{sale.paymentMethod || 'cash'}</span>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-600">KSH {sale.total?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="input pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <button onClick={() => setShowAddProduct(true)} className="btn-primary flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              {showAddProduct && (
                <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                  <h4 className="font-semibold mb-4 text-lg">Add New Product</h4>
                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      className="input"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      className="input"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      className="input"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      required
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="btn-primary flex-1">Add</button>
                      <button type="button" onClick={() => setShowAddProduct(false)} className="btn-secondary">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Package className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-600 font-medium text-lg">No products added yet</p>
                            <p className="text-gray-500 text-sm mt-2">Start by adding your first product using the form above</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-blue-600">KSH {product.price?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`font-medium ${product.quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                              {product.quantity || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`badge ${product.recipe ? 'badge-success' : 'badge-warning'}`}>
                              {product.recipe ? 'Composite' : 'Raw'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`badge ${product.quantity > 10 ? 'badge-success' : product.quantity > 0 ? 'badge-warning' : 'badge-danger'}`}>
                              {product.quantity > 10 ? 'In Stock' : product.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">User Management</h3>
                <button onClick={() => setShowAddUser(true)} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
              </div>

              {showAddUser && (
                <div className="mb-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
                  <h4 className="font-semibold mb-4 text-lg">Add New User</h4>
                  <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="input"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="input"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password (min 6 chars)"
                      className="input"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                      minLength={6}
                    />
                    <select
                      className="input"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="cashier">Cashier</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className="flex gap-2">
                      <button type="submit" className="btn-primary flex-1">Add User</button>
                      <button type="button" onClick={() => setShowAddUser(false)} className="btn-secondary">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Users className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-600 font-medium text-lg">No users added yet</p>
                            <p className="text-gray-500 text-sm mt-2">Add team members using the form above</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      data.users.map((user) => (
                        <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`badge ${user.role === 'admin' ? 'badge-success' : 'badge-warning'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`badge ${user.active ? 'badge-success' : 'badge-danger'}`}>
                              {user.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">All Sales</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sales.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-600 font-medium text-lg">No sales recorded</p>
                            <p className="text-gray-500 text-sm mt-2">Sales from the cashier dashboard will appear here</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      data.sales.slice().reverse().map((sale, i) => (
                        <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm">{new Date(sale.createdAt).toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">{sale.items?.length || 0} items</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="badge badge-success">{sale.paymentMethod || 'cash'}</span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-600">KSH {sale.total?.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">All Expenses</h3>
                <button className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Expense
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.expenses.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <TrendingDown className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-600 font-medium text-lg">No expenses recorded</p>
                            <p className="text-gray-500 text-sm mt-2">Add your first expense to track spending</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      data.expenses.slice().reverse().map((expense, i) => (
                        <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm">{new Date(expense.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">{expense.description}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="badge badge-warning">{expense.category || 'General'}</span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-red-600">KSH {expense.amount?.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Vendor Management
                </h3>
                <button 
                  onClick={() => setShowAddVendor(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Vendor
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Supplier Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Details</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Expected Delivery</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.vendors && data.vendors.length > 0 ? (
                      data.vendors.slice().reverse().map((vendor) => (
                        <tr key={vendor.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-semibold">{vendor.supplierName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{vendor.details}</td>
                          <td className="px-4 py-3 text-sm">{new Date(vendor.orderDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">{new Date(vendor.expectedDelivery).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-orange-600">KSH {vendor.amount?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{vendor.createdBy}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          No vendors added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Vendor Modal */}
          {showAddVendor && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white rounded-t-2xl">
                  <h2 className="text-2xl font-bold">Add Vendor</h2>
                  <p className="text-orange-100 text-sm mt-1">Add new supplier information</p>
                </div>
                <form onSubmit={handleAddVendor} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Supplier Name</label>
                    <input
                      type="text"
                      value={newVendor.supplierName}
                      onChange={(e) => setNewVendor({ ...newVendor, supplierName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Details</label>
                    <textarea
                      value={newVendor.details}
                      onChange={(e) => setNewVendor({ ...newVendor, details: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-500"
                      placeholder="Supplier details..."
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Order Date</label>
                    <input
                      type="date"
                      value={newVendor.orderDate}
                      onChange={(e) => setNewVendor({ ...newVendor, orderDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expected Delivery</label>
                    <input
                      type="date"
                      value={newVendor.expectedDelivery}
                      onChange={(e) => setNewVendor({ ...newVendor, expectedDelivery: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (KSH)</label>
                    <input
                      type="number"
                      value={newVendor.amount}
                      onChange={(e) => setNewVendor({ ...newVendor, amount: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-500"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition"
                    >
                      Add Vendor
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddVendor(false)}
                      className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
