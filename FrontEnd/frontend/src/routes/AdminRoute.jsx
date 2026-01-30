import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const role = localStorage.getItem("role");

  // not logged in
  if (!role) {
    return <Navigate to="/" replace />;
  }

  // logged in but not admin
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // admin allowed
  return <Outlet />;
};

export default AdminRoute;
