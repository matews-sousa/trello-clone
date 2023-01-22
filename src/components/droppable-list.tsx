import React from "react";
import { useDroppable } from "@dnd-kit/core";
import DraggableItem from "./draggable-item";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AddButton from "./add-button";
import { IItem } from "@/types/IBoard";

interface Props {
  id: string;
  title: string;
  items: IItem[];
  addFn: (inputValue: string) => void;
}

const DroppableList = ({ id, title, items, addFn }: Props) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="mb-6">
        <AddButton
          btnText={"Add another card"}
          inputPlaceholder={"Card title"}
          addFn={addFn}
        />
      </div>
      <SortableContext
        id={id}
        items={items ? items.map((item) => item.id) : []}
        strategy={verticalListSortingStrategy}
      >
        <ul ref={setNodeRef} className="w-72 h-[60vh] flex flex-col gap-2">
          {items?.map((item) => (
            <DraggableItem key={item.id} id={item.id} title={item.title} />
          ))}
        </ul>
      </SortableContext>
    </div>
  );
};

export default DroppableList;
