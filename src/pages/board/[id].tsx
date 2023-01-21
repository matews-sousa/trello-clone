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
import { IBoard } from "@/types/IBoard";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import AddButton from "@/components/add-button";

const BoardPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [listsDocId, setListsDocId] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [lists, setLists] = useState<IBoard>({});
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const q = query(collection(db, "lists"), where("boardId", "==", id));
    console.log(q);
    const unsub = onSnapshot(q, async (querySnapshot) => {
      console.log(querySnapshot);
      if (querySnapshot.empty) {
        const newBoard = {
          board: {},
          boardId: id,
        };
        await addDoc(collection(db, "lists"), newBoard);
        return;
      }
      const data = querySnapshot.docs.map((doc) => {
        setListsDocId(doc.id);

        return { ...doc.data() };
      });
      console.log(data[0].board);
      setLists(data[0].board as IBoard);
    });
    return () => unsub();
  }, [id]);

  const handleDragStart = (event: DragStartEvent) =>
    setActiveItemId(event.active.id);
  const handleDragCancel = () => setActiveItemId(null);

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over?.id) return;

    const activeListName = active.data.current?.sortable.containerId;
    const overListName = over.data.current?.sortable.containerId || over.id;

    if (activeListName !== overListName) {
      setLists((prev) => {
        const activeItemIndex = active.data.current?.sortable.index;
        const overItemIndex =
          over.id in prev[overListName]
            ? prev[overListName].length + 1
            : over.data.current?.sortable.index;

        return {
          ...prev,
          [activeListName]: removeAtIndex(
            prev[activeListName],
            activeItemIndex,
          ),
          [overListName]: insertAtIndex(
            prev[overListName],
            overItemIndex,
            prev[activeListName][activeItemIndex],
          ),
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
        over.id in lists[overListName]
          ? lists[overListName].length + 1
          : over.data.current?.sortable.index;

      setLists((prev) => {
        let newLists;
        if (activeListName === overListName) {
          newLists = {
            ...prev,
            [activeListName]: arrayMove(
              prev[activeListName],
              activeItemIndex,
              overItemIndex,
            ),
          };
        } else {
          newLists = {
            ...prev,
            [activeListName]: removeAtIndex(
              prev[activeListName],
              activeItemIndex,
            ),
            [overListName]: insertAtIndex(
              prev[overListName],
              overItemIndex,
              prev[activeListName][activeItemIndex],
            ),
          };
        }
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
            Object.keys(lists)?.map((list) => (
              <DroppableList
                key={list}
                id={list}
                title={list}
                items={lists[list]}
                addFn={async (inputValue) => {
                  const docRef = doc(db, "lists", listsDocId);
                  const newItem = {
                    id: uuidv4(),
                    title: inputValue,
                  };
                  await updateDoc(docRef, {
                    board: {
                      ...lists,
                      [list]: [...lists[list], newItem],
                    },
                  });
                }}
              />
            ))}
          <AddButton
            btnText={"Add another list"}
            inputPlaceholder={"Enter a title..."}
            addFn={async (inputValue: string) => {
              try {
                const docRef = doc(db, "lists", listsDocId);
                await updateDoc(docRef, {
                  board: {
                    ...lists,
                    [inputValue]: [],
                  },
                });
                console.log("Document written with ID: ", docRef.id);
              } catch (e) {
                console.error("Error adding document: ", e);
              }
            }}
          />
        </div>
      </DndContext>
    </Layout>
  );
};

export default BoardPage;
