// src/pages/OpeningPage.jsx
import { useNavigate } from 'react-router-dom';
import styles from './OpeningPage.module.css';
import { useAuthUser } from '../components/AuthGate';
import { WRITING_MOCKS } from '../data/mocks';
import { resetExamTimer } from '../utils/timer';

export default function OpeningPage() {
  const navigate = useNavigate();
  const { user } = useAuthUser();

  const startMock = (mock) => {
    resetExamTimer();
    if (mock.requiresAuth && !user) {
      navigate(`/mock/${mock.id}/sign-in`, {
        state: { from: { pathname: `/mock/${mock.id}/instructions` } }
      });
      return;
    }
    navigate(`/mock/${mock.id}/instructions`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Aptis General Practice Test</h1>
      <p className={styles.subtitle}>Writing</p>

      <div className={styles.infoRow}>
        <div>
          <p className={styles.label}>Number of Questions</p>
          <p className={styles.value}>4</p>
        </div>
        <div>
          <p className={styles.label}>Time Allowed</p>
          <p className={styles.value}>50 min</p>
        </div>
      </div>

      <div className={styles.mockList} aria-label="Available writing mocks">
        {WRITING_MOCKS.map((mock) => (
          <button
            key={mock.id}
            className={styles.mockButton}
            onClick={() => startMock(mock)}
          >
            <span className={styles.mockTitle}>{mock.menuTitle}</span>
            <span className={styles.mockDescription}>{mock.menuDescription}</span>
            <span className={mock.requiresAuth ? styles.lockedTag : styles.openTag}>
              {mock.requiresAuth ? 'Sign in required' : 'Open'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
