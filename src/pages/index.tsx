import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth, User } from "@/contexts/AuthContext";
import AddBoardModal from "@/components/add-board-modal";
import { IBoard } from "@/types/IBoard";
import getDocsFromArrayOfIds from "@/utils/getDocsFromArrayOfIds";
import getDocData from "@/utils/getDocData";
import BoardCard from "@/components/board-card";

export default function Home() {
  const { user } = useAuth();
  const [myBoards, setMyBoards] = useState<IBoard[]>([]);
  const [memberBoards, setMemberBoards] = useState<IBoard[]>([]);

  useEffect(() => {
    if (!user) return;
    const qMyBoards = query(
      collection(db, "boards"),
      where("ownerId", "==", user?.id),
    );
    const unsubMyBoards = onSnapshot(qMyBoards, async (querySnapshot) => {
      const _boards = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const members = await getDocsFromArrayOfIds<User>(
            "users",
            doc.data().membersIds,
          );
          const owner = await getDocData<User>("users", doc.data().ownerId);
          return {
            id: doc.id,
            ...doc.data(),
            members,
            owner,
          } as IBoard;
        }),
      );
      setMyBoards(
        _boards.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf()),
      );
    });

    const qMemberBoards = query(
      collection(db, "boards"),
      where("membersIds", "array-contains", user?.id),
    );
    const unsubMemberBoards = onSnapshot(
      qMemberBoards,
      async (querySnapshot) => {
        const _boards = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const members = await getDocsFromArrayOfIds<User>(
              "users",
              doc.data().membersIds,
            );
            const owner = await getDocData<User>("users", doc.data().ownerId);
            return {
              id: doc.id,
              ...doc.data(),
              members,
              owner,
            } as IBoard;
          }),
        );
        setMemberBoards(
          _boards.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf()),
        );
      },
    );
    return () => {
      unsubMyBoards();
      unsubMemberBoards();
    };
  }, []);

  return (
    <Layout>
      <div className="px-10 py-10">
        <header className="flex justify-between">
          <h1 className="text-3xl font-semibold">My Boards</h1>
          <AddBoardModal />
        </header>
        <div className="flex flex-wrap gap-6 mt-6">
          {myBoards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
        {memberBoards.length > 0 && (
          <header>
            <h1 className="text-3xl font-semibold mt-10">
              Boards that you are member
            </h1>
          </header>
        )}
        <div className="flex flex-wrap gap-6 mt-6">
          {memberBoards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
