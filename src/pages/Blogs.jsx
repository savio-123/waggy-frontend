import { useEffect, useState, useRef } from "react"
import { Link,useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import API from "../api"

export default function Blogs() {

  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ prevent multiple calls
  const fetchedRef = useRef(false)
  const navigate = useNavigate()


  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    const fetchBlogs = async () => {
      try {
        const res = await API.get("/blogs/")
        setBlogs(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const handleAddBlog = () => {
    const token = localStorage.getItem("token")
  
    if (!token) {
      toast.error("Login required")
      return
    }
  
    navigate("/add-blog")
  }

  if (loading) {
    return <h4 className="text-center mt-5">Loading blogs...</h4>
  }

  return (
    <section className="container my-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">All Blogs</h2>

        <button className="btn btn-dark" onClick={handleAddBlog}>
        + Add Blog
      </button>
      </div>

      <div className="row">

        {blogs.map(blog => {

          // ✅ compute once per render
          const date = new Date(blog.created_at)
          const day = date.getDate()
          const month = date.toLocaleString("default", { month: "short" })
          const year = date.getFullYear()

          return (
            <div className="col-md-4 mb-4" key={blog.id}>

              <div className="card position-relative">

                {/* DATE */}
                <div className="position-absolute bg-light p-2 m-2 rounded text-dark">
                  <b>{day}</b> {month} {year}
                </div>

                <Link to={`/blogs/${blog.id}`}>
                  <img
                    src={blog.image}
                    className="img-fluid rounded-4"
                  />
                </Link>

                <div className="card-body">

                  <Link to={`/blogs/${blog.id}`}>
                    <h5>{blog.title}</h5>
                  </Link>

                  <p>{blog.content?.slice(0, 120)}...</p>

                  <Link
                    to={`/blogs/${blog.id}`}
                    className="btn btn-sm btn-outline-dark"
                  >
                    Read More
                  </Link>

                </div>

              </div>

            </div>
          )
        })}

      </div>

    </section>
  )
}