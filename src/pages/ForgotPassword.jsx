import { useState } from "react"
import API from "../api"
import toast from "react-hot-toast"
import { FaEnvelope } from "react-icons/fa"

export default function ForgotPassword() {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) return toast.error("Enter your email")

    try {
      setLoading(true)

      await API.post("/auth/forgot-password/", { email })

      toast.success("Reset link sent to email 📩")

      setTimeout(() => {
        navigate("/login", { replace: true })  // ✅ important
      }, 1500)

    } catch {
      toast.error("User not found")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-bg vh-100 d-flex align-items-center justify-content-center">

      <div className="fglass-card">

        <h3 className="text-center fw-bold mb-2">Forgot Password</h3>
        <p className="text-center text-light mb-4">
          Enter your email to receive reset link
        </p>

        <form onSubmit={handleSubmit}>

          <div className="finput-group-custom">
            <FaEnvelope className="finput-icon" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-dark w-100 flogin-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

      </div>

    </section>
  )
}