import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IItem } from "@/types/IBoard";
import Item from "./item";

const DraggableItem = ({ item }: { item: IItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    transition: {
      duration: 150, // milliseconds
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  return (
    <li
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Item item={item} isDragging={isDragging} />
    </li>
  );
};

export default DraggableItem;
