import { useState, useEffect, useCallback, useRef } from 'react';

export default function useInactivity(timeout = 60000) { // Default 1 minute
  const [isLocked, setIsLocked] = useState(false);
  const lastActivityRef = useRef(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsLocked(false);
  }, []);

  const unlock = useCallback(() => {
    setIsLocked(false);
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (isLocked) {
        setIsLocked(false);
      }
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Set up interval to check for inactivity
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivityRef.current > timeout && !isLocked) {
        setIsLocked(true);
      }
    }, 5000); // Check every 5 seconds instead of 1 second to reduce CPU usage

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(interval);
    };
  }, [timeout, isLocked]);

  return [isLocked, unlock, resetTimer];
}