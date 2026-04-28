// src/firebase-config.js
import { initializeApp } from "firebase/app";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCvpE87D16safq68oFB4fJKPyCURsc-mrU",
  authDomain: "examplay-auth.firebaseapp.com",
  projectId: "examplay-auth",
  storageBucket: "examplay-auth.firebasestorage.app",
  messagingSenderId: "654835226958",
  appId: "1:654835226958:web:a95cd8da4adb09c8a5661f",
  measurementId: "G-DMMT8D3XBR",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const doSignIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const doSignOut = () => signOut(auth);

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

export async function doSignUp({ email, password, name, username }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;
  const normalizedUsername = (username || '').toLowerCase().trim();

  if (name) {
    await updateProfile(user, { displayName: name });
  }

  await setDoc(
    doc(db, 'users', user.uid),
    {
      email: user.email || email,
      name: name || '',
      username: normalizedUsername,
      role: 'student',
      createdAt: serverTimestamp()
    },
    { merge: true }
  );

  if (normalizedUsername) {
    await setDoc(doc(db, 'usernames', normalizedUsername), {
      email: user.email || email,
      uid: user.uid,
      createdAt: serverTimestamp()
    });
  }

  return user;
}

export function doPasswordReset(email) {
  return sendPasswordResetEmail(auth, email);
}

export async function lookupEmailByUsername(username) {
  const normalizedUsername = (username || '').toLowerCase().trim();
  if (!normalizedUsername) return null;

  const snap = await getDoc(doc(db, 'usernames', normalizedUsername));
  if (!snap.exists()) return null;

  return snap.data()?.email || null;
}
