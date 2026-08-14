import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getDatabase, type Database } from 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const isFirebaseConfigValid = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.trim().length > 0
)

let firebaseApp: FirebaseApp | undefined

if (isFirebaseConfigValid) {
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
}

export const isFirebaseConfigured = Boolean(firebaseApp)
export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null
export const rtdb: Database | null = firebaseApp ? getDatabase(firebaseApp) : null

export default firebaseApp ?? null
