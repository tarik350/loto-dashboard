import {
  CreateGameCategoryRequestDto,
  CreateGameCategoryResponseDto,
} from "@/utils/dto/createGameCategoryDto";
import { db } from "@/utils/firebaseConfig";
import { GenericResponse } from "@/utils/types";
import {
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { createResponse } from "../apiHelper";

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

    // Reference to your Firestore collection
    // const docRef: DocumentReference = doc(db, "gamecategory", title.en);
    const docRef: DocumentReference = doc(collection(db, "gamecategory"));

    // Store the data in Firestore
    await setDoc(docRef, data);

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
    const querySnapshot = await getDocs(collection(db, "gamecategory"));
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

    const docRef = doc(db, "gamecategory", id);
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
