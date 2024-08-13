// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-9a9ab.firebaseapp.com",
  projectId: "blog-app-9a9ab",
  storageBucket: "blog-app-9a9ab.appspot.com",
  messagingSenderId: "587116783001",
  appId: "1:587116783001:web:b8707743e47f89fa9b1f08",
  measurementId: "G-DDHZL5KC5G",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
