import { Navigate } from "react-router-dom";

function AdminRoute({ isAdmin, children }) {

  // ⛔ if not admin → block access
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // ✅ allow access
  return children;
}

export default AdminRoute;