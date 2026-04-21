import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: []
}

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    setCart: (state, action) => {
      // ✅ map backend format → redux format
      state.items = action.payload.map(item => ({
        id: item.product.id,
        quantity: item.quantity,
        product: item.product
      }))
    },

    addItem: (state, action) => {
      const existing = state.items.find(
        item => item.id === action.payload.id
      )

      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(
        item => item.id !== action.payload
      )
    },

    clearCart: (state) => {
      state.items = []
    },

    incrementQty: (state, action) => {
      const item = state.items.find(i => i.id === action.payload)
      if (item) item.quantity += 1
    },

    decrementQty: (state, action) => {
      const item = state.items.find(i => i.id === action.payload)

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1
        } else {
          state.items = state.items.filter(i => i.id !== action.payload)
        }
      }
    }

  }
})

export const { 
  setCart,
  addItem,
  removeItem,
  clearCart,
  incrementQty,
  decrementQty 
} = CartSlice.actions

export default CartSlice.reducer