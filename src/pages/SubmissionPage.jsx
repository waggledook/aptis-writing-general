import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { loadSubmission } from '../services/submissions';
import {
  downloadSubmissionDocx,
  getNormalizedSubmission
} from '../utils/submissionDocument';
import { getWritingMock } from '../data/mocks';
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

  const submission = getNormalizedSubmission(loaded.answers || loaded);
  const mock = getWritingMock(loaded.mockId || loaded.answers?.__mockId);
  const part4Prompt1 = mock.part4.prompts[0];
  const part4Prompt2 = mock.part4.prompts[1];

  return (
    <div className={styles.page}>
      <div className={styles.toolbar} aria-label="Submission export tools">
        <button type="button" onClick={copyLink}>Copy link</button>
        <button type="button" onClick={handlePrint}>Print / Save as PDF</button>
        <button
          type="button"
          onClick={() => downloadSubmissionDocx({ submissionId: id, submission, mock })}
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
          <p className={styles.submissionMeta}>{mock.menuTitle}</p>
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
            {mock.part1.prompt}
          </p>
          {mock.part1.questions.map((q, i) => (
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
            {mock.part2.prompt}
          </p>
          <p className={styles.promptText}>
            {mock.part2.question}
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
            {mock.part3.prompt}
          </p>
          {mock.part3.questions.map((question, i) => (
            <div key={i} className={styles.qaBlock}>
              <p className={styles.question}>
                <strong>{question.speaker}:</strong> {question.text}
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
            {mock.part4.intro}
          </p>
          <blockquote className={styles.emailBlock}>
            {mock.part4.sourceEmail.map((line, index) => (
              <React.Fragment key={line}>
                {line}
                {index < mock.part4.sourceEmail.length - 1 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </React.Fragment>
            ))}
          </blockquote>

          <p><strong>1)</strong> {part4Prompt1.heading} {part4Prompt1.instructions}</p>
          <div className={styles.qaBlock}>
            <div className={styles.answer}>
              {submission.part4[0]?.trim() ? (
                <div dangerouslySetInnerHTML={{ __html: submission.part4[0] }} />
              ) : (
                <em>(no answer)</em>
              )}
            </div>
          </div>

          <p><strong>2)</strong> {part4Prompt2.heading} {part4Prompt2.instructions}</p>
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
