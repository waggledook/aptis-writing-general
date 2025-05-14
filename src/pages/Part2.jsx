// src/pages/Part2.jsx
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useRef, useEffect, useState } from 'react';
import { AnswersContext } from '../context/AnswersContext';
import styles from './Part2.module.css';

export default function Part2() {
  const { answers, updateAnswer } = useContext(AnswersContext);
  const maxWords = 45;

  const ref = useRef(null);
  const [wordCount, setWordCount] = useState(() =>
    countWords(stripHtml(answers[2] || ''))
  );

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
  });

  // Helpers
  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText;
  }

  function countWords(str) {
    const m = str.trim().match(/\S+/g);
    return m ? m.length : 0;
  }

  // Load any saved answer only once on mount
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    const node = ref.current;
    if (node && answers[2]) {
      node.innerHTML = answers[2];
      setWordCount(countWords(stripHtml(answers[2])));
    }
  }, []);

  // Handle typing/paste
  function handleInput() {
    const node = ref.current;
    const plain = node.innerText;
    const html = node.innerHTML;
    const wc = countWords(plain);
    setWordCount(wc);
    updateAnswer(2, 0, html);
  }

  // Insert a tab on Tab key
  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '\t');
      handleInput();
    }
  }

  // Formatting commands
  function formatText(cmd) {
    const node = ref.current;
    if (!node) return;
    node.focus();
    document.execCommand(cmd, false, null);
    handleInput();
    updateActiveFormats();
  }

  function updateActiveFormats() {
    const cmds = {
      bold: 'bold',
      italic: 'italic',
      underline: 'underline',
      strikeThrough: 'strikeThrough',
    };
    setActiveFormats((prev) => {
      const next = { ...prev };
      Object.entries(cmds).forEach(([key, command]) => {
        next[key] = document.queryCommandState(command);
      });
      return next;
    });
  }

  // Keep toolbar state in sync with selection
  useEffect(() => {
    const handler = () => {
      if (ref.current.contains(document.getSelection().anchorNode)) {
        updateActiveFormats();
      }
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  const limitReached = wordCount >= maxWords;

  return (
    <div className={styles.partContainer}>
      <h2 className={styles.heading}>Writing</h2>
      <h3 className={styles.heading}>Question 2 of 4</h3>
      <p className={styles.prompt}>
        You are a new member of the Music Club. Fill in the form. Write in
        sentences. Use 20–30 words. Recommended time: 7 minutes.
      </p>

      <div className={styles.questionBlock}>
        <p className={styles.text}>
          Please tell us about the music you like and when you usually listen to
          it.
        </p>

        <div className={styles.toolbar}>
          <button
            className={activeFormats.bold ? styles.active : ''}
            onClick={() => formatText('bold')}
          >
            B
          </button>
          <button
            className={activeFormats.italic ? styles.active : ''}
            onClick={() => formatText('italic')}
          >
            I
          </button>
          <button
            className={activeFormats.underline ? styles.active : ''}
            onClick={() => formatText('underline')}
          >
            U
          </button>
          <button
            className={activeFormats.strikeThrough ? styles.active : ''}
            onClick={() => formatText('strikeThrough')}
          >
            S
          </button>
        </div>

        <div
          className={styles.editable}
          contentEditable
          dir="ltr"
          data-placeholder="Type your answer here…"
          ref={ref}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />

<div
  className={`${styles.wordCount} ${
    limitReached ? styles.wordCountWarning : ''
  }`}
>
  {limitReached
    ? `Word limit reached ${wordCount}/${maxWords}`
    : `Words ${wordCount} / ${maxWords}`}
</div>
      </div>
    </div>
  );
}
