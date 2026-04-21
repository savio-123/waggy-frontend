import { useEffect, useState } from "react";
import API from "../api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import "./admin.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [statsRes, chartRes, topRes, ordersRes] = await Promise.all([
        API.get("/admin/stats/", { headers: { Authorization: `Bearer ${token}` }}),
        API.get("/admin/chart/", { headers: { Authorization: `Bearer ${token}` }}),
        API.get("/admin/top-products/", { headers: { Authorization: `Bearer ${token}` }}),
        API.get("/admin/recent-orders/", { headers: { Authorization: `Bearer ${token}` }}),
      ]);

      setStats(statsRes.data);

      setChartData(
        chartRes.data.map(item => ({
          ...item,
          date: new Date(item.date).toLocaleDateString()
        }))
      );

      setTopProducts(topRes.data);
      setRecentOrders(ordersRes.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!stats) return <p className="center">Loading...</p>;

  const safeChartData =
    chartData.length === 1
      ? [{ ...chartData[0], total: 0 }, ...chartData]
      : chartData;

  const pieData =
    topProducts.length > 0
      ? topProducts
      : [{ name: "No Data", value: 1 }];

  const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

  return (
    <div className="dashboard">

      <h2 className="title">Dashboard Overview</h2>

      {/* STATS */}
      <div className="cards">
        <div className="card gradient1">
          <p>Total Orders</p>
          <h3>{stats.total_orders}</h3>
        </div>

        <div className="card gradient2">
          <p>Revenue</p>
          <h3>₹{stats.total_revenue}</h3>
        </div>

        <div className="card gradient3">
          <p>Pending</p>
          <h3>{stats.pending_orders}</h3>
        </div>

        <div className="card gradient4">
          <p>Delivered</p>
          <h3>{stats.delivered_orders}</h3>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts">

        {/* LINE */}
        <div className="chart-box">
          <h4>Weekly Sales</h4>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={safeChartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="chart-box">
          <h4>Best Selling</h4>

          <div className="pie-wrapper">

            <PieChart width={250} height={250}>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>

            {/* LEGEND */}
            <div className="legend">
              {pieData.map((item, index) => (
                <div key={index} className="legend-item">
                  <span
                    className="legend-color"
                    style={{ background: COLORS[index % COLORS.length] }}
                  ></span>
                  <span>{item.name} ({item.value})</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* RECENT ORDERS */}
      <div className="orders-table">
        <h4>Recent Orders</h4>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.username}</td>
                  <td>₹{order.total_price}</td>
                  <td>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="center">No orders</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AdminDashboard;