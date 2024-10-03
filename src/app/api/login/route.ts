import { NextRequest, NextResponse } from "next/server";
import "server-only";

import { auth } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import initAdmin from "@/utils/firebase/adminConfig";

initAdmin();
export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();

    //look the user in the db

    const user = await getFirestore()
      .collection("user")
      .where("phone", "==", phone)
      .where("password", "==", password)
      .get();

    if (user.docs.length === 0) {
      return NextResponse.json(
        {
          stauts: 404,
          message: "No user with these credentials",
        },
        { status: 404 }
      );
    }
    // const uid = user.docs[0].data().id;

    //generate token send back the token with the user and permissions
    const userData = user.docs[0].data();

    const token = await auth().createCustomToken(userData.id);

    const response = {
      status: 200,
      message: "login successful",
      user: user.docs[0].data(),
      token,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    const response = {
      status: 500,
      message: "Intrnal server erorr",

      content: error.toString(),
    };

    return NextResponse.json(response, { status: 500 });
  }
}
