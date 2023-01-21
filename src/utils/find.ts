import { IList } from "@/types/IBoard";

const find = (array: IList[], id: string) => {
  const item = array.find((item) => item.id === id);
  return item;
};

export default find;
