import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAmyAiz6BnrHdZMFb_oIb1qHVI6jNyUBu4",
  authDomain: "tickerator-bb4cf.firebaseapp.com",
  projectId: "tickerator-bb4cf",
  storageBucket: "tickerator-bb4cf.appspot.com",
  messagingSenderId: "171343846365",
  appId: "1:171343846365:web:7ac38c9a3b34436b3df434",
  measurementId: "G-9F8YPJ358E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);