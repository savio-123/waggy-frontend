import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../api"
import toast from "react-hot-toast"

export default function MyBlogs() {

  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  const fetchBlogs = async () => {
    try {
      const res = await API.get("/my-blogs/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setBlogs(res.data)

    } catch (err) {
      console.log(err)
      toast.error("Failed to load blogs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const deleteBlog = async (id) => {

    if (!window.confirm("Delete this blog?")) return

    try {
      await API.delete(`/blogs/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success("Blog deleted")

      setBlogs(prev => prev.filter(blog => blog.id !== id))

    } catch (err) {
      console.log(err)
      toast.error("Delete failed")
    }
  }

  if (loading) {
    return <h3 className="text-center mt-5">Loading...</h3>
  }

  return (
    <section className="container my-5">

      <h2 className="mb-4">My Blogs</h2>

      {blogs.length === 0 ? (
        <p>No blogs posted yet.</p>
      ) : (
        <div className="row">

          {blogs.map(blog => (
            <div className="col-md-4 mb-4" key={blog.id}>

              <div className="card h-100">

                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="card-img-top"
                  style={{
                    height: "220px",
                    objectFit: "cover"
                  }}
                />

                <div className="card-body">

                  <h5>{blog.title}</h5>

                  <p>
                    {blog.content.slice(0, 100)}...
                  </p>

                  <div className="d-flex gap-2">

                    <Link
                      to={`/blogs/${blog.id}`}
                      className="btn btn-outline-dark btn-sm"
                    >
                      View
                    </Link>

                    <Link
                      to={`/edit-blog/${blog.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteBlog(blog.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </section>
  )
}