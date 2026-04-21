import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setWishlist, toggleWishlistItem } from "../features/WishlistSlice"
import { addItem } from "../features/CartSlice"
import API from "../api"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

export default function Wishlist() {

  const dispatch = useDispatch()
  const items = useSelector(state => state.wishlist.items)

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) return

    const fetchWishlist = async () => {
      const res = await API.get("/wishlist/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      dispatch(setWishlist(res.data))
    }

    fetchWishlist()
  }, [])

  const removeFromWishlist = async (product) => {
    await API.post("/wishlist/toggle/", 
      { product_id: product.id },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    dispatch(toggleWishlistItem(product))
    toast("Removed from wishlist")
  }

  const moveToCart = async (product) => {
    try {
      await API.post("/cart/add/", 
        { product_id: product.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      dispatch(addItem(product))
      dispatch(toggleWishlistItem(product))

      toast.success("Moved to cart 🛒")

    } catch {
      toast.error("Error moving to cart")
    }
  }

  if (!items.length) {
    return (
      <div className="container text-center my-5">
        <h3>Your wishlist is empty 🤍</h3>
        <Link to="/shop" className="btn btn-dark mt-3">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container my-5">

      <h3 className="mb-4">Your Wishlist ❤️</h3>

      <div className="row">
        {items.map(item => {

          const product = item.product

          return (
            <div className="col-md-3 mb-4" key={item.id}>
              <div className="card h-100">

                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    className="img-fluid"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </Link>

                <div className="card-body d-flex flex-column">

                <h6 className="fw-semibold text-dark mb-1">
                  {product.name}
                </h6>
                  <p className="text-primary">₹{product.price}</p>

                  <div className="mt-auto d-flex flex-column gap-2">

                    <button
                      className="btn btn-dark"
                      onClick={() => moveToCart(product)}
                    >
                      Move to Cart 🛒
                    </button>

                    <button
                      className="btn btn-outline-danger"
                      onClick={() => removeFromWishlist(product)}
                    >
                      Remove ❌
                    </button>

                  </div>

                </div>

              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}