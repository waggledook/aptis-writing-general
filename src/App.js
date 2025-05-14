// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OpeningPage from './pages/OpeningPage';
import InstructionsPage from './pages/InstructionsPage';

import Part1 from './pages/Part1';
import Part2 from './pages/Part2';
import Part3 from './pages/Part3';
import Part4 from './pages/Part4';          // ← new import

import ReviewPage from './pages/ReviewPage';
import SubmissionPage from './pages/SubmissionPage';

import Layout from './components/Layout';
import { TimerProvider } from './context/TimerContext';
import { AnswersProvider } from './context/AnswersContext';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Opening page—no timer/bottom bar */}
        <Route path="/" element={<OpeningPage />} />

        {/* The test pages share the timer, bottom bar, and answer state */}
        <Route
          element={
            <AnswersProvider>
              <TimerProvider>
                <Layout />
              </TimerProvider>
            </AnswersProvider>
          }
        >
          <Route path="instructions" element={<InstructionsPage />} />

          {/* General Writing parts 1–4 */}
          <Route path="part/1" element={<Part1 />} />
          <Route path="part/2" element={<Part2 />} />
          <Route path="part/3" element={<Part3 />} />
          <Route path="part/4" element={<Part4 />} />

          <Route path="review" element={<ReviewPage />} />
          <Route path="submitted/:id" element={<SubmissionPage />} />
        </Route>
        
        {/* Anything else → back to opening */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
