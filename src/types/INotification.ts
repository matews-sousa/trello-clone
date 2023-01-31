import { User } from "@/contexts/AuthContext";
import { Timestamp } from "firebase/firestore";

export interface INotification {
  id: string;
  from: User;
  to: string;
  createdAt: Timestamp;
  boardId: string;
  message: string;
  type: "invite";
}
