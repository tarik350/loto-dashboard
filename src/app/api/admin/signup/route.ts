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
    initAdmin();
    if (!(await typesenseCollectionExists("users"))) {
      await initTypesense(userSchema);
    }
    const { email, password, username } = await request.json();
    const validation = validateSignupRequestPaylaod(request);
    if (!validation) {
      return NextResponse.json(validation, { status: 400 });
    }
    //todo validate email and passwod
    // if (!email || !password || !username) {
    //   return NextResponse.json(
    //     {
    //       message:
    //         "Please provide all the fields. username , email and password",
    //       error: "Validation error",
    //       status: 400,
    //     },
    //     { status: 400 }
    //   );
    // }
    const userPayload = {
      email: email,
      password: password,
      displayName: username,
      emailVerified: false,
    };

    const transactionResponse = await getFirestore().runTransaction(
      async (t) => {
        const user = await getAuth().createUser(userPayload);
        console.log(user);

        const token = await getAuth().createCustomToken(user.uid, {
          role: "admin",
        });

        const { emailVerified, ...addPayload } = userPayload;
        await getFirestore()
          .collection("admins")
          .add({ ...addPayload, uid: user.uid });
        //add user data to typesesnse
        // const client = getTypesenseClient();
        // const typesenseRes = await client
        //   .collections("users")
        //   .documents()
        //   .create(addPayload);
        // console.log("created");
        // console.log(typesenseRes);

        return NextResponse.json(
          { status: 201, message: "user created successfully", content: token },
          { status: 201 }
        );
      }
    );
    return transactionResponse;
  } catch (error: any) {
    const response = {
      status: 500,
      message: "Intrnal server erorr",

      content: error.toString(),
    };

    return NextResponse.json(response, { status: 500 });
  }
}
