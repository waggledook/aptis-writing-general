import React, { useContext } from 'react';
import { AnswersContext } from '../context/AnswersContext';
import RichTextAnswerEditor from '../components/RichTextAnswerEditor';
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

export default function Part4() {
  const { answers, updateAnswer } = useContext(AnswersContext);

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
        return (
          <section key={i} className={styles.questionSection}>
            <h3 className={styles.subHeading}>{p.heading}</h3>
            <p className={styles.subPrompt}>{p.instructions}</p>
            <RichTextAnswerEditor
              value={answers[4][i] || ''}
              maxWords={p.maxWords}
              minHeight={120}
              onChange={(html) => updateAnswer(4, i, html)}
            />
          </section>
        );
      })}
    </div>
  );
}
