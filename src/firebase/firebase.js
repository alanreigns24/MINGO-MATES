import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhOL-tWgwfYKQ0QcJKTSra5UKkILXpb9M",
  authDomain: "mingo-mates.firebaseapp.com",
  projectId: "mingo-mates",
  storageBucket: "mingo-mates.firebasestorage.app",
  messagingSenderId: "193575382547",
  appId: "1:193575382547:web:7eba35f3431196a30dd9e6",
  measurementId: "G-BF7VJR334F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Setup Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
// Optional: Force account selection prompt every time
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
