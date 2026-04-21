  import { useEffect, useState } from "react"
  import API from "../api"
  import { Link, useNavigate, useLocation } from "react-router-dom"
  import toast from "react-hot-toast"
  import { useSelector, useDispatch } from "react-redux"
  import { addItem, incrementQty, decrementQty } from "../features/CartSlice"
  import { toggleWishlistItem } from "../features/WishlistSlice"

  export default function Shop() {

    const location = useLocation()
    const dispatch = useDispatch()

    const [products, setProducts] = useState([])
    const [searchInput, setSearchInput] = useState("")
    const [showFilter, setShowFilter] = useState(false)
    const [activeFilter, setActiveFilter] = useState("category")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const cartItems = useSelector(state => state.cart.items)
    const wishlistItems = useSelector(state => state.wishlist.items)
    const [loadingId, setLoadingId] = useState(null)

    const [filters, setFilters] = useState({
      category: "all",
      animal: "all",
      minPrice: "",
      maxPrice: "",
      search: "",
      sort: "",
      rating: ""
    })

    const token = localStorage.getItem("token")

    // LOAD CSS
    useEffect(() => {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "/styles.css"
      document.head.appendChild(link)
      return () => document.head.removeChild(link)
    }, [])

    // SEARCH FROM HEADER
    useEffect(() => {
      const params = new URLSearchParams(location.search)
      const searchQuery = params.get("search")
      if (searchQuery) {
        setSearchInput(searchQuery)
        setFilters(prev => ({ ...prev, search: searchQuery }))
      }
    }, [location.search])

    // FETCH PRODUCTS
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products/", {
          params: { ...filters, page }
        })
    
        setProducts(res.data.results)
        setTotalPages(Math.ceil(res.data.count / 8))
    
      } catch (err) {
        console.log(err)
      }
    }

    useEffect(() => {
      fetchProducts()
    }, [filters, page])

    useEffect(() => {
  setPage(1)
}, [filters])

    // SEARCH DELAY
    useEffect(() => {
      const delay = setTimeout(() => {
        setFilters(prev => ({ ...prev, search: searchInput }))
      }, 500)
      return () => clearTimeout(delay)
    }, [searchInput])

    // CLEAR FILTERS
    const clearFilters = () => {
      setFilters({
        category: "all",
        animal: "all",
        minPrice: "",
        maxPrice: "",
        search: "",
        sort: "",
        rating: ""
      })
    }

    const handleAddToCart = async (e, product) => {
      e.preventDefault()
    
      if (!token) {
        toast.error("Login required")
        return
      }
    
      try {
        await API.post(
          "/cart/add/",
          { product_id: product.id },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
    
        dispatch(addItem(product))
    
      } catch (err) {
    
        if (err.response?.status === 401) {
          toast.error("Session Expired,Login required")
          localStorage.removeItem("token")
        }
    
        console.log(err)
      }
    }
  
    const handleIncrement = async (e, product) => {
      e.preventDefault()
      dispatch(incrementQty(product.id))
      await API.post("/cart/add/", { product_id: product.id }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }
  
    const handleDecrement = async (e, product) => {
      e.preventDefault()
      dispatch(decrementQty(product.id))
      await API.post("/cart/remove/", { product_id: product.id }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }

    return (
      <section className="shop-page my-3">
        <div className="container">

          <div className="row">

            {/* DESKTOP FILTER */}
            <div className="col-md-3 d-none d-md-block">
              <div style={{ position: "sticky", top: "20px" }}>

                <h4>Filters</h4>

                <select className="form-control mb-3"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="all">All Categories</option>
                  <option value="cloth">Clothing</option>
                  <option value="food">Food</option>
                  <option value="toy">Toys</option>
                </select>

                <select className="form-control mb-3"
                  value={filters.animal}
                  onChange={(e) => setFilters({ ...filters, animal: e.target.value })}
                >
                  <option value="all">All Animals</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="fish">Fish</option>
                </select>

                <select className="form-control mb-3"
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                >
                  <option value="">All Ratings</option>
                  <option value="4">4★ & above</option>
                  <option value="3">3★ & above</option>
                </select>

                <input
                  type="number"
                  placeholder="Min Price"
                  className="form-control mb-2"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />

                <input
                  type="number"
                  placeholder="Max Price"
                  className="form-control mb-3"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />

                <button
                  className="btn btn-warning w-100"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              </div>
            </div>

            {/* PRODUCTS */}
            <div className="col-md-9">

              {/* TOP BAR */}
              <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">

                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control"
                  style={{ maxWidth: "200px" }}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
             
              <select
                className="form-control d-none d-md-block"
                style={{ maxWidth: "180px" }}
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              >
                <option value="">Sort</option>
                <option value="price_low">Low → High</option>
                <option value="price_high">High → Low</option>
              </select>

              </div>

              <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
              <select
                className="form-control d-md-none mb-2 "
                style={{ maxWidth: "180px" }}
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              >
                <option value="">Sort</option>
                <option value="price_low">Low → High</option>
                <option value="price_high">High → Low</option>
              </select>

              <button
                  className="btn btn-dark d-md-none"
                  onClick={() => setShowFilter(true)}
                >
                  Filters
                </button>
                </div>

              {/* GRID */}
              <div className="row">
                {products.map(product => (
                  <div className="col-md-4 col-lg-3 mb-4" key={product.id}>
                    <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="card h-100">

                    {/* MOBILE LAYOUT */}
                    <div className="d-flex d-md-block">

                      {/* IMAGE */}
                      <img
                        src={product.image}
                        style={{
                          height: "200px",
                          objectFit: "contain",
                          width: "100%",
                        }}
                        className="d-none d-md-block"
                      />

                      <img
                        src={product.image}
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "contain",
                          borderRadius:'10px'
                        }}
                        className="d-md-none"
                      />

                      {/* CONTENT */}
                      <div className="card-body p-2 flex-grow-1">

                      <h6
                      style={{
                        fontSize: "14px",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        color:'black'
                      }}
                    >
                      {product.name}
                    </h6>

                        <p
                          className="text-muted mb-1"
                          style={{
                            fontSize: "12px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}
                        >
                          {product.description}
                        </p>

                        <p className="text-primary mb-1">₹{product.price}</p>

                        
                        {cartItems.find(i => i.id === product.id) ? (
                        <div className="d-flex justify-content-center gap-2 align-items-center">

                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={(e)=>handleDecrement(e, product)}
                          >
                            -
                          </button>

                          <span>
                            {cartItems.find(i => i.id === product.id).quantity}
                          </span>

                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={(e)=>handleIncrement(e, product)}
                          >
                            +
                          </button>

                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-dark w-100"
                          onClick={(e)=>handleAddToCart(e, product)}
                        >
                          Add To Cart
                        </button>
                      )}

                      </div>

                    </div>

                    </div>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-center mt-2 gap-2 flex-wrap mb-3">

              <button
                className="btn btn-outline-dark"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>

              <span className="align-self-center">
                Page {page} of {totalPages}
              </span>

              <button
                className="btn btn-outline-dark"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>

              </div>

            </div>

          </div>
        </div>

        {/* MOBILE FILTER */}
        {showFilter && (
          <div className="mobile-filter">

            {/* HEADER */}
            <div className="d-flex justify-content-between p-3 border-bottom">
              <h5>Filters</h5>
              <span onClick={() => setShowFilter(false)} style={{ cursor: "pointer" }}>✕</span>
            </div>

            <div className="d-flex">

              {/* LEFT MENU */}
              <div className="filter-left">
                {["category", "animal", "price", "rating"].map(item => (
                  <div
                    key={item}
                    onClick={() => setActiveFilter(item)}
                    className={`filter-item ${activeFilter === item ? "active-filter" : ""}`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </div>
                ))}
              </div>

              {/* RIGHT */}
              <div className="filter-right p-3">

                {activeFilter === "category" && (
                  <>
                    <button className={filters.category === "cloth" ? "active-option" : ""} onClick={() => setFilters({ ...filters, category: "cloth" })}>Clothing</button>
                    <button className={filters.category === "food" ? "active-option" : ""} onClick={() => setFilters({ ...filters, category: "food" })}>Food</button>
                    <button className={filters.category === "toy" ? "active-option" : ""} onClick={() => setFilters({ ...filters, category: "toy" })}>Toys</button>
                  </>
                )}

                {activeFilter === "animal" && (
                  <>
                    <button className={filters.animal === "dog" ? "active-option" : ""} onClick={() => setFilters({ ...filters, animal: "dog" })}>Dog</button>
                    <button className={filters.animal === "cat" ? "active-option" : ""} onClick={() => setFilters({ ...filters, animal: "cat" })}>Cat</button>
                    <button className={filters.animal === "bird" ? "active-option" : ""} onClick={() => setFilters({ ...filters, animal: "bird" })}>Bird</button>
                    <button className={filters.animal === "fish" ? "active-option" : ""} onClick={() => setFilters({ ...filters, animal: "fish" })}>Fish</button>
                  </>
                )}

                {activeFilter === "price" && (
                  <>
                    <input
                      type="number"
                      placeholder="Min Price"
                      className="form-control mb-2"
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      className="form-control"
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                  </>
                )}

                {activeFilter === "rating" && (
                  <>
                    <button className={filters.rating === "4" ? "active-option" : ""} onClick={() => setFilters({ ...filters, rating: "4" })}>4★ & above</button>
                    <button className={filters.rating === "3" ? "active-option" : ""} onClick={() => setFilters({ ...filters, rating: "3" })}>3★ & above</button>
                  </>
                )}

              </div>

            </div>

            {/* FOOTER */}
            <div className="filter-footer p-3 d-flex gap-2">
              <button className="btn btn-outline-dark w-50" onClick={clearFilters}>
                Clear All
              </button>
              <button className="btn btn-warning w-50" onClick={() => setShowFilter(false)}>
                Apply
              </button>
            </div>

          </div>
        )}

      </section>
    )
  }