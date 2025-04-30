import React, { useState, useRef, useEffect, useContext } from 'react';
import { AnswersContext } from '../context/AnswersContext';
import styles from './Part3.module.css';

// helpers
function countWords(str) {
  const m = str.trim().match(/\S+/g);
  return m ? m.length : 0;
}
function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.innerText;
}

export default function Part3() {
  const maxWords = 330;
  const { answers, updateAnswer } = useContext(AnswersContext);
  const editorRef = useRef(null);

  // initialize word count from context
  const [wordCount, setWordCount] = useState(() => {
    const html = answers[3] || '';
    return countWords(stripHtml(html));
  });

  // formatting state
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
  });

  // bookmark toggle (local UI state)
  const [bookmarked, setBookmarked] = useState(false);

  // restore saved HTML on mount
  useEffect(() => {
    const node = editorRef.current;
    if (node && answers[3]) {
      node.innerHTML = answers[3];
    }
}, [answers]);

  // persist & update word count
  const handleInput = () => {
    const node = editorRef.current;
    const html = node.innerHTML;
    const plain = node.innerText;
    const wc = countWords(plain);
    setWordCount(wc);
    updateAnswer(3, 0, html);
  };

  // Tab indents instead of blurring
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '\t');
      handleInput();
    }
  };

  const toggleBookmark = () => setBookmarked((b) => !b);

  const formatText = (cmd) => {
    const node = editorRef.current;
    if (!node) return;
    node.focus();
    document.execCommand(cmd, false, null);
    handleInput();
    updateActiveStates();
  };

  const updateActiveStates = () => {
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

  // listen for caret/selection changes
  useEffect(() => {
    const handler = () => {
      const sel = document.getSelection();
      if (!sel?.anchorNode) return;
      if (editorRef.current.contains(sel.anchorNode)) {
        updateActiveStates();
      }
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
}, [answers]);

  const limitReached = wordCount >= maxWords;

  return (
    <div className={styles.partContainer}>
      <h2 className={styles.heading}>Part 3: University Education Trends</h2>
      <p className={styles.prompt}>
        FutureFocus is a website about changes in education and society. You
        have researched the changing patterns in higher education. Write an
        article using the notes and data provided (180–220 words).
      </p>

      <ul className={styles.notes}>
        <li>Many students graduate with debt</li>
        <li>Vocational training gaining popularity as an alternative</li>
        <li>University seen as key to better job opportunities</li>
        <li>Higher education linked to higher economic growth</li>
      </ul>

      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Year</th>
            <th>% of School Leavers Going to Uni</th>
            <th>Avg. Tuition Fees (USD/year)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2000</td>
            <td>32%</td>
            <td>$4,500</td>
          </tr>
          <tr>
            <td>2010</td>
            <td>45%</td>
            <td>$7,200</td>
          </tr>
          <tr>
            <td>2022</td>
            <td>56%</td>
            <td>$12,000</td>
          </tr>
        </tbody>
      </table>

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
          data-placeholder="Type your article here…"
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
