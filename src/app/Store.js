import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/CartSlice";
import WishlistSliceReducer from "../features/WishlistSlice"

export const Store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist:WishlistSliceReducer  
  }
})