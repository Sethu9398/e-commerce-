import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        formData,
        { withCredentials: true }
      );

      if (!res.data?.user?.role) {
        throw new Error("Invalid server response");
      }

      const localCart = JSON.parse(localStorage.getItem("cart")) || [];

      if (localCart.length > 0) {
        for (const item of localCart) {
          await axios.post(
            "http://localhost:8000/api/cart/add",
            {
              productId: item.product._id,
              quantity: item.quantity
            },
            { withCredentials: true }
          );
        }

        // ✅ clear local cart
        localStorage.removeItem("cart");
      }

      // ✅ store role (works fine)
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name",res.data.user.name)
      localStorage.setItem("email",res.data.user.email)

      // ✅ FORCE UI refresh so Navbar re-reads role
      navigate("/", { replace: true });
      window.location.reload();

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-sm px-4 py-3"
        style={{ width: "100%", maxWidth: "380px", minHeight: "360px" }}
      >
        <div className="d-flex flex-column justify-content-center h-100">

          <h5 className="text-center mb-3 fw-bold">
            Login <span className="text-primary">In</span>
          </h5>

          {error && (
            <div className="alert alert-danger text-center py-1 mb-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

            <div>
              <label className="form-label small mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control form-control-sm text-center"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label small mb-1">Password</label>
              <input
                type="password"
                name="password"
                className="form-control form-control-sm text-center"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary btn-sm w-100 mt-2">
              Submit
            </button>

            <p className="text-center small mb-0">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-decoration-none">
                Signup
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

