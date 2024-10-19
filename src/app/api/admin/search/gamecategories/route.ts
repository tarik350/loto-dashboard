import "server-only";
import {
  getTypesenseClient,
  typesenseCollectionExists,
} from "@/app/api/helper/apiHelper";

import initAdmin from "@/utils/firebase/adminConfig";
import { NextRequest, NextResponse } from "next/server";
import { SearchParams } from "typesense/lib/Typesense/Documents";
import {
  deleteTypesenseSchema,
  initTypesense,
  updateTypesenseSchema,
} from "@/app/api/helper/initTypesense";
import { userSchema } from "@/utils/constants";

export async function GET(request: NextRequest) {
  try {
    initAdmin();
    await initTypesense(userSchema);

    const querystring = request.nextUrl.searchParams;

    // Extract query parameters
    const q = querystring.get("q");
    const queryBy = querystring.get("query_by");

    // Check if both are provided
    if (!q || !queryBy) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Both 'q' and 'query_by' query parameters are required.",
        },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = getTypesenseClient();

    const params: SearchParams = {
      query_by: queryBy,
      q,
    };

    const response = await client.collections("gamecategories").retrieve();

    console.log(response.num_documents);

    return NextResponse.json(
      { status: 200, content: response, messaging: "search successful" },

      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        status: 500,
        message: "error while searching",
        error: error.toString(),
      },
      { status: 500 }
    );
  }
}
