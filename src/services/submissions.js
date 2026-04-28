import {
  addDoc,
  collection,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase-config';

const submissionsCol = collection(db, 'submissions');

async function getSubmissionIdentity(user) {
  if (!user?.uid) {
    return null;
  }

  let profile = {};
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    profile = snap.exists() ? snap.data() : {};
  } catch (err) {
    console.warn('Could not load user profile for submission metadata:', err);
  }

  return {
    userId: user.uid,
    userEmail: user.email || profile.email || null,
    displayName: user.displayName || profile.name || '',
    username: profile.username || ''
  };
}

export async function saveSubmission(answers, options = {}) {
  const clean = {
    ...JSON.parse(JSON.stringify(answers)),
    __mockId: options.mockId || 'music-club'
  };
  const basePayload = {
    answers: clean,
    createdAt: new Date()
  };

  const identity = await getSubmissionIdentity(options.user);
  const payload = identity
    ? {
        ...basePayload,
        mockId: options.mockId || 'music-club',
        ...identity
      }
    : basePayload;

  try {
    const ref = await addDoc(submissionsCol, payload);
    return ref.id;
  } catch (err) {
    if (identity && err?.code === 'permission-denied') {
      console.warn('Submission metadata rejected by Firestore rules; retrying without identity fields.');
      const ref = await addDoc(submissionsCol, basePayload);
      return ref.id;
    }
    throw err;
  }
}

export async function loadSubmission(id) {
  const ref = doc(db, 'submissions', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error(`No such submission: ${id}`);
  }

  return snap.data();
}
  
