import { GenericResponse } from "@/utils/types";
import { auth } from "firebase-admin"; // Assuming Firebase Admin SDK is set up
import { DecodedIdToken, UserRecord } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { headers } from "next/headers";
import { AiOutlineConsoleSql } from "react-icons/ai";
import Typesense, { Client } from "typesense";
import ConversationModel from "typesense/lib/Typesense/ConversationModel";

const createResponse = <T>(
  status: number,
  message: string,
  data: T
): GenericResponse<T> => {
  return { status, message, data };
};

const verifyIdToken = async (): Promise<{
  status: number;
  message?: string;
  error?: string;
  content?: DecodedIdToken;
}> => {
  try {
    const token = headers().get("Authorization")?.split("Bearer ")[1];
    if (!token) {
      return {
        status: 403,
        message: "unauthorized",
        error: "Token not provided",
      };
    }

    const decodedToken = await auth().verifyIdToken(token);

    if (!decodedToken) {
      return {
        status: 403,
        message: "unauthorized",
        error: "Token invalid or expired",
      };
    }

    return { status: 200, content: decodedToken, message: "verified" };
  } catch (error: any) {
    console.error(error);
    return {
      status: 403,
      message: "unauthorized",
      error: error.toString(),
    };
  }
};

const checkUesrPermission = (
  permission: string,
  permissions: string[]
): boolean => {
  return permissions.includes(permission);
};
function getTypesenseClient(): Client {
  try {
    const typesense: Client = new Typesense.Client({
      nodes: [
        {
          host: "localhost",
          port: 9090,
          protocol: "http",
        },
      ],
      apiKey: "xyz",
    });
    return typesense;
  } catch (error) {
    throw error;
  }
}

async function typesenseCollectionExists(name: string): Promise<boolean> {
  try {
    const exists = await getTypesenseClient().collections(name).exists();
    if (!exists) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("here is ther errro");
    throw error;
  }
}

export {
  checkUesrPermission,
  createResponse,
  getTypesenseClient,
  verifyIdToken,
  typesenseCollectionExists,
};

//get typesense cleint
