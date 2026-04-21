import { useState, useEffect, useRef } from "react"
import API from "../api"

function AddProduct() {

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  })

  const [categories, setCategories] = useState([])

  // ✅ useRef for image (no re-render)
  const imageRef = useRef(null)

  // ✅ useRef for token (read once)
  const tokenRef = useRef(localStorage.getItem("token"))

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories/")
        setCategories(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchCategories()
  }, [])

  // input change
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!tokenRef.current) {
      alert("Login required")
      return
    }

    const file = imageRef.current?.files[0]

    if (!file) {
      alert("Image required")
      return
    }

    const data = new FormData()
    data.append("name", formData.name)
    data.append("price", formData.price)
    data.append("description", formData.description)
    data.append("category", formData.category)
    data.append("image", file)

    try {
      await API.post("/products/", data, {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
          "Content-Type": "multipart/form-data",
        },
      })

      alert("Product submitted for approval")

      // reset form
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
      })

      if (imageRef.current) {
        imageRef.current.value = ""
      }

    } catch (err) {
      console.log(err.response?.data)
      alert("Error")
    }
  }

  return (
    <div className="container mt-5">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="form-control mb-3"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          className="form-control mb-3"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="form-control mb-3"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          className="form-control mb-3"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          className="form-control mb-3"
          ref={imageRef}
          required
        />

        <button className="btn btn-primary">
          Add Product
        </button>

      </form>
    </div>
  )
}

export default AddProduct