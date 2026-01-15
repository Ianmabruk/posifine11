import { useState, useEffect } from 'react';
import { sales as salesApi, admin } from '../../services/api';
import { Calendar, Download, Filter, Trash } from 'lucide-react';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
    
    // Listen for clear-data and tab switch events
    const handleDataCleared = () => {
      console.log('Sales data cleared - refreshing');
      setSales([]);
    };

    window.addEventListener('dataCleared', handleDataCleared);
    window.addEventListener('storage', loadSales);
    
    return () => {
      window.removeEventListener('dataCleared', handleDataCleared);
      window.removeEventListener('storage', loadSales);
    };
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      const data = await salesApi.getAll();
      setSales(Array.isArray(data) ? data.reverse() : []);
    } catch (error) {
      console.error('Failed to load sales:', error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSales = async () => {
    if (window.confirm('⚠️ Are you sure you want to clear ALL sales data?\n\nThis action CANNOT be undone!')) {
      try {
        await admin.clearData('sales');
        setSales([]);
        alert('✅ All sales cleared successfully!');
      } catch (error) {
        console.error('Failed to clear sales:', error);
        alert('❌ Failed to clear sales: ' + error.message);
      }
    }
  };

  const filteredSales = sales.filter(sale => {
    if (filter === 'today') {
      return new Date(sale.createdAt).toDateString() === new Date().toDateString();
    }
    if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(sale.createdAt) >= weekAgo;
    }
    return true;
  });

  const totalSales = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const totalCOGS = filteredSales.reduce((sum, s) => sum + (s.cogs || 0), 0);
  const totalProfit = totalSales - totalCOGS;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="input w-40"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={handleClearSales} className="btn-secondary flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
            <Trash className="w-4 h-4" />
            Clear All Sales
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <p className="text-sm text-green-100 mb-1">Total Sales</p>
          <p className="text-3xl font-bold">KSH {totalSales.toLocaleString()}</p>
        </div>
        <div className="card bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <p className="text-sm text-orange-100 mb-1">Total COGS</p>
          <p className="text-3xl font-bold">KSH {totalCOGS.toLocaleString()}</p>
        </div>
        <div className="card bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <p className="text-sm text-blue-100 mb-1">Total Profit</p>
          <p className="text-3xl font-bold">KSH {totalProfit.toLocaleString()}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Sales History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">COGS</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Profit</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Download className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium text-lg">No sales yet</p>
                      <p className="text-gray-500 text-sm mt-2">Your sales transactions will appear here once processed</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">#{sale.id}</td>
                    <td className="px-4 py-3 text-sm">{new Date(sale.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">{sale.items?.length || 0} items</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="badge badge-success">{sale.paymentMethod}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">
                      KSH {sale.total?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-orange-600">
                      KSH {sale.cogs?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                      KSH {sale.profit?.toLocaleString() || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
