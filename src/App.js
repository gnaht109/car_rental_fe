import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import UserRoutes from "./routes/userRoutes";
import AdminRoutes from "./routes/adminRoutes";
import { AuthProvider } from "./context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <BrowserRouter>
          <Routes>
            {UserRoutes()}
            {AdminRoutes()}
          </Routes>
        </BrowserRouter>
      </Elements>
    </AuthProvider>
  );
}

export default App;
