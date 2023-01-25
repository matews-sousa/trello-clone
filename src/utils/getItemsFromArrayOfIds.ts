import { db } from "@/lib/firebase";
import { IItem } from "@/types/IBoard";
import { doc, getDoc } from "firebase/firestore";

const getItemsFromArrayOfIds = async (itemsIds: string[]): Promise<IItem[]> => {
  const items = await Promise.all(
    itemsIds.map(async (id) => {
      const docRef = doc(db, "items", id);
      const docSnap = await getDoc(docRef);

      return {
        id: docSnap.id,
        title: docSnap.data()?.title,
        cover: docSnap.data()?.cover,
        description: docSnap.data()?.description,
      };
    }),
  );
  return items;
};

export default getItemsFromArrayOfIds;
