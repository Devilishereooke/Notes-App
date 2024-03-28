// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore,collection } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-Io98GoEyuGUUKy2SsCyLi7KGM32OIP0",
  authDomain: "react-notes-4c6ad.firebaseapp.com",
  projectId: "react-notes-4c6ad",
  storageBucket: "react-notes-4c6ad.appspot.com",
  messagingSenderId: "629181898225",
  appId: "1:629181898225:web:e33b093cc314940a71f850",
  measurementId: "G-GF3GS3Z7BE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");