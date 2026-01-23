// Business Aware Admin Router - Routes to correct dashboard based on business type
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Import all dashboard variants
import AdminDashboard from './admin/AdminDashboard';
import BarAdminDashboard from './admin/BarAdminDashboard';
import HospitalAdminDashboard from './admin/HospitalAdminDashboard';
import SchoolAdminDashboard from './admin/SchoolAdminDashboard';
import KioskAdminDashboard from './admin/KioskAdminDashboard';
import PetrolAdminDashboard from './admin/PetrolAdminDashboard';
import ShoeAdminDashboard from './admin/ShoeAdminDashboard';

// Import cashier variants
import BarCashierPOS from './cashier/BarCashierPOS';
import HospitalCashierPOS from './cashier/HospitalCashierPOS';
import SchoolCashierPOS from './cashier/SchoolCashierPOS';
import KioskCashierPOS from './cashier/KioskCashierPOS';
import PetrolCashierPOS from './cashier/PetrolCashierPOS';
import ShoesCashierPOS from './cashier/ShoesCashierPOS';

const BusinessAwareAdminRouter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
  }, [user, navigate]);

  // Get business type from user or localStorage
  const businessType = user?.businessType || localStorage.getItem('selectedBusinessType');

  console.log('[BUSINESS ADMIN ROUTER] User:', user?.email, 'Role:', user?.role, 'Business Type:', businessType);

  // Route to correct dashboard based on role and business type
  // If user is admin, show admin dashboard; if cashier, show cashier POS
  const isDashboard = user?.role === 'admin' || user?.role === 'owner';

  if (isDashboard) {
    // Admin/Owner - show admin dashboard
    switch (businessType) {
      case 'bar':
        return <BarAdminDashboard />;
      case 'hospital':
        return <HospitalAdminDashboard />;
      case 'school':
        return <SchoolAdminDashboard />;
      case 'kiosk':
        return <KioskAdminDashboard />;
      case 'petrol':
        return <PetrolAdminDashboard />;
      case 'shoes':
        return <ShoeAdminDashboard />;
      default:
        return <AdminDashboard />;
    }
  } else {
    // Cashier - show cashier POS
    switch (businessType) {
      case 'bar':
        return <BarCashierPOS />;
      case 'hospital':
        return <HospitalCashierPOS />;
      case 'school':
        return <SchoolCashierPOS />;
      case 'kiosk':
        return <KioskCashierPOS />;
      case 'petrol':
        return <PetrolCashierPOS />;
      case 'shoes':
        return <ShoesCashierPOS />;
      default:
        // Fallback to generic
        return <AdminDashboard />;
    }
  }
};

export default BusinessAwareAdminRouter;
