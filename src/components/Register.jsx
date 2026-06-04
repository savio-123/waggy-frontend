import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import API from "../api"

export default function Register() {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const {phone, password } = form 

    if (!phone.startsWith("+")) {
      return toast.error("Use country code. Example: +919876543210")
    }

    if (password.length < 8) {
      return toast.error("Min 8 characters required")
    }

    if (!/[A-Za-z]/.test(password)) {
      return toast.error("Must include a letter")
    }

    if (!/\d/.test(password)) {
      return toast.error("Must include a number")
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return toast.error("Must include a special character")
    }

    try {

      setLoading(true)
    
      await API.post(
        "/auth/register/",
        form
      )
    
      toast.success("Account created! 🎉")
      navigate("/login")
    } catch (err) {
    
      const message =
        err.response?.data?.error ||
        "Registration failed"
    
      toast.error(message)
    
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="register"
      style={{ background: "url('/images/background-img.png') no-repeat" }}
    >
      <div className="container">
        <div className="row py-5">

          <div className="offset-md-3 col-md-6 my-3">

            <h2 className="display-3 fw-normal text-center">
              Get 20% Off on <span className="text-primary">first Purchase</span>
            </h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="username"
                className="form-control form-control-lg mb-3"
                placeholder="Username"
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                className="form-control form-control-lg mb-3"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              
              <input
                type="tel"
                name="phone"
                className="form-control form-control-lg mb-3"
                placeholder="+919876543210, include country code"
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                className="form-control form-control-lg mb-3"
                placeholder="Password"
                autoComplete="new-password"
                onChange={handleChange}
                required
              />

              <button
                className="btn btn-dark w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>

            </form>

          </div>

        </div>
      </div>
    </section>
  )
}