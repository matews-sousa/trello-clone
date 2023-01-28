import Head from "next/head";
import React from "react";
import Navbar from "./navbar";

interface Props {
  children: React.ReactNode;
  boardTitle?: string;
}

const Layout = ({ boardTitle, children }: Props) => {
  return (
    <>
      <Head>
        <title>Thullo {boardTitle && `| ${boardTitle} Board`}</title>
        <link rel="icon" href="/Logo-small.svg" />
      </Head>
      <Navbar boardTitle={boardTitle} />
      <main className="mx-auto mt-24">{children}</main>
    </>
  );
};

export default Layout;
