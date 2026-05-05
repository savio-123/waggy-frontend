import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useCartDrawer } from "../context/CartDrawerContext"

export default function Header2({ isAdmin }) {

  const cartItems = useSelector((state) => state.cart.items)

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // ✅ FIXED names (no conflict)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { setOpen: setCartOpen } = useCartDrawer()

  const navigate = useNavigate()

  // ✅ check login
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"))
    }
  
    checkAuth()
    window.addEventListener("authChanged", checkAuth)
  
    return () => window.removeEventListener("authChanged", checkAuth)
  }, [])

  // ✅ close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.dispatchEvent(new Event("authChanged"))
    navigate('/')
  }

  return (
    <header>

      <div className="container py-2">
        <div className="row align-items-center py-3">

          {/* LOGO */}
          <div className="col-6 col-lg-3">
            <Link to="/">
              <img src="/images/logo.png" className="img-fluid" alt="logo" />
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <div className="d-none d-lg-flex col-lg-6 justify-content-center">
            <ul className="navbar-nav d-flex flex-row gap-4">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/shop" className="nav-link">Shop</Link></li>
              <li><Link to="/blogs" className="nav-link">Blogs</Link></li>
              <li><Link to="/about" className="nav-link">About</Link></li>
            </ul>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-6 col-lg-3 d-flex justify-content-end align-items-center gap-2">

            {/* MOBILE ICONS */}
            <div className="d-flex d-lg-none align-items-center gap-2">

              <Link to="/wishlist" className="mx-2">❤️</Link>

              {/* ✅ FIXED */}
              <button
                className="border-0 bg-transparent"
                onClick={() => navigate('/profile')}
              >
                👤
              </button>

              <button
                className="navbar-toggler"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasNavbar"
              >
                ☰
              </button>

            </div>

            {/* DESKTOP ICONS */}
            <ul className="d-none d-lg-flex list-unstyled m-0 align-items-center">

              <li ref={dropdownRef}>
                <button
                  className="mx-2 border-0 bg-transparent"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  👤
                </button>

                {dropdownOpen && (
                  <div
                    className="position-absolute bg-white shadow rounded p-2"
                    style={{ zIndex: 9999, right: 65, minWidth: "180px" }}
                  >
                    {isLoggedIn ? (
                      <>
                        <Link to="/profile" className="dropdown-item">Profile</Link>
                        <Link to="/orders" className="dropdown-item">Orders</Link>
                        <Link to="/address" className="dropdown-item">Address</Link>
                        <Link to="/add-product" className="dropdown-item">Add Product</Link>
                        <button
                          className="dropdown-item"
                          style={{color:'red'}} 
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
                <Link to="/wishlist" className="mx-2">❤️</Link>
              </li>

              {/* ✅ CART FIXED */}
              <li>
                <span
                  className="mx-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => setCartOpen(true)}
                >
                  🛒 ({cartItems.length})
                </span>
              </li>

            </ul>

          </div>

        </div>
      </div>

      <hr className="m-0" />

      {/* MOBILE BOTTOM NAV */}
      <ul className="mobile-bottom-nav d-lg-none">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/shop" className="nav-link">Shop</Link></li>
        <li>
          <span
            className="nav-link"
            onClick={() => setCartOpen(true)}
          >
            Cart
          </span>
        </li>
        <li><Link to="/about" className="nav-link">About</Link></li>
      </ul>

      {/* OFFCANVAS MENU */}
      <div className="offcanvas offcanvas-end" id="offcanvasNavbar">

        <div className="offcanvas-header">
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body">
          <ul className="navbar-nav w-100">

            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <li>
                    <Link to="/admin/dashboard" className="btn btn-warning mb-2">
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                <li><Link to="/orders" className="nav-link">Orders</Link></li>
                <li><Link to="/address" className="nav-link">Address</Link></li>
                <li><Link to="/add-product" className="nav-link">Add Product</Link></li>

                <li>
                  <button
                    className="dropdown-item"
                    style={{color:'red'}}
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

    </header>
  )
}