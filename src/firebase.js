// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGZuDLneMjrNKfV5lvJyq0jUgYV5EnaWU",
  authDomain: "cryptap-7d8a5.firebaseapp.com",
  projectId: "cryptap-7d8a5",
  storageBucket: "cryptap-7d8a5.firebasestorage.app",
  messagingSenderId: "1037600763065",
  appId: "1:1037600763065:web:680d45f29627c89911bf68",
  measurementId: "G-D32FR0PPJD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);