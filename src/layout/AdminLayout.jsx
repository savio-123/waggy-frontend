import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./admin.css";

export default function AdminLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Pending Products", path: "/admin/pending-products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Returns", path: "/admin/returns" },
    { name: 'Products', path:'/admin/products'}
  ];

  return (
    <div className="admin-layout">

      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* SIDEBAR */}
      <div className={`sidebar ${open ? "show" : ""}`}>
        <h3 className="logo">Waggy</h3>

        {menu.map(item => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setOpen(false)}
            className={`menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOPBAR */}
        <div className="topbar">

          <button className="menu-btn" onClick={() => setOpen(true)}>
            ☰
          </button>

          <div className="topbar-title">
            Admin Panel
            </div>
        </div>

        <div className="content">
          <Outlet />
        </div>

      </div>
    </div>
  );
}