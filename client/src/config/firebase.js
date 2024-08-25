// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

/* To work on this project in the future, you'll have to make your own firebase account and replace this firebaseConfig
as well as the API KEY
*/
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "buyword-54579.firebaseapp.com",
  projectId: "buyword-54579",
  storageBucket: "buyword-54579.appspot.com",
  messagingSenderId: "93675993422",
  appId: "1:93675993422:web:3ccfa8cb65c89cc7b5461f",
  measurementId: "G-L4LWVBBJZS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
