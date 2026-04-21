import { useState } from "react"
import toast from "react-hot-toast"

export default function Register() {

  const [form, setForm] = useState({
    username: "",
    email: "",
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

    const { username, email, password } = form   // ✅ FIX

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
      const res = await fetch("https://waggy-backend-rhf8.onrender.com/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Account created! 🎉")
        window.location.href = "/login"
      } else {
        toast.error(data.error || "Registration failed")
      }

    } catch (err) {
      console.log(err)
      toast.error("Server error")
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
                type="password"
                name="password"
                className="form-control form-control-lg mb-3"
                placeholder="Password"
                autoComplete="new-password"
                onChange={handleChange}
                required
              />

              <button className="btn btn-dark w-100">
                Register
              </button>

            </form>

          </div>

        </div>
      </div>
    </section>
  )
}