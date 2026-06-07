import { Navigate } from "react-router-dom";

function AdminRoute({ isAdmin, children }) {
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
}

export default AdminRoute;