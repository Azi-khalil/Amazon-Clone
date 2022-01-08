// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCA6O3cat9xmVOezgxW3n2RyFkRH4mtuek",
  authDomain: "anteeqa-e8c7d.firebaseapp.com",
  projectId: "anteeqa-e8c7d",
  storageBucket: "anteeqa-e8c7d.appspot.com",
  messagingSenderId: "44279486674",
  appId: "1:44279486674:web:53a68be81cc20e2226b50b",
  measurementId: "G-3BS1F3S0JD",
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();

export { db, auth };