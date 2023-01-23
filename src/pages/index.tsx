import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import AddBoardModal from "@/components/add-board-modal";
import Link from "next/link";
import { IBoard } from "@/types/IBoard";

export default function Home() {
  const { user } = useAuth();
  const [boards, setBoards] = useState<IBoard[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "boards"),
      where("ownerId", "==", user?.uid),
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      const boards = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setBoards(boards as IBoard[]);
    });
    return () => unsub();
  }, []);

  return (
    <Layout>
      <div className="px-10">
        <header className="flex justify-between">
          <h1 className="text-3xl font-semibold">All Boards</h1>
          <AddBoardModal />
        </header>
        <div className="flex gap-6 mt-6">
          {boards.map((board) => (
            <Link
              href={`/board/${board.id}`}
              key={board.id}
              className="bg-white shadow-md rounded-xl p-4 w-72"
            >
              <img
                src={board.cover}
                alt=""
                className="rounded-xl w-full h-40 object-cover"
              />
              <h2 className="text-xl font-semibold mt-4">{board.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
