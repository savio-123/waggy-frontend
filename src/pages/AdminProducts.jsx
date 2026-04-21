import { useEffect, useState } from "react"
import API from "../api"
import toast from "react-hot-toast"
import "./admin.css"

export default function AdminProducts() {

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await API.get("/admin/products/", {
        params: {
          page,
          search,
          category: filterCategory,
          status: filterStatus
        }
      })

      setProducts(res.data.results)
      setTotalPages(Math.ceil(res.data.count / 8))

    } catch (err) {
      console.log(err)
    }
  }

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    const res = await API.get("/categories/")
    setCategories(res.data)
  }

  // INITIAL LOAD
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // 🔥 FETCH ON FILTER + PAGE CHANGE
  useEffect(() => {
    fetchProducts()
  }, [page, search, filterStatus, filterCategory])

  // 🔥 RESET PAGE WHEN FILTER CHANGES
  useEffect(() => {
    setPage(1)
  }, [search, filterStatus, filterCategory])

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return

    try {
      await API.delete(`/admin/products/${id}/delete/`)
      toast.success("Deleted")
      fetchProducts()
    } catch {
      toast.error("Delete failed")
    }
  }

  // UPDATE
  const handleUpdate = async (product, updates) => {
    try {
      await API.put(`/products/${product.id}/`, updates)
      toast.success("Updated")
      fetchProducts()
    } catch {
      toast.error("Update failed")
    }
  }

  const getCategoryId = (p) => {
    return typeof p.category === "object" ? p.category.id : p.category
  }

  return (
    <div className="admin-container">

      <h2 className="admin-title">📦 Product Management</h2>

      {/* FILTERS */}
      <div className="admin-filters">

        <input
          placeholder="Search product..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-control"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>

        <select
          className="form-control"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <div className="text-center mt-5">
          <h5 className="text-muted">No products found 😕</h5>
        </div>
      ) : (

        <>
          <div className="admin-grid">
            {products.map(product => (
              <div key={product.id} className="admin-card">

                <img
                  src={product.image}
                  className="admin-img"
                />

                <div className="admin-body">

                  <h6>{product.name}</h6>
                  <p>₹{product.price}</p>

                  <select
                    className="form-control mb-2"
                    value={getCategoryId(product)}
                    onChange={(e) =>
                      handleUpdate(product, { category: e.target.value })
                    }
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <button
                    className={`btn w-100 mb-2 ${
                      product.is_approved ? "btn-danger" : "btn-success"
                    }`}
                    onClick={() =>
                      handleUpdate(product, {
                        is_approved: !product.is_approved
                      })
                    }
                  >
                    {product.is_approved ? "Disapprove ❌" : "Approve ✔"}
                  </button>

                  <button
                    className="btn btn-danger w-100"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="d-flex justify-content-center mt-4 gap-2">

            <button
              className="btn btn-outline-dark"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span className="align-self-center">
              Page {page} of {totalPages}
            </span>

            <button
              className="btn btn-outline-dark"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>

          </div>

        </>
      )}

    </div>
  )
}