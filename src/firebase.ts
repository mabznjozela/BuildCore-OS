import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const env = import.meta.env;

function requireEnv(name: string): string {
  const value = env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. Copy .env.example to .env.local and fill in the Firebase project values.`,
    );
  }
  return value;
}

const firebaseConfig = {
  apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requireEnv('VITE_FIREBASE_APP_ID'),
};

const databaseId = requireEnv('VITE_FIREBASE_DATABASE_ID');

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
}, databaseId);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
