import React from "react";
import { useDroppable } from "@dnd-kit/core";
import DraggableItem from "./draggable-item";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Props {
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    description: string;
  }[];
}

const DroppableList = ({ id, title, items }: Props) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  const style = `
    p-2
    w-72 min-h-screen
    flex flex-col gap-2
    border border-gray-300
    bg-gray-200
  `;

  return (
    <div>
      <h2 className="text-3xl font-semibold">{title}</h2>
      <SortableContext
        id={id}
        items={items ? items.map((item) => item.id) : []}
        strategy={verticalListSortingStrategy}
      >
        <ul ref={setNodeRef} className={style}>
          {items.map((item) => (
            <DraggableItem
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
            />
          ))}
        </ul>
      </SortableContext>
    </div>
  );
};

export default DroppableList;
