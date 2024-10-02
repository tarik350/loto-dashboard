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
import { GameRequestDto, TicketNumberDto } from "@/utils/dto/gameDto";
import { db } from "@/utils/firebaseConfig";
import { GenericResponse } from "@/utils/types";

import { createResponse } from "../apiHelper";
import { gameStatus } from "@/utils/constants";

//POST HANDLER

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const data: { gameCategoryId: string } = await request.json();
    const docRef = doc(collection(db, "games"));

    // Get game category with the ID
    const gameCategoryDoc = await getDoc(
      doc(collection(db, "gamecategories"), data.gameCategoryId)
    );

    //check if game category exists
    if (!gameCategoryDoc.exists()) {
      return NextResponse.json(
        { status: 404, message: "Game category not found" },
        { status: 404 }
      );
    }

    // Get number of tickets from the game category
    const gameCategoryData = gameCategoryDoc.data();
    const numberOfTickets = gameCategoryData.numberOfTicket;

    // Create a list of TicketNumberDto for range 1 - numberOfTickets
    const ticketNumbers: TicketNumberDto[] = Array.from(
      { length: numberOfTickets },
      (_, index) => ({
        id: "", // Placeholder, will be set later
        value: index + 1, // Value represents the ticket number
        status: "free", // Initial status is "free"
      })
    );

    // Store the game data with an additional gameStatus property
    const gameData: {
      gameCategoryId: string;
      id: string;
      gameStatus: gameStatus;
    } = {
      ...data,
      id: docRef.id, // Set the game ID
      gameStatus: "started", // Add the gameStatus property
    };

    // Save the game document
    await setDoc(docRef, gameData);

    // Create sub-collection for ticket numbers
    const ticketCollectionRef = collection(docRef, "ticketNumbers");
    const ticketPromises = ticketNumbers.map(async (ticket, index) => {
      const ticketDocRef = doc(ticketCollectionRef); // Create a document reference
      ticket.id = ticketDocRef.id; // Set the ID for the ticket number
      return setDoc(ticketDocRef, ticket); // Save the ticket number document
    });

    // Wait for all ticket documents to be written
    await Promise.all(ticketPromises);

    // Return success response
    const response = {
      status: 201,
      message: "Game created successfully",
      content: { gameId: docRef.id },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error creating game:", error);

    // Return error response
    const response = {
      status: 500,
      message: "Failed to create game",
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
