import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../api"   // ✅ use this

export default function LatestBlog() {

  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get("/blogs/")   // ✅ FIX
        setBlogs(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchBlogs()
  }, [])

  return (
    <section id="latest-blog" className="my-5">
      <div className="container py-5 my-5">

        {/* HEADER */}
        <div className="row mt-5">
          <div className="section-header d-md-flex justify-content-between align-items-center mb-3">
            <h2 className="display-3 fw-normal">Latest Blog Post</h2>

            <div>
              <a href="#" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1">
                Read all
              </a>
            </div>
          </div>
        </div>

        {/* BLOG CARDS */}
        <div className="row">

          {blogs.map((blog) => {

            const dateObj = new Date(blog.created_at)
            const day = dateObj.getDate()
            const month = dateObj.toLocaleString("default", { month: "short" })

            return (
              <div className="col-md-4 my-4 my-md-0" key={blog.id}>

                {/* DATE BADGE */}
                <div className="z-1 position-absolute rounded-3 m-2 px-3 pt-1 bg-light">
                  <h3 className="secondary-font text-primary m-0">{day}</h3>
                  <p className="secondary-font fs-6 m-0">{month}</p>
                </div>

                {/* CARD */}
                <div className="card position-relative">

                  <Link to={`/blogs/${blog.id}`}>
                    <img
                      src={blog.image}  
                      className="img-fluid rounded-4"
                      alt={blog.title}
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                  </Link>

                  <div className="card-body p-0">

                    <Link to={`/blogs/${blog.id}`}>
                      <h3 className="card-title pt-4 pb-3 m-0">
                        {blog.title}
                      </h3>
                    </Link>

                    <div className="card-text">
                      <p className="blog-paragraph fs-6">
                        {blog.content?.slice(0, 100)}...
                      </p>

                      <Link to={`/blogs/${blog.id}`} className="blog-read">
                        read more
                      </Link>
                    </div>

                  </div>
                </div>

              </div>
            )
          })}

        </div>

      </div>
    </section>
  )
}