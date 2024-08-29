// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

/* To work on this project in the future, you'll have to make your own firebase account and replace this firebaseConfig
as well as the API KEY
*/
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "buywordtwo.firebaseapp.com",
  projectId: "buywordtwo",
  storageBucket: "buywordtwo.appspot.com",
  messagingSenderId: "479333057129",
  appId: "1:479333057129:web:eeee986f90e5ff53d018f8",
  measurementId: "G-49ZTSR0JFF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
