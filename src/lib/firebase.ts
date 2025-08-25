// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const isMockMode =
  typeof process !== 'undefined' && typeof process.env !== 'undefined'
    ? process.env.NEXT_PUBLIC_MOCK_MODE !== 'false'
    : true;

// Initialize Firebase only when not in mock mode
const app = !isMockMode
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : (null as unknown as import('firebase/app').FirebaseApp);

const db = !isMockMode
  ? getFirestore(app)
  : (null as unknown as ReturnType<typeof getFirestore>);

const auth = !isMockMode
  ? getAuth(app)
  : ({} as unknown as ReturnType<typeof getAuth>);

const storage = !isMockMode
  ? getStorage(app)
  : (null as unknown as ReturnType<typeof getStorage>);

const analytics = !isMockMode && typeof window !== 'undefined'
  ? getAnalytics(app)
  : null;

export { app, db, auth, storage, analytics };
