import { User } from "@/contexts/AuthContext";

export interface INotification {
  id: string;
  from: User;
  to: string;
  date: Date;
  boardId: string;
  message: string;
}
