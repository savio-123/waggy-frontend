import { createSlice } from "@reduxjs/toolkit"

const WishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: []
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload
    },
    toggleWishlistItem: (state, action) => {
      const exists = state.items.find(i => i.product.id === action.payload.id)

      if (exists) {
        state.items = state.items.filter(i => i.product.id !== action.payload.id)
      } else {
        state.items.push({ product: action.payload })
      }
    }
  }
})

export const { setWishlist, toggleWishlistItem } = WishlistSlice.actions
export default WishlistSlice.reducer