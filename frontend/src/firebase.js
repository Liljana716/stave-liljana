// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_D1ojDAelyl-_uHQF3DAQ8OeeGcpgIKY",
  authDomain: "rirs-e50a9.firebaseapp.com",
  projectId: "rirs-e50a9",
  storageBucket: "rirs-e50a9.firebasestorage.app",
  messagingSenderId: "26990108171",
  appId: "1:26990108171:web:bc053dacef12acf14e710e",
  measurementId: "G-B33T7ZL57M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
