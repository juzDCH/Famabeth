import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyCwN3PTpkYc_AAHGzzFLQFJWDdppLBzwqU",
  authDomain: "psii-farmabeth365.firebaseapp.com",
  projectId: "psii-farmabeth365",
  storageBucket: "psii-farmabeth365.appspot.com",
  messagingSenderId: "1024363225141",
  appId: "1:1024363225141:web:d67cb18c0cf6b4f5b6117c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 

export {
  auth,
  db,
  storage, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
};
