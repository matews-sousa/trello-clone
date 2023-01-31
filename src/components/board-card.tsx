import { IBoard } from "@/types/IBoard";
import Link from "next/link";
import React from "react";
import Avatar from "./avatar";

interface Props {
  board: IBoard;
}

const BoardCard = ({ board }: Props) => {
  return (
    <Link
      href={{
        pathname: `/board/${board.id}`,
        query: { board_title: board.title },
      }}
      key={board.id}
      className="bg-white shadow-md rounded-xl p-4 col-span-1"
    >
      {board.cover && (
        <img
          src={board.cover}
          alt=""
          className="rounded-xl w-full h-40 object-cover"
        />
      )}
      <h2 className="text-xl font-semibold mt-4">{board.title}</h2>
      <div className="mt-4 flex gap-2">
        <Avatar
          photoURL={board.owner?.photoURL}
          displayName={board.owner.displayName}
        />
        {board.members.map(
          (member, i) =>
            i < 3 && (
              <Avatar
                key={member.id}
                photoURL={member.photoURL}
                displayName={member.displayName}
              />
            ),
        )}
        {board.members.length > 3 && (
          <div className="flex items-center justify-center px-2 rounded-md bg-gray-200">
            <span className="text-gray-500">
              +{board.members.length - 3} members
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default BoardCard;
