import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let db: admin.firestore.Firestore | null = null;

export const getAdminDb = (): admin.firestore.Firestore => {
  if (db) return db;

  if (!admin.apps.length) {
    let serviceAccount: any = null;

    // First try env var
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch (e) {
        console.error('FIREBASE_SERVICE_ACCOUNT is not valid JSON');
      }
    }

    // Next try the legacy path from backend if developing locally
    if (!serviceAccount) {
      const devPath = path.resolve('../backend/immigrants-game-firebase-adminsdk-fbsvc-da4aa4541e.json');
      if (fs.existsSync(devPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(devPath, 'utf8'));
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'dummy-project-id';
      admin.initializeApp({ projectId });
      console.warn('Firebase admin initialized without credentials (using projectId only)');
    }
  }

  db = admin.firestore();
  return db;
};
