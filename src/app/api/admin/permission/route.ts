import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "../../helper/apiHelper";
import { getAuth } from "firebase-admin/auth";
import { getUserWithEmailFromFirestore } from "@/repository/userRepository";
import { getFirestore } from "firebase-admin/firestore";
import { PermissionDto } from "@/utils/dto/permissionDto";
import { firestore } from "firebase-admin";

export async function POST(request: NextRequest) {
  try {
    //todo
    const decoded = await verifyIdToken();
    if (decoded.status === 403) {
      return NextResponse.json(decoded, { status: 403 });
    }
    const data = await request.json();

    if (!data.name || !data.category) {
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

    const res = await getFirestore()
      .collection("permissions")
      .add({
        ...data,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
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

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyIdToken();
    if (decoded.status === 403) {
      return NextResponse.json(decoded, { status: 403 });
    }
    const user = await getAuth().getUser(decoded.content?.uid!);
    const firestoreUserData = await getUserWithEmailFromFirestore(user);

    const res = await getFirestore().collection("permissions").get();
    const permissions: PermissionDto[] = [];
    res.docs.forEach((item) => {
      const name = item.data().name;
      const category = item.data().category;
      const id = item.data().id;
      const createdAt = item.data()?.createdAt;
      const updatedAt = item.data()?.updatedAt;
      permissions.push({ name, category, id, createdAt, updatedAt });
    });

    return NextResponse.json(
      {
        status: 200,
        message: "fetch successful",
        content: permissions,
      },
      { status: 200 }
    );
  } catch (error) {}
}
