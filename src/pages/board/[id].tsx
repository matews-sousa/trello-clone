import React, { useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  TouchSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import DroppableList from "@/components/droppable-list";
import { insertAtIndex, removeAtIndex, arrayMove } from "@/utils/array";
import { IList } from "@/types/IBoard";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import AddButton from "@/components/add-button";
import find from "@/utils/find";

const BoardPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [lists, setLists] = useState<IList[]>([
    {
      id: uuidv4(),
      title: "To Do",
      items: [
        {
          id: uuidv4(),
          title: "Create a new board",
        },
        {
          id: uuidv4(),
          title: "Add a new list",
        },
      ],
    },
    {
      id: uuidv4(),
      title: "In Progress",
      items: [
        {
          id: uuidv4(),
          title: "Drag and drop items between lists",
        },
        {
          id: uuidv4(),
          title: "Drag and drop lists",
        },
      ],
    },
    {
      id: uuidv4(),
      title: "Done",
      items: [
        {
          id: uuidv4(),
          title: "Create a new board",
        },
        {
          id: uuidv4(),
          title: "Add a new list",
        },
      ],
    },
  ]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) =>
    setActiveItemId(event.active.id);
  const handleDragCancel = () => setActiveItemId(null);

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over?.id) return;

    const activeListId = active.data.current?.sortable.containerId;
    const overListId = over.data.current?.sortable.containerId || over.id;
    const activeList = find(lists, activeListId);
    const overList = find(lists, overListId);

    if (!activeList || !overList) return;

    if (activeListId !== overListId) {
      setLists((prev) => {
        const activeItemIndex = active.data.current?.sortable.index;
        const overItemIndex =
          over.id in overList.items.map((item) => item.id)
            ? overList.items.length + 1
            : over.data.current?.sortable.index;

        const newLists = prev.map((list) => {
          if (list.id === overListId) {
            return {
              ...list,
              items: insertAtIndex(
                list.items,
                overItemIndex,
                activeList.items[activeItemIndex],
              ),
            };
          } else if (list.id === activeListId) {
            return {
              ...list,
              items: removeAtIndex(list.items, activeItemIndex),
            };
          }
          return list;
        });

        return newLists;
      });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      setActiveItemId(null);
      return;
    }

    if (active.id !== over.id) {
      const activeListId = active.data.current?.sortable.containerId;
      const overListId = over.data.current?.sortable.containerId || over.id;
      const activeList = find(lists, activeListId);
      const overList = find(lists, overListId);
      if (!activeList || !overList) return;
      const activeItemIndex = active.data.current?.sortable.index;
      const overItemIndex =
        over.id in overList.items.map((item) => item.id)
          ? overList.items.length + 1
          : over.data.current?.sortable.index;

      setLists((prev) => {
        const newLists = prev.map((list) => {
          if (list.id === overListId) {
            return {
              ...list,
              items: arrayMove(list.items, activeItemIndex, overItemIndex),
            };
          } else {
            if (list.id === overListId) {
              return {
                ...list,
                items: insertAtIndex(
                  list.items,
                  overItemIndex,
                  activeList.items[activeItemIndex],
                ),
              };
            } else if (list.id === activeListId) {
              return {
                ...list,
                items: removeAtIndex(list.items, activeItemIndex),
              };
            }
          }
          return list;
        });
        return newLists;
      });
    }
    setActiveItemId(null);
  };

  return (
    <Layout>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-start gap-10">
          {lists &&
            lists?.map((list) => (
              <DroppableList
                key={list.id}
                id={list.id}
                title={list.title}
                items={list.items}
                addFn={async (inputValue: string) => {
                  return;
                }}
              />
            ))}
          <AddButton
            btnText={"Add another list"}
            inputPlaceholder={"Enter a title..."}
            addFn={async (inputValue: string) => {
              return;
            }}
          />
        </div>
      </DndContext>
    </Layout>
  );
};

export default BoardPage;
