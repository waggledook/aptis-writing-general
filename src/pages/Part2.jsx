import React, { useContext } from 'react';
import { AnswersContext } from '../context/AnswersContext';
import RichTextAnswerEditor from '../components/RichTextAnswerEditor';
import styles from './Part2.module.css';

export default function Part2() {
  const { answers, updateAnswer } = useContext(AnswersContext);

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
        <RichTextAnswerEditor
          value={answers[2] || ''}
          maxWords={45}
          onChange={(html) => updateAnswer(2, 0, html)}
        />
      </div>
    </div>
  );
}
