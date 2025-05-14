// src/context/AnswersContext.jsx
import React, { createContext, useState, useEffect } from 'react';

const DRAFT_KEY = 'aptis-writing-draft';

/**
 * answers shape:
 * {
 *   1: [string, string, string, string, string],
 *   2: string,
 *   3: [string, string, string],
 *   4: [string, string]
 * }
 */
export const AnswersContext = createContext({
  answers: {
    1: Array(5).fill(''),
    2: '',
    3: Array(3).fill(''),
    4: Array(2).fill('')
  },
  updateAnswer: () => {},
  setAnswers: () => {}
});

export function AnswersProvider({ children }) {
  // 1) Initialize from localStorage (with safe fallbacks)
  const [answers, setAnswers] = useState(() => {
    const defaults = {
      1: Array(5).fill(''),
      2: '',
      3: Array(3).fill(''),
      4: Array(2).fill('')
    };
    try {
      const json = localStorage.getItem(DRAFT_KEY);
      if (!json) return defaults;
      const parsed = JSON.parse(json);
      return {
        1: Array.isArray(parsed[1]) ? parsed[1] : defaults[1],
        2: typeof parsed[2] === 'string' ? parsed[2] : defaults[2],
        3: Array.isArray(parsed[3]) ? parsed[3] : defaults[3],
        4: Array.isArray(parsed[4]) ? parsed[4] : defaults[4]
      };
    } catch (err) {
      console.warn('⚠️ Could not load draft, using defaults:', err);
      return defaults;
    }
  });

  // 2) Persist back to localStorage whenever answers change
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
    } catch (err) {
      console.warn('⚠️ Could not save draft:', err);
    }
  }, [answers]);

  // 3) updateAnswer handles both array‐based parts and string parts
  const updateAnswer = (part, idx, html) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      const p = Number(part);
      if (p === 1) {
        const arr = Array.isArray(copy[1]) ? [...copy[1]] : Array(5).fill('');
        arr[idx] = html;
        copy[1] = arr;
      } else if (p === 2) {
        copy[2] = html;
      } else if (p === 3) {
        const arr = Array.isArray(copy[3]) ? [...copy[3]] : Array(3).fill('');
        arr[idx] = html;
        copy[3] = arr;
      } else if (p === 4) {
        const arr = Array.isArray(copy[4]) ? [...copy[4]] : Array(2).fill('');
        arr[idx] = html;
        copy[4] = arr;
      }
      return copy;
    });
  };

  return (
    <AnswersContext.Provider value={{ answers, updateAnswer, setAnswers }}>
      {children}
    </AnswersContext.Provider>
  );
}
