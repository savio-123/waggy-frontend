import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useCartDrawer } from "../context/CartDrawerContext"


export default function Header({isAdmin,onCategoryChange }) {

  const cartItems = useSelector((state) => state.cart.items)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [open, setOpened] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { setOpen } = useCartDrawer()

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpened(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.reload()
    navigate('/')
  }

  return (
    <header>

      {/* TOP */}
      <div className="container py-2">
  <div className="row py-4 pb-0 pb-sm-4 align-items-center">

    {/* LOGO */}
    <div className="col-6 col-lg-3">
      <Link to="/">
        <img
          src="/images/logo.png"
          className="img-fluid"
          style={{ maxHeight: "50px" }}
        />
      </Link>
    </div>

    {/* DESKTOP SEARCH */}
    <div className="col-lg-5 d-none d-lg-block">
      <div className="search-bar border rounded-2 px-3 border-dark-subtle">
        <form
          className="d-flex align-items-center"
          onSubmit={(e) => {
            e.preventDefault()
            navigate(`/shop?search=${search}`)
          }}
        >
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={{ border: "none", background: "transparent" }}>
            🔍
          </button>
        </form>
      </div>
    </div>

    <div className="col-6 col-lg-4 d-flex justify-content-end align-items-center gap-4">

{/* ✅ DESKTOP PHONE */}
<div className="text-end d-none d-lg-block">
  <span className="text-muted small d-block">Phone</span>
  <h6 className="mb-0 fw-semibold">+980-34984089</h6>
</div>

{/* ✅ MOBILE TOGGLE (REPLACES PHONE) */}
<div className="d-lg-none">
<button
  className="border-0 bg-transparent"
  data-bs-toggle="offcanvas"
  data-bs-target="#offcanvasNavbar"
>
  <span style={{ fontSize: "22px" }}>☰</span>
</button>
</div>

{/* EMAIL (DESKTOP ONLY) */}
<div className="text-end d-none d-xl-block">
  <span className="text-muted small d-block">Email</span>
  <h6 className="mb-0">waggy@gmail.com</h6>
</div>

</div>

  </div>
</div>


     
      <hr className="m-3" />

       {/* MOBILE SEARCH */}
      


      {/* NAVBAR */}
      <div className="container">
        <nav className="main-menu navbar navbar-expand-lg">

          <div className="d-flex align-items-center justify-content-between w-100">

            {/* LEFT: CATEGORY */}
            <div className="d-flex align-items-center">
              
              {/* DESKTOP */}
              <div className="d-none d-lg-block me-3">
                <select
                  className="filter-categories border-0"
                  onChange={(e) => onCategoryChange(e.target.value)}
                >
                  <option value="clothes">Shop by Category</option>
                  <option value="clothes">Clothes</option>
                  <option value="food">Food</option>
                  <option value="toy">Toy</option>
                </select>
              </div>

              {/* MOBILE */}
              <div className="d-lg-none">
                <select
                  className="filter-categories border-0"
                  onChange={(e) => onCategoryChange(e.target.value)}
                >
                  <option value="clothes">Shop by Category</option>
                  <option value="clothes">Clothes</option>
                  <option value="food">Food</option>
                  <option value="toy">Toy</option>
                </select>
              </div>

            </div>

            {/* CENTER NAV */}
            <ul className="navbar-nav d-none d-lg-flex gap-3 mx-auto">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/shop" className="nav-link">Shop</Link></li>
              <li><Link to="/blogs" className="nav-link">Blogs</Link></li>
              <li><Link to="/about" className="nav-link">About</Link></li>
              <li>{isAdmin && (
              <Link to="/admin/dashboard" className="btn btn-warning ms-3">
                Admin Dashboard
              </Link>
            )}</li>
            </ul>

            {/* RIGHT ICONS */}
            <div className="d-none d-lg-flex align-items-center">
              <ul className="d-flex list-unstyled m-0">

                {/* PROFILE */}
                <li ref={dropdownRef}>
                  <button
                    className="mx-3 border-0 bg-transparent"
                    onClick={() => setOpened(!open)}
                  >
                    👤
                  </button>

                  {open && (
                    <div className="position-absolute bg-white shadow rounded p-2"
                    style={{ zIndex: 9999, right: 0, minWidth: "180px" }}>

                      {isLoggedIn ? (
                        <>
                          <Link to="/profile" className="dropdown-item">Profile</Link>
                          <Link to="/orders" className="dropdown-item">Orders</Link>
                          <Link to="/address" className="dropdown-item">Address</Link>
                          <Link to="/add-product" className="dropdown-item">Add Product</Link>
                          <button
                          className="dropdown-item logout-btn border-0 bg-transparent"
                          style={{
                            outline: "none",
                            boxShadow: "none",
                            background: "transparent"
                          }}
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="dropdown-item">Login</Link>
                          <a href="/#register" className="dropdown-item">Register</a>
                        </>
                      )}

                    </div>
                  )}
                </li>

                <li>
                  <Link to="/wishlist" className="mx-3 sidenavitems">
                    ❤️
                  </Link>
                </li>

                <li>
                  <span
                    className="mx-3 sidenavitems"
                    onClick={() => setOpen(true)}
                  >
                    🛒 ({cartItems.length})
                  </span>
                </li>

              </ul>
            </div>

            {/* MOBILE TOGGLE */}
            <div className="d-lg-none">
               <div className="d-lg-none px-3 mb-2">
        <form
          className="d-flex border rounded px-2"
          onSubmit={(e) => {
            e.preventDefault()
            navigate(`/shop?search=${search}`)
          }}
        >
          <input
            type="text"
            className="form-control border-0"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={{ border: "none", background: "transparent" }}>🔍</button>
        </form>
      </div>
            </div>

          </div>

          {/* MOBILE BOTTOM NAV */}
          <ul className="mobile-bottom-nav d-lg-none list-unstyled">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/shop" className="nav-link">Shop</Link></li>
            <li>
                  <span
                    className="mx-3 sidenavitems"
                    onClick={() => setOpen(true)}
                  >
                    Cart 
                  </span>
                </li>
                <li><Link to="/about" className="nav-link">About</Link></li>    
          </ul>

          {/* OFFCANVAS */}
          <div className="offcanvas offcanvas-end" id="offcanvasNavbar">

            <div className="offcanvas-header">
              <button className="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>

            <div className="offcanvas-body">

              <ul className="navbar-nav w-100 d-lg-none">

                {isLoggedIn ? (
                  <>
                    <li><Link to="/profile" className="nav-link">Profile</Link></li>
                    <li><Link to="/orders" className="nav-link">Your Orders</Link></li>
                    <li><Link to="/address" className="nav-link">Your Address</Link></li>
                    <li><Link to="/add-product" className="nav-link">Add Product</Link></li>
                    <li>
                    <button
                    className="dropdown-item logout-btn border-0 bg-transparent"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      background: "transparent"
                    }}
                    onClick={handleLogout}
                  >
                    Logout
</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" className="nav-link">Login</Link></li>
                    <li><a href="/#register" className="nav-link">Register</a></li>
                  </>
                )}

              </ul>

            </div>
          </div>

        </nav>
      </div>

    </header>
  )
}