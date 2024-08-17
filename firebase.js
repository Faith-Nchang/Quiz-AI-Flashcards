// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore}  from  'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaD31Pzddg3-FDn36Lq46eoVeXrOk-li0",
  authDomain: "flashcards-6c69b.firebaseapp.com",
  projectId: "flashcards-6c69b",
  storageBucket: "flashcards-6c69b.appspot.com",
  messagingSenderId: "337075654123",
  appId: "1:337075654123:web:06ee7a951bd7065255ddae",
  measurementId: "G-1E6XFEBZ73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
export default db;

