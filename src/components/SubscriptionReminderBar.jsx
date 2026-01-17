import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function SubscriptionReminderBar({ user }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !user) return null;

  // Check if subscription is expiring soon or trial is ending
  const startDate = user?.serviceStartDate ? new Date(user.serviceStartDate) : null;
  const daysUsed = user?.daysUsed || 0;
  const plan = user?.plan || '';
  
  // Most plans have 30 days trial/service period
  const trialDays = 30;
  const daysRemaining = Math.max(0, trialDays - daysUsed);
  
  if (daysRemaining > 7) return null; // Only show if less than 7 days remaining

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 md:p-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 flex-1">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-900">
            {daysRemaining === 0 
              ? `Your ${plan} plan has expired. Please renew to continue.`
              : `Your ${plan} plan expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Consider upgrading.`
            }
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Service started: {startDate?.toLocaleDateString() || 'Unknown'}
          </p>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 text-amber-600 hover:text-amber-900"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
