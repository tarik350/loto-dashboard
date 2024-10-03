import {
  cert,
  getApps,
  initializeApp,
  ServiceAccount,
} from "firebase-admin/app";
import serviceAccountKey from "../../../serviceAccountKey.json";

export default function initAdmin() {
  try {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert(serviceAccountKey as ServiceAccount),
      });
    }
  } catch (e) {
    console.error("Error initializing Firebase Admin:", e);
  }
}
