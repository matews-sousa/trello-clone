import { useAuth, User } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { INotification } from "@/types/INotification";
import getDocData from "@/utils/getDocData";
import { Menu, Popover } from "@headlessui/react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiBell } from "react-icons/hi";
import Avatar from "./avatar";
import Notification from "./notification";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  if (!user) return null;

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("to", "==", user.id),
    );
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const _notifications = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            from: await getDocData<User>("users", doc.data().from),
          } as INotification;
        }),
      );
      setNotifications(_notifications);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="px-10 py-6 border-b border-b-gray-300 bg-white flex items-center justify-between fixed top-0 inset-x-0 max-w-screen">
      <Link href="/" aria-label="Home">
        <img src="/Logo.svg" alt="" />
      </Link>
      <div className="flex items-center gap-4">
        <Popover className="relative">
          <Popover.Button
            aria-label="Notifications"
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-black relative focus:ring-1 focus:ring-gray-400 focus:outline-none"
          >
            <HiBell />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </Popover.Button>
          <Popover.Panel className="absolute -translate-x-2/3 transform top-12 max-w-sm w-screen bg-white ring-1 ring-gray-300 rounded-sm z-50">
            <h4 className="font-medium border-b border-gray-300 p-4">
              Notifications
            </h4>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center p-4">
                No notifications yet
              </p>
            ) : (
              <ul className="space-y-6 p-4">
                {notifications.map((notification) => (
                  <Notification
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </ul>
            )}
          </Popover.Panel>
        </Popover>

        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-2">
            <Avatar photoURL={user?.photoURL} displayName={user?.displayName} />
            <span className="text-gray-800 font-semibold">
              {user?.displayName}
            </span>
          </Menu.Button>
          <Menu.Items className="absolute bg-white ring-1 ring-gray-300 rounded-sm shadow w-32 mt-2">
            <Menu.Item>
              <button
                className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={logout}
              >
                Logout
              </button>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
