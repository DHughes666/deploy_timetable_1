import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB2E514RLYY_NGkTNFqxE0ky1chpjKA2fo",
  authDomain: "timetabla.firebaseapp.com",
  projectId: "timetabla",
  storageBucket: "timetabla.appspot.com",
  messagingSenderId: "303668759823",
  appId: "1:303668759823:web:ed1af99811a68972e6027a",
  measurementId: "G-RHJDNDL1Y7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
