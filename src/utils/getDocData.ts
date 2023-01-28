import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

async function getDocData<Type>(
  collection: "users" | "items" | "boards" | "lists",
  docId: string,
): Promise<Type> {
  const docRef = doc(db, collection, docId);
  const docSnap = await getDoc(docRef);

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Type;
}

export default getDocData;
