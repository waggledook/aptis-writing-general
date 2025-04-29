// src/pages/OpeningPage.jsx
import { useNavigate } from 'react-router-dom';
import styles from './OpeningPage.module.css';

export default function OpeningPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Aptis Advanced Practice Test</h1>
      <p className={styles.subtitle}>Writing</p>

      <div className={styles.infoRow}>
        <div>
          <p className={styles.label}>Number of Questions</p>
          <p className={styles.value}>3</p>
        </div>
        <div>
          <p className={styles.label}>Time Allowed</p>
          <p className={styles.value}>45 min</p>
        </div>
      </div>

      <button
        className={styles.startButton}
        onClick={() => navigate('/instructions')}
      >
        Start Assessment
      </button>
    </div>
  );
}