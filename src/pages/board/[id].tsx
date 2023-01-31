import React, { useEffect } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  TouchSensor,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import DroppableList from "@/components/droppable-list";
import { IList } from "@/types/IBoard";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import AddButton from "@/components/add-button";
import Item from "@/components/item";
import Modal from "@/components/modal";
import ItemDetails from "@/components/item-details";
import useLists from "@/hooks/useLists";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import Loader from "@/components/loader";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "@/components/avatar";
import AddMemberModal from "@/components/add-member-modal";

const BoardPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { id, item_id } = router.query;
  const { board, lists, setLists, loading } = useLists(id as string);
  const {
    activeItem,
    handleDragStart,
    handleDragCancel,
    handleDragOver,
    handleDragEnd,
  } = useDragAndDrop(lists, setLists);
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

  useEffect(() => {
    if (!board || !user) return;
    const isOwner = board?.ownerId === user?.id;
    const isMember = board?.members.some((member) => member.id === user?.id);
    if (!loading) {
      if (!isMember && !isOwner) {
        router.push("/");
      }
    }
  }, [loading, board]);

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

  if (loading || !board) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 md:px-10 mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">{board?.title}</h1>
        <div className="flex gap-1">
          <Avatar
            photoURL={board?.owner.photoURL}
            displayName={board?.owner.displayName}
          />
          {board?.members.map((member) => (
            <Avatar
              key={member.id}
              photoURL={member.photoURL}
              displayName={member.displayName}
            />
          ))}
          <AddMemberModal />
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {item_id && (
          <Modal open={true} onClose={() => router.back()}>
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
