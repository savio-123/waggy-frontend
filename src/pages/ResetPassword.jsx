import { useSearchParams,useNavigate } from "react-router-dom"
import { useState } from "react"
import API from "../api"
import toast from "react-hot-toast"
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa"

export default function ResetPassword() {

  const [params] = useSearchParams()
  const uid = params.get("uid")
  const token = params.get("token")

  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    
    e.preventDefault()

    if (!password) return toast.error("Enter new password")

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

      await API.post("/auth/reset-password/", {
        uid,
        token,
        password
      })

      toast.success("Password reset successful 🎉")

      setTimeout(() => {
        navigate("/login", { replace: true })
      }, 1500)

    } catch {
      toast.error("Invalid or expired link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-bg vh-100 d-flex align-items-center justify-content-center">

      <div className="fglass-card">

        <h3 className="text-center fw-bold mb-2">Reset Password</h3>
        <p className="text-center text-light mb-4">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit}>

          <div className="finput-group-custom">
            <FaLock className="finput-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <small style={{ color: "#ddd" }}>
            Must contain letter, number & special character
            </small>

          <button className="btn btn-dark w-100 login-btn" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>

      </div>

    </section>
  )
}