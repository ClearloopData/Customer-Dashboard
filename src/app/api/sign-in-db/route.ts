// src/app/api/sign-in-db/route.ts

import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";

const dbConfig = {
  apiKey: process.env.NEXT_PUBLIC_DB_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_DB_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DB_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_DB_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_DB_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_DB_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_DB_FIREBASE_APP_ID,
};

const dbApp = getApps().find(app => app.name === 'dbApp') || initializeApp(dbConfig, 'dbApp');
const dbAuth = getAuth(dbApp);

export async function GET() {
  try {
    const { user } = await signInWithEmailAndPassword(
      dbAuth,
      process.env.SHARED_ACCESS_EMAIL!,
      process.env.SHARED_ACCESS_PASSWORD!
    );

    const token = await user.getIdToken();
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Shared DB login failed:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
