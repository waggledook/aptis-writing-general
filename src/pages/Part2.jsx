// src/pages/Part2.jsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { AnswersContext } from '../context/AnswersContext';
import styles from './Part2.module.css';

// Count words in a plain‐text string
function countWords(str) {
  const m = str.trim().match(/\S+/g);
  return m ? m.length : 0;
}

// Strip HTML tags for initial word-count
function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.innerText;
}

export default function Part2() {
  const maxWords = 225;              // ← updated limit here
  const { answers, updateAnswer } = useContext(AnswersContext);
  const editorRef = useRef(null);

  // Initialize word count from context
  const [wordCount, setWordCount] = useState(() => {
    const html = answers[2] || '';
    return countWords(stripHtml(html));
  });

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
  });
  const [bookmarked, setBookmarked] = useState(false);

  // Restore saved HTML on mount
  useEffect(() => {
    const node = editorRef.current;
    if (node && answers[2]) {
      node.innerHTML = answers[2];
    }
  }, [answers]);

  // Update word-count & persist HTML
  const handleInput = () => {
    const node = editorRef.current;
    const plain = node.innerText;
    const wc = countWords(plain);
    setWordCount(wc);
    updateAnswer(2, 0, node.innerHTML);
  };

  // Insert tab instead of losing focus
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '\t');
      handleInput();
    }
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    setBookmarked((b) => !b);
  };

  // Apply a formatting command
  const formatText = (cmd) => {
    const node = editorRef.current;
    if (!node) return;
    node.focus();
    document.execCommand(cmd, false, null);
    handleInput();
    updateActiveFormats();
  };

  // Refresh which formatting buttons are active
  const updateActiveFormats = () => {
    const cmds = {
      bold: 'bold',
      italic: 'italic',
      underline: 'underline',
      strikeThrough: 'strikeThrough',
    };
    setActiveFormats((af) => {
      const next = {};
      Object.entries(cmds).forEach(([key, command]) => {
        next[key] = document.queryCommandState(command);
      });
      return next;
    });
  };

  // Watch selection changes
  useEffect(() => {
    const handler = () => {
      const sel = document.getSelection();
      if (!sel?.anchorNode) return;
      if (editorRef.current.contains(sel.anchorNode)) {
        updateActiveFormats();
      }
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
}, [answers]);

  const limitReached = wordCount >= maxWords;

  return (
    <div className={styles.partContainer}>
      <h2 className={styles.heading}>Part 2: Hotel Complaint Email</h2>
      <p className={styles.prompt}>
        You recently stayed at a hotel, but your experience was disappointing.
        Write an email to the manager including the following points.
        You should write 120–150 words.
      </p>

      <ul className={styles.notes}>
        <li>Room smaller than expected – no window</li>
        <li>No hot water on second day</li>
        <li>Staff didn’t apologise – felt ignored</li>
      </ul>

      <div className={styles.editorBlock}>
        <button
          className={`${styles.bookmarkButton} ${
            bookmarked ? styles.bookmarked : ''
          }`}
          onClick={toggleBookmark}
          aria-label="Toggle bookmark"
        >
          🔖
        </button>

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
          data-placeholder="Type your email here…"
          ref={editorRef}
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
