// app/api/winning-numbers/route.ts

import { NextRequest, NextResponse } from "next/server";

import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { db } from "@/utils/firebase/firebaseConfig";

interface WinningNumbersRequestDto {
  gameId: string;
  videoUrl: string;
  firstPlace: {
    number: number;
    userId: string; // Associated user ID from the ticket owner
  };
  secondPlace: {
    number: number;
    userId: string;
  };
  thirdPlace: {
    number: number;
    userId: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { gameId, videoUrl, firstPlace, secondPlace, thirdPlace } =
      await request.json();

    // Validate incoming data
    if (!gameId || !videoUrl || !firstPlace || !secondPlace || !thirdPlace) {
      return NextResponse.json(
        {
          message:
            "Missing required fields. Please provide gameId, videoUrl, and winning numbers.",
        },
        { status: 400 }
      );
    }

    // Define ticket numbers reference
    const ticketNumbersRef = collection(db, "games", gameId, "ticketNumbers");

    // Function to get user ID from ticket number
    const getUserIdFromTicket = async (ticketNumber: number) => {
      const ticketDocRef = doc(ticketNumbersRef, ticketNumber.toString());
      const ticketDoc = await getDoc(ticketDocRef);
      return ticketDoc.exists() ? ticketDoc.data().ownerId : null; // Return null if not found
    };

    // Get user IDs for winning tickets
    const firstPlaceUserId = await getUserIdFromTicket(firstPlace.number);
    const secondPlaceUserId = await getUserIdFromTicket(secondPlace.number);
    const thirdPlaceUserId = await getUserIdFromTicket(thirdPlace.number);

    // Check if any winning number has an associated user ID
    if (!firstPlaceUserId && !secondPlaceUserId && !thirdPlaceUserId) {
      return NextResponse.json(
        { message: "No winners found for the provided ticket numbers." },
        { status: 404 }
      );
    }

    // Build winning numbers data
    const winningNumbersData: WinningNumbersRequestDto = {
      gameId,
      videoUrl,
      firstPlace: {
        number: firstPlace.number,
        userId: firstPlaceUserId,
      },
      secondPlace: {
        number: secondPlace.number,
        userId: secondPlaceUserId,
      },
      thirdPlace: {
        number: thirdPlace.number,
        userId: thirdPlaceUserId,
      },
    };

    // Create winning numbers document
    const winningNumberRef = doc(collection(db, "winningNumbers"));
    await setDoc(winningNumberRef, winningNumbersData);

    return NextResponse.json(
      { message: "Winning numbers created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating winning numbers:", error);
    return NextResponse.json(
      { message: "Failed to create winning numbers." },
      { status: 500 }
    );
  }
}
