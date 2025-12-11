import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  const location = useLocation();
  const hideHeaderOnAuthPages =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideHeaderOnAuthPages && <Header />}
      {/* The Outlet will be replaced by HomePage, AboutPage, etc., based on the URL */}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
