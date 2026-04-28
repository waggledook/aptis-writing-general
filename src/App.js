import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import OpeningPage from './pages/OpeningPage';
import InstructionsPage from './pages/InstructionsPage';

import Part1 from './pages/Part1';
import Part2 from './pages/Part2';
import Part3 from './pages/Part3';
import Part4 from './pages/Part4';          // ← new import

import ReviewPage from './pages/ReviewPage';
import SubmissionPage from './pages/SubmissionPage';

import Layout from './components/Layout';
import { RequireMockAuth, SignInPage } from './components/AuthGate';
import { MockContext } from './context/MockContext';
import { TimerProvider } from './context/TimerContext';
import { AnswersProvider } from './context/AnswersContext';
import { DEFAULT_MOCK_ID, getWritingMock } from './data/mocks';

function ExamShell() {
  const { mockId } = useParams();
  const mock = getWritingMock(mockId);

  return (
    <RequireMockAuth mockId={mock.id}>
      <MockContext.Provider value={mock}>
        <AnswersProvider key={mock.id} mockId={mock.id}>
          <TimerProvider>
            <Layout />
          </TimerProvider>
        </AnswersProvider>
      </MockContext.Provider>
    </RequireMockAuth>
  );
}

function MockSignInRoute() {
  const { mockId } = useParams();
  const mock = getWritingMock(mockId);
  return <SignInPage mockId={mock.id} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OpeningPage />} />
        <Route path="submitted/:id" element={<SubmissionPage />} />
        <Route path="mock/:mockId/sign-in" element={<MockSignInRoute />} />

        <Route
          path="mock/:mockId"
          element={<ExamShell />}
        >
          <Route index element={<Navigate to="instructions" replace />} />
          <Route path="instructions" element={<InstructionsPage />} />
          <Route path="part/1" element={<Part1 />} />
          <Route path="part/2" element={<Part2 />} />
          <Route path="part/3" element={<Part3 />} />
          <Route path="part/4" element={<Part4 />} />
          <Route path="review" element={<ReviewPage />} />
        </Route>
        <Route path="instructions" element={<Navigate to={`/mock/${DEFAULT_MOCK_ID}/instructions`} replace />} />
        <Route path="part/:partNum" element={<Navigate to={`/mock/${DEFAULT_MOCK_ID}/part/1`} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
