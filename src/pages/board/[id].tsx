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
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import DroppableList from "@/components/droppable-list";
import { insertAtIndex, removeAtIndex, arrayMove } from "@/utils/array";
import { IBoard, IItem, IList } from "@/types/IBoard";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AddButton from "@/components/add-button";
import find from "@/utils/find";
import Item from "@/components/item";

type BoardState = Omit<IBoard, "lists">;

const BoardPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeItem, setActiveItem] = useState<IItem | null | undefined>(null);
  const [board, setBoard] = useState<BoardState>();
  const [lists, setLists] = useState<IList[] | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const q = doc(db, "boards", id as string);
    const unsub = onSnapshot(q, (doc) => {
      if (doc.exists()) {
        const _board: BoardState = {
          id: doc.id,
          title: doc.data()?.title,
          createdAt: doc.data()?.createdAt,
          cover: doc.data()?.cover,
        };
        setBoard(_board);
        setLists(doc.data()?.lists);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsub();
  }, [id]);

  useEffect(() => {
    if (!lists) return;
    updateLists(lists);
  }, [lists]);

  const addList = async (inputValue: string) => {
    const newList = {
      id: uuidv4(),
      title: inputValue,
      items: [],
    };
    const docRef = doc(db, "boards", id as string);
    await updateDoc(docRef, {
      lists: lists ? [...lists, newList] : [newList],
    });
  };

  const updateLists = async (lists: IList[]) => {
    const docRef = doc(db, "boards", id as string);
    await updateDoc(docRef, {
      lists,
    });
  };

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
    setActiveItem(null);
  };

  return (
    <Layout boardTitle={board?.title}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-start gap-10 px-10 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-600 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {lists &&
            lists?.map((list) => (
              <DroppableList
                key={list.id}
                list={list}
                addFn={async (inputValue: string) => {
                  const newItem = {
                    id: uuidv4(),
                    title: inputValue,
                  };
                  const docRef = doc(db, "boards", id as string);
                  await updateDoc(docRef, {
                    lists: lists.map((_list) => {
                      if (_list.id === list.id) {
                        return {
                          ..._list,
                          items: [..._list.items, newItem],
                        };
                      }
                      return _list;
                    }),
                  });
                }}
              />
            ))}
          <AddButton
            btnText={"Add another list"}
            inputPlaceholder={"Enter a title..."}
            addFn={addList}
          />
        </div>
        <DragOverlay>
          {activeItem ? <Item item={activeItem} key={activeItem.id} /> : null}
        </DragOverlay>
      </DndContext>
    </Layout>
  );
};

export default BoardPage;
