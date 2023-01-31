import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { IBoard } from "@/types/IBoard";
import { INotification } from "@/types/INotification";
import getDocData from "@/utils/getDocData";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React from "react";
import Avatar from "./avatar";
import { formatDistanceToNow } from "date-fns";

interface Props {
  notification: INotification;
}

const Notification = ({ notification }: Props) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleJoin = async (notification: INotification) => {
    if (!user) return;

    try {
      const board = await getDocData<IBoard>("boards", notification.boardId);
      const newBoard = {
        ...board,
        membersIds: [...board.membersIds, user.id],
      };
      await updateDoc(doc(db, "boards", notification.boardId), newBoard);
      await deleteDoc(doc(db, "notifications", notification.id));
      router.push(`/board/${notification.boardId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeny = async (notification: INotification) => {
    try {
      await deleteDoc(doc(db, "notifications", notification.id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className="grid grid-cols-3">
      <div className="col-span-2">
        <span className="text-gray-500">
          {formatDistanceToNow(new Date(notification.createdAt.toDate()), {
            addSuffix: true,
          })}
        </span>
        <div className="flex items-center space-x-2">
          <Avatar
            photoURL={notification.from.photoURL}
            displayName={notification.from.displayName}
          />
          <p className="text-sm">{notification.message}</p>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 col-span-1">
        {notification.type === "invite" && (
          <>
            <button
              className="text-sm font-medium p-2 rounded-md bg-gray-100 hover:bg-gray-200"
              onClick={() => handleJoin(notification)}
            >
              Join
            </button>
            <button
              className="text-sm font-medium p-2 rounded-md bg-gray-100 hover:bg-gray-200"
              onClick={() => handleDeny(notification)}
            >
              Deny
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default Notification;
