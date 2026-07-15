import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast"; 
import { useCustomerAuth } from "./CustomerAuthContext"; 
import api from "../../services/api"; // <-- Step 1: Backend API import

const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate(); 
  const { isAuthenticated } = useCustomerAuth(); 

  // Add To Cart — Step 2: Converted to async function
  const addToCart = async (product) => {
    // Auth Check
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    // Checking ID + Color + Size combination
    const exists = cart.find(
      (item) =>
        item.id === product.id &&
        item.selectedColor === product.selectedColor &&
        item.selectedSize === product.selectedSize
    );

    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id &&
          item.selectedColor === product.selectedColor &&
          item.selectedSize === product.selectedSize
            ? {
                ...item,
                quantity: item.quantity + (product.quantity || 1), 
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: product.quantity || 1,
        },
      ]);
    }

    // Step 3: Syncing with Backend before success toast
    try {
      await api.post("/api/cart", {
        product_id: product.id,
        quantity: product.quantity || 1,
      });
      console.log("Cart synced to backend");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync cart");
    }

    toast.success("Added to cart"); 
  };

  // Remove Item
  const removeFromCart = (id, color, size) => {
    setCart(
      cart.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
    toast.success("Removed from cart");
  };

  // Increase Quantity
  const increaseQuantity = (id, color, size) => {
    setCart(
      cart.map((item) =>
        item.id === id &&
        item.selectedColor === color &&
        item.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease Quantity
  const decreaseQuantity = (id, color, size) => {
    setCart(
      cart
        .map((item) =>
          item.id === id &&
          item.selectedColor === color &&
          item.selectedSize === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Clear Cart Helper
  const clearCart = () => {
    setCart([]);
  };

  // Save To Local Storage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart, 
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}