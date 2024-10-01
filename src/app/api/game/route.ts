import {
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

import { CreateGameCategoryResponseDto } from "@/utils/dto/createGameCategoryDto";
import { GameRequestDto } from "@/utils/dto/gameDto";
import { db } from "@/utils/firebaseConfig";
import { GenericResponse } from "@/utils/types";

import { createResponse } from "../apiHelper";

//POST HANDLER
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body

    const data: GameRequestDto = await request.json();

    const docRef: DocumentReference = doc(collection(db, "games"));

    //todo
    //get game category with the id
    //get number of ticket from response dto
    //create a list of Ticketnumberdto for range 1 - number of tickets
    //create a game with the id and the list of tickte number dto as requets payload

    //not get like this rather there is a way to get that value only ( ticket count)

    //eager loading => in firebase read about it
    // const gameCategory = await getDoc(
    //   doc(collection(db, "gamecategories", data.gameCategoryId))
    // );

    // const querySnapshot: CreateGameCategoryResponseDto =
    //   gameCategory.data() as CreateGameCategoryResponseDto;

    // Store the data in Firestore
    await setDoc(docRef, { ...data, id: docRef.id });

    // Return success response
    const response: GenericResponse<Record<string, any>> = {
      status: 201,
      message: "Game category created successfully",
      content: { gameId: docRef.id },
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
