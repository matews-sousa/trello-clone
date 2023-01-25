import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import React from "react";

interface Props {
  boardTitle?: string;
}

const Navbar = ({ boardTitle }: Props) => {
  const { user, logout } = useAuth();

  return (
    <nav className="px-10 py-6 border-b border-b-gray-300 bg-white flex items-center justify-between fixed top-0 inset-x-0 max-w-screen">
      <Link href="/" aria-label="Home">
        <img src="/Logo.svg" alt="" />
      </Link>
      {boardTitle && (
        <h1 className="text-2xl font-semibold">{boardTitle} Board</h1>
      )}
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center space-x-4">
          <img
            src={user?.photoURL}
            alt={`${user?.displayName} profile picture`}
            className="w-10 h-10 object-cover rounded-lg"
          />
          <span className="text-gray-800 font-semibold">
            {user?.displayName}
          </span>
        </Menu.Button>
        <Menu.Items className="absolute bg-white ring-1 ring-gray-200 rounded-sm shadow w-44 mt-2">
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
