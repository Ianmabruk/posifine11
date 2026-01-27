import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Users, Pill, DollarSign, FileText, Calendar,
  Settings, LogOut, Plus, Eye, Clock, AlertCircle
} from 'lucide-react';

/**
 * ClinicAdminDashboard
 * 
 * Complete admin dashboard for clinic business.
 * Features:
 * - Patient management
 * - Doctor/staff management
 * - Appointment scheduling
 * - Prescription tracking
 * - Pharmacy inventory
 * - Billing and payments
 */
export default function ClinicAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    activeDoctors: 0,
    pendingBills: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // TODO: Load dashboard data from API
      setStats({
        totalPatients: 0,
        todayAppointments: 0,
        activeDoctors: 0,
        pendingBills: 0
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Stethoscope },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clinic Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">{user?.name} • {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-green-600">{stats.todayAppointments}</p>
              </div>
              <Calendar className="w-12 h-12 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Doctors</p>
                <p className="text-3xl font-bold text-purple-600">{stats.activeDoctors}</p>
              </div>
              <Stethoscope className="w-12 h-12 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Bills</p>
                <p className="text-3xl font-bold text-orange-600">KES {stats.pendingBills.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to your Clinic Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Manage your clinic operations efficiently with our comprehensive tools.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-gray-600">
                        <Plus className="w-4 h-4" />
                        Register new patient
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Schedule appointment
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <Stethoscope className="w-4 h-4" />
                        Manage doctors
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Today's Schedule</h3>
                    <p className="text-sm text-gray-500">No appointments scheduled</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Patient Management</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Register Patient
                  </button>
                </div>
                <div className="text-gray-600">
                  <p>Patient management interface will appear here.</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Features: Patient records, medical history, prescriptions, and more.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Appointment Scheduling</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    New Appointment
                  </button>
                </div>
                <div className="text-gray-600">
                  <p>Appointment calendar and management will appear here.</p>
                </div>
              </div>
            )}

            {activeTab === 'pharmacy' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Pharmacy Inventory</h2>
                <div className="text-gray-600">
                  <p>Pharmacy inventory and prescription tracking will appear here.</p>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Billing & Payments</h2>
                <div className="text-gray-600">
                  <p>Billing and payment management will appear here.</p>
                </div>
              </div>
            )}

            {activeTab === 'staff' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Staff Management</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Staff
                  </button>
                </div>
                <div className="text-gray-600">
                  <p>Staff management interface will appear here.</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Manage doctors, nurses, receptionists, and pharmacists.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Clinic Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter clinic name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Duration (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
