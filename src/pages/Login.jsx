import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import API from "../api"

export default function Login() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: "",
    password: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState("")
  const [usernameForOTP, setUsernameForOTP] = useState("")

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.username || !form.password) {
      return toast.error("All fields required")
    }

    try {
      setLoading(true)

      const res = await API.post("/auth/login/", form)

      if (res.data.message === "OTP sent successfully") {

        setUsernameForOTP(res.data.username)
      
        setShowOTP(true)
      
        toast.success("OTP sent to your phone")
      
        return
      }

    } catch (err) {
      const message =
        err.response?.data?.error || "Login failed"
    
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {

    if (!otp) {
      return toast.error("Enter OTP")
    }
  
    try {
  
      setOtpLoading(true)
  
      const res = await API.post(
        "/auth/verify-otp/",
        {
          username: usernameForOTP,
          otp
        }
      )
  
      localStorage.setItem("token", res.data.access)
      localStorage.setItem("refresh", res.data.refresh)
  
      window.dispatchEvent(new Event("login"))
  
      toast.success("Login successful 🎉")
  
      navigate("/")
  
    } catch (err) {
  
      toast.error(
        err.response?.data?.error ||
        "Invalid OTP"
      )
  
    } finally {
      setOtpLoading(false)
    }
  }

  return (
    <section className="container-fluid vh-100 overflow-hidden">
     <div className="row h-100">

        {/*  LEFT IMAGE */}
        <div className="col-md-6 d-none d-md-block p-0 ">
        <img
          src="/images/login4.png"
          alt="login"
          style={{
            width: "100%",
            height: "100vh",  
            objectFit: "cover"
          }}
        />
        </div>

        {/*  RIGHT FORM */}
        <div className="col-md-6 d-flex align-items-center justify-content-center login-bg">

<div className="glass-card">          
<div className="login-logo">
  <img src="/images/logo.png" alt="logo" />
</div>

  <h3 className="text-center fw-bold mb-2">Welcome Back</h3>
  <p className="text-center text-light mb-4">Login to continue</p>

  <form onSubmit={handleSubmit}>

  {!showOTP ? (
    <>

      <div className="input-group-custom">
        <FaUser className="input-icon" />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group-custom">
        <FaLock className="input-icon" />

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <span
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <div className="text-end mb-3">
        <span
          className="forgot-link"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </span>
      </div>

      <button
        className="btn btn-dark w-100 login-btn"
        disabled={loading}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
            />
            Sending OTP...
          </>
        ) : (
          "Login"
        )}
      </button>

    </>
  ) : (
    <>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        type="button"
        className="btn btn-success w-100"
        onClick={verifyOTP}
        disabled={otpLoading}
      >
        {otpLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
            />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </button>

    </>
  )}

</form>

</div>

</div>

      </div>

    </section>
  )
}