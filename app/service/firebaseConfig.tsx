// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqYRI5mXRqGxR6cIwHQbJeF3ZOdVaeW2c",
  authDomain: "tripio-ef511.firebaseapp.com",
  projectId: "tripio-ef511",
  storageBucket: "tripio-ef511.appspot.com",
  messagingSenderId: "981426667033",
  appId: "1:981426667033:web:1f2fc7d82745632d40f488",
  measurementId: "G-D03D87NGGL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
// const analytics = getAnalytics(app);