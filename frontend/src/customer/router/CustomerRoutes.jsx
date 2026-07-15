import { Routes, Route } from "react-router-dom";

import CustomerProtectedRoute from "./CustomerProtectedRoute";

// Public Pages
import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import Product from "../pages/Product/Product";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Collections from "../pages/Collections/Collections";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import NotFound from "../pages/NotFound/NotFound";

// Protected Pages
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import Checkout from "../pages/Checkout/Checkout";
import Profile from "../pages/Profile/Profile";
import MyOrders from "../pages/MyOrders/MyOrders";
import OrderDetails from "../pages/OrderDetails/OrderDetails"; // 👈 Step 1: Import added
import SavedAddress from "../pages/SavedAddress/SavedAddress";

function CustomerRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} /> 
      <Route path="/collections" element={<Collections />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/order-success" element={<OrderSuccess />} />

      {/* Protected Routes */}
      <Route element={<CustomerProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Order Routes */}
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetails />} /> {/* 👈 Step 2: Dynamic Route added */}
        
        <Route path="/saved-address" element={<SavedAddress />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default CustomerRoutes;