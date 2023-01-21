import { IItem } from "@/types/IBoard";
import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";

export const removeAtIndex = (array: IItem[], index: number) => {
  const newArray = new Set([
    ...array.slice(0, index),
    ...array.slice(index + 1),
  ]);
  return Array.from(newArray);
};

export const insertAtIndex = (array: IItem[], index: number, item: IItem) => {
  const newArray = new Set([
    ...array.slice(0, index),
    item,
    ...array.slice(index),
  ]);
  return Array.from(newArray);
};

export const arrayMove = (
  array: IItem[],
  oldIndex: number,
  newIndex: number,
) => {
  const newArray = new Set(dndKitArrayMove(array, oldIndex, newIndex));
  return Array.from(newArray);
};
