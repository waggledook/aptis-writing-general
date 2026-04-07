import React, { createContext, useState, useEffect } from 'react';
import {
  getOrCreateExamEndTime,
  getRemainingSeconds
} from '../utils/timer';

export const TimerContext = createContext();

export function TimerProvider({ children }) {
  const [timeLeft, setTimeLeft] = useState(() =>
    getRemainingSeconds(getOrCreateExamEndTime())
  );

  useEffect(() => {
    const endTime = getOrCreateExamEndTime();
    const tick = () => {
      const secs = getRemainingSeconds(endTime);
      setTimeLeft(secs);
      if (secs <= 0) clearInterval(intervalId);
    };

    tick();
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <TimerContext.Provider value={{ timeLeft }}>
      {children}
    </TimerContext.Provider>
  );
}
