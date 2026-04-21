import { useEffect, useState, useRef } from "react"
import API from "../api"
import { useNavigate } from "react-router-dom"

export default function Orders() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  // ✅ stable token
  const tokenRef = useRef(localStorage.getItem("token"))

  const fetchOrders = async () => {
    try {
      setLoading(true)

      const res = await API.get("/orders/", {
        headers: { Authorization: `Bearer ${tokenRef.current}` }
      })

      setOrders(res.data)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return { background: "#fff3cd", color: "#856404" }
      case "Shipped":
        return { background: "#cfe2ff", color: "#084298" }
      case "Delivered":
        return { background: "#e6f4ea", color: "#198754" }
      default:
        return {}
    }
  }

  return (
    <section className="container my-4 my-md-5">

      <h3 className="fw-bold mb-4 text-dark">My Orders</h3>

      {/* ✅ LOADING */}
      {loading && (
        <p className="text-center text-muted">Loading orders...</p>
      )}

      {/* ✅ EMPTY */}
      {!loading && orders.length === 0 && (
        <p className="text-muted text-center">No orders yet</p>
      )}

      {/* ✅ LIST */}
      {orders.map(order => (
        <div
          key={order.id}
          className="card p-3 mb-3 shadow-sm border-0 rounded-3"
          onClick={() => navigate(`/orders/${order.id}`)}
          style={{ cursor: "pointer" }}
        >

          <div className="d-flex flex-column flex-md-row justify-content-between gap-2">

          <div>
            <div className="fw-semibold text-dark">Order #{order.id}</div>

            <small className="text-muted d-block">
              {new Date(order.created_at).toLocaleDateString()}
            </small>

            {/* ✅ PRODUCT NAMES */}
            <small className="text-muted">
              {order.items?.map((item, index) => (
                <span key={index}>
                  {item.product_name}
                  {index !== order.items.length - 1 && ", "}
                </span>
              ))}
            </small>
          </div>

            <div className="d-flex flex-column align-items-start align-items-md-end">

              <span
                className="badge mb-1"
                style={getStatusStyle(order.status)}
              >
                {order.status}
              </span>

              <div className="fw-semibold">₹{order.total_price}</div>

            </div>

          </div>

        </div>
      ))}

    </section>
  )
}