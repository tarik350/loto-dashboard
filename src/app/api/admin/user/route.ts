import "server-only";
import { NextRequest, NextResponse } from "next/server";

import { getAuth, UserRecord } from "firebase-admin/auth";
import initAdmin from "@/utils/firebase/adminConfig";
import {
  checkUesrPermission,
  getUserWithEmailFromFirestore,
  verifyIdToken,
} from "../../helper/apiHelper";
import { getFirestore } from "firebase-admin/firestore";
import { usedDynamicAPIs } from "next/dist/server/app-render/dynamic-rendering";
import { permission } from "process";
import { validateSignupRequestPaylaod } from "../../helper/validationHelper";
import {
  sendEmailVerification,
  signInWithCustomToken,
  signOut,
} from "firebase/auth";
import { auth } from "@/utils/firebase/firebaseConfig";

initAdmin();

//get user information
export async function GET(request: NextRequest) {
  try {
    //verify token
    const verifyResponse = await verifyIdToken();
    if (verifyResponse.status === 403) {
      return NextResponse.json(
        {
          message: "unauthorized",
          status: 403,
        },
        { status: 403 }
      );
    }

    if (!verifyResponse.content) {
      return NextResponse.json(
        {
          message: " Invalid token",
          status: 403,
        },
        { status: 403 }
      );
    }
    const queryStringUid = request.nextUrl.searchParams.get("uid");
    let user: UserRecord;
    //check if the user has permission to access other people's profile
    //if so grant access

    //else if the user does not have permission throw an error saying
    user = await getAuth().getUser(verifyResponse.content.uid);
    const userFirestoreData = await getUserWithEmailFromFirestore(user);

    //get the authenticated user record from firestore
    //check if querystring is set and docs are empty
    //in production this should not happen b/c if a user has a token that means it will be registred on firestore
    if (queryStringUid && userFirestoreData.docs.length === 0) {
      //trying to access ohter people information while not having profile informaiton
      //registered in the firestore
      return NextResponse.json(
        {
          statsu: 403,
          message: "Access denied. user not registered in the firestore",
        },
        { status: 403 }
      );
    }

    const permission: string[] = userFirestoreData.docs[0].data()?.permissions;
    if (permission) {
      if (queryStringUid && permission.includes("ADMIN_GET_USER_PROFILE")) {
        //has permission to access other user profile
        user = await getAuth().getUser(queryStringUid);
      } else if (
        queryStringUid &&
        !permission.includes("ADMIN_GET_USER_PROFILE")
      ) {
        //trying to access user profile without permission
        return NextResponse.json(
          {
            status: 403,
            message:
              "Access denied. you don't have permission to perform this action",
          },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json(
        {
          status: 403,
          message:
            "Access denied. you don't have permission to perform this action",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        message: "Success",
        content: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.toString(),
      },
      { status: 500 }
    );
  }
}

///create admin users based on permissions
//authenticated route
//only user with the permission to create user are allowed to make a request
//other requesting this even though they are authenticated will get an error
export async function POST(request: NextRequest) {
  try {
    const verificationResponse = await verifyIdToken();
    if (verificationResponse.status === 403) {
      return NextResponse.json(verificationResponse, { status: 403 });
    }
    const decodedToken = verificationResponse.content;

    const userData = await getFirestore()
      .collection("admins")
      .where("email", "==", decodedToken?.email)
      .limit(1)
      .get();
    //no user in firestore
    //this should not happen in production
    if (!userData) {
      return NextResponse.json(
        { message: "User not found", status: 404 },
        { status: 404 }
      );
    }
    const permissions: string[] = userData.docs[0].data().permissions;
    if (
      !permissions ||
      !checkUesrPermission("ADMIN_CREATE_USER_PROFILE", permissions)
    ) {
      return NextResponse.json(
        {
          message:
            "Access denied. you don't have permission to perform this action",

          status: 403,
        },
        { status: 403 }
      );
    }

    //validate input
    const validation = validateSignupRequestPaylaod(request);

    const data = await request.json();

    if (validation) {
      return NextResponse.json(validation, { status: 400 });
    }

    //create user
    const response = await getFirestore().runTransaction(async (t) => {
      const credentials = await getAuth().createUser(data);
      const token = await getAuth().createCustomToken(credentials.uid);
      const result = await signInWithCustomToken(auth, token);
      sendEmailVerification(result.user);
      signOut(auth);
      await getFirestore()
        .collection("admins")
        .add({ ...data, uid: credentials.uid });
      return NextResponse.json(
        {
          status: 201,
          messasge: "User created successfully",
        },
        { status: 201 }
      );
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: error.toString() },
      { status: 500 }
    );
  }
}
