import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { BUSINESS_TYPES, BUSINESS_TEMPLATES, getBusinessTypeFeatures, AVAILABLE_FEATURES } from '../config/businessTypes';

export default function BuildPOS() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan;
  
  const [selectedBusinessType, setSelectedBusinessType] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState(new Set());

  const businessTypes = Object.values(BUSINESS_TYPES);
  
  const handleBusinessTypeSelect = (businessType) => {
    setSelectedBusinessType(businessType);
    // Auto-select default features for this business type
    const defaultFeatures = BUSINESS_TEMPLATES[businessType].defaultFeatures;
    setSelectedFeatures(new Set(defaultFeatures));
  };

  const handleFeatureToggle = (featureId) => {
    const newFeatures = new Set(selectedFeatures);
    if (newFeatures.has(featureId)) {
      newFeatures.delete(featureId);
    } else {
      newFeatures.add(featureId);
    }
    setSelectedFeatures(newFeatures);
  };

  const handleNext = () => {
    if (!selectedBusinessType) {
      alert('Please select a business type');
      return;
    }
    
    // Store selections and proceed to signup
    localStorage.setItem('selectedBusinessType', selectedBusinessType);
    localStorage.setItem('selectedFeatures', JSON.stringify(Array.from(selectedFeatures)));
    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
    localStorage.setItem('planId', selectedPlan?.id);
    
    console.log('✅ BuildPOS complete:', { selectedBusinessType, features: Array.from(selectedFeatures), plan: selectedPlan?.id });
    
    navigate('/auth/signup', { state: { plan: selectedPlan, businessType: selectedBusinessType } });
  };

  const handleBack = () => {
    navigate('/plans');
  };

  const currentBusinessType = selectedBusinessType ? BUSINESS_TEMPLATES[selectedBusinessType] : null;
  const currentFeatures = selectedBusinessType ? getBusinessTypeFeatures(selectedBusinessType) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build Your POS
          </h1>
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Business Types Selection */}
          <div className="lg:col-span-1">
            <div className="card shadow-lg sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Select Business Type</h2>
              
              <div className="space-y-3">
                {businessTypes.map((businessTypeId) => {
                  const template = BUSINESS_TEMPLATES[businessTypeId];
                  const isSelected = selectedBusinessType === businessTypeId;
                  
                  return (
                    <button
                      key={businessTypeId}
                      onClick={() => handleBusinessTypeSelect(businessTypeId)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold">{template.icon} {template.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{template.description}</div>
                      {isSelected && (
                        <div className="mt-2 flex items-center gap-1 text-blue-600">
                          <Check size={16} />
                          <span className="text-xs font-semibold">Selected</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Features Display */}
          <div className="lg:col-span-2">
            {selectedBusinessType ? (
              <div className="card shadow-lg">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">{currentBusinessType.icon} {currentBusinessType.name}</h2>
                  <p className="text-gray-600">{currentBusinessType.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold">Default Features</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                      Pre-selected
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 pb-6 border-b">
                    {currentFeatures.map((feature) => (
                      <div
                        key={feature.id}
                        className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border-2 border-green-200"
                      >
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-gray-900">{feature.icon} {feature.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{feature.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Additional Features for Custom Plans */}
                {selectedPlan?.id === 'custom' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Add More Features (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.values(AVAILABLE_FEATURES)
                        .filter(f => !currentFeatures.find(cf => cf.id === f.id))
                        .map((feature) => {
                          const isChecked = selectedFeatures.has(feature.id);
                          
                          return (
                            <button
                              key={feature.id}
                              onClick={() => handleFeatureToggle(feature.id)}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                isChecked
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleFeatureToggle(feature.id)}
                                  className="mt-1"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div>
                                  <div className="font-semibold text-gray-900">{feature.icon} {feature.name}</div>
                                  <div className="text-xs text-gray-600 mt-1">{feature.description}</div>
                                  <div className="text-xs text-gray-500 mt-2">Category: {feature.category}</div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 font-semibold transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold flex items-center gap-2 transition shadow-lg"
                  >
                    Next: Sign Up
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="card shadow-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 text-lg">Select a business type to see features</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
