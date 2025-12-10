import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <Header />
      {/* The Outlet will be replaced by HomePage, AboutPage, etc., based on the URL */}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
