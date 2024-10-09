import { SearchParams } from "typesense/lib/Typesense/Documents";
import { getTypesenseClient } from "./apiHelper";

async function searchUsers(query: string, query_by: string | string[]) {
  let searchParameters: SearchParams = {
    q: query,
    query_by,
  };

  const client = getTypesenseClient();

  const result = await client
    .collections("books")
    .documents()
    .search(searchParameters);

  return result;
}
