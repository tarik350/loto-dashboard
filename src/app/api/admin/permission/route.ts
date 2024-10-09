import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "../../helper/apiHelper";
import { getAuth } from "firebase-admin/auth";
import { getUserWithEmailFromFirestore } from "@/repository/userRepository";
import { getFirestore } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    //todo
    const decoded = await verifyIdToken();
    if (decoded.status === 403) {
      return NextResponse.json(decoded, { status: 403 });
    }
    const data = await request.json();

    console.log(data);
    if (!data.permissionName || !data.permissionCategory) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Permission name and category needs to be provided",
          status: 400,
        },
        { status: 400 }
      );
    }

    const user = await getAuth().getUser(decoded.content?.uid!);
    const firestoreUserData = await getUserWithEmailFromFirestore(user);
    //todo check permission here
    //todo write permission to typesense server for searching

    const res = await getFirestore().collection("permissions").add(data);
    res.update({ id: res.id });

    return NextResponse.json(
      {
        status: 200,
        message: "permission created successfully",
        content: res.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.toString(),
        message: "Unknown error occured",
        status: 500,
      },
      { status: 500 }
    );
  }
}
