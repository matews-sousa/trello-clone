import { User } from "@/contexts/AuthContext";

export interface IItem {
  id: string;
  title: string;
  cover?: string;
  description?: string;
}

export interface IList {
  id: string;
  title: string;
  createdAt: Date;
  items: IItem[];
}

export interface IBoard {
  id: string;
  title: string;
  cover: string;
  createdAt: Date;
  ownerId: string;
  members: User[];
  owner?: User;
}
