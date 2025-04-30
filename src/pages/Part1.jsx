/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useContext } from 'react';
import { AnswersContext } from '../context/AnswersContext';
import styles from './Part1.module.css';

const questions = [
  { speaker: 'Zara', text: "Hi and welcome! I mostly take landscape shots, but I’d love to get into portraits. What kind of photography do you enjoy?" },
  { speaker: 'Mateo', text: "Can you describe one of your favourite photos you’ve taken or seen?" },
  { speaker: 'Tom', text: "There’s a local photo walk this Saturday. Would you like to come along?" },
];

function countWords(str) {
  const m = str.trim().match(/\S+/g);
  return m ? m.length : 0;
}

export default function Part1() {
  const maxWords = 60;

  // get context
  const { answers, updateAnswer } = useContext(AnswersContext);

  // local state
  const [wordCounts, setWordCounts] = useState(
    () => answers[1].map((html) => countWords( stripHtml(html) ))
  );
  const [bookmarks, setBookmarks] = useState(() => questions.map(() => false));
  const [activeFormats, setActiveFormats] = useState(
    () =>
      questions.map(() => ({
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false,
      }))
  );

  // refs for each contentEditable
  const refs = useRef([]);

  // helper to strip tags for initial word count
  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText;
  }

  // load saved HTML into the editors on mount
  // ── run once on mount, avoid resetting during edits ──
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    answers[1].forEach((html, i) => {
      const node = refs.current[i];
      if (node && html) {
        node.innerHTML = html;
        // update word count
        setWordCounts((wc) => {
          const copy = [...wc];
          copy[i] = countWords(stripHtml(html));
          return copy;
        });
      }
    });
}, []);

  // handle any change (typing, paste, format)
  const handleInput = (i) => {
    const node = refs.current[i];
    const plain = node?.innerText || '';
    const html = node?.innerHTML || '';
    // update word count
    setWordCounts((wc) => {
      const copy = [...wc];
      copy[i] = countWords(plain);
      return copy;
    });
    // persist into context
    updateAnswer(1, i, html);
  };

  // prevent Tab from blurring & insert tab
  const handleKeyDown = (e, i) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '\t');
      handleInput(i);
    }
  };

  // toggle bookmark flag
  const toggleBookmark = (i) => {
    setBookmarks((bm) => {
      const copy = [...bm];
      copy[i] = !copy[i];
      return copy;
    });
  };

  // apply a formatting command
  const formatText = (cmd, i) => {
    const node = refs.current[i];
    if (!node) return;
    node.focus();
    document.execCommand(cmd, false, null);
    handleInput(i);
    updateActiveFormats(i);
  };

  // refresh which buttons are active at caret
  const updateActiveFormats = (i) => {
    const cmds = {
      bold: 'bold',
      italic: 'italic',
      underline: 'underline',
      strikeThrough: 'strikeThrough',
    };
    setActiveFormats((af) => {
      const copy = af.map((o) => ({ ...o }));
      Object.entries(cmds).forEach(([key, command]) => {
        copy[i][key] = document.queryCommandState(command);
      });
      return copy;
    });
  };

  // rerun active‐format check on selection changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handler = () => {
      const sel = document.getSelection();
      if (!sel?.anchorNode) return;
      refs.current.forEach((el, i) => {
        if (el?.contains(sel.anchorNode)) {
          updateActiveFormats(i);
        }
      });
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
}, []);

  return (
    <div className={styles.partContainer}>
      <h2 className={styles.heading}>Part 1: Photography Club</h2>
      <p className={styles.prompt}>
      You are a member of a photography club. You are talking to three other members in the chat room. Talk to them using sentences. Answer all three questions. Use 30–40 words per answer. Recommended time: 10 minutes.
      </p>

      {questions.map((q, i) => {
        const wc = wordCounts[i];
        const limitReached = wc >= maxWords;
        return (
          <div key={i} className={styles.questionBlock}>
            <button
              className={`${styles.bookmarkButton} ${
                bookmarks[i] ? styles.bookmarked : ''
              }`}
              onClick={() => toggleBookmark(i)}
            >
              🔖
            </button>

            <p className={styles.label}>
              <strong>{q.speaker}:</strong>
            </p>
            <p className={styles.text}>{q.text}</p>

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
                className={
                  activeFormats[i].strikeThrough ? styles.active : ''
                }
                onClick={() => formatText('strikeThrough', i)}
              >
                S
              </button>
            </div>

            <div
              className={styles.editable}
              contentEditable
              dir="ltr"
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
                ? `Word limit reached ${wc}/${maxWords}`
                : `Words ${wc} / ${maxWords}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
