export interface IItem {
  id: string;
  title: string;
  description: string;
}

export interface IList {
  items: IItem[];
}

export interface IBoard {
  [key: string]: IItem[];
}
