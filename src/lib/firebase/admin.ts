import { getApps, initializeApp, getApp, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let app: App;

export function initAdmin() {
  if (getApps().length === 0) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error(
        "Firebase Admin is not configured. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in your environment (see .env.example)."
      );
    }
    if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error(
        "Firebase Admin credentials missing. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in your environment (see .env.example)."
      );
    }
    app = initializeApp({
      projectId,
      credential: cert({
        projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    app = getApp();
  }
  return { app, auth: getAuth(app), db: getFirestore(app) };
}

export function getAdmin() {
  if (!getApps().length) return initAdmin();
  return { app: getApp(), auth: getAuth(getApp()), db: getFirestore(getApp()) };
}

export interface AuthedRequest {
  uid: string;
  email: string | null;
  token: string;
}

/**
 * Verifies the Firebase ID token from the Authorization: Bearer <idToken> header.
 * Returns uid + email, or null when no/invalid token is present.
 */
export async function verifyRequest(
  request: Request,
): Promise<AuthedRequest | null> {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const token = match[1];
  try {
    const { auth } = getAdmin();
    const decoded = await auth.verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? null, token };
  } catch {
    return null;
  }
}

export function getAdminDb() {
  return getAdmin().db;
}
