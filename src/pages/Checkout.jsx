import { useEffect, useState, useRef } from "react"
import API from "../api"
import { useNavigate, useLocation } from "react-router-dom"

export default function Checkout() {

  const [cartItems, setCartItems] = useState([])
  const [address, setAddress] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const location = useLocation()

  const address_id = location.state?.address_id

  // ✅ useRef
  const tokenRef = useRef(localStorage.getItem("token"))
  const fetchedRef = useRef(false)

  const fetchData = async () => {
    try {
      const [cartRes, addressRes] = await Promise.all([
        API.get("/cart/", {
          headers: { Authorization: `Bearer ${tokenRef.current}` }
        }),
        API.get("/addresses/", {
          headers: { Authorization: `Bearer ${tokenRef.current}` }
        })
      ])

      setCartItems(cartRes.data)

      const selected = addressRes.data.find(a => a.id === address_id)
      setAddress(selected)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!address_id) {
      navigate("/cart")
      return
    }

    if (fetchedRef.current) return
    fetchedRef.current = true

    fetchData()
  }, [])

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const platformFee = 15
  const total = subtotal + platformFee

  // ✅ HANDLERS (clean)

  const handlePayment = async () => {
    try {
      const res = await API.post(
        "/payment/create/",
        { address_id },
        { headers: { Authorization: `Bearer ${tokenRef.current}` } }
      )

      const data = res.data

      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: "INR",
        name: "Pet Shop",
        description: "Order Payment",
        order_id: data.razorpay_order_id,
        handler: async function (response) {
          await API.post(
            "/payment/verify/",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              address_id: address_id
            },
            {
              headers: { Authorization: `Bearer ${tokenRef.current}` }
            }
          )
        
          alert("Payment successful 🎉")
          navigate("/orders")
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      console.log(err)
    }
  }

  const handleCOD = async () => {
    try {
      await API.post(
        "/order/create/",
        { address_id },
        {
          headers: { Authorization: `Bearer ${tokenRef.current}` }
        }
      )

      alert("Order placed with Cash on Delivery ✅")
      navigate("/orders")

    } catch (err) {
      console.log(err)
    }
  }

  if (loading) {
    return <h4 className="text-center text-dark mt-5">Loading checkout...</h4>
  }

  return (
    <section className="my-5">
      <div className="container">

        <div className="row">

          {/* LEFT */}
          <div className="col-md-8">

            {address && (
              <div className="card p-3 shadow-sm border-0 mb-3">

                <div className="d-flex justify-content-between">

                  <div>
                    <strong className="text-dark">{address.name}</strong>
                    <div className="small text-muted">{address.phone}</div>

                    <div className="small mt-2 text-muted">
                      {address.house}, {address.area}
                    </div>

                    <div className="small text-muted">
                      {address.city}, {address.state} - {address.pincode}
                    </div>
                  </div>

                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => navigate("/cart")}
                  >
                    Change
                  </button>

                </div>

              </div>
            )}

            {/* ITEMS */}
            <div className="card p-3 shadow-sm border-0">

              <h5 className="text-dark">Order Items</h5>

              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-2"
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px"
                      }}
                    />

                    <div>
                      <div className="text-dark">{item.product.name}</div>
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
                          {item.product.description}
                        </p>
                      <small className="text-dark">Qty: {item.quantity}</small>
                    </div>

                    </div>

                  <strong className="text-primary">
                    ₹{item.product.price * item.quantity}
                  </strong>
                </div>
              ))}

            </div>

          </div>

          {/* RIGHT */}
          <div className="col-md-4">

            <div className="card p-4 shadow-sm border-0">

              <h5 className="text-dark">Price Details</h5>

              <div className="d-flex justify-content-between">
                <span className="text-dark">Subtotal</span>
                <span className="text-primary">₹{subtotal}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span className="text-dark">Platform Fee</span>
                <span className="text-dark">₹{platformFee}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span className="text-dark">Delivery</span>
                <span style={{color:'green'}}>FREE</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold">
                <span className="text-dark">Total</span>
                <span className="text-primary">₹{total}</span>
              </div>

              <button
                className="btn w-100 mt-3"
                style={{ background: "#ff6f00", color: "white" }}
                onClick={handlePayment}
              >
                Pay Now
              </button>

              <button
                className="btn w-100 mt-2"
                style={{ background: "#212529", color: "white" }}
                onClick={handleCOD}
              >
                Cash on Delivery
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}