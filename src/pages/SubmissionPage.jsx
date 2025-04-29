// src/pages/SubmissionPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';
import { loadSubmission } from '../services/submissions';
import styles from './SubmissionPage.module.css';

export default function SubmissionPage() {
  const { id } = useParams();
  const containerRef = useRef();
  const [loadedAnswers, setLoadedAnswers] = useState(null);

  // 1) On mount (or when :id changes), fetch the saved submission
  useEffect(() => {
    if (!id) return;
    loadSubmission(id)
      .then(data => setLoadedAnswers(data))
      .catch(err => {
        console.error(err);
        alert('Could not load that submission. It may not exist.');
      });
  }, [id]);

  // Copy-link handler
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch {
      alert('Failed to copy link.');
    }
  };

  // PDF-download handler
  const handleDownloadPDF = () => {
    html2pdf()
      .from(containerRef.current)
      .set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'aptis-writing-test.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .save();
  };

  // Show loading state
  if (!loadedAnswers) {
    return <div className={styles.page}>Loading submission…</div>;
  }

  // Destructure or default the three parts
  const part1 = loadedAnswers[1] || ['', '', ''];
  const part2 = loadedAnswers[2] || '';
  const part3 = loadedAnswers[3] || '';

  // Static data for prompts
  const part1Questions = [
    {
      speaker: 'Zara',
      prompt:
        "You are a member of a photography club. You are talking to three other members in the chat room. Talk to them using sentences. Answer all three questions. Use 30–40 words per answer.",
      question:
        'Hi and welcome! I mostly take landscape shots, but I’d love to get into portraits. What kind of photography do you enjoy?',
    },
    {
      speaker: 'Mateo',
      question:
        'Can you describe one of your favourite photos you’ve taken or seen?',
    },
    {
      speaker: 'Tom',
      question:
        'There’s a local photo walk this Saturday. Would you like to come along?',
    },
  ];

  const part2Prompt = {
    instructions:
      'You recently stayed at a hotel, but your experience was disappointing. Write an email to the manager including the following points.',
    notes: [
      'Room smaller than expected – no window',
      'No hot water on second day',
      'Staff didn’t apologise – felt ignored',
    ],
  };

  const part3Prompt = {
    instructions:
      'FutureFocus is a website about changes in education and society. You have researched the changing patterns in higher education. Write an article using the notes and data provided (180–220 words).',
    notes: [
      'Many students graduate with debt',
      'Vocational training gaining popularity as an alternative',
      'University seen as key to better job opportunities',
      'Higher education linked to higher economic growth',
    ],
    table: [
      ['Year', '% of School Leavers Going to Uni', 'Avg. Tuition Fees (USD/year)'],
      ['2000', '32%', '$4,500'],
      ['2010', '45%', '$7,200'],
      ['2022', '56%', '$12,000'],
    ],
  };

  return (
    <div className={styles.page}>
      <h1>Aptis Advanced Practice Test – Writing</h1>
      <div className={styles.toolbar}>
        <button onClick={handleCopyLink}>Copy link</button>
        <button onClick={handleDownloadPDF}>Download PDF</button>
      </div>

      <div ref={containerRef} className={styles.content}>
        {/* Instructions */}
        <section className={styles.section}>
          <h2>Writing Instructions</h2>
          <p>Total Time: 45 minutes</p>
          <ul>
            <li>Part One: 10 minutes</li>
            <li>Part Two: 15 minutes</li>
            <li>Part Three: 20 minutes</li>
          </ul>
        </section>

        {/* Part 1 */}
        <section className={styles.section}>
          <h3>Part 1: Photography Club</h3>
          <p className={styles.promptText}>{part1Questions[0].prompt}</p>
          {part1Questions.map((q, i) => (
            <div key={i} className={styles.qaBlock}>
              <p className={styles.question}>
                <strong>{q.speaker}:</strong> {q.question}
              </p>
              <div className={styles.answer}>
                {part1[i] ? (
                  <div dangerouslySetInnerHTML={{ __html: part1[i] }} />
                ) : (
                  <em>(no answer)</em>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Part 2 */}
        <section className={styles.section}>
          <h3>Part 2: Hotel Complaint Email</h3>
          <p className={styles.promptText}>{part2Prompt.instructions}</p>
          <ul className={styles.notesList}>
            {part2Prompt.notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
          <div className={styles.qaBlock}>
            <div className={styles.answer}>
              <div
                dangerouslySetInnerHTML={{
                  __html: part2 || '<em>(no answer)</em>',
                }}
              />
            </div>
          </div>
        </section>

        {/* Part 3 */}
        <section className={styles.section}>
          <h3>Part 3: University Education Trends</h3>
          <p className={styles.promptText}>{part3Prompt.instructions}</p>
          <ul className={styles.notesList}>
            {part3Prompt.notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                {part3Prompt.table[0].map((hdr, idx) => (
                  <th key={idx}>{hdr}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {part3Prompt.table.slice(1).map((row, ridx) => (
                <tr key={ridx}>
                  {row.map((cell, cidx) => (
                    <td key={cidx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.qaBlock}>
            <div className={styles.answer}>
              <div
                dangerouslySetInnerHTML={{
                  __html: part3 || '<em>(no answer)</em>',
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
