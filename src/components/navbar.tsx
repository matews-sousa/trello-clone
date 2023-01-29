import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import React from "react";
import Avatar from "./avatar";

interface Props {
  boardTitle?: string;
}

const Navbar = ({ boardTitle }: Props) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="px-10 py-6 border-b border-b-gray-300 bg-white flex items-center justify-between fixed top-0 inset-x-0 max-w-screen">
      <Link href="/" aria-label="Home">
        <img src="/Logo.svg" alt="" />
      </Link>
      {boardTitle && (
        <h1 className="text-2xl font-semibold">{boardTitle} Board</h1>
      )}
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
    </nav>
  );
};

export default Navbar;
