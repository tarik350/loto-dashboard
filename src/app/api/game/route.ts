import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

import { CreateGameCategoryResponseDto } from "@/utils/dto/createGameCategoryDto";
import { TicketNumberDto } from "@/utils/dto/gameDto";
import { db } from "@/utils/firebase/firebaseConfig";
import { GenericResponse } from "@/utils/types";

import { gameStatus } from "@/utils/constants";
import { createResponse } from "../helper/apiHelper";

//POST HANDLER

export async function POST(request: NextRequest) {
  try {
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
        // id: "", // Placeholder, will be set later
        id: index + 1,
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
      const ticketDocRef = doc(ticketCollectionRef, ticket.id.toString()); // Create a document reference
      // ticket.id = ticketDocRef.id; // Set the ID for the ticket number
      return setDoc(ticketDocRef, ticket); // Save the ticket number document
    });

    // Wait for all ticket documents to be written
    await Promise.all(ticketPromises);

    // Return success response

    //write the game to typesense

    return NextResponse.json(
      {
        status: 201,
        message: "Game created successfully",
        content: { gameId: docRef.id },
      },
      { status: 201 }
    );
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
