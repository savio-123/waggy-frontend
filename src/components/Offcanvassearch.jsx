import { useState } from "react"
import API from "../api"   // ✅ add this

export default function OffcanvasSearch() {

  const [query, setQuery] = useState("")

  const handleSearch = async (e) => {
    e.preventDefault()

    try {
      const res = await API.get(`/products/?search=${query}`)   // ✅ FIX
      console.log(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div
      className="offcanvas offcanvas-end"
      data-bs-scroll="true"
      tabIndex="-1"
      id="offcanvasSearch"
      aria-labelledby="Search"
    >
      <div className="offcanvas-header justify-content-center">
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        ></button>
      </div>

      <div className="offcanvas-body">

        <div className="order-md-last">

          <h4 className="text-primary text-uppercase mb-3">
            Search
          </h4>

          <div className="search-bar border rounded-2 border-dark-subtle">

            <form
              className="text-center d-flex align-items-center"
              onSubmit={handleSearch}
            >

              <input
                type="text"
                className="form-control border-0 bg-transparent"
                placeholder="Search Here"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <span className="fs-4 me-3">🔍</span>

            </form>

          </div>

        </div>

      </div>
    </div>
  )
}