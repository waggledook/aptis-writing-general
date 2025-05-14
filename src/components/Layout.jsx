// src/components/Layout.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { TimerContext } from '../context/TimerContext';
import { AnswersContext } from '../context/AnswersContext';
import { saveSubmission } from '../services/submissions';
import styles from './Layout.module.css';

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.innerText;
}

const TOTAL_SECONDS = 50 * 60;

export default function Layout() {
  const { timeLeft } = useContext(TimerContext);
  const { answers } = useContext(AnswersContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [timeUpHandled, setTimeUpHandled] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);

  const nav = useNavigate();
  const { pathname } = useLocation();

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const timerLabel = `${minutes}:${seconds}`;

  // Progress bar percentage
  const percent = Math.max(
    0,
    Math.min(100, (timeLeft / TOTAL_SECONDS) * 100)
  );

  // Determine Next path
  let nextPath;
  if (pathname === '/instructions') {
    nextPath = '/part/1';
  } else if (pathname.startsWith('/part/')) {
    const partNum = parseInt(pathname.split('/')[2], 10);
    // now handles parts 1–4
    nextPath = partNum < 4
      ? `/part/${partNum + 1}`
      : '/review';
  }

  // Handle Next button
  const handleNext = () => {
    if (nextPath === '/review') {
      setShowReview(true);
    } else if (nextPath) {
      nav(nextPath);
    }
  };

  // Time-up effect
  useEffect(() => {
    if (timeLeft <= 0 && !timeUpHandled) {
      setTimeUpHandled(true);
      setShowTimeUpModal(true);
    }
  }, [timeLeft, timeUpHandled]);

  // Compute whether exam is still active
  const isExamActive = !examSubmitted;

  // Compute part status for review modal
  const partStatus = {
    // Part 1: array of 5 short answers
    1:
      Array.isArray(answers[1]) &&
      answers[1].some((html) => stripHtml(html).trim() !== '')
        ? 'Attempted'
        : 'Not Attempted',
    // Part 2: single string
    2: (answers[2] || '').trim() ? 'Attempted' : 'Not Attempted',
    // Part 3: array of 3 chat replies
    3:
      Array.isArray(answers[3]) &&
      answers[3].some((html) => stripHtml(html).trim() !== '')
      ? 'Attempted'
      : 'Not Attempted',
    // Part 4: array of 2 emails
    4: 
      Array.isArray(answers[4]) &&
      answers[4].some((html) => stripHtml(html).trim() !== '')
      ? 'Attempted'
      : 'Not Attempted',
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.timerDisplay}>
          <div className={styles.timerValue}>{timerLabel}</div>
          <div className={styles.timerText}>Time remaining</div>
        </div>
        <div className={styles.timeBarContainer}>
          <div
            className={styles.timeBar}
            style={{ width: `${percent}%` }}
          />
        </div>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Bottom bar (only while exam active) */}
      {isExamActive && (
        <footer className={styles.bottomBar}>
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>
          <button
            className={styles.nextButton}
            onClick={handleNext}
          >
            Next →
          </button>
        </footer>
      )}

      {/* Menu drawer (only while exam active) */}
      {isExamActive && menuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMenuOpen(false)}
        >
          <nav
            className={styles.drawer}
            onClick={(e) => e.stopPropagation()}
          >
            <ul className={styles.drawerList}>
              {[1, 2, 3, 4].map((n) => (
                <li key={n}>
                  <button
                    onClick={() => {
                      nav(`/part/${n}`);
                      setMenuOpen(false);
                    }}
                  >
                    Part {n}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Review Modal */}
      {showReview && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowReview(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalHeader}>Question Review</h3>
            <p className={styles.modalSubheader}>
              Please review the following parts
            </p>
            <ul className={styles.partList}>
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className={styles.partItem}>
                  <button
                    className={styles.partButton}
                    onClick={() => {
                      nav(`/part/${n}`);
                      setShowReview(false);
                    }}
                  >
                    <span>
                      <strong>Part {n}</strong>
                    </span>
                    <span>{partStatus[n]}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.modalFooter}>
              <button
                className={styles.reviewButton}
                onClick={() => {
                  nav('/part/1');
                  setShowReview(false);
                }}
              >
                Review Questions
              </button>
              <button
                className={styles.submitButton}
                onClick={() => {
                  setShowReview(false);
                  setShowSubmitConfirm(true);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowSubmitConfirm(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalHeader}>Submit Test?</h3>
            <p className={styles.modalSubheader}>
              Once you submit, you will no longer have access to the questions.
            </p>
            <div className={styles.confirmFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowSubmitConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={styles.submitConfirmButton}
                onClick={async () => {
                  setShowSubmitConfirm(false);
                  // clear the auto-saved draft
                  localStorage.removeItem('aptis-writing-draft');
                  try {
                    console.log('Submitting answers...', answers);
                    const newId = await saveSubmission(answers);
                    console.log('Received submission ID:', newId);
                    setExamSubmitted(true);
                    nav(`/submitted/${newId}`, { replace: true });
                  } catch (err) {
                    console.error('Error submitting test:', err);
                    alert('There was a problem submitting your test:\n' + err.message);
                  }
                }}
              >
                Submit test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time-Up Modal */}
      {showTimeUpModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => {}}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalHeader}>Time’s up!</h3>
            <p className={styles.modalSubheader}>
              Your time has run out—your exam will now be automatically submitted.
            </p>
            <div className={styles.confirmFooter}>
              <button
                className={styles.submitConfirmButton}
                onClick={async () => {
                  setShowTimeUpModal(false);
                  localStorage.removeItem('aptis-writing-draft');
                  const newId = await saveSubmission(answers);
                  setExamSubmitted(true);
                  nav(`/submitted/${newId}`, { replace: true });
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
