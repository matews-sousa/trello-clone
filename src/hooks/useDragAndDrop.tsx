import React, { useState } from "react";
import { IItem, IList } from "@/types/IBoard";
import find from "@/utils/find";
import moveBetweenLists from "@/utils/moveBetweenLists";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const useDragAndDrop = (
  lists: IList[] | null,
  setLists: React.Dispatch<React.SetStateAction<IList[] | null>>,
) => {
  const [activeItem, setActiveItem] = useState<IItem | null | undefined>(null);

  const handleDragStart = (event: DragStartEvent) => {
    if (!lists) return;
    const activeList = find(
      lists,
      event.active.data.current?.sortable.containerId,
    );
    const item = activeList?.items[event.active.data.current?.sortable.index];

    setActiveItem(item);
  };
  const handleDragCancel = () => setActiveItem(null);

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over?.id || !lists) return;

    const activeListId = active.data.current?.sortable.containerId;
    const overListId = over.data.current?.sortable.containerId || over.id;
    const activeList = find(lists, activeListId);
    const overList = find(lists, overListId);

    if (!activeList || !overList) return;

    if (activeListId !== overListId) {
      setLists((prev) => {
        if (!prev) return prev;
        const activeItemIndex = active.data.current?.sortable.index;
        const overItemIndex =
          over.id in overList.items.map((item) => item.id)
            ? overList.items.length + 1
            : over.data.current?.sortable.index;

        const newLists = prev.map((list) =>
          moveBetweenLists(
            list,
            activeList,
            activeListId,
            overListId,
            activeItemIndex,
            overItemIndex,
          ),
        );
        return newLists;
      });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || !lists) {
      setActiveItem(null);
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
        if (!prev) return prev;
        const newLists = prev.map((list) => {
          if (list.id === overListId) {
            return {
              ...list,
              items: arrayMove(list.items, activeItemIndex, overItemIndex),
            };
          }
          return moveBetweenLists(
            list,
            activeList,
            activeListId,
            overListId,
            activeItemIndex,
            overItemIndex,
          );
        });
        return newLists;
      });
    }
    setActiveItem(null);
  };

  return {
    activeItem,
    handleDragStart,
    handleDragCancel,
    handleDragOver,
    handleDragEnd,
  };
};

export default useDragAndDrop;
