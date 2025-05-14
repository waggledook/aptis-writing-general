/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useRef, useEffect, useState } from 'react';
import { AnswersContext } from '../context/AnswersContext';
import styles from './Part4.module.css';

const prompts = [
  {
    heading: 'Write an email to your friend.',
    instructions:
      'Write about your feelings and what you think the club should do about the situation. Write about 50 words. Recommended time: 10 minutes.',
    maxWords: 50
  },
  {
    heading: 'Write an email to the president of the club.',
    instructions:
      'Write about your feelings and what you think the club should do about the situation. Write 120–150 words. Recommended time: 20 minutes.',
    maxWords: 150
  }
];

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.innerText;
}

function countWords(str) {
  const m = str.trim().match(/\S+/g);
  return m ? m.length : 0;
}

export default function Part4() {
  const { answers, updateAnswer } = useContext(AnswersContext);
  const [wordCounts, setWordCounts] = useState(
    () => answers[4].map((html) => countWords(stripHtml(html)))
  );
  const [activeFormats, setActiveFormats] = useState(
    () =>
      prompts.map(() => ({
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false
      }))
  );
  const refs = useRef([]);

  // On mount load saved HTML
  useEffect(() => {
    answers[4].forEach((html, i) => {
      const node = refs.current[i];
      if (node && html) {
        node.innerHTML = html;
        setWordCounts((wc) => {
          const copy = [...wc];
          copy[i] = countWords(stripHtml(html));
          return copy;
        });
      }
    });
  }, []);

  // Handle input / wordcount / context
  function handleInput(i) {
    const node = refs.current[i];
    const plain = node.innerText;
    const html = node.innerHTML;
    const wc = countWords(plain);
    setWordCounts((wcArr) => {
      const copy = [...wcArr];
      copy[i] = wc;
      return copy;
    });
    updateAnswer(4, i, html);
  }

  // Allow Tab indent
  function handleKeyDown(e, i) {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '\t');
      handleInput(i);
    }
  }

  // Formatting toolbar
  function formatText(cmd, i) {
    const node = refs.current[i];
    node?.focus();
    document.execCommand(cmd, false, null);
    handleInput(i);
    refreshFormats(i);
  }
  function refreshFormats(i) {
    const cmds = {
      bold: 'bold',
      italic: 'italic',
      underline: 'underline',
      strikeThrough: 'strikeThrough'
    };
    setActiveFormats((af) => {
      const copy = af.map((o) => ({ ...o }));
      Object.entries(cmds).forEach(([key, command]) => {
        copy[i][key] = document.queryCommandState(command);
      });
      return copy;
    });
  }
  useEffect(() => {
    const handler = () => {
      const sel = document.getSelection();
      if (!sel?.anchorNode) return;
      refs.current.forEach((el, i) => {
        if (el?.contains(sel.anchorNode)) refreshFormats(i);
      });
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  return (
    <div className={styles.partContainer}>
      <h2 className={styles.heading}>Writing</h2>
      <h3 className={styles.heading}>Question 4 of 4</h3>

      <div className={styles.emailIntro}>
        <p className={styles.prompt}>
          You are a member of a music club. You have received this email from
          the club:
        </p>
        <div className={styles.emailBlock}>
          <p>Dear Member,</p>
          <p>
            We are writing to let you know that next week’s music club meeting
            has been changed. Unfortunately, the guest speaker — local musician
            and music teacher Ms Rachel Dean — is no longer available due to
            illness.
          </p>
          <p>
            Instead, we will show a documentary about her life and career, and
            there will be a short discussion afterwards. The event will still
            take place at the usual time, and we hope you will enjoy the new
            format.
          </p>
          <p>
            If you have any suggestions or questions, please contact the club
            organiser.
          </p>
          <p>Kind regards,</p>
          <p>The Music Club Team</p>
        </div>
      </div>

      {prompts.map((p, i) => {
        const wc = wordCounts[i];
        const limitReached = wc >= p.maxWords;
        return (
          <section key={i} className={styles.questionSection}>
            <h3 className={styles.subHeading}>{p.heading}</h3>
            <p className={styles.subPrompt}>{p.instructions}</p>

            <div className={styles.toolbar}>
              <button
                className={activeFormats[i].bold ? styles.active : ''}
                onClick={() => formatText('bold', i)}
              >
                B
              </button>
              <button
                className={activeFormats[i].italic ? styles.active : ''}
                onClick={() => formatText('italic', i)}
              >
                I
              </button>
              <button
                className={activeFormats[i].underline ? styles.active : ''}
                onClick={() => formatText('underline', i)}
              >
                U
              </button>
              <button
                className={activeFormats[i].strikeThrough ? styles.active : ''}
                onClick={() => formatText('strikeThrough', i)}
              >
                S
              </button>
            </div>

            <div
              className={styles.editable}
              contentEditable
              data-placeholder="Type your answer here…"
              ref={(el) => (refs.current[i] = el)}
              onInput={() => handleInput(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />

            <div
              className={`${styles.wordCount} ${
                limitReached ? styles.wordCountWarning : ''
              }`}
            >
              {limitReached
                ? `Word limit reached ${wc}/${p.maxWords}`
                : `Words ${wc} / ${p.maxWords}`}
            </div>
          </section>
        );
      })}
    </div>
  );
}
