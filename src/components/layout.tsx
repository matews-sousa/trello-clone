import React from "react";
import Navbar from "./navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Navbar boardTitle="Title" />
      <main className="container mx-auto mt-10">{children}</main>
    </>
  );
};

export default Layout;
