import { useEffect, useState, useRef } from "react"
import API from "../api"
import { useNavigate } from "react-router-dom"

export default function Cart() {

  const [cartItems, setCartItems] = useState([])
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)

  const navigate = useNavigate()

  // ✅ useRef (no re-render)
  const tokenRef = useRef(localStorage.getItem("token"))
  const fetchedRef = useRef(false)

  // ✅ COMBINED FETCH
  const fetchAll = async () => {
    try {
      const [cartRes, addrRes] = await Promise.all([
        API.get("/cart/", {
          headers: { Authorization: `Bearer ${tokenRef.current}` }
        }),
        API.get("/addresses/", {
          headers: { Authorization: `Bearer ${tokenRef.current}` }
        })
      ])

      setCartItems(cartRes.data)
      setAddresses(addrRes.data)

      const defaultAddr = addrRes.data.find(a => a.is_default)
      if (defaultAddr) setSelectedAddress(defaultAddr.id)

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    fetchAll()
  }, [])

  // FIX bootstrap leftover
  useEffect(() => {
    document.body.classList.remove("modal-open")
    document.querySelectorAll(".offcanvas-backdrop").forEach(el => el.remove())
  }, [])

  // ✅ HANDLERS (clean, reusable)

  const updateCart = async (url, productId) => {
    await API.post(url,
      { product_id: productId },
      { headers: { Authorization: `Bearer ${tokenRef.current}` } }
    )
    fetchAll()
  }

  const handleIncrement = (id) => updateCart("/cart/add/", id)
  const handleDecrement = (id) => updateCart("/cart/remove/", id)
  const handleDelete = (id) => updateCart("/cart/delete/", id)

  // CALCULATIONS
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const platformFee = 15
  const total = subtotal + platformFee

  const handleOrder = () => {
    if (!selectedAddress) {
      alert("Select address")
      return
    }

    navigate("/checkout", {
      state: { address_id: selectedAddress }
    })
  }

  return (
    <section className="my-5">
      <div className="container">
        <div className="row">

          {/* LEFT */}
          <div className="col-md-8">

            {/* ADDRESS */}
            <div className="card p-3 mb-3 shadow-sm border-0">

              <h6 className="text-dark">Select Delivery Address</h6>

              <select
                className="form-select"
                value={selectedAddress || ""}
                onChange={(e) => setSelectedAddress(Number(e.target.value))}
              >
                <option value="">Select Address</option>

                {addresses.map(addr => (
                  <option key={addr.id} value={addr.id}>
                    {addr.name} - {addr.city} ({addr.pincode})
                  </option>
                ))}

              </select>
            </div>

            {selectedAddress && (
              <div className="mt-3 p-3 border rounded-3 bg-light">
                {(() => {
                  const addr = addresses.find(a => a.id === selectedAddress)
                  if (!addr) return null

                  return (
                    <>
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{addr.name}</strong>
                          <div className="small text-muted">{addr.phone}</div>
                        </div>

                        <span className="badge bg-success">
                          Selected
                        </span>
                      </div>

                      <div className="small mt-2">
                        {addr.house}, {addr.area}
                      </div>

                      <div className="small">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </div>
                    </>
                  )
                })()}
              </div>
            )}

            {/* ITEMS */}
            {cartItems.map(item => (
              <div key={item.id} className="card mb-3 p-3 shadow-sm border-0">

                <div className="d-flex gap-3">

                  <img
                    src={item.product.image}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />

                  <div className="flex-grow-1">

                    <h6 className="text-dark">{item.product.name}</h6>
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


                    <div className="d-flex gap-2 my-2 mb-3">

                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => handleDecrement(item.product.id)}
                      >-</button>

                      <span className="text-dark">{item.quantity}</span>

                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => handleIncrement(item.product.id)}
                      >+</button>

                    </div>

                    <h5 className="text-primary">₹{item.product.price * item.quantity}</h5>

                    <button
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => handleDelete(item.product.id)}
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* RIGHT */}
          <div className="col-md-4">

            <div className="card p-4 shadow-sm border-0">

              <h5 className="text-dark">Price Details</h5>

              <div className="d-flex justify-content-between">
                <span className="text-dark">Items</span>
                <span className="text-dark">{cartItems.length}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span className="text-dark">Subtotal</span>
                <span className="text-dark">₹{subtotal}</span>
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

              {cartItems.length > 0 && (
              <button
                className="btn w-100 mt-3"
                style={{ background: "#ff6f00", color: "white" }}
                onClick={handleOrder}
              >
                Proceed to Checkout
              </button>
            )}

            </div>

          </div>

        </div>
      </div>
    </section>
  )
}