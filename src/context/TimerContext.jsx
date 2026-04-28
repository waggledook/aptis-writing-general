import React, { createContext, useState, useEffect } from 'react';
import {
  EXAM_DURATION_SECONDS,
  getRemainingSeconds,
  getStoredEndTime,
  resetExamTimer
} from '../utils/timer';

export const TimerContext = createContext({
  timeLeft: EXAM_DURATION_SECONDS,
  timerRunning: false,
  startTimer: () => {}
});

export function TimerProvider({ children }) {
  const [endTime, setEndTime] = useState(() => getStoredEndTime());
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedEndTime = getStoredEndTime();
    return storedEndTime ? getRemainingSeconds(storedEndTime) : EXAM_DURATION_SECONDS;
  });

  const startTimer = () => {
    const nextEndTime = endTime || resetExamTimer();
    setEndTime(nextEndTime);
    setTimeLeft(getRemainingSeconds(nextEndTime));
  };

  useEffect(() => {
    if (!endTime) {
      setTimeLeft(EXAM_DURATION_SECONDS);
      return undefined;
    }

    const tick = () => {
      const secs = getRemainingSeconds(endTime);
      setTimeLeft(secs);
      if (secs <= 0) clearInterval(intervalId);
    };

    tick();
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [endTime]);

  return (
    <TimerContext.Provider value={{ timeLeft, timerRunning: !!endTime, startTimer }}>
      {children}
    </TimerContext.Provider>
  );
}
