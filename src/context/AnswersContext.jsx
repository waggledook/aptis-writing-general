// src/context/AnswersContext.jsx
import React, { createContext, useState, useEffect } from 'react';

const DRAFT_KEY = 'aptis-writing-draft';  // ← the Local Storage key we’ll use

/**
 * answers shape:
 * {
 *   1: [string, string, string],  // HTML for Part1's 3 answers
 *   2: string,                    // HTML for Part2
 *   3: string                     // HTML for Part3
 * }
 */
export const AnswersContext = createContext({
  answers: { 1: ['', '', ''], 2: '', 3: '' },
  updateAnswer: () => {},
  setAnswers: () => {}
});

export function AnswersProvider({ children }) {
  // 1) On first render, pull any saved draft out of LS.
  const [answers, setAnswers] = useState(() => {
    try {
      const json = localStorage.getItem(DRAFT_KEY);
      return json ? JSON.parse(json) : { 1: ['', '', ''], 2: '', 3: '' };
    } catch {
      return { 1: ['', '', ''], 2: '', 3: '' };
    }
  });

  // 2) Whenever answers change, save them to Local Storage.
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
    } catch (e) {
      console.warn('⚠️ could not save draft:', e);
    }
  }, [answers]);

  // your existing updateAnswer helper
  const updateAnswer = (part, idx, html) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      const p = String(part);
      if (p === '1') {
        const arr = Array.isArray(copy[1]) ? [...copy[1]] : ['', '', ''];
        arr[idx] = html;
        copy[1] = arr;
      } else if (p === '2') {
        copy[2] = html;
      } else if (p === '3') {
        copy[3] = html;
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
