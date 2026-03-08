import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // 1. I-import ang Storage

const firebaseConfig = {
  apiKey: "AIzaSyD5ZIx_bpI_e98doOqMoC7iMqTsziDqsrk",
  authDomain: "tricomplaintsweb.firebaseapp.com",
  projectId: "tricomplaintsweb",
  storageBucket: "tricomplaintsweb.firebasestorage.app",
  messagingSenderId: "230587853162",
  appId: "1:230587853162:web:ecebb22bd8b303ab639d13",
  measurementId: "G-VYLY57D8GF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export ang mga services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app); // 2. I-initialize at i-export ang Storage