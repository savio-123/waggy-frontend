import { useEffect, useState, useRef, useMemo } from "react"
import Swiper from "swiper"
import "swiper/css"
import toast from "react-hot-toast"
import { useSelector, useDispatch } from "react-redux"
import { addItem, incrementQty, decrementQty } from "../features/CartSlice"
import { toggleWishlistItem } from "../features/WishlistSlice"
import API from "../api"
import { Link } from "react-router-dom"

export default function Clothing() {

  const dispatch = useDispatch()
  const cacheRef = useRef({})
  const cartItems = useSelector(state => state.cart.items)
  const wishlistItems = useSelector(state => state.wishlist.items)

  const [loadingId, setLoadingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [activeFilter, setActiveFilter] = useState("dog")

  const tokenRef = useRef(localStorage.getItem("token"))

  // ✅ optimized wishlist lookup
  const wishlistSet = useMemo(() => 
    new Set(wishlistItems.map(i => i.product.id)),
  [wishlistItems])

  const cartMap = useMemo(() => {
    const map = {}
    cartItems.forEach(i => {
      map[i.id] = i
    })
    return map
  }, [cartItems])

  // ======================
  // FETCH PRODUCTS
  // ======================
  const fetchProducts = async (animal = "dog") => {

    if (cacheRef.current[animal]){
      setProducts(cacheRef.current[animal]) 
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      if (!cacheRef.current[animal]) {
        setProducts([])
      }
      const res = await API.get("/products/filter/", {
        params: {
          category: "cloth",
          animal
        }
      })

      cacheRef.current[animal] = res.data 
      setProducts(res.data)
    } catch (err) {
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts("dog")
  }, [])

  // ======================
  // SWIPER
  // ======================
  useEffect(() => {
    if (!products.length) return
  
    const swiper = new Swiper(".clothing-carousel", {
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
  }, [products])   // ✅ FIXED

  // ======================
  // FILTER
  // ======================
  const handleFilter = (animal) => {
    if (animal === activeFilter) return
    setActiveFilter(animal)

    if (cacheRef.current[animal]) {
    setProducts(cacheRef.current[animal])
  } else {
    setProducts([])
  }

    fetchProducts(animal)
  }

  // ======================
  // WISHLIST
  // ======================
  const handleWishlist = async (e, product) => {
    e.preventDefault()

    if (!tokenRef.current) return toast.error("Login required")
    if (loadingId === product.id) return

    setLoadingId(product.id)

    try {
      await API.post(
        "/wishlist/toggle/",
        { product_id: product.id },
        { headers: { Authorization: `Bearer ${tokenRef.current}` } }
      )

      const alreadyExists = wishlistSet.has(product.id)

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

  // ======================
  // CART
  // ======================
  const handleAddToCart = async (e, product) => {
    e.preventDefault()

    if (!tokenRef.current) {
      toast.error("Login required")
      return
    }

    try {
      await API.post(
        "/cart/add/",
        { product_id: product.id },
        {
          headers: { Authorization: `Bearer ${tokenRef.current}` }
        }
      )

      dispatch(addItem(product))

    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session Expired, Login required")
        localStorage.removeItem("token")
      }
      console.log(err)
    }
  }

  const handleIncrement = async (e, product) => {
    e.preventDefault()

    dispatch(incrementQty(product.id))

    await API.post(
      "/cart/add/",
      { product_id: product.id },
      {
        headers: { Authorization: `Bearer ${tokenRef.current}` }
      }
    )
  }

  const handleDecrement = async (e, product) => {
    e.preventDefault()

    dispatch(decrementQty(product.id))

    await API.post(
      "/cart/remove/",
      { product_id: product.id },
      {
        headers: { Authorization: `Bearer ${tokenRef.current}` }
      }
    )
  }

  // ======================
  // UI
  // ======================
  return (
    <section id="clothing" className="my-4 overflow-hidden">
      <div className="container pb-3">

        {/* HEADER */}
        <div className="section-header d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start mb-3">

          <h2 style={{ fontSize: "clamp(22px, 5vw, 48px)" }}>
            Pet Clothing
          </h2>

          <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start mb-3">
            <button className={`filter-button ${activeFilter==="dog"?"active":""}`} onClick={()=>handleFilter("dog")}>DOG</button>
            <button className={`filter-button ${activeFilter==="cat"?"active":""}`} onClick={()=>handleFilter("cat")}>CAT</button>
            <button className={`filter-button ${activeFilter==="bird"?"active":""}`} onClick={()=>handleFilter("bird")}>BIRD</button>
          </div>

          <Link to="/shop" className="btn btn-outline-dark text-uppercase rounded-1">
            Shop
          </Link>

        </div>

        {/* SWIPER */}
        <div className="clothing-carousel swiper" key={activeFilter}>
          <div className="swiper-wrapper">
          {loading ? (
            <div className="text-center py-5 w-100">
              <h5>Loading...</h5>
            </div>
          ) : (
            products.map((product) => {
              const cartItem = cartMap[product.id]
              const isWishlisted = wishlistSet.has(product.id)

              return (
                <div className="swiper-slide" key={product.id}>

                  <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>

                    <div className="card">

                      <img
                        loading="lazy"
                        src={product.image}
                        className="img-fluid rounded-4"
                        alt={product.name}
                        style={{
                          height: "280px",
                          objectFit: "cover"
                        }}
                      />

                      <div className="card-body p-2">

                      <h6
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "5px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color:'black'
                      }}
                    >
                      {product.name}
                    </h6>

                        <small className="text-muted">
                          ⭐ {product.avg_rating || 0}
                        </small>

                        <h6 className="text-primary">${product.price}</h6>

                        <div className="d-flex justify-content-between align-items-center mt-2">

                        {cartItem ? (
                            <div className="d-flex gap-1 align-items-center">
                              <button className="btn btn-sm btn-outline-dark px-2"
                                onClick={(e)=>handleDecrement(e,product)}>-</button>

                              <span className="text-dark p-2">{cartItem.quantity}</span>

                              <button className="btn btn-sm btn-outline-dark px-2"
                                onClick={(e)=>handleIncrement(e,product)}>+</button>
                            </div>
                          ) : (
                            <button
                              className="btn-cart px-2 py-1"
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
            })
          )}
          </div>
        </div>

      </div>
    </section>
  )
}