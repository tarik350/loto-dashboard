import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import { getTypesenseClient } from "./apiHelper";

export async function initTypesense(collectionSchema: CollectionCreateSchema) {
  try {
    console.log("creating ");
    const typesense = getTypesenseClient();
    await typesense.collections().create(collectionSchema);
    console.log("SCHEMA CREATED");
  } catch (error) {
    console.log("error");
    throw error;
  }
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
