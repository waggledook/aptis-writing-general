export const EXAM_DURATION_SECONDS = 50 * 60;
export const TIMER_END_KEY = 'aptis-writing-end-time';

export function getStoredEndTime() {
  const rawValue = localStorage.getItem(TIMER_END_KEY);
  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

export function resetExamTimer() {
  const endTime = Date.now() + EXAM_DURATION_SECONDS * 1000;
  localStorage.setItem(TIMER_END_KEY, String(endTime));
  return endTime;
}

export function getOrCreateExamEndTime() {
  const storedEndTime = getStoredEndTime();
  if (storedEndTime) {
    return storedEndTime;
  }

  return resetExamTimer();
}

export function getRemainingSeconds(endTime) {
  const remainingMs = endTime - Date.now();
  return Math.max(0, Math.round(remainingMs / 1000));
}

export function clearExamTimer() {
  localStorage.removeItem(TIMER_END_KEY);
}
