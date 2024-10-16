import "server-only";

import { NextRequest, NextResponse } from "next/server";

import { getAuth } from "firebase-admin/auth";
import { error } from "console";
import { getFirestore } from "firebase-admin/firestore";
import { validateSignupRequestPaylaod } from "../../helper/validationHelper";
import {
  getTypesenseClient,
  typesenseCollectionExists,
} from "../../helper/apiHelper";
import initAdmin from "@/utils/firebase/adminConfig";
import { initTypesense } from "../../helper/initTypesense";
import { userSchema } from "@/utils/constants";

export async function POST(request: NextRequest) {
  try {
    if (!(await typesenseCollectionExists("users"))) {
      console.log("schema does not exist");
      await initTypesense(userSchema);
    }
  } catch (error) {
    //do nothing
    //probably i did not start the server
    //but in production this should not be possible b/c the item will be created and we can not search it
    //so we return an internal server error
    //indicating a graceful message
  }
  try {
    initAdmin();

    const { email, password, username } = await request.json();
    const validation = validateSignupRequestPaylaod(request);
    if (!validation) {
      return NextResponse.json(validation, { status: 400 });
    }
    // todo validate email and passwod
    if (!email || !password || !username) {
      return NextResponse.json(
        {
          message:
            "Please provide all the fields. username , email and password",
          error: "Validation error",
          status: 400,
        },
        { status: 400 }
      );
    }
    const userPayload = {
      email: email,
      password: password,
      displayName: username,
      emailVerified: false,
    };

    const transactionResponse = await getFirestore().runTransaction(
      async (t) => {
        const user = await getAuth().createUser(userPayload);

        const token = await getAuth().createCustomToken(user.uid);

        const { emailVerified, ...addPayload } = userPayload;
        await getFirestore()
          .collection("admins")
          .add({ ...addPayload, uid: user.uid });
        // add user data to typesesnse
        // const client = getTypesenseClient();
        // const res = await client
        //   .collections("users")
        //   .documents()
        //   .create(addPayload);

        return NextResponse.json(
          { status: 201, message: "user created successfully", content: token },
          { status: 201 }
        );
      }
    );
    return transactionResponse;
  } catch (error: any) {
    console.log(error);
    const response = {
      status: 500,
      message: "Intrnal server erorr",

      content: error.toString(),
    };

    return NextResponse.json(response, { status: 500 });
  }
}
