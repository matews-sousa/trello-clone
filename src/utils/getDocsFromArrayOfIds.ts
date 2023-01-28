import getDocData from "./getDocData";

async function getDocsFromArrayOfIds<Type>(
  collection: "users" | "items" | "boards" | "lists",
  array: string[],
): Promise<Type[]> {
  const docs = await Promise.all(
    array.map(async (id) => {
      return await getDocData<Type>(collection, id);
    }),
  );
  return docs;
}

export default getDocsFromArrayOfIds;
