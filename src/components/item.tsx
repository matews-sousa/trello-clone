import { IItem } from "@/types/IBoard";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  item: IItem;
  isDragging?: boolean;
  dragOverlay?: boolean;
}

const Item = ({ item, isDragging, dragOverlay }: Props) => {
  const { asPath } = useRouter();

  return (
    <Link
      href={{
        pathname: asPath,
        query: { item_id: item.id },
      }}
      className={`inline-block w-64 p-2 bg-white rounded-md shadow-md hover:bg-gray-100 ${
        isDragging &&
        "bg-blue-400 text-transparent bg-opacity-50 border-2 border-dashed border-blue-700"
      } ${dragOverlay && "rotate-3"}`}
      style={{
        cursor: dragOverlay ? "grabbing" : "pointer",
      }}
    >
      <h3 className="text-lg">{item.title}</h3>
    </Link>
  );
};

export default Item;
