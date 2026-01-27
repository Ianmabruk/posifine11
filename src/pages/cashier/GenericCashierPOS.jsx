import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, ShoppingCart, AlertCircle, TrendingUp } from 'lucide-react';
import MonitorDashboard from './MonitorDashboard';
import ClockInOut from './ClockInOut';
// Import optimized transaction service
import { 
  completeSaleTransaction,
  clockInTransaction,
  invalidateProductCache 
} from '../../services/transactionService';

export default function GenericCashierPOS() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pos');
  const [shiftId, setShiftId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [loading, setLoading] = useState(false);

  // Clock in on component mount using optimized service
  useEffect(() => {
    const performClockIn = async () => {
      try {
        console.log('🕐 [GenericPOS] Initiating clock-in...');
        
        await clockInTransaction((result) => {
          if (result.success && result.shiftId) {
            setShiftId(result.shiftId);
            console.log(`✅ [GenericPOS] Clocked in: Shift ${result.shiftId} (${result.elapsedMs.toFixed(1)}ms)`);
          }
        });
      } catch (error) {
        console.error('❌ [GenericPOS] Clock-in failed:', error);
      }
    };
    
    performClockIn();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setProducts(data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addItem = (product) => {
    const existingItem = selectedItems.find(i => i.productId === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
      setSelectedItems([...selectedItems]);
    } else {
      setSelectedItems([...selectedItems, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const removeItem = (productId) => {
    setSelectedItems(selectedItems.filter(i => i.productId !== productId));
  };

  const calculateTotal = () => {
    let subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let taxAmount = (subtotal * tax) / 100;
    return subtotal + taxAmount - discount;
  };

  const completeSale = async () => {
    if (selectedItems.length === 0) {
      alert('Please add items to the sale');
      return;
    }

    // Prevent double submission
    if (loading) {
      console.log('⚠️ [GenericPOS] Sale already in progress');
      return;
    }

    setLoading(true);
    
    // Save state for potential rollback
    const savedItems = [...selectedItems];
    const savedDiscount = discount;
    const savedTax = tax;
    
    try {
      const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const taxAmount = (subtotal * tax) / 100;
      const finalTotal = subtotal + taxAmount - discount;
      
      console.log('💳 [GenericPOS] Starting sale transaction');
      
      // Use optimized transaction service
      await completeSaleTransaction(
        {
          items: selectedItems,
          total: finalTotal,
          discount: discount,
          tax: taxAmount,
          taxType: 'exclusive',
          paymentMethod: 'cash',
          shiftId: shiftId
        },
        // onOptimisticUpdate
        (optimisticData) => {
          console.log('⚡ [GenericPOS] Optimistic update:', optimisticData.action);
          // Clear cart immediately
          setSelectedItems([]);
          setDiscount(0);
          setTax(0);
        },
        // onSuccess
        (successData) => {
          console.log(`✅ [GenericPOS] Sale completed in ${successData.clientElapsedMs.toFixed(1)}ms ${successData.performanceGrade}`);
          
          // Invalidate cache for fresh data
          invalidateProductCache();
          
          alert(
            `✅ Sale Completed!\n\n` +
            `Sale ID: ${successData.saleId}\n` +
            `Amount: KSH ${finalTotal.toLocaleString()}\n` +
            `Time: ${successData.processingTime}\n` +
            `Performance: ${successData.performanceGrade}`
          );
        },
        // onError
        (errorData) => {
          console.error(`❌ [GenericPOS] Sale failed after ${errorData.elapsedMs.toFixed(1)}ms:`, errorData.error);
          
          // Rollback if needed
          if (errorData.needsRollback) {
            setSelectedItems(savedItems);
            setDiscount(savedDiscount);
            setTax(savedTax);
            console.log('🔄 [GenericPOS] Rolled back to previous state');
          }
          
          alert(`❌ Error: ${errorData.error}`);
        }
      );
      
    } catch (error) {
      console.error('❌ [GenericPOS] Unexpected error:', error);
      
      // Rollback on unexpected error
      setSelectedItems(savedItems);
      setDiscount(savedDiscount);
      setTax(savedTax);
      
      alert(`❌ Sale failed: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const tabs = [
    { id: 'pos', label: 'POS', icon: ShoppingCart },
    { id: 'monitor', label: 'Monitor', icon: TrendingUp },
    { id: 'shift', label: 'Shift', icon: Clock }
  ];

  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount - discount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cashier POS</h1>
              <p className="text-sm text-gray-600">Welcome, {user.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Shift ID: {shiftId || 'Not Started'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* POS Tab */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addItem(product)}
                      className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-left"
                    >
                      <p className="font-semibold text-sm">{product.name}</p>
                      <p className="text-sm text-gray-600">Stock: {product.quantity || 0}</p>
                      <p className="text-lg font-bold text-blue-600 mt-2">{product.price}</p>
                    </button>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No products found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cart & Checkout */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Cart</h2>

                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {selectedItems.length === 0 ? (
                    <p className="text-gray-500 text-sm">No items selected</p>
                  ) : (
                    selectedItems.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">{item.quantity} × {item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">{(item.price * item.quantity).toLocaleString()}</p>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Calculations */}
                <div className="space-y-2 border-t pt-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount:</span>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border rounded"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (%):</span>
                    <input
                      type="number"
                      value={tax}
                      onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border rounded"
                    />
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>TOTAL:</span>
                    <span className="text-green-600">{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={completeSale}
                  disabled={loading || selectedItems.length === 0}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Processing...' : '✓ Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Monitor Tab */}
        {activeTab === 'monitor' && <MonitorDashboard />}

        {/* Shift Tab */}
        {activeTab === 'shift' && (
          <ClockInOut shiftId={shiftId} onClockOut={() => navigate('/auth/login')} />
        )}
      </div>
    </div>
  );
}
