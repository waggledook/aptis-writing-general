// src/pages/InstructionsPage.jsx
import { useNavigate } from 'react-router-dom';
import styles from './InstructionsPage.module.css';

export default function InstructionsPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Writing Instructions</h2>
      <p>This test has three parts.</p>
      <p>Total Time: 45 minutes</p>

      <p className={styles.subheading}>Recommended times:</p>
      <ul className={styles.list}>
        <li>Part One: 10 minutes</li>
        <li>Part Two: 15 minutes</li>
        <li>Part Three: 20 minutes</li>
      </ul>

      <div className={styles.footer}>
        <button
          className={styles.nextButton}
          onClick={() => navigate('/part/1')}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
