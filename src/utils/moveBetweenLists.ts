import { IList } from "@/types/IBoard";
import { insertAtIndex, removeAtIndex } from "./array";

const moveBetweenLists = (
  list: IList,
  activeList: IList,
  activeListId: string,
  overListId: string,
  activeItemIndex: number,
  overItemIndex: number,
) => {
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
};

export default moveBetweenLists;
