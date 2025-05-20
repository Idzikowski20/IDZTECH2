
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration with the correct API key
const firebaseConfig = {
  apiKey: "AIzaSyBGBbWqNBsSzAPvoX7gY2062V-nOJif6IA",
  authDomain: "idztech-bfeef.firebaseapp.com",
  projectId: "idztech-bfeef",
  storageBucket: "idztech-bfeef.appspot.com",
  messagingSenderId: "535192245227",
  appId: "1:535192245227:web:680958b5cc3bd3d1903fae",
  measurementId: "G-SNPV2N8124"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
