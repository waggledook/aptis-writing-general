import React, { useContext } from 'react';
import { AnswersContext } from '../context/AnswersContext';
import RichTextAnswerEditor from '../components/RichTextAnswerEditor';
import styles from './Part3.module.css';

const questions = [
  {
    speaker: 'Jasmine',
    text: 'Hi and welcome! Do you prefer listening to music or making it?'
  },
  {
    speaker: 'Leo',
    text: 'What was the best live music experience you’ve had?'
  },
  {
    speaker: 'Amira',
    text: "We're planning a playlist for the next club meeting. Which songs or artists would you recommend, and why?"
  }
];

export default function Part3() {
  const { answers, updateAnswer } = useContext(AnswersContext);

  return (
    <div className={styles.partContainer}>
      <h2 className={styles.heading}>Writing</h2>
      <h3 className={styles.heading}>Question 3 of 4</h3>
      <p className={styles.prompt}>
        You are communicating with other members of the club in the chat room.
        Reply to their questions. Write in sentences. Use 30–40 words per answer.
        Recommended time: 10 minutes.
      </p>

      {questions.map((q, i) => {
        return (
          <div key={i} className={styles.questionBlock}>
            <p className={styles.label}>
              <strong>{q.speaker}:</strong>
            </p>
            <p className={styles.text}>{q.text}</p>
            <RichTextAnswerEditor
              value={answers[3][i] || ''}
              maxWords={60}
              showBookmark
              onChange={(html) => updateAnswer(3, i, html)}
            />
          </div>
        );
      })}
    </div>
  );
}
