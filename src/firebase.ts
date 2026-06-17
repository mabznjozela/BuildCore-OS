import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCp7L1w3_sDRxj1-fSVyUBIZnpV2FHHJP0",
  authDomain: "ardent-fuze-7tn3v.firebaseapp.com",
  projectId: "ardent-fuze-7tn3v",
  storageBucket: "ardent-fuze-7tn3v.firebasestorage.app",
  messagingSenderId: "1049961621196",
  appId: "1:1049961621196:web:fe61cfe211c7594eecc469"
};

const databaseId = "ai-studio-6d4b7cd2-cb8d-4dd6-b0f7-69485cdd024c";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
export const db = getFirestore(app, databaseId);
