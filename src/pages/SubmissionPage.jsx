// src/pages/SubmissionPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';
import { loadSubmission } from '../services/submissions';
import styles from './SubmissionPage.module.css';

export default function SubmissionPage() {
  const { id } = useParams();
  const containerRef = useRef();
  const [loaded, setLoaded] = useState(null);

  useEffect(() => {
    if (!id) return;
    loadSubmission(id)
      .then((data) => setLoaded(data))
      .catch(() => alert('Could not load that submission.'));
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copied!'))
      .catch(() => alert('Copy failed'));
  };

  const handleDownloadPDF = () => {
    const opt = {
      margin:       [0.5,0.5,0.5,0.5],
      filename:     'aptis-general-writing.pdf',
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: {
        mode:  ['css','legacy'],      // first try your CSS rules, fallback to html2pdf's legacy logic
        avoid: ['.section', '.qaBlock'] // never split these selectors across pages
      }
    };
  
    html2pdf()
      .set(opt)
      .from(containerRef.current)
      .save();
  };

  if (!loaded) {
    return <div className={styles.page}>Loading submission…</div>;
  }

  // Destructure with safe defaults
  const part1 = Array.isArray(loaded[1]) ? loaded[1] : Array(5).fill('');
  const part2 = loaded[2] || '';
  const part3 = Array.isArray(loaded[3]) ? loaded[3] : Array(3).fill('');
  const part4 = Array.isArray(loaded[4]) ? loaded[4] : ['', ''];

  // Static prompts
  const p1Qs = [
    'What languages do you speak?',
    'Where do you work or study?',
    'What’s your favourite kind of food?',
    'What sports do you do?',
    'What time do you get up?'
  ];

  return (
    <div className={styles.page}>
      <h1>Aptis General Practice Test – Writing</h1>
      <div className={styles.toolbar}>
        <button onClick={copyLink}>Copy link</button>
        <button onClick={handleDownloadPDF}>Download PDF</button>
      </div>

      <div ref={containerRef} className={styles.content}>
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
          {p1Qs.map((q, i) => (
            <div key={i} className={styles.qaBlock}>
              <p className={styles.question}>{q}</p>
              <div className={styles.answer}>
                {part1[i]?.trim() ? (
                  <span>{part1[i]}</span>
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
              {part2.trim() ? (
                <div dangerouslySetInnerHTML={{ __html: part2 }} />
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
          {[
            ['Jasmine', 'Hi and welcome! Do you prefer listening to music or making it?'],
            ['Leo', 'What was the best live music experience you’ve had?'],
            ['Amira', "We're planning a playlist for the next club meeting. Which songs or artists would you recommend, and why?"]
          ].map(([speaker, text], i) => (
            <div key={i} className={styles.qaBlock}>
              <p className={styles.question}>
                <strong>{speaker}:</strong> {text}
              </p>
              <div className={styles.answer}>
                {part3[i]?.trim() ? (
                  <div dangerouslySetInnerHTML={{ __html: part3[i] }} />
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
            Dear Member,<br/><br/>
            We are writing to let you know that next week’s music club meeting has been changed. Unfortunately, the guest speaker — local musician and music teacher Ms Rachel Dean — is no longer available due to illness.<br/><br/>
            Instead, we will show a documentary about her life and career, and there will be a short discussion afterwards. The event will still take place at the usual time, and we hope you will enjoy the new format.<br/><br/>
            If you have any suggestions or questions, please contact the club organiser.<br/><br/>
            Kind regards,<br/>
            The Music Club Team
          </blockquote>

          <p><strong>1)</strong> Write an email to your friend. Write about your feelings and what you think the club should do about the situation. Write about 50 words. Recommended time: 10 minutes.</p>
          <div className={styles.qaBlock}>
            <div className={styles.answer}>
              {part4[0]?.trim() ? (
                <div dangerouslySetInnerHTML={{ __html: part4[0] }} />
              ) : (
                <em>(no answer)</em>
              )}
            </div>
          </div>

          <p><strong>2)</strong> Write an email to the president of the club. Write about your feelings and what you think the club should do about the situation. Write 120–150 words. Recommended time: 20 minutes.</p>
          <div className={styles.qaBlock}>
            <div className={styles.answer}>
              {part4[1]?.trim() ? (
                <div dangerouslySetInnerHTML={{ __html: part4[1] }} />
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
