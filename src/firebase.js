// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDagNSvVPIO-9Ds-Cws32lfBzQyJ-pCYbs",
  authDomain: "educaseindia-4b538.firebaseapp.com",
  projectId: "educaseindia-4b538",
  storageBucket: "educaseindia-4b538.firebasestorage.app",
  messagingSenderId: "279631188023",
  appId: "1:279631188023:web:145fc69944f0e42b4eafb2",
  measurementId: "G-X8XLS06XMF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
