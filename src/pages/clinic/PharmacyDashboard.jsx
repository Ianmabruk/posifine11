import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Pill, 
  FileText, 
  Package,
  CheckCircle,
  AlertCircle,
  Search,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BASE_API_URL } from '../../services/api';

export default function PharmacyDashboard() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPrescriptions();
    loadProducts();
  }, []);

  const loadPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_API_URL}/prescriptions?status=active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(data);
      }
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_API_URL}/products`, {
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

  const handleDispensePrescription = async (prescriptionId, medications) => {
    try {
      const token = localStorage.getItem('token');
      
      // Update prescription status
      const res = await fetch(`${BASE_API_URL}/prescriptions/${prescriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: 'dispensed',
          dispensed_at: new Date().toISOString(),
          dispensed_by: user.id
        })
      });

      if (res.ok) {
        // TODO: Deduct medication from stock
        loadPrescriptions();
        alert('Prescription dispensed successfully');
      }
    } catch (error) {
      console.error('Failed to dispense prescription:', error);
      alert('Failed to dispense prescription');
    }
  };

  const filteredPrescriptions = prescriptions.filter(p =>
    p.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.medications.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePrescriptions = prescriptions.filter(p => p.status === 'active');
  const dispensedToday = prescriptions.filter(p => {
    if (p.status !== 'dispensed' || !p.dispensed_at) return false;
    const dispensedDate = new Date(p.dispensed_at).toDateString();
    const today = new Date().toDateString();
    return dispensedDate === today;
  });

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pharmacy Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome, {user.name}</p>
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
              <p className="text-gray-600 text-sm">Active Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{activePrescriptions.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <FileText className="w-6 h-6 text-blue-600" />
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
              <p className="text-gray-600 text-sm">Dispensed Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{dispensedToday.length}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
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
              <p className="text-gray-600 text-sm">Stock Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{products.length}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <Package className="w-6 h-6 text-purple-600" />
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
              <p className="text-gray-600 text-sm">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {products.filter(p => p.quantity < 10).length}
              </p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prescriptions by patient name or medication..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Prescriptions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Pending Prescriptions</h2>

        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-8">
            <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No prescriptions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 rounded-full p-2">
                        <Pill className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{prescription.patient_name}</p>
                        <p className="text-sm text-gray-600">
                          Prescribed by Dr. {prescription.doctor_name}
                        </p>
                      </div>
                    </div>

                    <div className="ml-11 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-600">Medications</p>
                          <p className="text-sm text-gray-900">{prescription.medications}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Dosage</p>
                          <p className="text-sm text-gray-900">{prescription.dosage}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-600">Instructions</p>
                        <p className="text-sm text-gray-900">{prescription.instructions}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-600">Duration</p>
                          <p className="text-sm text-gray-900">{prescription.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Date Prescribed</p>
                          <p className="text-sm text-gray-900">
                            {new Date(prescription.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        prescription.status === 'dispensed'
                          ? 'bg-green-100 text-green-700'
                          : prescription.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {prescription.status}
                    </span>

                    {prescription.status === 'active' && (
                      <button
                        onClick={() => handleDispensePrescription(prescription.id, prescription.medications)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Dispense
                      </button>
                    )}

                    {prescription.status === 'dispensed' && prescription.dispensed_at && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(prescription.dispensed_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
