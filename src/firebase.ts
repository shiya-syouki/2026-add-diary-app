import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOf9sBTKH5nryTbC9D1SlEPb2e2w3pSTc",
  authDomain: "add-practice.firebaseapp.com",
  projectId: "add-practice",
  storageBucket: "add-practice.firebasestorage.app",
  messagingSenderId: "355430734434",
  appId: "1:355430734434:web:40a39c911d1d951e478f3b",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
