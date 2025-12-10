import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import UserRoutes from "./routes/userRoutes";
import AdminRoutes from "./routes/adminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {UserRoutes()}
        {AdminRoutes()}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
