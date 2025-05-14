// src/pages/Part1.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Part1.module.css';
import { AnswersContext } from '../context/AnswersContext';

export default function Part1() {
  const navigate = useNavigate();
  const { answers, updateAnswer } = useContext(AnswersContext);

  const questions = [
    'What languages do you speak?',
    'Where do you work or study?',
    'What’s your favourite kind of food?',
    'What sports do you do?',
    'What time do you get up?'
  ];

  // pull the Part 1 array out of context
  const localAnswers = answers[1];

  const handleChange = (i, e) => {
    // write back into context at key “1”
    updateAnswer(1, i, e.target.value);
  };

  return (
    <div className={styles.partContainer}>
      <h2 className={styles.heading}>Writing</h2>
      <h3 className={styles.heading}>Question 1 of 4</h3>
      <p className={styles.prompt}>
        You want to join a music club. You have 5 messages from a member of the
        club. Write short answers (1–5 words) to each message. Recommended time:
        3 minutes.
      </p>
      <p className={styles.prompt}>
        <strong>Example</strong> How are you? I’m fine, thanks.
      </p>

      {questions.map((q, i) => (
        <div key={i} className={styles.questionBlock}>
          <label className={styles.label}>{q}</label>
          <input
            type="text"
            className={styles.answerInput}
            placeholder="Type your answer here"
            value={localAnswers[i] || ''}
            onChange={(e) => handleChange(i, e)}
          />
        </div>
      ))}

      {/* Navigation handled by bottom bar, so no Next button here */}
    </div>
  );
}
