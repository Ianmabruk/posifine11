import { createContext, useContext, useState, useCallback } from 'react';

const ScreenLockContext = createContext();

export const useScreenLock = () => useContext(ScreenLockContext);

export const ScreenLockProvider = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);

  const lock = useCallback(() => {
    setIsLocked(true);
  }, []);

  const unlock = useCallback(() => {
    setIsLocked(false);
  }, []);

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
