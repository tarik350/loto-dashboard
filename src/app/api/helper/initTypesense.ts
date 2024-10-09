import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import { getTypesenseClient } from "./apiHelper";

export async function initTypesense(collectionSchema: CollectionCreateSchema) {
  const typesense = getTypesenseClient();
  await typesense.collections().create(collectionSchema);
  console.log("SCHEMA CREATED");
}
export async function updateTypesenseSchema(
  collectionName: string,
  collectionSchema: CollectionCreateSchema
) {
  const client = getTypesenseClient();
  await client.collections(collectionName).update(collectionSchema);
}

export async function deleteTypesenseSchema(name: string) {
  const client = getTypesenseClient();
  await client.collections(name).delete();
}
