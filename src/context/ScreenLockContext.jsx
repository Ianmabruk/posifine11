import { createContext, useContext, useState, useCallback } from 'react';

const ScreenLockContext = createContext();

export function ScreenLockProvider({ children }) {
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState(''); // 'admin' or 'timeout'

  const lock = useCallback((reason = 'timeout') => {
    setIsLocked(true);
    setLockReason(reason);
    console.log(`🔒 Screen locked by: ${reason}`);
  }, []);

  const unlock = useCallback(() => {
    setIsLocked(false);
    setLockReason('');
    console.log('🔓 Screen unlocked');
  }, []);

  return (
    <ScreenLockContext.Provider value={{ isLocked, lockReason, lock, unlock }}>
      {children}
    </ScreenLockContext.Provider>
  );
}

export function useScreenLock() {
  const context = useContext(ScreenLockContext);
  if (!context) {
    throw new Error('useScreenLock must be used within ScreenLockProvider');
  }
  return context;
}
