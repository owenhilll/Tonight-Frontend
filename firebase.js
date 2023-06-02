// Import the functions you need from the SDKs you need
import "firebase/firestore";
import "firebase/auth";
import * as firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAY0UzRxrc5hpJKaUXDz3a8CyErjXZRnNM",
  authDomain: "tonight-5d3d5.firebaseapp.com",
  projectId: "tonight-5d3d5",
  storageBucket: "tonight-5d3d5.appspot.com",
  messagingSenderId: "453837494402",
  appId: "1:453837494402:web:a107d15d2067d11f8e3c9b",
  measurementId: "G-PBYWSJ4R40",
};

let app;
if (firebase.getApps().length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.getApp();
}
// Initialize Firebase
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
