import { useEffect, useState, useRef } from "react"
import API from "../api"
import { Link } from "react-router-dom"

export default function RelatedProducts({ productId }) {

  const [products, setProducts] = useState([])
  const scrollRef = useRef()

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get(`/products/${productId}/related/`)
      setProducts(res.data)
    }

    if (productId) fetch()
  }, [productId])

  if (products.length === 0) return null

  const scroll = (direction) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth"
    })
  }

  return (
    <div className="mt-5 position-relative">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold m-0">Related Products</h4>

        {/* DESKTOP SCROLL BUTTONS */}
        <div className="d-none d-md-flex gap-2">
          <button className="btn btn-light border" onClick={() => scroll("left")}>‹</button>
          <button className="btn btn-light border" onClick={() => scroll("right")}>›</button>
        </div>
      </div>

      {/* SCROLL CONTAINER */}
      <div
        ref={scrollRef}
        className="d-flex gap-3 overflow-auto pb-2"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none"
        }}
      >
        {products.map(p => (
          <div
            key={p.id}
            style={{ minWidth: "180px", maxWidth: "180px", flex: "0 0 auto" }}
          >

            <Link to={`/product/${p.id}`} style={{ textDecoration:"none", color:"inherit" }}>
              
              <div className="card border-0 shadow-sm h-100"
                style={{
                  transition: "0.2s",
                  borderRadius: "12px"
                }}
                onMouseEnter={(e)=>e.currentTarget.style.transform="translateY(-5px)"}
                onMouseLeave={(e)=>e.currentTarget.style.transform="translateY(0)"}
              >

                <img
                  src={p.image}
                  style={{
                    height:"140px",
                    objectFit:"cover",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px"
                  }}
                />

                <div className="card-body p-2">

                <h6
                style={{
                    fontSize: "14px",
                    minHeight: "20px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    color:'black'
                }}
                >
                {p.name}
                </h6>

                {/*  DESCRIPTION */}
                <p
                className="text-muted mb-1"
                style={{
                    fontSize: "12px",
                    minHeight: "32px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                }}
                >
                {p.description}
                </p>

                <div className="text-primary fw-bold">
                ₹{p.price}
                </div>

                </div>

              </div>

            </Link>

          </div>
        ))}
      </div>

    </div>
  )
}