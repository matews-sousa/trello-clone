import { IItem } from "@/types/IBoard";
import React from "react";

interface Props {
  item: IItem;
  isDragging?: boolean;
  dragOverlay?: boolean;
}

const Item = ({ item, isDragging, dragOverlay }: Props) => {
  return (
    <div
      className={`w-64 p-2 bg-white rounded-md shadow-md ${
        isDragging &&
        "bg-blue-400 text-transparent bg-opacity-50 border-2 border-dashed border-blue-700"
      }`}
      style={{
        cursor: dragOverlay ? "grabbing" : "grab",
      }}
    >
      <h3 className="text-lg">{item.title}</h3>
    </div>
  );
};

export default Item;
