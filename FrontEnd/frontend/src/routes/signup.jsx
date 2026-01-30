import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
    role: "user",
  });

  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(""); // reset previous errors



  try {
    // Prepare payload
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      image: formData.image ? formData.image.name : "", // send file name only for now
      role: formData.role
    };

    

    await axios.post(
      "http://localhost:8000/api/auth/register",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    alert("Signup successful! Please login.");
    navigate("/login");

  } catch (err) {
    // Improved error handling
    if (err.response) {
      const msg = err.response.data?.message || "User already exists";
      if (msg.includes("exists")) {
        setError("Email already exists. Please use a different email.");
      } else {
        setError(msg);
      }
    } else if (err.request) {
      setError("No response from server. Please try again later.");
    } else {
      setError("Error: " + err.message);
    }
  }
};




  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-sm p-3"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h5 className="text-center mb-3 fw-bold">
          Sign <span className="text-primary">Up</span>
        </h5>

        {error && (
          <div className="alert alert-danger text-center py-1 mb-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">

          {/* Image Upload */}
          <div className="d-flex justify-content-center mb-1">
            <label
              className="d-flex justify-content-center align-items-center border border-2 border-secondary rounded"
              style={{
                width: "120px",
                height: "120px",
                cursor: "pointer",
                background: "#f8f9fa",
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-100 h-100 rounded"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <span className="text-muted text-center small">
                  Upload<br />Image
                </span>
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                hidden
                onChange={handleChange}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="form-label mb-0 small">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control form-control-sm text-center"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="form-label mb-0 small">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control form-control-sm text-center"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="form-label mb-0 small">Password</label>
            <input
              type="password"
              name="password"
              className="form-control form-control-sm text-center"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="form-label mb-0 small">Role</label>
            <select
              name="role"
              className="form-select form-select-sm text-center"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Actions */}
          <button className="btn btn-primary btn-sm w-100 mt-2">
            Register
          </button>

          <p className="text-center mb-0 small">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Signup;
