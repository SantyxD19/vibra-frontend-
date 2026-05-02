import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔒 si no hay usuario o no es admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/events" replace />;
  }

  return children;
}

export default AdminRoute;
