import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  auth,
  doPasswordReset,
  doSignIn,
  doSignUp,
  lookupEmailByUsername,
  onAuthChange
} from '../firebase-config';
import { DEFAULT_MOCK_ID, getWritingMock } from '../data/mocks';
import styles from './AuthGate.module.css';

export function useAuthUser() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthChange((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}

export function RequireMockAuth({ mockId, children }) {
  const { user, loading } = useAuthUser();
  const location = useLocation();
  const mock = getWritingMock(mockId);

  if (!mock) {
    return <Navigate to="/" replace />;
  }

  if (!mock.requiresAuth) {
    return children;
  }

  if (loading) {
    return <div className={styles.authPage}>Checking sign in...</div>;
  }

  if (!user) {
    return (
      <Navigate
        to={`/mock/${mockId || DEFAULT_MOCK_ID}/sign-in`}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}

export function SignInPage({ mockId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuthUser();
  const [mode, setMode] = useState('signIn');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [ageConsent, setAgeConsent] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const isSignUp = mode === 'signUp';
  const isReset = mode === 'reset';
  const target = location.state?.from?.pathname || `/mock/${mockId}/instructions`;

  useEffect(() => {
    if (!loading && user) {
      navigate(target, { replace: true });
    }
  }, [loading, navigate, target, user]);

  const switchMode = () => {
    setMode((current) => (current === 'signIn' ? 'signUp' : 'signIn'));
    setError('');
    setNotice('');
    setAgeConsent(false);
  };

  const goToReset = () => {
    setMode('reset');
    setPassword('');
    setError('');
    setNotice('');
  };

  const goToSignIn = () => {
    setMode('signIn');
    setPassword('');
    setError('');
    setNotice('');
    setAgeConsent(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);

    try {
      if (isReset) {
        let emailToUse = identifier.trim();
        if (!emailToUse.includes('@')) {
          const found = await lookupEmailByUsername(emailToUse);
          emailToUse = found || emailToUse;
        }

        if (!emailToUse.includes('@')) {
          setError('Please enter your email address or username.');
          return;
        }

        await doPasswordReset(emailToUse.toLowerCase());
        setNotice("If an account exists for that email, we've sent a password reset link.");
        return;
      }

      if (mode === 'signIn') {
        let emailToUse = identifier.trim();
        if (!emailToUse.includes('@')) {
          const found = await lookupEmailByUsername(emailToUse);
          if (!found) {
            setError('Invalid username or password');
            return;
          }
          emailToUse = found;
        }

        await doSignIn(emailToUse, password);
        navigate(target, { replace: true });
        return;
      }

      if (!ageConsent) {
        setError('Please confirm that you are 14+ or that you have permission from a parent, guardian, school, or teacher.');
        return;
      }

      await doSignUp({
        email: identifier.trim(),
        password,
        name: name.trim(),
        username: username.trim()
      });
      navigate(target, { replace: true });
    } catch (err) {
      if (isReset) {
        setNotice("If an account exists for that email, we've sent a password reset link.");
      } else {
        setError(err?.message || 'Something went wrong.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <p className={styles.kicker}>Photography Club Mock</p>
        <h1 className={styles.authTitle}>
          {isReset ? 'Reset Password' : isSignUp ? 'Create Account' : 'Sign In'}
        </h1>
        <p className={styles.authIntro}>
          This mock uses the same Firebase sign-in as the Aptis grammar tool.
        </p>

        {error && <p className={styles.errorText}>{error}</p>}
        {notice && <p className={styles.successText}>{notice}</p>}

        <form onSubmit={submit} className={styles.authForm}>
          {isSignUp && (
            <>
              <label className={styles.formRow}>
                <span>Name</span>
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
              <label className={styles.formRow}>
                <span>Username</span>
                <input value={username} onChange={(event) => setUsername(event.target.value)} required />
              </label>
            </>
          )}

          <label className={styles.formRow}>
            <span>{isSignUp ? 'Email' : 'Email or Username'}</span>
            <input
              type={isSignUp ? 'email' : 'text'}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              autoComplete={isSignUp ? 'email' : 'username'}
            />
          </label>

          {!isReset && (
            <label className={styles.formRow}>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
            </label>
          )}

          {isSignUp && (
            <label className={styles.consentRow}>
              <input
                type="checkbox"
                checked={ageConsent}
                onChange={(event) => setAgeConsent(event.target.checked)}
                required
              />
              <span>
                I confirm that I am at least 14 years old, or that I am using this
                account with permission from a parent, guardian, school, or teacher.
              </span>
            </label>
          )}

          {!isSignUp && !isReset && (
            <button type="button" className={styles.linkButton} onClick={goToReset}>
              Forgotten your password?
            </button>
          )}

          <button type="submit" className={styles.primaryButton} disabled={busy}>
            {busy ? 'Please wait...' : isReset ? 'Send reset link' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {isReset ? (
          <p className={styles.authSwitch}>
            Remembered it?{' '}
            <button type="button" className={styles.linkButton} onClick={goToSignIn}>
              Back to sign in
            </button>
          </p>
        ) : (
          <p className={styles.authSwitch}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" className={styles.linkButton} onClick={switchMode}>
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
