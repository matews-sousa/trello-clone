export interface IItem {
  id: string;
  title: string;
  description: string;
}

export interface IList {
  id: string;
  items: IItem[];
}

export interface IBoard {
  [key: string]: IList;
}
