import { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import "./admin.css";

function ReturnsAdmin() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchReturns = async () => {
    try {
      const res = await API.get("/admin/returns/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await API.post(
        `/admin/orders/${id}/return/`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Return ${action}ed`);
      fetchReturns();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="returns-container">

      <h2 className="returns-title">Returns & Refunds</h2>

      <div className="returns-grid">

        {orders.map(order => (
          <div key={order.id} className="return-card">

            {/* HEADER */}
            <div className="return-header">
              <h5>Order #{order.id}</h5>
              <span className={`status-pill ${order.return_status?.toLowerCase()}`}>
                {order.return_status}
              </span>
            </div>

            {/* BODY */}
            <div className="return-body">
              <p><span>User:</span> {order.username}</p>
              <p><span>Total:</span> ₹{order.total_price}</p>
              <p><span>Payment:</span> {order.is_paid ? "Paid" : "Not Paid"}</p>
            </div>

            {/* ACTIONS */}
            {order.return_status === "Requested" && (
              <div className="return-actions">

                <button
                  className="btn-approve"
                  onClick={() => handleAction(order.id, "approve")}
                >
                  ✔ Approve
                </button>

                <button
                  className="btn-reject"
                  onClick={() => handleAction(order.id, "reject")}
                >
                  ✖ Reject
                </button>

              </div>
            )}

            {/* FINAL */}
            {order.return_status === "Approved" && (
              <div className="status-text success">Refund Processed</div>
            )}

            {order.return_status === "Rejected" && (
              <div className="status-text danger">Rejected</div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}

export default ReturnsAdmin;