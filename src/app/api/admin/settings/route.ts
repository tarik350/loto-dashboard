import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "../../helper/apiHelper";
import { getUserWithEmailFromFirestore } from "@/repository/userRepository";
import { getAuth } from "firebase-admin/auth";
import { getAdminSettings } from "@/repository/settingRepository";

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyIdToken();
    if (decoded.status === 403) {
      return NextResponse.json(decoded, { status: 403 });
    }
    const user = await getAuth().getUser(decoded.content?.uid!);
    // const firestoreUserData = await getUserWithEmailFromFirestore(user);
    const settings = await getAdminSettings();
    return NextResponse.json(
      {
        status: 200,
        content: settings,
        message: "success",
      },
      { status: 200 }
    );
    // if (firestoreUserData.permissions.includes("ADMIN_SETTING_GET")) {
    // }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
        error: error.toString(),
      },
      { status: 500 }
    );
  }
}
