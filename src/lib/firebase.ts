// src/lib/firebase.ts
//comment for commit

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from 'firebase/database';

// Auth Project config (used for login)
const authConfig = {
  apiKey: process.env.NEXT_PUBLIC_AUTH_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_AUTH_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_AUTH_FIREBASE_APP_ID,
};

// DB Project config (used for Realtime DB)
const dbConfig = {
  apiKey: process.env.NEXT_PUBLIC_DB_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_DB_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DB_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_DB_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_DB_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_DB_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_DB_FIREBASE_APP_ID,
};

// Initialize apps
const authApp = getApps().find(app => app.name === '[DEFAULT]') || initializeApp(authConfig);
const dbApp = getApps().find(app => app.name === 'dbApp') || initializeApp(dbConfig, 'dbApp');

// Auth for login
export const auth = getAuth(authApp);

// Auth for accessing DB under a shared user
export const dbAuth = getAuth(dbApp);

// Realtime Database
export const database = getDatabase(dbApp);

// Shared DB login (called after login to authApp)
export const signInToSharedDB = async () => {
  try {
    await signInWithEmailAndPassword(
      dbAuth,
      String(process.env.NEXT_PUBLIC_SHARED_ACCESS_EMAIL),
      String(process.env.NEXT_PUBLIC_SHARED_ACCESS_PASSWORD)
    );
    console.log("Signed in to DB as shared-access@carbonapp.com");
  } catch (error) {
    console.error("Failed to sign in to DB as shared user:", error);
    console.log("TRIED", String(process.env.SHARED_ACCESS_EMAIL), " AND ", String(process.env.SHARED_ACCESS_PW))
  }
};

export default authApp;
