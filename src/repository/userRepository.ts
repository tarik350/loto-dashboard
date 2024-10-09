import { UserRecord } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

async function getUserWithEmailFromFirestore(
  user: UserRecord
): Promise<Record<string, any>> {
  try {
    const userData = await getFirestore()
      .collection("admins")
      .where("email", "==", user.email)
      .limit(1)
      .get();
    return userData.docs[0].data();
  } catch (error) {
    throw error;
  }
}

export { getUserWithEmailFromFirestore };
