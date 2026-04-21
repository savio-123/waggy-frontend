import { useEffect, useState } from "react";
import API from "../api";

function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [confirmBox, setConfirmBox] = useState({
    show: false,
    id: null,
    status: "",
    is_paid: false
  });

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.log(err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ STATUS UPDATE (OPEN MODAL)
  const confirmOrder = (id, status, is_paid) => {

    // 🚫 BLOCK if already completed
    if (status === "Delivered" && is_paid) {
      return; // do nothing
    }
  
    setConfirmBox({
      show: true,
      id,
      status,
      is_paid
    });
  };

 
  const handleConfirm = async () => {
    try {
      //  update status
      await API.put(
        `/orders/${confirmBox.id}/status/`,
        { status: confirmBox.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      //  update payment ONLY HERE
      await API.put(
        `/orders/${confirmBox.id}/payment/`,
        { is_paid: confirmBox.is_paid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setConfirmBox({ show: false, id: null, status: "", is_paid: false });
  
      fetchOrders();
  
    } catch (err) {
      console.log(err);
    }
  };

  //  PAYMENT TOGGLE
  const togglePayment = async (id, is_paid) => {
    try {
      await API.put(
        `/orders/${id}/payment/`,
        { is_paid },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await API.delete(`/admin/orders/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Pending") return "bg-warning text-dark";
    if (status === "Shipped") return "bg-info text-dark";
    if (status === "Delivered") return "delivered-badge"; 
    return "bg-secondary";
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.username?.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search);

    const matchesStatus =
      statusFilter === "" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container py-5" style={{ paddingBottom: "80px" }}>

      <h2 className="mb-4 fw-bold">📦 Orders Management</h2>

      {/* SEARCH */}
      <div className="d-flex flex-wrap gap-2 mb-4">

        <input
          type="text"
          placeholder="Search by username or order ID..."
          className="form-control"
          style={{ maxWidth: "250px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>

      </div>

      {/* LIST */}
      <div className="row g-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="col-lg-6">
            <div className="card border-0 shadow-lg p-3 rounded-4">

              {/* HEADER */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-semibold text-dark">
                  Order #<span style={{ color: "red" }}>{order.id}</span>
                </h5>

                <span className={`badge ${getStatusColor(order.status)} px-3 py-2`}>
                  {order.status}
                </span>
              </div>

              {/* USER */}
              <div className="mb-2">
                <small className="text-muted">
                  Customer: <span className="fw-semibold">
                    {order.username}
                  </span>
                </small>
                <p className="text-muted small">User ID: {order.user}</p>
              </div>

              {/* PRICE */}
              <h6 className="text-primary fw-bold mb-3">
                ₹{order.total_price}
              </h6>

              {/* ITEMS */}
              <div className="border-top pt-3">
                {order.items.map((item, index) => (
                  <div key={index} className="d-flex align-items-center gap-3 mb-3">

                    <div style={{
                      width: "60px",
                      height: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f8f9fa",
                      borderRadius: "10px"
                    }}>
                      <img
                        src={item.product_image}
                        alt=""
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain"
                        }}
                      />
                    </div>

                    <div>
                      <p className="mb-0 fw-semibold text-dark">
                        {item.product_name}
                      </p>
                      <small className="text-muted">
                        Qty: {item.quantity}
                      </small>
                    </div>

                  </div>
                ))}
              </div>

              {/* STATUS SELECT */}
              <div className="mt-3">
                <select
                  className="form-select"
                  value={order.status}
                  onChange={(e) =>
                    confirmOrder(order.id, e.target.value, order.is_paid)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              {/* PAYMENT */}
              {order.payment_method === "ONLINE" ? (

              <div className="mt-2">
                <button className="btn btn-success w-100" disabled>
                  Paid (Online)
                </button>
              </div>

              ) : (

              <div className="mt-2 d-flex gap-2">

                <button
                  className={`btn w-50 ${
                    order.is_paid ? "btn-success" : "btn-outline-success"
                  }`}
                  onClick={() =>
                    setConfirmBox({
                      show: true,
                      id: order.id,
                      status: order.status,
                      is_paid: true
                    })
                  }
                >
                  Paid
                </button>

                <button
                  className="btn btn-outline-danger w-50"
                  disabled={order.is_paid}
                  onClick={() =>
                    setConfirmBox({
                      show: true,
                      id: order.id,
                      status: order.status,
                      is_paid: false
                    })
                  }
                >
                  Not Paid
                </button>

              </div>

              )}

              {/* ACTIONS */}
              <div
                className='d-flex flex-column gap-2 mt-3 align-items-center' 
              >

                {!(order.status === "Delivered" && order.is_paid) && (
                  <button
                    className="btn btn-outline-dark w-50"
                    onClick={() =>
                      confirmOrder(order.id, order.status, order.is_paid)
                    }
                  >
                    ✔ Confirm
                  </button>
                )}

                <button
                  className={`btn btn-danger ${
                    order.status === "Delivered" && order.is_paid ? "w-50" : "w-50"
                  }`}
                  onClick={() => deleteOrder(order.id)}
                >
                  🗑 Delete
                </button>

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* 🔥 MODAL */}
      {confirmBox.show && (
        <div className="confirm-overlay">

          <div className="confirm-modal">

            <h5>Confirm Action</h5>

            <p>
              Mark order as <strong>{confirmBox.status}</strong>?
            </p>

            <div className="confirm-actions">

              <button
                className="btn-cancel"
                onClick={() =>
                  setConfirmBox({ show: false, id: null, status: "" })
                }
              >
                Cancel
              </button>

              <button
                className="btn-confirm"
                onClick={handleConfirm}
              >
                Yes Confirm
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default OrdersAdmin;