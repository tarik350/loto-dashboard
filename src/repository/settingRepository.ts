import { getFirestore } from "firebase-admin/firestore";

async function getAdminSettings(): Promise<Record<string, any>> {
  try {
    const snapshot = await getFirestore().collection("admin-settings").get();
    const data = snapshot.docs[0].data();
    return data;
  } catch (error) {
    throw error;
  }
}

export { getAdminSettings };
