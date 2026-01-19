import { useState, useEffect } from 'react';
import { Lock, X } from 'lucide-react';

export default function ScreenLockPin({ isLocked, onUnlock, userPin, userName = 'Cashier' }) {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  // Auto-focus on PIN input when locked
  useEffect(() => {
    if (isLocked) {
      setError('');
      setPinInput('');
      setAttempts(0);
      setIsBlocked(false);
    }
  }, [isLocked]);

  // Block after 3 failed attempts
  useEffect(() => {
    if (attempts >= 3) {
      setIsBlocked(true);
      setTimeout(() => {
        setIsBlocked(false);
        setAttempts(0);
      }, 30000); // 30 second lockout
    }
  }, [attempts]);

  const handlePinInput = (digit) => {
    if (isBlocked) return;
    
    if (pinInput.length < 4) {
      setPinInput(prev => prev + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    if (isBlocked) return;
    setPinInput(prev => prev.slice(0, -1));
    setError('');
  };

  const handleUnlock = () => {
    if (isBlocked) {
      setError('Too many attempts. Please wait.');
      return;
    }

    // Verify PIN
    if (pinInput.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    // Check if PIN matches (compare as strings)
    if (String(pinInput) === String(userPin)) {
      setPinInput('');
      setError('');
      onUnlock();
    } else {
      setError('Incorrect PIN');
      setAttempts(prev => prev + 1);
      setPinInput('');
    }
  };

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 max-w-full mx-4">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <Lock className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Screen Locked
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {userName}, enter your PIN to continue
        </p>

        {/* PIN Display */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center font-bold text-xl text-gray-800"
            >
              {pinInput[i] ? '●' : ''}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={`text-center text-sm font-medium mb-4 p-2 rounded ${
              error.includes('Incorrect')
                ? 'bg-red-100 text-red-700'
                : error.includes('must be')
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {error}
            {attempts > 0 && attempts < 3 && (
              <p className="text-xs mt-1">
                {3 - attempts} attempt{3 - attempts !== 1 ? 's' : ''} remaining
              </p>
            )}
            {isBlocked && <p className="text-xs mt-1">Locked. Try again in 30 seconds.</p>}
          </div>
        )}

        {/* PIN Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePinInput(String(num))}
              disabled={isBlocked || pinInput.length >= 4}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors text-lg"
            >
              {num}
            </button>
          ))}

          {/* 0 Button - spans 2 columns */}
          <button
            onClick={() => handlePinInput('0')}
            disabled={isBlocked || pinInput.length >= 4}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors col-span-1 text-lg"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            onClick={handleBackspace}
            disabled={isBlocked || pinInput.length === 0}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors col-span-2 flex items-center justify-center gap-2"
          >
            <X size={16} />
            Back
          </button>
        </div>

        {/* Unlock Button */}
        <button
          onClick={handleUnlock}
          disabled={isBlocked || pinInput.length !== 4}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors mb-3"
        >
          {isBlocked ? 'Locked' : 'Unlock'}
        </button>

        {/* Info Text */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Enter your 4-digit PIN
        </p>
      </div>
    </div>
  );
}
