import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ENV, parsedFirebaseConfig, isFirebaseConfigured } from './env';

const firebaseConfig = {
  apiKey: parsedFirebaseConfig?.apiKey ?? ENV.firebaseApiKey,
  authDomain: parsedFirebaseConfig?.authDomain ?? ENV.firebaseAuthDomain,
  projectId: parsedFirebaseConfig?.projectId ?? ENV.firebaseProjectId,
  storageBucket: parsedFirebaseConfig?.storageBucket ?? ENV.firebaseStorageBucket,
  messagingSenderId:
    parsedFirebaseConfig?.messagingSenderId ?? ENV.firebaseMessagingSenderId,
  appId: parsedFirebaseConfig?.appId ?? ENV.firebaseAppId,
  measurementId: parsedFirebaseConfig?.measurementId ?? ENV.firebaseMeasurementId,
};

let app = null as ReturnType<typeof getApp> | null;
let auth = null as ReturnType<typeof getAuth> | null;
let db = null as ReturnType<typeof getFirestore> | null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization failed. The app will run without Firebase until valid web config values are provided.', error);
    app = null;
    auth = null;
    db = null;
  }
}

const firebaseNotConfiguredMessage =
  'Firebase is not configured. Add a Firebase Web App config to EXPO_PUBLIC_FIREBASE_CONFIG_JSON or the individual EXPO_PUBLIC_FIREBASE_* variables.';

export const getAuthOrThrow = () => {
  if (!auth) throw new Error(firebaseNotConfiguredMessage);
  return auth;
};

export const getDbOrThrow = () => {
  if (!db) throw new Error(firebaseNotConfiguredMessage);
  return db;
};

export { app, auth, db };
