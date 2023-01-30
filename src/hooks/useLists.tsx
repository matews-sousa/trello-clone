import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { IBoard, IItem, IList } from "@/types/IBoard";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import getDocsFromArrayOfIds from "@/utils/getDocsFromArrayOfIds";
import { User } from "@/contexts/AuthContext";
import getDocData from "@/utils/getDocData";

const useLists = (boardId: string) => {
  const [board, setBoard] = useState<IBoard | null>(null);
  const [lists, setLists] = useState<IList[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!boardId) return;
    const boardDocRef = doc(db, "boards", boardId.split("?")[0]);
    const unsubBoard = onSnapshot(boardDocRef, async (doc) => {
      const members = await getDocsFromArrayOfIds<User>(
        "users",
        doc.data()?.membersIds,
      );
      const owner = await getDocData<User>("users", doc.data()?.ownerId);
      const _board = {
        id: doc.id,
        ...doc.data(),
        members,
        owner,
      } as IBoard;
      setBoard(_board);
    });

    const q = query(
      collection(db, "lists"),
      where("boardId", "==", boardId.split("?")[0]),
    );
    const unsub = onSnapshot(q, async (querySnapshot) => {
      const _lists = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const items = await getDocsFromArrayOfIds<IItem>(
            "items",
            doc.data().itemsIds,
          );
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
    setLoading(false);

    return () => {
      unsubBoard();
      unsub();
    };
  }, [boardId]);

  return {
    board,
    lists,
    setLists,
    loading,
  };
};

export default useLists;
