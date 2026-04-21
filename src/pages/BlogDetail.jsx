import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import API from "../api"

export default function BlogDetail() {

  const { id } = useParams()

  const [blog, setBlog] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState("")

  // ✅ useRef (no re-render)
  const replyRef = useRef({})
  const tokenRef = useRef(localStorage.getItem("token"))
  const userRef = useRef(JSON.parse(localStorage.getItem("user")))
  const userId = userRef.current?.id

  // ✅ COMBINED FETCH (faster)
  const fetchAll = async () => {
    try {
      const [blogRes, commentRes] = await Promise.all([
        API.get(`/blogs/${id}/`),
        API.get(`/blogs/${id}/comments/`)
      ])

      setBlog(blogRes.data)
      setComments(commentRes.data)

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [id])

  // LIKE
  const handleLike = async () => {
    if (!tokenRef.current) return alert("Login required")

    await API.post(`/blogs/${id}/like/`, {}, {
      headers: { Authorization: `Bearer ${tokenRef.current}` }
    })

    fetchAll()
  }

  // ADD COMMENT
  const handleComment = async () => {
    if (!tokenRef.current) return alert("Login required")

    await API.post(`/blogs/${id}/comments/`, {
      content: newComment
    }, {
      headers: { Authorization: `Bearer ${tokenRef.current}` }
    })

    setNewComment("")
    fetchAll()
  }

  // DELETE
  const handleDelete = async (commentId) => {
    await API.delete(`/comments/${commentId}/`, {
      headers: { Authorization: `Bearer ${tokenRef.current}` }
    })
    fetchAll()
  }

  // EDIT
  const handleEdit = async (commentId) => {
    await API.put(`/comments/${commentId}/`, {
      content: editText
    }, {
      headers: { Authorization: `Bearer ${tokenRef.current}` }
    })

    setEditingComment(null)
    fetchAll()
  }

  // REPLY (🔥 no state re-render)
  const handleReply = async (commentId) => {
    await API.post(`/comments/${commentId}/reply/`, {
      content: replyRef.current[commentId]
    }, {
      headers: { Authorization: `Bearer ${tokenRef.current}` }
    })

    replyRef.current[commentId] = ""
    fetchAll()
  }

  if (!blog) return <h3>Loading...</h3>

  return (
    <section className="container my-5">

      <h1>{blog.title}</h1>

      <div className="d-flex justify-content-between mb-3">
        <p className="text-muted">💬 {comments.length} comments</p>

        <button
          className={`btn ${blog.is_liked ? "btn-danger" : "btn-outline-danger"}`}
          onClick={handleLike}
        >
          ❤️ {blog.total_likes}
        </button>
      </div>

      <img src={blog.image} className="img-fluid rounded mb-4" />

      <p style={{ lineHeight: "1.8" }}>{blog.content}</p>

      {/* ADD COMMENT */}
      <div className="d-flex gap-2 my-4">
        <input
          className="form-control"
          placeholder="Write comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn btn-dark" onClick={handleComment}>
          Post
        </button>
      </div>

      {/* COMMENTS */}
      {comments.map(c => (
        <div key={c.id} className="border p-3 mb-3 rounded">

          <div className="d-flex align-items-center gap-2">
            <img
              src={
                c.user_image
                  ? c.user_image
                  : "/images/default-avatar.png"
              }
              style={{ width: 35, height: 35, borderRadius: "50%" }}
            />
            <strong>{c.user}</strong>
          </div>

          {editingComment === c.id ? (
            <div className="mt-2 d-flex gap-2">
              <input
                className="form-control"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button className="btn btn-success" onClick={() => handleEdit(c.id)}>
                Save
              </button>
            </div>
          ) : (
            <p className="mt-2">{c.content}</p>
          )}

          {c.user_id === userId && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  setEditingComment(c.id)
                  setEditText(c.content)
                }}
              >
                Edit
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(c.id)}
              >
                Delete
              </button>
            </div>
          )}

          {/* REPLIES */}
          {c.replies.map(r => (
          <div key={r.id} className="ms-4 mt-2 border-start ps-3 d-flex gap-2">

            <img
              src={r.user_image || "/images/default-avatar.png"}
              style={{ width: 28, height: 28, borderRadius: "50%" }}
            />

            <div>
              <strong>{r.user}</strong>
              <p className="mb-0">{r.content}</p>
            </div>

          </div>
        ))}

          {/* ADD REPLY */}
          <div className="d-flex gap-2 mt-2">
            <input
              className="form-control form-control-sm"
              placeholder="Reply..."
              onChange={(e) =>
                (replyRef.current[c.id] = e.target.value)
              }
            />
            <button
              className="btn btn-sm btn-outline-dark"
              onClick={() => handleReply(c.id)}
            >
              Reply
            </button>
          </div>

        </div>
      ))}

    </section>
  )
}