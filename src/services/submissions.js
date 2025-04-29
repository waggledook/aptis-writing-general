// src/services/submissions.js
import {
    collection,
    addDoc,
    doc,
    getDoc
  } from "firebase/firestore";
  import { db } from "../firebase-config";
  
  // reference to your “submissions” collection
  const submissionsCol = collection(db, "submissions");
  
  /**
   * Save a new exam submission.
   * @param {object} answers  the answers object from context
   * @returns {Promise<string>}  the new doc ID
   */
  export async function saveSubmission(answers) {
    // remove any undefined
    const clean = JSON.parse(JSON.stringify(answers));
  
    const payload = {
      answers: clean,
      createdAt: new Date(),  // or serverTimestamp() if you import it
    };
  
    const ref = await addDoc(submissionsCol, payload);
    return ref.id;
  }
  
  /**
   * Load a previously saved submission by ID.
   * @param {string} id
   * @returns {Promise<object>}  the answers object
   */
  export async function loadSubmission(id) {
    const ref = doc(db, "submissions", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      throw new Error("No such submission: " + id);
    }
    const data = snap.data();
    return data.answers;
  }
  