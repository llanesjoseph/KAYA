// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration - supports both local env vars and Firebase App Hosting auto-config
const getFirebaseConfig = () => {
  // Try to get config from Firebase App Hosting environment first
  if (typeof window !== 'undefined' && (window as any).FIREBASE_WEBAPP_CONFIG) {
    try {
      const config = JSON.parse((window as any).FIREBASE_WEBAPP_CONFIG);
      console.log('Using Firebase App Hosting config');
      return config;
    } catch (e) {
      console.warn('Failed to parse FIREBASE_WEBAPP_CONFIG:', e);
    }
  }

  // Fallback to environment variables
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
  };

  if (typeof window !== 'undefined') {
    console.log('Using environment variables for Firebase config', {
      hasApiKey: !!config.apiKey,
      hasProjectId: !!config.projectId,
      apiKeyLength: config.apiKey?.length,
      projectId: config.projectId
    });
  }

  return config;
};

let firebaseConfig = getFirebaseConfig();

// Initialize Firebase only on client side or when all config is available
let app: any = null;
let db: any = null;
let auth: any = null;
let storage: any = null;
let analytics: any = null;

// Check build time conditions
const isBuildTime = typeof window === 'undefined' && (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production');
const isStaticGeneration = typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build';

// Initialize Firebase - delay for client-side to allow Firebase App Hosting config to load
const initializeFirebase = () => {
  const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== '' && firebaseConfig.projectId && firebaseConfig.projectId !== '';

  if (typeof window !== 'undefined') {
    console.log('Attempting Firebase initialization', {
      hasValidConfig,
      isBuildTime,
      isStaticGeneration,
      configKeys: Object.keys(firebaseConfig).filter(key => firebaseConfig[key as keyof typeof firebaseConfig])
    });
  }

  if (hasValidConfig && !isBuildTime && !isStaticGeneration) {
    try {
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      db = getFirestore(app);
      auth = getAuth(app);
      storage = getStorage(app);
      analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

      if (typeof window !== 'undefined') {
        console.log('Firebase initialized successfully');
      }
    } catch (error) {
      console.warn('Firebase initialization failed:', error);
      // Reset to null on error
      app = null;
      db = null;
      auth = null;
      storage = null;
      analytics = null;
    }
  } else if (typeof window !== 'undefined') {
    console.warn('Firebase initialization skipped', {
      hasValidConfig,
      isBuildTime,
      isStaticGeneration
    });
  }
};

// Initialize immediately for server-side, delay for client-side
if (typeof window === 'undefined') {
  initializeFirebase();
} else {
  // On client-side, wait for Firebase App Hosting config to be available
  const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== '' && firebaseConfig.projectId && firebaseConfig.projectId !== '';
  if ((window as any).FIREBASE_WEBAPP_CONFIG || hasValidConfig) {
    initializeFirebase();
  } else {
    // Retry initialization after a short delay to allow Firebase App Hosting to inject config
    setTimeout(() => {
      firebaseConfig = getFirebaseConfig();
      const hasUpdatedConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== '' && firebaseConfig.projectId && firebaseConfig.projectId !== '';
      if (hasUpdatedConfig) {
        initializeFirebase();
      }
    }, 100);
  }
}

// Helper function to check if Firebase is initialized and retry if needed
export const ensureFirebaseInitialized = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (auth && db) {
      resolve(true);
      return;
    }

    // If not initialized and we're on client-side, try to initialize again
    if (typeof window !== 'undefined') {
      firebaseConfig = getFirebaseConfig();
      const hasUpdatedConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== '' && firebaseConfig.projectId && firebaseConfig.projectId !== '';

      if (hasUpdatedConfig) {
        initializeFirebase();
      }

      // Check again after potential initialization
      if (auth && db) {
        resolve(true);
      } else {
        // Wait a bit more and try once more
        setTimeout(() => {
          resolve(auth && db ? true : false);
        }, 200);
      }
    } else {
      resolve(false);
    }
  });
};

export { app, db, auth, storage, analytics };