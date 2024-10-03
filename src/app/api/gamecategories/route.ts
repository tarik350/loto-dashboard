import {
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

import {
  CreateGameCategoryRequestDto,
  CreateGameCategoryResponseDto,
} from "@/utils/dto/createGameCategoryDto";
import { db } from "@/utils/firebase/firebaseConfig";
import { GenericResponse } from "@/utils/types";

import { createResponse, verifyIdToken } from "../helper/apiHelper";
import * as firestore from "firebase-admin/firestore";

//POST HANDLER
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const data: CreateGameCategoryRequestDto = await request.json();

    // Validate the request body
    const {
      title,
      duration,
      winningPrize,
      secondPlacePrize,
      thirdPlacePrize,
      ticketPrice,
      numberOfTicket,
    }: CreateGameCategoryRequestDto = data;

    if (
      !title?.en ||
      !title?.am ||
      !["hourly", "daily", "weekly", "monthly"].includes(duration) ||
      winningPrize == null ||
      secondPlacePrize == null ||
      thirdPlacePrize == null ||
      ticketPrice == null ||
      numberOfTicket == null
    ) {
      const response: GenericResponse<null> = {
        status: 400,
        message: "Invalid request body",
        content: null,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const docRef: DocumentReference = doc(collection(db, "gamecategories"));

    // Store the data in Firestore
    await setDoc(docRef, { ...data, id: docRef.id });

    // Return success response
    const response: GenericResponse<Record<string, any>> = {
      status: 201,
      message: "Game category created successfully",
      content: { gameCategoryId: docRef.id },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error creating game category:", error);

    // Return error response
    const response: GenericResponse<string> = {
      status: 500,
      message: "Failed to create game category",
      content: error.toString(),
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// GET request handler
export async function GET() {
  try {
    // //verify the request token
    // const verificationResponse = await verifyIdToken();
    // if (verificationResponse.status === 403) {
    //   return NextResponse.json(verificationResponse, { status: 403 });
    // }

    // const decodedToken = verificationResponse.content;
    // if (!decodedToken) {
    //   return NextResponse.json(
    //     {
    //       message: "Invalid token",
    //       status: 403,
    //     },
    //     { status: 403 }
    //   );
    // }
    // const user = await firestore
    //   .getFirestore()
    //   .collection("user")
    //   .where("id", "==", decodedToken.uid)
    //   .get();
    // const userData = user.docs[0].data() as UserDto;
    // if (!userData.admin) {
    //   return {
    //     status: 403,
    //     message: "unauthrized | only admin action",
    //   };
    // }

    // //check if user has the premissin to access this resource
    // const permissions = userData.permission;
    // if (!permissions?.includes("MAKE_PAYMENT")) {
    //   return NextResponse.json(
    //     {
    //       status: 403,
    //       messaging: "Permission denied",
    //     },
    //     { status: 403 }
    //   );
    // }
    const querySnapshot = await getDocs(collection(db, "gamecategories"));
    const gameCategories: CreateGameCategoryResponseDto[] = [];

    querySnapshot.forEach((doc) => {
      gameCategories.push({
        id: doc.id,
        title: doc.data().title,
        duration: doc.data().duration,
        winningPrize: doc.data().winningPrize,
        secondPlacePrize: doc.data().secondPlacePrize,
        thirdPlacePrize: doc.data().thirdPlacePrize,
        ticketPrice: doc.data().ticketPrice,
        numberOfTicket: doc.data().numberOfTicket,
      });
    });

    // Return success response with game categories
    return NextResponse.json<GenericResponse<CreateGameCategoryResponseDto[]>>({
      status: 200,
      message: "Game categories retrieved successfully",
      content: gameCategories,
    });
  } catch (error) {
    console.error("Error retrieving game categories:", error);

    // Return error response
    return NextResponse.json<GenericResponse<null>>({
      status: 500,
      message: "Internal server error",
      content: null,
    });
  }
}

//DELETE HANDLER
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    //verify the request token
    const verificationResponse = await verifyIdToken();
    if (verificationResponse.status !== 200) {
      return NextResponse.json(verificationResponse, { status: 403 });
    }

    //check if user has the premissin to access this resource
    const permissions = verificationResponse.content?.permission;
    if (!permissions?.includes("ADMIN_DELETE_GAME_CATEGORY")) {
      return NextResponse.json(
        {
          status: 403,
          messaging: "Permission denied",
        },
        { status: 403 }
      );
    }

    const docRef = doc(db, "gamecategories", id);
    await deleteDoc(docRef);

    return NextResponse.json(
      createResponse<Record<string, string>>(
        200,
        "Game category deleted successfully",
        { id }
      )
    );
  } catch (error: any) {
    return NextResponse.json(
      createResponse<Record<string, any>>(
        500,
        "Failed to delete game category",
        {
          error: error.message,
        }
      )
    );
  }
}

//expermental user dto
interface UserDto {
  admin: boolean;
  permission: string[];
  password: string;
  phone: string;
  username: string;
  id: string;
}
