import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Edit2, Truck } from 'lucide-react';

export default function Vendors() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newVendor, setNewVendor] = useState({
    supplierName: '',
    details: '',
    orderDate: '',
    expectedDelivery: '',
    amount: ''
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Load vendors from localStorage - account-specific storage
  useEffect(() => {
    loadVendors();
  }, [user]);

  const loadVendors = () => {
    try {
      const vendorKey = `vendors_${user?.email || 'default'}`;
      const savedVendors = JSON.parse(localStorage.getItem(vendorKey) || '[]');
      setVendors(savedVendors);
    } catch (error) {
      console.error('Failed to load vendors:', error);
      setVendors([]);
    }
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      if (!newVendor.supplierName.trim()) {
        showNotification('❌ Supplier name is required', 'error');
        return;
      }

      const vendor = {
        id: Math.random().toString(36).substr(2, 9),
        supplierName: newVendor.supplierName,
        details: newVendor.details,
        orderDate: newVendor.orderDate,
        expectedDelivery: newVendor.expectedDelivery,
        amount: parseFloat(newVendor.amount || 0),
        createdBy: user?.id || user?.name || 'Unknown',
        createdAt: new Date().toISOString()
      };

      // Save to localStorage for account - account-specific storage
      const vendorKey = `vendors_${user?.email || 'default'}`;
      const allVendors = JSON.parse(localStorage.getItem(vendorKey) || '[]');
      allVendors.push(vendor);
      localStorage.setItem(vendorKey, JSON.stringify(allVendors));

      setNewVendor({ supplierName: '', details: '', orderDate: '', expectedDelivery: '', amount: '' });
      setShowAddModal(false);
      loadVendors();
      showNotification(`✅ Vendor "${vendor.supplierName}" added successfully!`, 'success');
    } catch (error) {
      console.error('Failed to add vendor:', error);
      showNotification(`❌ Failed to add vendor: ${error.message}`, 'error');
    }
  };

  const handleEditVendor = async (e) => {
    e.preventDefault();
    try {
      if (!selectedVendor.supplierName.trim()) {
        showNotification('❌ Supplier name is required', 'error');
        return;
      }

      // Update in localStorage
      const vendorKey = `vendors_${user?.email || 'default'}`;
      const allVendors = JSON.parse(localStorage.getItem(vendorKey) || '[]');
      const index = allVendors.findIndex(v => v.id === selectedVendor.id);
      
      if (index !== -1) {
        allVendors[index] = {
          ...selectedVendor,
          amount: parseFloat(selectedVendor.amount || 0)
        };
        localStorage.setItem(vendorKey, JSON.stringify(allVendors));
      }

      setShowEditModal(false);
      setSelectedVendor(null);
      loadVendors();
      showNotification(`✅ Vendor "${selectedVendor.supplierName}" updated successfully!`, 'success');
    } catch (error) {
      console.error('Failed to update vendor:', error);
      showNotification(`❌ Failed to update vendor: ${error.message}`, 'error');
    }
  };

  const handleDeleteVendor = async (vendorId, vendorName) => {
    if (!confirm(`Are you sure you want to delete vendor "${vendorName}"?`)) {
      return;
    }

    try {
      const vendorKey = `vendors_${user?.email || 'default'}`;
      const allVendors = JSON.parse(localStorage.getItem(vendorKey) || '[]');
      const filtered = allVendors.filter(v => v.id !== vendorId);
      localStorage.setItem(vendorKey, JSON.stringify(filtered));

      loadVendors();
      showNotification(`✅ Vendor "${vendorName}" deleted successfully!`, 'success');
    } catch (error) {
      console.error('Failed to delete vendor:', error);
      showNotification(`❌ Failed to delete vendor: ${error.message}`, 'error');
    }
  };

  const filteredVendors = vendors.filter(v =>
    v.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.details?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-4 rounded-lg ${notification.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="w-6 h-6 text-blue-600" />
          Vendor Management
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Vendor
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search vendors by name or details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input w-full"
        />
      </div>

      {/* Vendors Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Supplier Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Details</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Expected Delivery</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount (KSH)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created By</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors && filteredVendors.length > 0 ? (
              filteredVendors.slice().reverse().map((vendor) => (
                <tr key={vendor.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold">{vendor.supplierName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{vendor.details || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    {vendor.orderDate ? new Date(vendor.orderDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {vendor.expectedDelivery ? new Date(vendor.expectedDelivery).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-orange-600">
                    {vendor.amount ? vendor.amount.toLocaleString() : '0'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{vendor.createdBy}</td>
                  <td className="px-4 py-3 text-sm flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit vendor"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVendor(vendor.id, vendor.supplierName)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete vendor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? 'No vendors match your search' : 'No vendors added yet'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Vendor</h3>
            <form onSubmit={handleAddVendor} className="space-y-4">
              <input
                type="text"
                placeholder="Supplier Name"
                value={newVendor.supplierName}
                onChange={(e) => setNewVendor({ ...newVendor, supplierName: e.target.value })}
                className="input w-full"
                required
              />
              <textarea
                placeholder="Details (optional)"
                value={newVendor.details}
                onChange={(e) => setNewVendor({ ...newVendor, details: e.target.value })}
                className="input w-full"
                rows="2"
              />
              <input
                type="date"
                value={newVendor.orderDate}
                onChange={(e) => setNewVendor({ ...newVendor, orderDate: e.target.value })}
                className="input w-full"
              />
              <input
                type="date"
                value={newVendor.expectedDelivery}
                onChange={(e) => setNewVendor({ ...newVendor, expectedDelivery: e.target.value })}
                className="input w-full"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Amount (KSH)"
                value={newVendor.amount}
                onChange={(e) => setNewVendor({ ...newVendor, amount: e.target.value })}
                className="input w-full"
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Add Vendor</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewVendor({ supplierName: '', details: '', orderDate: '', expectedDelivery: '', amount: '' });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {showEditModal && selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Vendor</h3>
            <form onSubmit={handleEditVendor} className="space-y-4">
              <input
                type="text"
                placeholder="Supplier Name"
                value={selectedVendor.supplierName}
                onChange={(e) => setSelectedVendor({ ...selectedVendor, supplierName: e.target.value })}
                className="input w-full"
                required
              />
              <textarea
                placeholder="Details (optional)"
                value={selectedVendor.details}
                onChange={(e) => setSelectedVendor({ ...selectedVendor, details: e.target.value })}
                className="input w-full"
                rows="2"
              />
              <input
                type="date"
                value={selectedVendor.orderDate}
                onChange={(e) => setSelectedVendor({ ...selectedVendor, orderDate: e.target.value })}
                className="input w-full"
              />
              <input
                type="date"
                value={selectedVendor.expectedDelivery}
                onChange={(e) => setSelectedVendor({ ...selectedVendor, expectedDelivery: e.target.value })}
                className="input w-full"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Amount (KSH)"
                value={selectedVendor.amount}
                onChange={(e) => setSelectedVendor({ ...selectedVendor, amount: e.target.value })}
                className="input w-full"
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Update Vendor</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedVendor(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
