// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCC5ErXRzTCX7yaePGIhm64DICIHM8gtJE",
  authDomain: "chatapplication-with-cha-fb45a.firebaseapp.com",
  projectId: "chatapplication-with-cha-fb45a",
  storageBucket: "chatapplication-with-cha-fb45a.appspot.com",
  messagingSenderId: "521975282267",
  appId: "1:521975282267:web:f87b53e61e90c9d6fe5d7e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);