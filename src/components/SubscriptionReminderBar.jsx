import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { auth } from '../services/api';

export default function SubscriptionReminderBar({ userId = null }) {
  const [reminder, setReminder] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const response = await auth.getSubscriptionStatus?.();
        if (!response) {
          setLoading(false);
          return;
        }

        const { status, days_remaining, is_active, reminder_needed } = response;

        // Show reminder only if 1 day remaining and subscription not yet expired
        if (reminder_needed && days_remaining === 1 && is_active) {
          setReminder({
            message: `⚠️ Your subscription expires ${days_remaining === 1 ? 'tomorrow' : `in ${days_remaining} days`}. Renew now to avoid platform closure.`,
            status: status,
            daysRemaining: days_remaining,
            expiryDate: response.subscription_end
          });
        } else if (status === 'expired' && !is_active) {
          setReminder({
            message: '❌ Your subscription has expired. Please renew to continue using the platform.',
            status: 'expired',
            daysRemaining: 0,
            type: 'error'
          });
        } else if (status === 'expiring') {
          setReminder({
            message: `⚠️ Your subscription expires in ${days_remaining} days. Renew now to avoid disruption.`,
            status: status,
            daysRemaining: days_remaining
          });
        }

        setLoading(false);
      } catch (error) {
        console.warn('Failed to check subscription status:', error);
        setLoading(false);
      }
    };

    if (!dismissed) {
      checkSubscriptionStatus();
      
      // Re-check every 5 minutes
      const interval = setInterval(checkSubscriptionStatus, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [dismissed]);

  // Listen for subscription renewal events via WebSocket
  useEffect(() => {
    const handleSubscriptionRenewal = (event) => {
      console.log('Subscription renewed:', event.detail);
      setDismissed(true);
      setReminder(null);
    };

    window.addEventListener('subscription_renewed', handleSubscriptionRenewal);
    window.addEventListener('subscription_reminder_day29', handleSubscriptionRenewal);
    
    return () => {
      window.removeEventListener('subscription_renewed', handleSubscriptionRenewal);
      window.removeEventListener('subscription_reminder_day29', handleSubscriptionRenewal);
    };
  }, []);

  if (!reminder || dismissed || loading) {
    return null;
  }

  const isError = reminder.type === 'error' || reminder.status === 'expired';
  const bgColor = isError ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200';
  const textColor = isError ? 'text-red-800' : 'text-orange-800';
  const iconColor = isError ? 'text-red-500' : 'text-orange-500';

  return (
    <div className={`fixed top-0 left-0 right-0 border-b ${bgColor} shadow-lg z-40`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${textColor}`}>
              {reminder.message}
            </p>
            {reminder.expiryDate && (
              <p className={`text-xs ${textColor} opacity-75 mt-1`}>
                Expires on: {new Date(reminder.expiryDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            if (!isError) {
              // Redirect to renewal page
              window.location.href = '/plans';
            } else {
              setDismissed(true);
            }
          }}
          className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap flex-shrink-0 ${
            isError
              ? 'bg-red-200 text-red-900 hover:bg-red-300'
              : 'bg-orange-200 text-orange-900 hover:bg-orange-300'
          } transition-colors`}
        >
          {isError ? 'Dismiss' : 'Renew Now'}
        </button>

        <button
          onClick={() => setDismissed(true)}
          className={`p-1 hover:opacity-75 transition-opacity ${textColor}`}
          title="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
