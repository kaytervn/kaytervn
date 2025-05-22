import { createContext, useEffect, useState } from "react";

// Khởi tạo context với giá trị mặc định
export const CartContext = createContext({
  cartItems: [],
  setCartItems: () => {},
  itemCount: 0,
  setItemCount: () => {},
});

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Mảng các mặt hàng trong giỏ
  const [itemCount, setItemCount] = useState(0); // Biến theo dõi số lượng mặt hàng

  useEffect(() => {
    setItemCount(cartItems.length); // Cập nhật itemCount dựa trên số lượng mục trong cartItems
  }, [cartItems]); // Chỉ chạy khi cartItems thay đổi

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, itemCount, setItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
