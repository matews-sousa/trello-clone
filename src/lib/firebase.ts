// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAATT4mUQqwZdRYrcVm9Y46N8YJ9kYJTuc",
  authDomain: "trello-clone-3b0fd.firebaseapp.com",
  projectId: "trello-clone-3b0fd",
  storageBucket: "trello-clone-3b0fd.appspot.com",
  messagingSenderId: "698068280641",
  appId: "1:698068280641:web:efd1e764f7813c22d22dc0",
  measurementId: "G-HFTHQNDG8D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
