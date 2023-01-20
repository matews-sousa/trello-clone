import React, { useState } from "react";
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
import { IBoard } from "@/types/IBoard";

const index = () => {
  const [activeItemId, setActiveItemId] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);
  const [lists, setLists] = useState<IBoard>({
    Todo: {
      id: uuidv4(),
      items: [
        {
          id: uuidv4(),
          title: "Learn React",
          description: "Learn React by building a Kanban board",
        },
        {
          id: uuidv4(),
          title: "Learn TypeScript",
          description: "Learn TypeScript by building a Kanban board",
        },
        {
          id: uuidv4(),
          title: "Learn Next.js",
          description: "Learn Next.js by building a Kanban board",
        },
      ],
    },
    "In Progress": {
      id: uuidv4(),
      items: [
        {
          id: uuidv4(),
          title: "Learn DnD",
          description: "Learn DnD by building a Kanban board",
        },
        {
          id: uuidv4(),
          title: "Learn Tailwind",
          description: "Learn Tailwind by building a Kanban board",
        },
      ],
    },
    Done: {
      id: uuidv4(),
      items: [
        {
          id: uuidv4(),
          title: "Learn GraphQL",
          description: "Learn GraphQL by building a Kanban board",
        },
      ],
    },
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) =>
    setActiveItemId(
      Object.keys(lists).find((list) => list.items === event.active.id),
    );
  const handleDragCancel = () => setActiveItemId(null);

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over?.id) return;

    const activeListName = active.data.current?.sortable.containerId;
    const overListName = over.data.current?.sortable.containerId || over.id;

    if (activeListName !== overListName) {
      setLists((prev) => {
        const activeItemIndex = active.data.current?.sortable.index;
        const overItemIndex =
          over.id in prev[overListName].items
            ? prev[overListName].items.length + 1
            : over.data.current?.sortable.index;

        return {
          ...prev,
          [activeListName]: {
            ...prev[activeListName],
            items: removeAtIndex(prev[activeListName].items, activeItemIndex),
          },
          [overListName]: {
            ...prev[overListName],
            items: insertAtIndex(
              prev[overListName].items,
              overItemIndex,
              prev[activeListName].items[activeItemIndex],
            ),
          },
        };
      });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      setActiveItemId(null);
      return;
    }

    if (active.id !== over.id) {
      const activeListName = active.data.current?.sortable.containerId;
      const overListName = over.data.current?.sortable.containerId || over.id;
      const activeItemIndex = active.data.current?.sortable.index;
      const overItemIndex =
        over.id in lists[overListName].items
          ? lists[overListName].items.length + 1
          : over.data.current?.sortable.index;

      setLists((prev) => {
        let newLists;
        if (activeListName === overListName) {
          newLists = {
            ...prev,
            [activeListName]: {
              ...prev[activeListName],
              items: arrayMove(
                prev[activeListName].items,
                activeItemIndex,
                overItemIndex,
              ),
            },
          };
        } else {
          newLists = {
            ...prev,
            [activeListName]: {
              ...prev[activeListName],
              items: removeAtIndex(prev[activeListName].items, activeItemIndex),
            },
            [overListName]: {
              ...prev[overListName],
              items: insertAtIndex(
                prev[overListName].items,
                overItemIndex,
                prev[activeListName].items[activeItemIndex],
              ),
            },
          };
        }
        return newLists;
      });
    }
    setActiveItemId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-2">
        {Object.keys(lists)?.map((list) => (
          <DroppableList
            key={list}
            id={list}
            title={list}
            items={lists[list].items}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default index;
