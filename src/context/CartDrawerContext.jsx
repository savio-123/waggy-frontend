// src/context/CartDrawerContext.jsx

import { createContext, useContext, useState } from "react"

const CartDrawerContext = createContext()

export const CartDrawerProvider = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <CartDrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </CartDrawerContext.Provider>
  )
}

export const useCartDrawer = () => useContext(CartDrawerContext)