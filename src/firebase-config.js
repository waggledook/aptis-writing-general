// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const fallbackConfig = {
  apiKey: "AIzaSyCvpE87D16safq68oFB4fJKPyCURsc-mrU",
  authDomain: "examplay-auth.firebaseapp.com",
  projectId: "examplay-auth",
  storageBucket: "examplay-auth.firebasestorage.app",
  messagingSenderId: "654835226958",
  appId: "1:654835226958:web:a95cd8da4adb09c8a5661f",
  measurementId: "G-DMMT8D3XBR",
};

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || fallbackConfig.appId,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
