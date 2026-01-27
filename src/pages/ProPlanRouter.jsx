import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import clinic dashboards
import DoctorDashboard from './clinic/DoctorDashboard';
import ReceptionDashboard from './clinic/ReceptionDashboard';
import PharmacyDashboard from './clinic/PharmacyDashboard';

// Import bar dashboard
import BarDashboard from './bar/BarDashboard';

// Import hotel dashboard
import HotelDashboard from './hotel/HotelDashboard';

// Import default admin dashboard for supermarket or fallback
import AdminDashboard from './admin/AdminDashboard';

/**
 * ProPlanRouter - Routes Pro Plan users to business-specific dashboards
 * 
 * Routing logic:
 * - Basic/Ultra plans → Use existing /admin or /cashier routes
 * - Pro plan → Route based on business_type and business_role:
 *   
 *   Clinic:
 *   - role='doctor' → DoctorDashboard (view patients, write prescriptions)
 *   - role='reception' → ReceptionDashboard (register patients, manage appointments)
 *   - role='pharmacy' → PharmacyDashboard (dispense prescriptions, manage stock)
 *   
 *   Bar/Club:
 *   - role='bartender' or 'waiter' → BarDashboard (table orders, billing)
 *   
 *   Hotel:
 *   - role='reception' or 'housekeeping' → HotelDashboard (bookings, check-in/out)
 *   
 *   Supermarket:
 *   - Any role → AdminDashboard (standard admin interface)
 */
export default function ProPlanRouter() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    // Only Pro users use this router
    if (user.plan !== 'pro') {
      // Redirect Basic/Ultra users to their standard dashboards
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'cashier') {
        navigate('/cashier');
      } else {
        navigate('/dashboard');
      }
      return;
    }
  }, [user, navigate]);

  if (!user) return null;

  // Get business context - check multiple sources
  const businessType = user.businessType || 
                       user.business_type || 
                       localStorage.getItem('businessType') || 
                       localStorage.getItem('selectedBusinessType');
  const businessRole = user.businessRole || user.business_role || user.role; // businessRole takes precedence

  console.log('[PRO PLAN ROUTER] Business Type:', businessType, 'Role:', businessRole, 'User:', user);

  // Route based on business type and role
  if (businessType === 'clinic') {
    switch (businessRole) {
      case 'doctor':
        return <DoctorDashboard />;
      case 'reception':
        return <ReceptionDashboard />;
      case 'pharmacy':
        return <PharmacyDashboard />;
      default:
        // Fallback for clinic without specific role
        return <ReceptionDashboard />;
    }
  }

  if (businessType === 'bar') {
    // Bar/club - all roles use same dashboard (bartender, waiter, manager)
    return <BarDashboard />;
  }

  if (businessType === 'hotel') {
    // Hotel - all roles use same dashboard (reception, housekeeping, manager)
    return <HotelDashboard />;
  }

  if (businessType === 'supermarket') {
    // Supermarket uses standard admin dashboard
    return <AdminDashboard />;
  }

  // Fallback to standard admin dashboard if no business type set
  console.warn('[PRO PLAN ROUTER] No business type found, using default admin dashboard');
  return <AdminDashboard />;
}
