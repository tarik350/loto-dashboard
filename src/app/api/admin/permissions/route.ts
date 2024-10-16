import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "../../helper/apiHelper";
import { getAuth } from "firebase-admin/auth";
import { getUserWithEmailFromFirestore } from "@/repository/userRepository";
import { getFirestore } from "firebase-admin/firestore";
import { PermissionDto } from "@/utils/dto/permissionDto";
import { firestore } from "firebase-admin";
import initAdmin from "@/utils/firebase/adminConfig";

export async function POST(request: NextRequest) {
  try {
    initAdmin();
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

    // const user = await getAuth().getUser(decoded.content?.uid!);
    // const firestoreUserData = await getUserWithEmailFromFirestore(user);
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
        content: (await res.get()).data() as PermissionDto,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
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
    initAdmin();

    const res = await getFirestore().collection("permissions").get();
    const permissions: PermissionDto[] = [];
    res.docs.forEach((item) => {
      const name = item.data().name;
      const category = item.data().category;
      const id = item.data().id;
      const createdAt = item.data()?.createdAt;
      const updatedAt = item.data()?.updatedAt;
      const description = item.data()?.description;
      permissions.push({
        name,
        category,
        id,
        createdAt,
        updatedAt,
        description: description ?? "",
      });
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
export async function DELETE(request: NextRequest) {
  try {
    initAdmin();
    const decoded = await verifyIdToken();
    if (decoded.status === 403) {
      return NextResponse.json(decoded, { status: 403 });
    }
    //todo
    //because this is a repititve task replace this with a helper function
    //the function takes the uid and the permission required to access this resource
    //ADMIN_GET_PERMISSIONS for this particualr resource
    //the function will take the user id and get the user from firestore
    //once it gets the user it checks if the user got the permission or not
    //returns with a boolean
    //we check the boolean if false we return 403 with permission error message
    //otherwise we continue

    // const user = await getAuth().getUser(decoded.content?.uid!);
    // const firestoreUserData = await getUserWithEmailFromFirestore(user);

    // const { id } = await request.json();
    const { ids } = await request.json();
    const isIdArray = Array.isArray(ids);

    //if id is not provided or if it is an array and its empty
    if (!ids || (isIdArray && ids.length === 0)) {
      return NextResponse.json(
        {
          status: 400,
          message: "Invalid input. Provide an array of IDs.",
        },
        { status: 400 }
      );
    }
    await getFirestore().runTransaction(async () => {
      if (isIdArray) {
        for (const id of ids) {
          await getFirestore().doc(`permissions/${id}`).delete();
        }
      } else {
        await getFirestore().doc(`permissions/${ids}`).delete();
      }
    });

    return NextResponse.json(
      { status: 200, message: "permission deleted successfully", content: ids },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 500,
        message: "unknown error occured while processing your request",
        error: error.toString(),
      },
      { status: 500 }
    );
  }
}
