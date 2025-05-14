// src/context/TimerContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const TimerContext = createContext();

/**
 * Starts a 50-minute countdown on mount by computing an end-time.
 * Even if the browser throttles intervals, timeLeft is always
 * calculated from Date.now(), keeping it accurate.
 */
export function TimerProvider({ children }) {
  const totalSeconds = 50 * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    // Calculate a fixed end timestamp
    const endTime = Date.now() + totalSeconds * 1000;

    // Tick function: compute remaining seconds from now → endTime
    const tick = () => {
      const remainingMs = endTime - Date.now();
      const secs = Math.max(0, Math.round(remainingMs / 1000));
      setTimeLeft(secs);
      if (secs <= 0) clearInterval(intervalId);
    };

    // Fire immediately to avoid one‐second delay on mount
    tick();

    // Even if throttled, this will re-compute off the timestamp
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [totalSeconds]);  // ← include totalSeconds here

  return (
    <TimerContext.Provider value={{ timeLeft }}>
      {children}
    </TimerContext.Provider>
  );
}
