import { useState } from 'react';
import { BASE_API_URL } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, ArrowLeft, Gem, Star } from 'lucide-react';

export default function Subscription() {
  const [selected, setSelected] = useState('ultra');
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoData, setDemoData] = useState({ name: '', email: '', company: '' });
  const navigate = useNavigate();
  
  console.log('✅ Subscription component mounted, navigate available:', typeof navigate);

  // Updated pricing: Basic=1000, Ultra=2500, Pro=3400, Custom=3500
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 1000,
      icon: Zap,
      color: 'from-green-500 to-teal-600',
      popular: false,
      features: [
        '✓ Admin Dashboard + Cashier POS',
        '✓ Basic Inventory Management',
        '✓ Sales Tracking',
        '✓ Daily/Weekly Reports',
        '✓ Basic Profit/Loss View',
        '✓ Email Support',
        '✓ 1 Cashier Only'
      ]
    },
    {
      id: 'ultra',
      name: 'Ultra',
      price: 2500,
      icon: Crown,
      color: 'from-blue-600 to-purple-600',
      popular: true,
      features: [
        '✓ Admin Dashboard + Cashier POS',
        '✓ Full Inventory Management',
        '✓ Automatic Stock Deduction',
        '✓ User Management (Unlimited)',
        '✓ Permission Controls',
        '✓ Expense Tracking',
        '✓ Advanced Analytics',
        '✓ Priority Support'
      ]
    },
    {
      id: 'custom',
      name: 'Custom',
      price: 3500,
      icon: Star,
      color: 'from-pink-500 to-rose-600',
      popular: false,
      features: [
        '✓ All Ultra Features',
        '✓ Business Type Builder',
        '✓ Custom Feature Selection',
        '✓ White-label Options',
        '✓ Custom Integrations',
        '✓ Dedicated Account Manager',
        '✓ Priority On-boarding',
        '✓ Custom Support'
      ]
    }
  ];

  const handleGetStarted = (e) => {
    e?.preventDefault?.();
    console.log('[BUTTON] Get Started clicked, selected plan:', selected);
    console.log('[BUTTON] Available plans:', plans.map(p => p.id));
    
    const plan = plans.find(p => p.id === selected);
    console.log('[BUTTON] Found plan:', plan);
    
    if (!plan) {
      console.error('[BUTTON] Plan not found!');
      alert('Please select a plan first');
      return;
    }
    
    try {
      // Store plan data (without icon which can't be serialized)
      const planData = {
        id: plan.id,
        name: plan.name,
        price: plan.price
      };
      
      localStorage.setItem('selectedPlan', JSON.stringify(planData));
      localStorage.setItem('planId', selected);
      console.log('[BUTTON] Stored to localStorage, navigating...');
      
      if (selected === 'custom') {
        console.log('[BUTTON] Custom plan - going to /build-pos');
        navigate('/build-pos');
      } else {
        console.log('[BUTTON] Standard plan - going to /auth/signup');
        navigate('/auth/signup');
      }
    } catch (error) {
      console.error('[BUTTON] Error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleDemoRequest = async (e) => {
    e.preventDefault();
    try {
      const API_URL = BASE_API_URL;
      await fetch(`${API_URL}/demo-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoData)
      });
      alert('Demo request submitted! Admin will review and contact you.');
      setShowDemoForm(false);
      setDemoData({ name: '', email: '', company: '' });
    } catch (error) {
      console.error('Demo request failed:', error);
      alert('Failed to submit demo request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-6 md:py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-base md:text-lg">Pick the perfect plan and unlock your POS potential</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`card cursor-pointer transition-all transform ${
                  selected === plan.id 
                    ? 'ring-4 ring-blue-600 shadow-2xl scale-105 bg-gradient-to-br from-blue-50 to-purple-50' 
                    : 'hover:shadow-lg hover:scale-102'
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">{plan.name}</h3>
                </div>
                
                <div className="mb-4">
                  <span className="text-2xl md:text-3xl font-bold">KSH {plan.price}</span>
                  <span className="text-gray-600 text-xs md:text-sm">/month</span>
                </div>
                
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-8">
          <button 
            type="button"
            onClick={handleGetStarted}
            className="cursor-pointer px-8 md:px-12 py-3 md:py-4 text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all active:scale-95"
          >
            Get Started
          </button>
          <button 
            type="button"
            onClick={() => setShowDemoForm(true)}
            className="cursor-pointer px-8 md:px-12 py-3 md:py-4 text-base md:text-lg font-bold border-2 border-gray-300 bg-white text-gray-700 rounded-lg hover:border-gray-400 transition-all"
          >
            Request Free Demo
          </button>
        </div>
        <p className="text-xs md:text-sm text-gray-500 mt-4 text-center">Secure payment • Cancel anytime</p>

        {/* Demo Request Modal */}
        {showDemoForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white rounded-t-2xl">
                <h2 className="text-2xl font-bold">Request Free Demo</h2>
                <p className="text-green-100 text-sm mt-1">We'll contact you to schedule a demo</p>
              </div>
              <form onSubmit={handleDemoRequest} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={demoData.name}
                    onChange={(e) => setDemoData({ ...demoData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={demoData.email}
                    onChange={(e) => setDemoData({ ...demoData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    value={demoData.company}
                    onChange={(e) => setDemoData({ ...demoData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500"
                    placeholder="Optional"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDemoForm(false)}
                    className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
