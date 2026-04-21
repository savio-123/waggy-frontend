import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import API from "../api"
import toast from "react-hot-toast"
import { useSelector, useDispatch } from "react-redux"
import { addItem, incrementQty, decrementQty } from "../features/CartSlice"
import { toggleWishlistItem } from "../features/WishlistSlice"
import RelatedProducts from "../components/RelatedProducts"

export default function ProductDetail() {

  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.items)
  const wishlistItems = useSelector(state => state.wishlist.items)

  const [loadingId, setLoadingId] = useState(null)

  // ✅ stable token
  const tokenRef = useRef(localStorage.getItem("token"))

  const fetchData = async () => {
    try {
      setLoading(true)

      const [productRes, reviewRes] = await Promise.all([
        API.get(`/products/${id}/`),
        API.get(`/products/${id}/reviews/`)
      ])

      setProduct(productRes.data)
      setReviews(reviewRes.data)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    if (!tokenRef.current) {
      return toast.error("Login required")
    }

    await API.post(
      `/products/${id}/reviews/`,
      { rating, comment },
      { headers: { Authorization: `Bearer ${tokenRef.current}` } }
    )

    setComment("")
    fetchData()
  }

  const handleWishlist = async (e, product) => {
    e.preventDefault()

    if (!tokenRef.current) return toast.error("Login required")
    if (loadingId === product.id) return

    setLoadingId(product.id)

    try {
      await API.post("/wishlist/toggle/",
        { product_id: product.id },
        { headers: { Authorization: `Bearer ${tokenRef.current}` } }
      )

      const exists = wishlistItems.some(i => i.product.id === product.id)

      dispatch(toggleWishlistItem(product))

      exists
        ? toast("Removed from wishlist")
        : toast.success("Added to wishlist ❤️")

    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoadingId(null)
    }
  }

  const handleAddToCart = async (e, product) => {
    e.preventDefault()

    if (!tokenRef.current) return toast.error("Login required")

    try {
      await API.post(
        "/cart/add/",
        { product_id: product.id },
        { headers: { Authorization: `Bearer ${tokenRef.current}` } }
      )

      dispatch(addItem(product))

    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired")
        localStorage.removeItem("token")
      }
    }
  }

  const handleIncrement = async (e, product) => {
    e.preventDefault()
    dispatch(incrementQty(product.id))

    await API.post("/cart/add/",
      { product_id: product.id },
      { headers: { Authorization: `Bearer ${tokenRef.current}` } }
    )
  }

  const handleDecrement = async (e, product) => {
    e.preventDefault()
    dispatch(decrementQty(product.id))

    await API.post("/cart/remove/",
      { product_id: product.id },
      { headers: { Authorization: `Bearer ${tokenRef.current}` } }
    )
  }

  if (loading) {
    return <h3 className="text-center mt-5">Loading...</h3>
  }

  if (!product) return null

  const cartItem = cartItems.find(i => i.id === product.id)
  const isWishlisted = wishlistItems.some(i => i.product.id === product.id)

  return (
    <section className="container my-4">

      {/* PRODUCT */}
      <div className="row g-4">

        <div className="col-md-5">
          <div className="border rounded-4 p-2 shadow-sm">
            <img
              src={product.image}
              className="img-fluid rounded-3"
              style={{ width: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="col-md-7 d-flex flex-column justify-content-between">

          <div>
            <h2 className="fw-bold">{product.name}</h2>

            <div className="text-muted mb-2">
              ⭐ {product.avg_rating} ({product.total_reviews} reviews)
            </div>

            <h3 className="text-primary fw-bold mb-3">₹{product.price}</h3>

            <p className="text-muted">{product.description}</p>
          </div>

          {/* ACTIONS */}
          <div className="d-flex gap-2 flex-wrap mt-3">

            {cartItem ? (
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-outline-dark" onClick={(e)=>handleDecrement(e,product)}>-</button>
                <span className="fw-bold">{cartItem.quantity}</span>
                <button className="btn btn-outline-dark" onClick={(e)=>handleIncrement(e,product)}>+</button>
              </div>
            ) : (
              <button className="btn btn-dark px-4" onClick={(e)=>handleAddToCart(e,product)}>
                Add To Cart 🛒
              </button>
            )}

            <button
              className="btn btn-outline-danger"
              disabled={loadingId === product.id}
              onClick={(e)=>handleWishlist(e, product)}
            >
              {loadingId === product.id ? "..." : (isWishlisted ? "❤️ Saved" : "🤍 Wishlist")}
            </button>

          </div>

        </div>

      </div>

      {/* RELATED */}
      <RelatedProducts productId={product.id} />

      {/* REVIEWS */}
      <div className="mt-5">

        <h4 className="mb-3 fw-bold">Customer Reviews</h4>

        <form onSubmit={handleReviewSubmit} className="mb-4">
          <div className="row g-2">

            <div className="col-4 col-md-2">
              <select
                className="form-control"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5,4,3,2,1].map(r => (
                  <option key={r} value={r}>{r}★</option>
                ))}
              </select>
            </div>

            <div className="col-8 col-md-8">
              <input
                className="form-control"
                placeholder="Write review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-2">
              <button className="btn btn-primary w-100">
                Submit
              </button>
            </div>

          </div>
        </form>

        {reviews.map(r => (
          <div key={r.id} className="border rounded-3 p-3 mb-3 shadow-sm">
            <div className="d-flex justify-content-between">
              <strong>{r.user}</strong>
              <span>⭐ {r.rating}</span>
            </div>
            <p className="mb-0 mt-2 text-muted">{r.comment}</p>
          </div>
        ))}

      </div>

    </section>
  )
}