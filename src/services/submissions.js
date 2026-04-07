import {
  addDoc,
  collection,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase-config';

const submissionsCol = collection(db, 'submissions');

export async function saveSubmission(answers) {
  const clean = JSON.parse(JSON.stringify(answers));
  const payload = {
    answers: clean,
    createdAt: new Date()
  };

  const ref = await addDoc(submissionsCol, payload);
  return ref.id;
}

export async function loadSubmission(id) {
  const ref = doc(db, 'submissions', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error(`No such submission: ${id}`);
  }

  return snap.data().answers;
}
  
