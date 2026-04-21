import { useEffect, useState } from "react";
import API from "../api";

function PendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await API.get("/products/pending/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setProducts(res.data);
      } catch (err) {
        console.log(err);
        setProducts([]); // safety
      } finally {
        setLoading(false);
      }
    };
  
    fetchPending();
  }, [token]);

  const approveProduct = async (id) => {
    try {
      await API.post(`/products/approve/${id}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  if (products.length === 0)
    return <p className="text-center mt-5">No pending products 🎉</p>;

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Pending Products</h3>

      <div className="row g-4">
        {products.map(product => (
          <div key={product.id} className="col-md-4">
            <div className="card p-3 shadow">
            <div style={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
                }}>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain"
                    }}
                />
                </div>

              <h5 className="mt-3">{product.name}</h5>
              <p>₹{product.price}</p>

              <button
                className="btn btn-success w-100"
                onClick={() => approveProduct(product.id)}
              >
                Approve
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PendingProducts;