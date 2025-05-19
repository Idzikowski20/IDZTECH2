
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration - replace with your own project details
const firebaseConfig = {
  apiKey: "AIzaSyC5vfBaB3y2sFgdd3vEtSm_kP6QHdDvShk",
  authDomain: "premiumdigital-2ae43.firebaseapp.com",
  projectId: "premiumdigital-2ae43",
  storageBucket: "premiumdigital-2ae43.appspot.com",
  messagingSenderId: "1073430273022",
  appId: "1:1073430273022:web:43d143d0b3a77ce8bcd48a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
