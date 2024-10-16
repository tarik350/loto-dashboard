import {
  cert,
  getApps,
  initializeApp,
  ServiceAccount,
} from "firebase-admin/app";
import serviceAccountKey from "../../../serviceAccountKey.json";
import { connectFirestoreEmulator } from "firebase/firestore";

export default function initAdmin() {
  try {
    if (process.env.NEXT_PUBLIC_APP_ENV === "env") {
      process.env["FIRESTORE_EMULATOR_HOST"] =
        process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH;
      process.env["FIREBASE_AUTH_EMULATOR_HOST"] =
        process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH;
    }
    if (getApps().length === 0) {
      initializeApp({
        credential: cert(serviceAccountKey as ServiceAccount),
      });
    } else {
    }
  } catch (e) {
    console.error("Error initializing Firebase Admin:", e);
  }
}
