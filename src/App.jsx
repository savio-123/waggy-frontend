import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setWishlist } from "./features/WishlistSlice";
import { setCart } from "./features/CartSlice";
import { Toaster } from "react-hot-toast";
import API from "./api";
import { CartDrawerProvider } from "./context/CartDrawerContext";

import MainLayout from "./layout/MainLayout";
import AdminRoute from "./features/AdminProtect";
import AdminLayout from "./layout/AdminLayout";
import AdminProducts from "./pages/AdminProducts"

import Home from "./pages/Home";
import AIChatWidget from "./components/AIChatWidget"
import FAQ from "./pages/FAQ"
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import AddProduct from "./pages/AddProduct";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import OrderDetail from "./pages/OrderDetail";
import Orders from "./pages/Orders";
import Address from "./pages/Address";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import AddBlog from "./pages/AddBlog";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import OffcanvasCart from "./components/Offcanvascart";
import AdminDashboard from "./pages/AdminDashboard";
import PendingProducts from "./pages/PendingProducts";
import OrdersAdmin from "./pages/OrdersAdmin";
import About from "./pages/About";
import ReturnsAdmin from "./pages/ReturnsAdmin";



function App() {
  const dispatch = useDispatch();

  // ✅ TOKEN STATE (IMPORTANT)
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ LISTEN FOR LOGIN (NO REFRESH NEEDED)
  useEffect(() => {
    const handleLogin = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("login", handleLogin);

    return () => window.removeEventListener("login", handleLogin);
  }, []);

  // ✅ CLEAN BOOTSTRAP BUGS
  useEffect(() => {
    const cleanBootstrap = () => {
      document.body.classList.remove("modal-open");
      document.body.style = "";

      document
        .querySelectorAll(".offcanvas-backdrop, .modal-backdrop")
        .forEach(el => el.remove());
    };

    window.addEventListener("popstate", cleanBootstrap);

    return () => {
      window.removeEventListener("popstate", cleanBootstrap);
    };
  }, []);

  // ✅ FETCH PROFILE (ADMIN DETECTION)
  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      setLoadingUser(false);
      return;
    }
  
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsAdmin(res.data.is_staff);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingUser(false);
      }
    };
  
    fetchProfile();
  }, [token]);

  // ✅ FETCH CART
  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      try {
        const res = await API.get("/cart/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setCart(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, [dispatch, token]);

  // ✅ FETCH WISHLIST
  useEffect(() => {
    if (!token) return;

    const fetchWishlist = async () => {
      try {
        const res = await API.get("/wishlist/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setWishlist(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    fetchWishlist();
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <CartDrawerProvider>

        <Toaster position="top-center" />
        <OffcanvasCart />        
        <AIChatWidget  />


        <Routes>

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          

          {/* HOME */}
          <Route path="/" element={<Home isAdmin={isAdmin} />} />

          {/* MAIN LAYOUT */}
          <Route element={<MainLayout isAdmin={isAdmin} />}>

            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/address" element={<Address />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/add-blog" element={<AddBlog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />

            <Route
            path="/admin"
            element={
              <AdminRoute isAdmin={isAdmin}>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="pending-products" element={<PendingProducts />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="returns" element={<ReturnsAdmin />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>

          </Route>

        </Routes>

      </CartDrawerProvider>
    </BrowserRouter>
  );
}

export default App;