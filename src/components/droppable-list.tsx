import React from "react";
import { useDroppable } from "@dnd-kit/core";
import DraggableItem from "./draggable-item";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AddButton from "./add-button";
import { IList } from "@/types/IBoard";
import { HiDotsHorizontal } from "react-icons/hi";
import { Menu } from "@headlessui/react";

interface Props {
  list: IList;
  addFn: (inputValue: string) => void;
  deleteFn: () => void;
}

const DroppableList = ({ list, addFn, deleteFn }: Props) => {
  const { setNodeRef } = useDroppable({
    id: list.id,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">{list.title}</h2>
        <Menu as="div" className="relative">
          <Menu.Button>
            <HiDotsHorizontal />
          </Menu.Button>
          <Menu.Items className="p-2 absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-300 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } group flex rounded-md items-center w-full px-2 py-2`}
                  onClick={deleteFn}
                >
                  Delete this list
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      <div className="mb-6">
        <AddButton
          btnText={"Add another card"}
          inputPlaceholder={"Card title"}
          addFn={addFn}
        />
      </div>
      <SortableContext
        id={list.id}
        items={list.items ? list.items.map((item) => item.id) : []}
        strategy={verticalListSortingStrategy}
      >
        <ul
          ref={setNodeRef}
          className="h-[60vh] flex flex-col gap-2 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-600 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
        >
          {list.items?.map((item) => (
            <DraggableItem key={item.id} item={item} />
          ))}
        </ul>
      </SortableContext>
    </div>
  );
};

export default DroppableList;
