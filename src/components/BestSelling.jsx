import { useEffect, useState,useRef,useMemo } from "react"
import Swiper from "swiper"
import "swiper/css"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { addItem, incrementQty, decrementQty, removeItem } from "../features/CartSlice"
import { toggleWishlistItem } from "../features/WishlistSlice"
import API from "../api"

export default function BestSelling() {

  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.items)
  const wishlistItems = useSelector(state => state.wishlist.items)
  

  const [products, setProducts] = useState([])
  const tokenRef = useRef(localStorage.getItem("token"))

  //  FETCH BEST SELLING
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products/best-selling/")
        setProducts(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchProducts()
  }, [])

  //  SWIPER
  useEffect(() => {
    if (products.length > 0) {
      const swiper = new Swiper(".bestselling-swiper", {
        slidesPerView: 4,
        spaceBetween: 20,
        loop: products.length > 4,
        breakpoints: {
          0: { slidesPerView: 2 },
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
        },
      })

      return () => swiper.destroy(true, true)
    }
  }, [products])

  // =========================
  //  CART HANDLERS
  // =========================

  const handleAddToCart = async (e, product) => {
    e.preventDefault()

    if (!tokenRef.current) {
      toast.error("Login required")
      return
    }

    try {
      await API.post("/cart/add/", { product_id: product.id }, {
        headers: { Authorization: `Bearer ${tokenRef.current}` }
      })

      dispatch(addItem(product))

    } catch (err) {
      console.log(err)
    }
  }

  

  const handleIncrement = async (e, product) => {
    e.preventDefault()

    if (!tokenRef.current) return

    dispatch(incrementQty(product.id))

    await API.post("/cart/add/", { product_id: product.id }, {
      headers: { Authorization: `Bearer ${tokenRef.current}` }
    })
  }

  const [loadingId, setLoadingId] = useState(null)

  const handleWishlist = async (e, product) => {
    e.preventDefault()

    if (!tokenRef.current) return toast.error("Login required")

    if (loadingId === product.id) return // prevent spam clicks

    setLoadingId(product.id)

    try {
      await API.post("/wishlist/toggle/", 
        { product_id: product.id },
        {headers: { Authorization: `Bearer ${tokenRef.current}` }}
      )

      const alreadyExists = wishlistItems.find(i => i.product.id === product.id)

      dispatch(toggleWishlistItem(product))

      if (alreadyExists) {
        toast("Removed from wishlist")
      } else {
        toast.success("Added to wishlist ❤️")
      } 

    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setLoadingId(null)
    }
  }

  const handleDecrement = async (e, product) => {
    e.preventDefault()
    if (!tokenRef.current) return

    const cartItem = cartItems.find(i => i.id === product.id)

    await API.post("/cart/remove/", { product_id: product.id }, {
      headers: { Authorization: `Bearer ${tokenRef.current}` }
    })

    if (cartItem.quantity === 1) {
      dispatch(removeItem(product.id))
    } else {
      dispatch(decrementQty(product.id))
    }
  }
  const wishlistMap = useMemo(() => {
    const map = {}
    wishlistItems.forEach(i => {
      map[i.product.id] = true
    })
    return map
  }, [wishlistItems])

  const cartMap = useMemo(() => {
    const map = {}
    cartItems.forEach(i => {
      map[i.id] = i
    })
    return map
  }, [cartItems])

  return (
    <section className="my-4 overflow-hidden">
      <div className="container pb-3">

        {/* HEADER */}
        <div className="section-header d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start mb-3">

          <h2 style={{ fontSize: "clamp(22px,5vw,48px)" }}>
            Best Selling
          </h2>

          <Link to="/shop" className="btn btn-outline-dark text-uppercase rounded-1 mt-2 mt-md-0">
            Shop
          </Link>

        </div>

        {/* SWIPER */}
        <div className="bestselling-swiper swiper">
          <div className="swiper-wrapper">

            {products.map(product => {

              const cartItem = cartMap[product.id]
              const isWishlisted = wishlistMap[product.id]

              return (
                <div className="swiper-slide" key={product.id}>

                  <Link to={`/product/${product.id}`} style={{ textDecoration:"none", color:"inherit" }}>

                    <div className="card">

                      <img
                        loading="lazy"
                        src={product.image}
                        className="img-fluid rounded-4"
                        alt={product.name}
                        style={{ height:"260px", objectFit:"cover" }}
                      />

                      <div className="card-body p-2">

                        <h6
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "20px",
                            color:'black'
                          }}
                        >
                          {product.name}
                        </h6>

                        <small className="text-muted">
                          ⭐ {product.avg_rating || 0}
                        </small>

                        <h6 className="text-primary">₹{Number(product.price).toFixed(2)}</h6>

                        {/*  CART UI */}
                        <div className="d-flex justify-content-between align-items-center mt-2">

                          {cartItem ? (
                            <div className="d-flex align-items-center gap-1">
                              <button
                                className="btn btn-sm btn-outline-dark px-2"
                                onClick={(e)=>handleDecrement(e,product)}
                              >-</button>

                              <span>{cartItem.quantity}</span>

                              <button
                                className="btn btn-sm btn-outline-dark px-2"
                                onClick={(e)=>handleIncrement(e,product)}
                              >+</button>
                            </div>
                          ) : (
                            <button
                              className="btn-cart py-1 px-2"
                              onClick={(e)=>handleAddToCart(e,product)}
                            >
                              Add To Cart
                            </button>
                          )}

                        <button
                          className="btn-wishlist"
                          disabled={loadingId === product.id}
                          onClick={(e)=>handleWishlist(e, product)}
                        >
                          {loadingId === product.id ? "..." : (isWishlisted ? "❤️" : "🤍")}
                        </button>

                        </div>

                      </div>

                    </div>

                  </Link>

                </div>
              )
            })}

          </div>
        </div>

      </div>
    </section>
  )
}