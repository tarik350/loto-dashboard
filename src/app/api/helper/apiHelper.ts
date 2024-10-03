import { GenericResponse } from "@/utils/types";
import { auth } from "firebase-admin"; // Assuming Firebase Admin SDK is set up
import { headers } from "next/headers";
import {
  cert,
  getApps,
  initializeApp,
  ServiceAccount,
} from "firebase-admin/app";
import serviceAccountKey from "../../../../serviceAccountKey.json";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest } from "next/server";

const createResponse = <T>(
  status: number,
  message: string,
  content: T
): GenericResponse<T> => {
  return { status, message, content };
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

export { verifyIdToken, createResponse, checkUesrPermission };
