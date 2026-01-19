import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const ScreenLockContext = createContext();

export const useScreenLock = () => useContext(ScreenLockContext);

// Screen lock timeout in milliseconds (15 minutes)
const LOCK_TIMEOUT = 15 * 60 * 1000;

export const ScreenLockProvider = ({ children }) => {
  const { user } = useAuth();
  const [isLocked, setIsLocked] = useState(false);
  const lockTimeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Reset lock timeout on activity
  const resetLockTimeout = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }

    // Set new timeout for screen lock
    lockTimeoutRef.current = setTimeout(() => {
      setIsLocked(true);
      console.log('🔒 Screen locked due to inactivity');
    }, LOCK_TIMEOUT);
  }, []);

  // Attach activity listeners to reset timeout
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'click', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetLockTimeout);
    });

    // Initial timeout setup
    resetLockTimeout();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetLockTimeout);
      });
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, [resetLockTimeout]);

  const lock = useCallback(() => {
    setIsLocked(true);
    console.log('🔒 Screen manually locked');
  }, []);

  const unlock = useCallback(() => {
    setIsLocked(false);
    // Reset activity timer when unlocking
    resetLockTimeout();
    console.log('🔓 Screen unlocked');
  }, [resetLockTimeout]);

  const value = {
    isLocked,
    lock,
    unlock
  };

  return (
    <ScreenLockContext.Provider value={value}>
      {children}
    </ScreenLockContext.Provider>
  );
};
