import { useState,useEffect,useRef } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import API from "../api"

export default function AddTestimonial() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    if (!token) {
      toast.error("Login required")
      navigate("/login")
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message.trim()) return

    try {
      setLoading(true)

      const res = await API.post(
        "/testimonials/",
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert("Testimonial added!")
      setMessage("")


    } catch (err) {
      console.log(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="my-5">
      <div className="container">

        <h2 className="text-center mb-4">Share Your Experience</h2>

        <form onSubmit={handleSubmit} className="col-md-6 mx-auto">

          <textarea
            className="form-control mb-3"
            rows="4"
            placeholder="Write your testimonial..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>

        </form>

      </div>
    </section>
  )
}