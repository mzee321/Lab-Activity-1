// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDk8nQrF4H8knUNNjIRNZ8knlL2D4k3Lo4",
  authDomain: "lab-activity-1-81948.firebaseapp.com",
  projectId: "lab-activity-1-81948",
  storageBucket: "lab-activity-1-81948.appspot.com",
  messagingSenderId: "69811755580",
  appId: "1:69811755580:web:61bcdf45454bb257658139",
  measurementId: "G-LB6B0QKD8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export {db};