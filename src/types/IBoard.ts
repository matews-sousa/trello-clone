export interface IItem {
  id: string;
  title: string;
}

export interface IList {
  id: string;
  title: string;
  items: IItem[];
}

export interface IBoard {
  id: string;
  title: string;
  cover: string;
  createdAt: Date;
}
