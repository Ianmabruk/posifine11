import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { BUSINESS_METADATA } from '../config/businessConfig';

export default function BuildPOS() {
  const navigate = useNavigate();
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [step, setStep] = useState(1);

  const handleSelectBusiness = (businessId) => {
    setSelectedBusiness(businessId);
    setStep(2);
  };

  const handleContinue = () => {
    if (!selectedBusiness) {
      alert('Please select a business type');
      return;
    }

    const metadata = BUSINESS_METADATA[selectedBusiness];
    
    localStorage.setItem('selectedBusinessType', selectedBusiness);
    localStorage.setItem('businessMetadata', JSON.stringify(metadata));
    
    console.log('[BUILD POS] Selected business:', selectedBusiness);
    navigate('/auth/signup');
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedBusiness(null);
    } else {
      navigate('/plans');
    }
  };

  const selectedMetadata = selectedBusiness ? BUSINESS_METADATA[selectedBusiness] : null;
  const businessArray = Object.entries(BUSINESS_METADATA).map(([key, value]) => ({ id: key, ...value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition p-2 rounded-lg hover:bg-white"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Choose Your Business Type
            </h1>
            <p className="text-gray-600 mb-12 text-lg">
              Select the type that best matches your operation. We'll customize your dashboard accordingly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessArray.map((business) => (
                <button
                  key={business.id}
                  onClick={() => handleSelectBusiness(business.id)}
                  className={`text-left p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    selectedBusiness === business.id
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-400 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{business.name}</h3>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedBusiness === business.id
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedBusiness === business.id && (
                        <Check size={16} className="text-white" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm">{business.description}</p>
                  
                  <ul className="space-y-2">
                    {business.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-600 font-bold mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedMetadata && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">
              Confirm Your Selection
            </h1>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-600">
              <h2 className="text-3xl font-bold mb-4 text-blue-600">{selectedMetadata.name}</h2>
              <p className="text-gray-600 mb-8 text-lg">{selectedMetadata.description}</p>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Your Dashboard Includes:</h3>
                <ul className="space-y-3">
                  {selectedMetadata.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={16} className="text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Custom Price:</span> 3,500 KES/month
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Your admin will be customized for {selectedMetadata.name.toLowerCase()}. You can modify your selection later.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedBusiness(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition"
                >
                  Choose Different
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  Continue to Sign Up
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
