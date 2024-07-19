// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBVTCTleGciPx17_Kr15UupUTkT62naDKs",
  authDomain: "buyword-a8012.firebaseapp.com",
  projectId: "buyword-a8012",
  storageBucket: "buyword-a8012.appspot.com",
  messagingSenderId: "129788802044",
  appId: "1:129788802044:web:d947103cc8c8fef5c77879",
  measurementId: "G-7HNVCKSWX7",
  databaseURL: "https://buyword-a8012-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// rememebr to npm install -g firebase-tools to host later on