// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
//import { db } from "../firebase";

// TODO: Add SDKs for Firebase products that you want to use.
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXFfNmO3L-ShFRgMMc1K2ko539vF28pLs",
  authDomain: "virtual-classroom-c9dad.firebaseapp.com",
  projectId: "virtual-classroom-c9dad",
  storageBucket: "virtual-classroom-c9dad.firebasestorage.app",
  messagingSenderId: "887333756418",
  appId: "1:887333756418:web:08d65a9c467fb69931511b",
  measurementId: "G-DKHH4J3PE2"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export {auth, db}