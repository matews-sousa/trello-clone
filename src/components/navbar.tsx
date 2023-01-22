import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React from "react";

interface Props {
  boardTitle?: string;
}

const Navbar = ({ boardTitle }: Props) => {
  const { user } = useAuth();

  return (
    <nav className="px-10 py-6 border-b border-b-gray-300 bg-white flex items-center justify-between fixed top-0 inset-x-0 max-w-screen">
      <Link href="/" aria-label="Home">
        <img src="/Logo.svg" alt="" />
      </Link>
      {boardTitle && (
        <h1 className="text-2xl font-semibold">{boardTitle} Board</h1>
      )}
      <button className="flex items-center space-x-4">
        <img
          src={user?.photoURL}
          alt=""
          className="w-10 h-10 object-cover rounded-lg"
        />
        <span className="text-gray-800 font-semibold">{user?.displayName}</span>
      </button>
    </nav>
  );
};

export default Navbar;
