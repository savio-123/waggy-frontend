import { useState, useRef } from "react"
import API from "../api"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function AddBlog() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null
  })

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)


  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) {
      toast.error("Login required")
      navigate("/login")
    }
  }, [])

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "image") {
      const file = files[0]

      setForm(prev => ({
        ...prev,
        image: file
      }))

      // IMAGE PREVIEW
      if (file) {
        setPreview(URL.createObjectURL(file))
      }

    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      return toast.error("Login required")
    }

    if (!form.title || !form.content || !form.image) {
      return toast.error("All fields are required")
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", form.title)
      formData.append("content", form.content)
      formData.append("image", form.image)

      await API.post("/blogs/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      toast.success("Blog published 🚀")

      navigate("/blogs")

    } catch (err) {
      console.log(err)
      toast.error("Failed to create blog")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container my-5" style={{ maxWidth: "700px" }}>

      <h2 className="fw-bold mb-4">Create Blog ✍️</h2>

      <form onSubmit={handleSubmit}>

        {/* TITLE */}
        <input
          type="text"
          name="title"
          placeholder="Enter blog title..."
          className="form-control mb-3"
          value={form.title}
          onChange={handleChange}
        />

        {/* CONTENT */}
        <textarea
          name="content"
          placeholder="Write your blog content..."
          className="form-control mb-3"
          rows="6"
          value={form.content}
          onChange={handleChange}
        />

        {/* IMAGE */}
        <input
          type="file"
          name="image"
          className="form-control mb-3"
          onChange={handleChange}
        />

        {/* IMAGE PREVIEW */}
        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: "250px",
                objectFit: "cover",
                borderRadius: "10px"
              }}
            />
          </div>
        )}

        {/* BUTTON */}
        <button
          className="btn btn-dark w-100"
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>

      </form>

    </section>
  )
}