import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { loadSubmission } from '../services/submissions';
import {
  downloadSubmissionDocx,
  getNormalizedSubmission,
  PART1_QUESTIONS,
  PART3_QUESTIONS,
  PART4_SOURCE_EMAIL
} from '../utils/submissionDocument';
import styles from './SubmissionPage.module.css';

export default function SubmissionPage() {
  const { id } = useParams();
  const containerRef = useRef();
  const [loaded, setLoaded] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    loadSubmission(id)
      .then((data) => setLoaded(data))
      .catch((err) => setError(err.message || 'Could not load that submission.'));
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copied!'))
      .catch(() => alert('Copy failed'));
  };

  const handlePrint = () => {
    window.print();
  };

  if (error) {
    return <div className={styles.page}>{error}</div>;
  }

  if (!loaded) {
    return <div className={styles.page}>Loading submission…</div>;
  }

  const submission = getNormalizedSubmission(loaded);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar} aria-label="Submission export tools">
        <button type="button" onClick={copyLink}>Copy link</button>
        <button type="button" onClick={handlePrint}>Print / Save as PDF</button>
        <button
          type="button"
          onClick={() => downloadSubmissionDocx({ submissionId: id, submission })}
        >
          Export .docx
        </button>
      </div>

      <div className={styles.toolbar}>
        <span className={styles.helperText}>
          Use browser print for a selectable PDF, or export a Word document for editing.
        </span>
      </div>

      <div ref={containerRef} className={styles.content}>
        <header className={styles.documentHeader}>
          <h1>Aptis General Practice Test - Writing</h1>
          <p className={styles.submissionMeta}>Submission ID: {id}</p>
        </header>

        {/* Instructions */}
        <section className={styles.section}>
          <h2>Writing</h2>
          <p>The test has four parts and takes up to 50 minutes.</p>
          <p><strong>Recommended times:</strong></p>
          <ul>
            <li>Part One: 3 minutes</li>
            <li>Part Two: 7 minutes</li>
            <li>Part Three: 10 minutes</li>
            <li>Part Four: 30 minutes</li>
          </ul>
        </section>

        {/* Part 1 */}
        <section className={styles.section}>
          <h3>Part One: Short answers</h3>
          <p>
            You want to join a music club. You have 5 messages from a member of the club.
            Write short answers (1–5 words) to each message. Recommended time: 3 minutes.
          </p>
          {PART1_QUESTIONS.map((q, i) => (
            <div key={i} className={styles.qaBlock}>
              <p className={styles.question}>{q}</p>
              <div className={styles.answer}>
                {submission.part1[i]?.trim() ? (
                  <span>{submission.part1[i]}</span>
                ) : (
                  <em>(no answer)</em>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Part 2 */}
        <section className={styles.section}>
          <h3>Part Two: Form completion</h3>
          <p>
            You are a new member of the Music Club. Fill in the form. Write in sentences.
            Use 20–30 words. Recommended time: 7 minutes.
          </p>
          <p className={styles.promptText}>
            Please tell us about the music you like and when you usually listen to it.
          </p>
          <div className={styles.qaBlock}>
            <div className={styles.answer}>
              {submission.part2.trim() ? (
                <div dangerouslySetInnerHTML={{ __html: submission.part2 }} />
              ) : (
                <em>(no answer)</em>
              )}
            </div>
          </div>
        </section>

        {/* Part 3 */}
        <section className={styles.section}>
          <h3>Part Three: Chat room</h3>
          <p>
            You are communicating with other members of the club in the chat room.
            Reply to their questions. Write in sentences. Use 30–40 words per answer.
            Recommended time: 10 minutes.
          </p>
          {PART3_QUESTIONS.map(([speaker, text], i) => (
            <div key={i} className={styles.qaBlock}>
              <p className={styles.question}>
                <strong>{speaker}:</strong> {text}
              </p>
              <div className={styles.answer}>
                {submission.part3[i]?.trim() ? (
                  <div dangerouslySetInnerHTML={{ __html: submission.part3[i] }} />
                ) : (
                  <em>(no answer)</em>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Part 4 */}
        <section className={styles.section}>
          <h3>Part Four: Emails</h3>
          <p>
            You are a member of a music club. You have received this email from the club:
          </p>
          <blockquote className={styles.emailBlock}>
            {PART4_SOURCE_EMAIL.map((line, index) => (
              <React.Fragment key={line}>
                {line}
                {index < PART4_SOURCE_EMAIL.length - 1 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </React.Fragment>
            ))}
          </blockquote>

          <p><strong>1)</strong> Write an email to your friend. Write about your feelings and what you think the club should do about the situation. Write about 50 words. Recommended time: 10 minutes.</p>
          <div className={styles.qaBlock}>
            <div className={styles.answer}>
              {submission.part4[0]?.trim() ? (
                <div dangerouslySetInnerHTML={{ __html: submission.part4[0] }} />
              ) : (
                <em>(no answer)</em>
              )}
            </div>
          </div>

          <p><strong>2)</strong> Write an email to the president of the club. Write about your feelings and what you think the club should do about the situation. Write 120–150 words. Recommended time: 20 minutes.</p>
          <div className={styles.qaBlock}>
            <div className={styles.answer}>
              {submission.part4[1]?.trim() ? (
                <div dangerouslySetInnerHTML={{ __html: submission.part4[1] }} />
              ) : (
                <em>(no answer)</em>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
