import { useEffect, useState, useRef, useMemo } from "react"
import API from "../api"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { removeItem } from "../features/CartSlice"
import { useCartDrawer } from "../context/CartDrawerContext"

export default function OffcanvasCart() {

  const [cartItems, setCartItems] = useState([])
  const { open, setOpen } = useCartDrawer()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const tokenRef = useRef(localStorage.getItem("token"))

  // =========================
  // OPEN CART (GLOBAL EVENT)
  // =========================
  useEffect(() => {
    if (open) {
      fetchCart()
    }
  }, [open])

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = async () => {
    try {
      if (!tokenRef.current) {
        setCartItems([])
        return
      }

      const res = await API.get("/cart/", {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`
        }
      })

      setCartItems(res.data)

    } catch (err) {
      console.log(err)
    }
  }

  // =========================
  // REMOVE ITEM
  // =========================
  const handleRemove = async (productId) => {
    try {
      await API.post(
        "/cart/delete/",
        { product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${tokenRef.current}`
          }
        }
      )

      dispatch(removeItem(productId))
      setCartItems(prev => prev.filter(i => i.product.id !== productId))

    } catch (err) {
      console.log(err)
    }
  }

  // =========================
  // TOTAL
  // =========================
  const total = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  }, [cartItems])

  // =========================
  // CLOSE
  // =========================
  const closeCart = () => setOpen(false)

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          onClick={closeCart}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1040
          }}
        />
      )}

      {/* DRAWER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: open ? 0 : "-400px",
          width: "350px",
          height: "100%",
          background: "#fff",
          zIndex: 1050,
          transition: "0.3s ease",
          overflowY: "auto",
          boxShadow: "-2px 0 10px rgba(0,0,0,0.1)"
        }}
      >
        <div className="p-3">

          <button
            className="btn-close float-end"
            onClick={closeCart}
          ></button>

          <h4 className="mb-3">Your Cart ({cartItems.length})</h4>

          <ul className="list-group mb-3">

            {cartItems.length === 0 && (
              <li className="list-group-item text-center">
                Cart is empty
              </li>
            )}

            {cartItems.map(item => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between"
              >
                <div>
                  <h6>{item.product.name}</h6>
                  <small>Qty: {item.quantity}</small>
                </div>

                <div>
                  ₹{item.product.price * item.quantity}

                  <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={(e) => {
                    e.stopPropagation()   // ✅ VERY IMPORTANT
                    handleRemove(item.product.id)
                  }}
                >
                  🗑
                </button>
                </div>
              </li>
            ))}

            {cartItems.length > 0 && (
              <li className="list-group-item d-flex justify-content-between">
                <b>Total</b>
                <b>₹{total}</b>
              </li>
            )}

          </ul>

          <button
            className="btn btn-dark w-100"
            onClick={() => {
              closeCart()
              navigate("/cart")
            }}
          >
            View Full Cart
          </button>

        </div>
      </div>
    </>
  )
}