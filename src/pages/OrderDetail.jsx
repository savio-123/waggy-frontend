import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import toast from 'react-hot-toast'
import API from "../api"

export default function OrderDetail() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const tokenRef = useRef(localStorage.getItem("token"))

  const fetchOrder = async () => {
    try {
      setLoading(true)

      const res = await API.get(`/orders/${id}/`, {
        headers: { Authorization: `Bearer ${tokenRef.current}` }
      })

      setOrder(res.data)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const requestReturn = () => {
    toast((t) => (
      <div style={{ padding: "10px" }}>
        <p style={{ marginBottom: "10px" }}>
          Request return for this order?
        </p>
  
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn btn-dark btn-sm"
            onClick={async () => {
              try {
                await API.post(
                  `/orders/${order.id}/return/`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${tokenRef.current}`
                    }
                  }
                );
  
                toast.success("Return requested ✅");
                fetchOrder();
  
              } catch {
                toast.error("Something went wrong ❌");
              }
  
              toast.dismiss(t.id);
            }}
          >
            Yes
          </button>
  
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  useEffect(() => {
    fetchOrder()
  }, [id])

  if (loading) return <p className="text-center mt-5 text-muted">Loading...</p>
  if (!order) return null

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

      {/* HEADER */}
      <h4 className="fw-bold mb-3 text-dark">
        Order #{order.id}
      </h4>

      <span
        className="badge mb-4 px-3 py-2"
        style={getStatusStyle(order.status)}
      >
        {order.status}
      </span>

      {/* STATUS TRACKER */}
      <div className="card p-3 mb-4 shadow-sm border-0 rounded-3 bg-white">

        <h6 className="mb-3 text-dark fw-semibold">Order Status</h6>

        <div className="d-flex justify-content-between text-center">

          {["Pending", "Shipped", "Delivered"].map(step => (
            <div key={step} className="flex-fill">

              <div
                style={{
                  fontSize: "28px",
                  color:
                    order.status === step ||
                    step === "Pending" ||
                    (step === "Shipped" && order.status === "Delivered")
                      ? "green"
                      : "#ccc"
                }}
              >
                ●
              </div>

              <small className="text-muted">{step}</small>

            </div>
          ))}

        </div>
      </div>

      {/* ADDRESS */}
      <div className="card p-3 mb-4 shadow-sm border-0 rounded-3 bg-white">

        <h6 className="mb-2 text-dark fw-semibold">
          Delivery Address
        </h6>

        <div className="fw-semibold text-dark">
          {order.address.name}
        </div>

        <div className="text-muted small">
          {order.address.phone}
        </div>

        <div className="small mt-2 text-dark">
          {order.address.house}, {order.address.area}
        </div>

        <div className="small text-muted">
          {order.address.city}, {order.address.state} - {order.address.pincode}
        </div>

      </div>

      {/* ITEMS */}
      <div className="card p-3 shadow-sm border-0 rounded-3 bg-white">

        <h6 className="mb-3 text-dark fw-semibold">Items</h6>

        {order.items.map((item, i) => (
          <div
            key={i}
            className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2"
          >

            <div className="d-flex align-items-center gap-3">

              <img
                src={item.product_image}
                alt={item.product_name}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />

              <div>

                <div className="fw-semibold text-dark">
                  {item.product_name}
                </div>

                <small className="text-muted">
                  ₹{item.product_price} × {item.quantity}
                </small>

              </div>

            </div>

            <div className="fw-bold text-dark">
              ₹{item.product_price * item.quantity}
            </div>

          </div>
        ))}

        <hr />

        <div className="d-flex justify-content-between fw-bold text-dark">
          <span>Total</span>
          <span>₹{order.total_price}</span>
        </div>

        <div className="mb-2 text-dark">
          <strong>Payment:</strong>{" "}
          {order.payment_method === "COD"
            ? "Cash on Delivery"
            : "Online Payment"}
        </div>

        <div className="mb-3 text-dark">
          <strong>Payment Status:</strong>{" "}
          {order.is_paid ? "Paid ✅" : "Not Paid ❌"}
        </div>

        {/* RETRY PAYMENT */}
        {order.payment_method === "ONLINE" && !order.is_paid && (
          <button
            className="btn btn-warning w-100 mb-2"
            onClick={async () => {
              try {
                const res = await API.post(
                  `/orders/${order.id}/retry-payment/`,
                  {},
                  { headers: { Authorization: `Bearer ${tokenRef.current}` } }
                )

                const data = res.data

                const rzp = new window.Razorpay({
                  key: data.key,
                  amount: data.amount * 100,
                  currency: "INR",
                  name: "Pet Shop",
                  order_id: data.razorpay_order_id,

                  handler: async (response) => {
                    await API.post(
                      "/payment/verify/",
                      {
                        order_id: data.order_id,
                        razorpay_payment_id: response.razorpay_payment_id
                      },
                      {
                        headers: { Authorization: `Bearer ${tokenRef.current}` }
                      }
                    )

                    alert("Payment successful 🎉")
                    fetchOrder()
                  }
                })

                rzp.open()

              } catch (err) {
                console.log(err)
              }
            }}
          >
            Retry Payment
          </button>
        )}

        {/* CANCEL */}
        {!order.is_paid && order.status === "Pending" && (
          <button
            className="btn btn-danger w-100"
            onClick={async () => {
              if (!window.confirm("Are you sure you want to cancel this order?")) return

              try {
                await API.post(
                  `/orders/${order.id}/cancel/`,
                  {},
                  { headers: { Authorization: `Bearer ${tokenRef.current}` } }
                )

                alert("Order cancelled ❌")
                navigate("/orders")

              } catch (err) {
                console.log(err)
              }
            }}
          >
            Cancel Order
          </button>
        )}
        {order.status === "Delivered" && order.is_paid && order.return_status === "None" && (
        <button
          className="btn btn-outline-danger"
          onClick={requestReturn}
        >
          Request Return
        </button>
      )}

    {order.return_status !== "None" && order.is_paid && (  
      <div className="mt-3">
      <p>Return Status: {order.return_status}</p>
      <p>Refund Status: {order.refund_status}</p>
      </div>
      )}
      </div>

    </section>
  )
}