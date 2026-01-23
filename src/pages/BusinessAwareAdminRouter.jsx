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

  console.log('[BUSINESS ADMIN ROUTER] User:', user?.email, 'Business Type:', businessType);

  // Route to correct dashboard based on business type
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
      // Fallback to generic admin dashboard
      return <AdminDashboard />;
  }
};

export default BusinessAwareAdminRouter;
