// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUoIUr_-U2nCGAnO3i2IX9N6BV1uBYXg4",
  authDomain: "paraty-boat.firebaseapp.com",
  projectId: "paraty-boat",
  storageBucket: "paraty-boat.firebasestorage.app",
  messagingSenderId: "602918851056",
  appId: "1:602918851056:web:5102dd520dc5af50374d35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;