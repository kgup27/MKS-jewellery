import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // 👈 Step 1: Import added

import "./index.css";
import App from "./App";

import CartProvider from "./customer/context/CartContext";
import { WishlistProvider } from "./customer/context/WishlistContext";
import { CustomerAuthProvider } from "./customer/context/CustomerAuthContext";

import { AuthProvider } from "./admin/context/AuthContext";
import QueryProvider from "./providers/QueryProvider";

import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 👈 Step 2: Wrapped the entire app with GoogleOAuthProvider */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <QueryProvider>
          {/* Admin Authentication */}
          <AuthProvider>
            {/* Customer Authentication */}
            <CustomerAuthProvider>
              <CartProvider>
                <WishlistProvider>
                  
                  <App />

                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 2000,
                    }}
                  />
                  
                </WishlistProvider>
              </CartProvider>
            </CustomerAuthProvider>
          </AuthProvider>
        </QueryProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);