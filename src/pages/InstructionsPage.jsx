// src/pages/InstructionsPage.jsx
import { useNavigate } from 'react-router-dom';
import styles from './InstructionsPage.module.css';

export default function InstructionsPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Aptis General Writing Instructions</h2>

      <p>Writing</p>
      <p>This test has four parts and takes up to 50 minutes.</p>

      <p className={styles.subheading}>Recommended times:</p>
      <ul className={styles.list}>
        <li>Part One: 3 minutes</li>
        <li>Part Two: 7 minutes</li>
        <li>Part Three: 10 minutes</li>
        <li>Part Four: 30 minutes</li>
      </ul>

      <p>When you click on the 'Next' button, the test will begin.</p>

      <div className={styles.footer}>
        <button
          className={styles.nextButton}
          onClick={() => navigate('/part/1')}
        >
          Next
        </button>
      </div>
    </div>
  );
}