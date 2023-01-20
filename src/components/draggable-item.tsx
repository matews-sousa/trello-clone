import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  id: string;
  title: string;
  description: string;
}

const DraggableItem = ({ id, title, description }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
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
      className={"p-2 border border-gray-300 bg-gray-200"}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "grab",
        scale: isDragging ? 2 : 1,
      }}
    >
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p>{description}</p>
    </li>
  );
};

export default DraggableItem;
