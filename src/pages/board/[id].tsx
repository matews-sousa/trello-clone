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
import DroppableList from "@/components/droppable-list";
import { insertAtIndex, removeAtIndex, arrayMove } from "@/utils/array";
import { IBoard, IItem, IList } from "@/types/IBoard";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import AddButton from "@/components/add-button";
import find from "@/utils/find";
import Item from "@/components/item";
import Modal from "@/components/modal";
import { HiOutlineX } from "react-icons/hi";
import ItemDetails from "@/components/item-details";

const BoardPage = () => {
  const router = useRouter();
  const { id, item_id } = router.query;
  const [activeItem, setActiveItem] = useState<IItem | null | undefined>(null);
  const [board, setBoard] = useState<IBoard>();
  const [lists, setLists] = useState<IList[] | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const getItemsFromArrayOfIds = async (
    itemsIds: string[],
  ): Promise<IItem[]> => {
    const items = await Promise.all(
      itemsIds.map(async (id) => {
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);

        return {
          id: docSnap.id,
          title: docSnap.data()?.title,
          cover: docSnap.data()?.cover,
          description: docSnap.data()?.description,
        };
      }),
    );
    return items;
  };

  const getBoardDoc = async (id: string) => {
    const doRef = doc(db, "boards", id);
    const docSnap = await getDoc(doRef);
    if (docSnap.exists()) {
      const board = {
        id: docSnap.id,
        cover: docSnap.data().cover,
        title: docSnap.data().title,
        createdAt: docSnap.data().createdAt,
      } as IBoard;
      setBoard(board);
    }
  };

  useEffect(() => {
    getBoardDoc(id as string);

    const q = query(collection(db, "lists"), where("boardId", "==", id));
    const unsub = onSnapshot(q, async (querySnapshot) => {
      const _lists = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const items = await getItemsFromArrayOfIds(doc.data().itemsIds);
          return {
            id: doc.id,
            title: doc.data().title,
            createdAt: doc.data().createdAt,
            items: items,
          } as IList;
        }),
      );
      setLists(
        _lists.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf()),
      );
    });

    return () => unsub();
  }, [id]);

  useEffect(() => {
    if (!lists) return;
    updateLists(lists);
  }, [lists]);

  const addList = async (inputValue: string) => {
    await addDoc(collection(db, "lists"), {
      boardId: id,
      title: inputValue,
      createdAt: Date.now(),
      itemsIds: [],
    });
  };

  const updateLists = async (lists: IList[]) => {
    if (!lists) return;
    const listsIds = lists.map((list) => list.id);
    const updatedLists = await Promise.all(
      listsIds.map(async (list) => {
        const docRef = doc(db, "lists", list);
        await updateDoc(docRef, {
          itemsIds: lists
            .find((l) => l.id === list)
            ?.items.map((item) => item.id),
        });
      }),
    );
    return updatedLists;
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
        {item_id && (
          <Modal onClose={() => router.push(router.asPath.split("?")[0])}>
            <ItemDetails id={item_id as string} />
          </Modal>
        )}
        <div className="flex items-start gap-10 px-10 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-600 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {lists &&
            lists?.map((list) => (
              <DroppableList
                key={list.id}
                list={list}
                // add item to list
                addFn={async (inputValue: string) => {
                  const newItemdocRef = await addDoc(collection(db, "items"), {
                    title: inputValue,
                    listId: list.id,
                  });
                  const listDocRef = doc(db, "lists", list.id as string);
                  await updateDoc(listDocRef, {
                    itemsIds: [
                      ...list.items.map((item) => item.id),
                      newItemdocRef.id,
                    ],
                  });
                }}
                // delete list
                deleteFn={async () => {
                  const docRef = doc(db, "lists", list.id as string);
                  const listDoc = await getDoc(docRef);
                  if (listDoc.exists()) {
                    const listData = listDoc.data();
                    if (listData) {
                      const itemsIds = listData.itemsIds;
                      itemsIds.forEach(async (itemId: string) => {
                        await deleteDoc(doc(db, "items", itemId));
                      });
                    }
                  }
                  await deleteDoc(doc(db, "lists", list.id as string));
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
          {activeItem ? (
            <Item item={activeItem} key={activeItem.id} dragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Layout>
  );
};

export default BoardPage;
