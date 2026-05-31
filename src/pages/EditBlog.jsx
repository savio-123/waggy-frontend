import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import API from "../api"
import toast from "react-hot-toast"

export default function EditBlog() {

  const { id } = useParams()
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
      return
    }

    fetchBlog()
  }, [])

  const fetchBlog = async () => {
    try {
      const res = await API.get(`/blogs/${id}/`)

      setForm({
        title: res.data.title,
        content: res.data.content,
        image: null
      })

      setPreview(res.data.image_url)

    } catch (err) {
      console.log(err)
      toast.error("Failed to load blog")
      navigate("/my-blogs")
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "image") {

      const file = files[0]

      setForm(prev => ({
        ...prev,
        image: file
      }))

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title || !form.content) {
      return toast.error("Title and content are required")
    }

    setLoading(true)

    try {

      const formData = new FormData()

      formData.append("title", form.title)
      formData.append("content", form.content)

      if (form.image) {
        formData.append("image", form.image)
      }

      await API.put(
        `/blogs/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success("Blog updated successfully ✨")

      navigate("/my-blogs")

    } catch (err) {
      console.log(err)
      toast.error("Failed to update blog")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container my-5" style={{ maxWidth: "700px" }}>

      <h2 className="fw-bold mb-4">Edit Blog ✏️</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Enter blog title..."
          className="form-control mb-3"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="content"
          placeholder="Write your blog content..."
          className="form-control mb-3"
          rows="6"
          value={form.content}
          onChange={handleChange}
        />

        <input
          type="file"
          name="image"
          className="form-control mb-3"
          onChange={handleChange}
        />

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

        <button
          className="btn btn-dark w-100"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>

      </form>

    </section>
  )
}