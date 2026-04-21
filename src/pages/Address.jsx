import { useEffect, useState,useRef } from "react"
import API from "../api"

export default function Address() {

  const [addresses, setAddresses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    name: "",
    phone: "",
    house: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: ""
  })

  const tokenRef = useRef(localStorage.getItem("token"))

  const fetchAddresses = async () => {
    const res = await API.get("/addresses/", {
      headers: { Authorization: `Bearer ${tokenRef.current}` }
    })
    setAddresses(res.data)
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingId) {
        await API.put(`/addresses/${editingId}/`, form, {
          headers: { Authorization: `Bearer ${tokenRef.current}` }
        })
      } else {
        await API.post("/addresses/", form, {
          headers: { Authorization: `Bearer ${tokenRef.current}` }
        })
      }

      setShowForm(false)
      setEditingId(null)
      setForm({
        name: "",
        phone: "",
        house: "",
        area: "",
        landmark: "",
        city: "",
        state: "",
        pincode: ""
      })

      fetchAddresses()

    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (id) => {
    await API.delete(`/addresses/${id}/`, {
      headers: { Authorization: `Bearer ${tokenRef.current}` }
    })
    fetchAddresses()
  }

  const handleEdit = (addr) => {
    setForm(addr)
    setEditingId(addr.id)
    setShowForm(true)
  }

  return (
    <div className="container my-5">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Your Addresses</h3>

        <button
          className="btn"
          style={{
            background: "#ff6f00",
            color: "white",
            fontWeight: "500",
            borderRadius: "8px"
          }}
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
          }}
        >
          + Add Address
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form className="card p-4 mb-4 shadow-sm border-0 rounded-3" onSubmit={handleSubmit}>

          <h5 className="mb-3 text-dark">{editingId ? "Edit Address" : "Add Address"}</h5>

          <div className="row g-2">
            <div className="col-md-6">
              <input name="name" className="form-control" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <input name="phone" className="form-control" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            </div>
          </div>

          <input name="house" className="form-control mt-2" placeholder="House / Building" value={form.house} onChange={handleChange} required />

          <textarea name="area" className="form-control mt-2" placeholder="Area / Street" value={form.area} onChange={handleChange} required />

          <input name="landmark" className="form-control mt-2" placeholder="Landmark (optional)" value={form.landmark} onChange={handleChange} />

          <div className="row g-2 mt-1">
            <div className="col-md-4">
              <input name="city" className="form-control" placeholder="City" value={form.city} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <input name="state" className="form-control" placeholder="State" value={form.state} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <input name="pincode" className="form-control" placeholder="Pincode" value={form.pincode} onChange={handleChange} required />
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-success">
              {editingId ? "Update Address" : "Save Address"}
            </button>

            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>

        </form>
      )}

      {/* ADDRESS LIST */}
      <div className="row g-3">

        {addresses.map(addr => (
          <div className="col-md-6" key={addr.id}>

            <div className="card p-3 shadow-sm border-0 rounded-3 h-100">

              {/* HEADER */}
              <div className="d-flex justify-content-between align-items-start mb-2">

                <div>
                  <div className="fw-semibold text-dark">{addr.name}</div>
                  <div className="text-muted small">{addr.phone}</div>
                </div>

                {addr.is_default && (
                  <span
                    style={{
                      background: "#e6f4ea",
                      color: "#198754",
                      fontSize: "12px",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontWeight: "500"
                    }}
                  >
                    ✓ Default
                  </span>
                )}

              </div>

              {/* ADDRESS */}
              <div className="small text-muted">
                {addr.house}, {addr.area}
              </div>

              {addr.landmark && (
                <div className="small text-muted">{addr.landmark}</div>
              )}

              <div className="small text-muted">
                {addr.city}, {addr.state} - {addr.pincode}
              </div>

              {/* ACTIONS */}
              <div className="d-flex gap-2 mt-3 flex-wrap">

                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => handleEdit(addr)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(addr.id)}
                >
                  Delete
                </button>

                {!addr.is_default && (
                  <button
                    className="btn btn-sm"
                    style={{
                      background: "#198754",
                      color: "white"
                    }}
                    onClick={async () => {
                      await API.put(`/addresses/${addr.id}/`,
                        { is_default: true },
                        { headers: { Authorization: `Bearer ${token}` } }
                      )
                      fetchAddresses()
                    }}
                  >
                    Set Default
                  </button>
                )}

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}