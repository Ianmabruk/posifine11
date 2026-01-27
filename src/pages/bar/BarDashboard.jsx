import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Beer, 
  Users, 
  DollarSign, 
  Clock,
  Plus,
  Check,
  X,
  Eye,
  Edit
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BASE_API_URL } from '../../services/api';

export default function BarDashboard() {
  const { user } = useAuth();
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    loadTables();
    loadOrders();
    loadProducts();
  }, []);

  const loadTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_API_URL}/table-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Group orders by table
        const tableMap = {};
        data.forEach(order => {
          if (!tableMap[order.table_number]) {
            tableMap[order.table_number] = {
              table_number: order.table_number,
              orders: [],
              total: 0,
              status: order.status
            };
          }
          tableMap[order.table_number].orders.push(order);
          if (order.status !== 'paid') {
            tableMap[order.table_number].total += order.total_amount;
          }
        });
        setTables(Object.values(tableMap));
      }
    } catch (error) {
      console.error('Failed to load tables:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_API_URL}/table-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_API_URL}/products?category=drinks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToOrder = (product) => {
    const existingItem = orderItems.find(item => item.product_id === product.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedTable || orderItems.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const res = await fetch(`${BASE_API_URL}/table-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          table_number: selectedTable,
          items: orderItems,
          total_amount: total,
          status: 'pending',
          waiter_id: user.id,
          waiter_name: user.name
        })
      });

      if (res.ok) {
        setShowOrderModal(false);
        setSelectedTable(null);
        setOrderItems([]);
        loadTables();
        loadOrders();
        alert('Order created successfully');
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_API_URL}/table-orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        loadTables();
        loadOrders();
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
  const completedToday = orders.filter(o => {
    if (o.status !== 'paid') return false;
    const orderDate = new Date(o.created_at).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });
  const todayRevenue = completedToday.reduce((sum, o) => sum + o.total_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bar Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user.name}</p>
        </div>
        <button
          onClick={() => setShowOrderModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Order
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{activeOrders.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Occupied Tables</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {tables.filter(t => t.status !== 'paid').length}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">KES {todayRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{completedToday.length}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <Check className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tables Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Active Tables</h2>

        {tables.filter(t => t.status !== 'paid').length === 0 ? (
          <div className="text-center py-8">
            <Beer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No active tables</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables
              .filter(t => t.status !== 'paid')
              .map((table) => (
                <div
                  key={table.table_number}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-gray-900">Table {table.table_number}</p>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">{table.orders.length} orders</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    KES {table.total.toLocaleString()}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        const lastOrder = table.orders[table.orders.length - 1];
                        if (lastOrder) {
                          handleUpdateOrderStatus(lastOrder.id, 'paid');
                        }
                      }}
                      className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                    >
                      Pay
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </motion.div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Order</h3>
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setOrderItems([]);
                  setSelectedTable(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Table Number *
              </label>
              <input
                type="number"
                value={selectedTable || ''}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter table number"
              />
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Select Items</h4>
              <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddToOrder(product)}
                    className="bg-gray-50 hover:bg-blue-50 p-3 rounded-lg text-left transition-colors"
                  >
                    <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                    <p className="text-blue-600 font-bold text-sm">KES {product.price}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              {orderItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items added</p>
              ) : (
                <div className="space-y-2">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-600">KES {item.price} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              setOrderItems(orderItems.map(i =>
                                i.product_id === item.product_id
                                  ? { ...i, quantity: i.quantity - 1 }
                                  : i
                              ));
                            }
                          }}
                          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                        >
                          -
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() => {
                            setOrderItems(orderItems.map(i =>
                              i.product_id === item.product_id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                            ));
                          }}
                          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={() => {
                            setOrderItems(orderItems.filter(i => i.product_id !== item.product_id));
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  KES {orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setOrderItems([]);
                  setSelectedTable(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Order
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
