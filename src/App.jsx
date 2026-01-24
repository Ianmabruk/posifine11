import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import { ScreenLockProvider, useScreenLock } from './context/ScreenLockContext';
import AdminDashboard from './pages/AdminDashboard';
import BusinessAwareAdminRouter from './pages/BusinessAwareAdminRouter';
import PaymentInput from './pages/PaymentInput';
import BasicDashboard from './pages/BasicDashboard';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Subscription from './pages/Subscription';
import BuildPOS from './pages/BuildPOS';
import CashierPOS from './pages/CashierPOS';
import BarCashierPOS from './pages/cashier/BarCashierPOS';
import HospitalCashierPOS from './pages/cashier/HospitalCashierPOS';
import SchoolCashierPOS from './pages/cashier/SchoolCashierPOS';
import KioskCashierPOS from './pages/cashier/KioskCashierPOS';
import PetrolCashierPOS from './pages/cashier/PetrolCashierPOS';
import ShoesCashierPOS from './pages/cashier/ShoesCashierPOS';
import MainAdmin from './pages/MainAdmin';
import ReminderModal from './components/ReminderModal';
import ScreenLock from './components/ScreenLock';
import SubscriptionReminderBar from './components/SubscriptionReminderBar';
import StockUpdateListener from './components/StockUpdateListener';
import useInactivity from './hooks/useInactivity';
import { BASE_API_URL } from './services/api';
import { useState, useEffect, useCallback } from 'react';

function ProtectedRoute({ children, adminOnly = false, ultraOnly = false, ownerOnly = false }) {
  const { user, loading } = useAuth();
  const { isLocked: isScreenLocked, lock: lockScreen, unlock: unlockScreen } = useScreenLock();
  const [showReminders, setShowReminders] = useState(false);
  const inactivityResult = useInactivity(60000); // 1 minute for all dashboards
  const isLocked = inactivityResult?.[0] || isScreenLocked || false;
  const unlock = useCallback(() => {
    inactivityResult?.[1]?.();
    unlockScreen();
  }, [inactivityResult, unlockScreen]);
  const [settings, setSettings] = useState({});
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = BASE_API_URL;
        const res = await fetch(`${API_URL}/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    
    if (user && !ownerOnly) {
      loadSettings();
      // Only show reminders once per session to avoid duplicate displays
      const reminderShown = sessionStorage.getItem('reminderShown');
      if (!reminderShown) {
        setShowReminders(true);
        sessionStorage.setItem('reminderShown', 'true');
      }
    }
  }, [user, ownerOnly]);

  // Listen for screen lock from admin
  useEffect(() => {
    const handleAdminLock = (event) => {
      console.log('🔒 Admin locked screen:', event.detail);
      lockScreen('admin');
    };

    window.addEventListener('admin_locked_user_screen', handleAdminLock);
    return () => window.removeEventListener('admin_locked_user_screen', handleAdminLock);
  }, [lockScreen]);
  
  if (loading && !ownerOnly) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Owner route protection (main.admin)
  if (ownerOnly) {
    const ownerToken = localStorage.getItem('ownerToken');
    const ownerUser = localStorage.getItem('ownerUser');
    if (!ownerToken || !ownerUser) {
      return <Navigate to="/main.admin" />;
    }
    try {
      const userData = JSON.parse(ownerUser);
      if (userData.type !== 'main_admin') {
        return <Navigate to="/main.admin" />;
      }
    } catch (e) {
      return <Navigate to="/main.admin" />;
    }
  } else {
    // Regular route protection
    if (!user) return <Navigate to="/auth/login" />;
    if (!user.active) return <Navigate to="/choose-subscription" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
    if (ultraOnly && (user.role !== 'admin' || user.plan !== 'ultra')) return <Navigate to="/dashboard" />;
  }
  
  const userType = ownerOnly ? 'owner' : 'user';
  
  return (
    <>
      <SubscriptionReminderBar />
      <StockUpdateListener />
      {isLocked && <ScreenLock onUnlock={unlock} userType={userType} />}
      {showReminders && <ReminderModal onClose={() => setShowReminders(false)} />}
      {children}
    </>
  );
}

function DashboardRouter() {
  const { user } = useAuth();
  
  if (!user || !user.active) return <Navigate to="/choose-subscription" />;
  
  // Route based on ROLE, not package
  if (user.role === 'admin') {
    return <Navigate to="/admin" />;
  }
  
  // All non-admin users go to cashier dashboard
  return <Navigate to="/dashboard/cashier" />;
}

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <ScreenLockProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Navigate to="/get-started" />} />
              <Route path="/get-started" element={<Landing />} />
              <Route path="/choose-subscription" element={<Subscription />} />
              <Route path="/auth/login" element={<Auth />} />
              <Route path="/auth/signup" element={<Auth />} />
              <Route path="/plans" element={<Navigate to="/choose-subscription" />} />
              <Route path="/build-pos" element={<BuildPOS />} />
              
              {/* Owner Main Admin Routes */}
              <Route path="/main.admin/*" element={<MainAdmin />} />
              <Route path="/main-admin" element={<ProtectedRoute ownerOnly><MainAdmin /></ProtectedRoute>} />
              
              {/* Regular User Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
              <Route path="/dashboard/cashier" element={<ProtectedRoute><CashierPOS /></ProtectedRoute>} />
              
              {/* Business-Specific Cashier Routes */}
              <Route path="/cashier/bar" element={<ProtectedRoute><BarCashierPOS /></ProtectedRoute>} />
              <Route path="/cashier/hospital" element={<ProtectedRoute><HospitalCashierPOS /></ProtectedRoute>} />
              <Route path="/cashier/school" element={<ProtectedRoute><SchoolCashierPOS /></ProtectedRoute>} />
              <Route path="/cashier/kiosk" element={<ProtectedRoute><KioskCashierPOS /></ProtectedRoute>} />
              <Route path="/cashier/petrol" element={<ProtectedRoute><PetrolCashierPOS /></ProtectedRoute>} />
              <Route path="/cashier/shoes" element={<ProtectedRoute><ShoesCashierPOS /></ProtectedRoute>} />
              
              {/* Admin Dashboard - ORIGINAL OLD version with tabs */}
              <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              
              {/* Legacy redirects */}
              <Route path="/login" element={<Navigate to="/auth/login" />} />
              <Route path="/signup" element={<Navigate to="/auth/signup" />} />
              <Route path="/subscription" element={<Navigate to="/choose-subscription" />} />
              <Route path="/payment" element={<Navigate to="/choose-subscription" />} />
              <Route path="/cashier" element={<ProtectedRoute><Navigate to="/dashboard/cashier" /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </ScreenLockProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;