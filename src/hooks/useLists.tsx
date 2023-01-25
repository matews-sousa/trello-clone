import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { IList } from "@/types/IBoard";
import getItemsFromArrayOfIds from "@/utils/getItemsFromArrayOfIds";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const useLists = (boardId: string) => {
  const [lists, setLists] = useState<IList[] | null>(null);

  useEffect(() => {
    if (!boardId) return;
    const q = query(
      collection(db, "lists"),
      where("boardId", "==", boardId.split("?")[0]),
    );
    const unsub = onSnapshot(q, async (querySnapshot) => {
      const _lists = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const items = await getItemsFromArrayOfIds(doc.data().itemsIds);
          return {
            id: doc.id,
            title: doc.data().title,
            createdAt: doc.data().createdAt,
            items: items,
          } as IList;
        }),
      );
      setLists(
        _lists.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf()),
      );
    });

    return () => unsub();
  }, [boardId]);

  return {
    lists,
    setLists,
  };
};

export default useLists;
