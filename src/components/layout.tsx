import React from "react";
import Navbar from "./navbar";

interface Props {
  children: React.ReactNode;
  boardTitle?: string;
}

const Layout = ({ boardTitle, children }: Props) => {
  return (
    <>
      <Navbar boardTitle={boardTitle} />
      <main className=" mx-auto mt-36">{children}</main>
    </>
  );
};

export default Layout;
