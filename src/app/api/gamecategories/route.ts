import { NextRequest, NextResponse } from "next/server";
import "server-only";

import {
  CreateGameCategoryRequestDto,
  CreateGameCategoryResponseDto,
} from "@/utils/dto/createGameCategoryDto";
import { GenericResponse } from "@/utils/types";

import { gameCategorySchema } from "@/utils/constants";
import initAdmin from "@/utils/firebase/adminConfig";
import { getAuth } from "firebase-admin/auth";
import * as firestore from "firebase-admin/firestore";
import {
  createResponse,
  getTypesenseClient,
  typesenseCollectionExists,
  verifyIdToken,
} from "../helper/apiHelper";
import { initTypesense } from "../helper/initTypesense";
import { getUserWithEmailFromFirestore } from "@/repository/userRepository";

//POST HANDLER
export async function POST(request: NextRequest) {
  initAdmin();
  if (!(await typesenseCollectionExists("gamecategories"))) {
    await initTypesense(gameCategorySchema);
  }
  //  else {
  //   await deleteTypesenseSchema("gamecategories");
  //   await initTypesense(gameCategorySchema);
  // }

  try {
    const decoded = await verifyIdToken();
    if (decoded.status === 403) {
      return NextResponse.json(decoded, { status: 403 });
    }

    const data: CreateGameCategoryRequestDto = await request.json();

    // Parse the JSON body
    if (!data) {
      return NextResponse.json(
        { messge: "data is empty", status: 400 },
        { status: 400 }
      );
    }
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
      !title ||
      !duration ||
      !winningPrize ||
      !secondPlacePrize ||
      !thirdPlacePrize ||
      !ticketPrice ||
      !numberOfTicket
    ) {
      return NextResponse.json(
        {
          message: "Validation error",
          error:
            "all fields title , duration , winningPrize , secondPlacePrize , thirdPlacePrize , ticketPrice , numberOfTicket are required",
          status: 400,
        },
        { status: 400 }
      );
    }
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

    // Store the data in Firestore

    const payload = {
      ...data,
      // id: docRef.id,
      createdAt: firestore.FieldValue.serverTimestamp(), // Use FieldValue for timestamps
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };
    const docref = await firestore
      .getFirestore()
      .collection("gamecategories")
      .add(payload);
    docref.update({ id: docref.id });

    const client = getTypesenseClient();
    const typesensePayload: TypesenseGameCategoryDto = {
      id: docref.id,
      winningPrize: parseInt(payload.winningPrize.toString(), 10),
      secondPlacePrize: parseInt(payload.secondPlacePrize.toString(), 10),
      thirdPlacePrize: parseInt(payload.thirdPlacePrize.toString(), 10),
      ticketPrice: parseInt(payload.ticketPrice.toString(), 10),
      numberOfTicket: parseInt(payload.numberOfTicket.toString(), 10),
      title_en: payload.title.en,
      title_am: payload.title.am,
      categoryId: docref.id,
      duration: payload.duration,
    };

    await client
      .collections("gamecategories")
      .documents()
      .upsert(typesensePayload);

    return NextResponse.json(
      {
        status: 201,
        message: "Game category created successfully",
        content: { gameCategoryId: docref.id },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);

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
    initAdmin();

    const snapshot = await firestore
      .getFirestore()
      .collection("gamecategories")
      .get();

    const gameCategories: CreateGameCategoryResponseDto[] = [];

    snapshot.forEach((doc) => {
      gameCategories.push({
        id: doc?.id,
        title: doc.data()?.title,
        duration: doc.data()?.duration,
        winningPrize: doc.data()?.winningPrize,
        secondPlacePrize: doc.data()?.secondPlacePrize,
        thirdPlacePrize: doc.data()?.thirdPlacePrize,
        ticketPrice: doc.data()?.ticketPrice,
        numberOfTicket: doc.data()?.numberOfTicket,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
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
    initAdmin();
    const { id } = await req.json();

    //verify the request token
    const decoded = await verifyIdToken();
    if (decoded.status === 403) {
      return NextResponse.json(decoded, { status: 403 });
    }
    if (!decoded.content) {
      return NextResponse.json(
        {
          message: " Invalid token",
          status: 403,
        },
        { status: 403 }
      );
    }
    //get authenticated user
    const user = await getAuth().getUser(decoded.content.uid);

    //get user permissions
    const permissions = await getUserWithEmailFromFirestore(user).then(
      (value) => value.permissions
    );

    //check if user has the premissin to access this resource
    // const permissions = userFirestoreData;
    if (!permissions?.includes("ADMIN_DELETE_GAME_CATEGORY")) {
      return NextResponse.json(
        {
          status: 403,
          messaging: "Permission denied",
        },
        { status: 403 }
      );
    }

    // const docRef = doc(db, "gamecategories", id);

    const res = await firestore
      .getFirestore()
      .doc(`gamecategories/${id}`)
      .delete();

    console.log(res);
    if (res.isEqual(res)) {
      //successfully deleted
      return NextResponse.json(
        createResponse<Record<string, string>>(
          200,
          "Game category deleted successfully",
          { id }
        )
      );
    } else {
      return NextResponse.json(
        { status: 500, message: "error while deleting game category" },
        { status: 500 }
      );
    }
    // await deleteDoc(docRef);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to delete game category",
        error: error.toString(),
        status: 500,
      },
      { status: 500 }
    );
  }
}

interface TypesenseGameCategoryDto {
  id: string;
  title_en: string;
  title_am: string;
  categoryId: string;
  duration: "hourly" | "daily" | "weekly" | "monthly";
  winningPrize: number;
  secondPlacePrize: number;
  thirdPlacePrize: number;
  ticketPrice: number;
  numberOfTicket: number;
  // createdAt: string;
  // updatedAt: string;
}
