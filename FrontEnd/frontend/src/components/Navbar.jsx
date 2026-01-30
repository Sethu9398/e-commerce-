import axios from "axios";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";

function Navbar() {
    const navigate = useNavigate();
    const { searchTerm, setSearchTerm } = useContext(SearchContext);

    const role = localStorage.getItem("role"); // "admin" | "user" | null
    const isAdmin = role === "admin";
    const isLoggedIn = !!role;

    const profileImage =
        localStorage.getItem("image") ||
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    const name = localStorage.getItem("name") || "User";
    const email = localStorage.getItem("email") || "user@example.com";

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:8000/api/auth/logout",
                {},
                { withCredentials: true }
            );

            localStorage.removeItem("role");
            localStorage.removeItem("image");
            localStorage.removeItem("name");
            localStorage.removeItem("email");

            setDropdownOpen(false);
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-2 shadow-sm">
            <div className="container-fluid">

                {/* Brand */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img
                        src="https://img.freepik.com/free-vector/seasonal-sale-discounts-presents-purchase-visiting-boutiques-luxury-shopping-price-reduction-promotional-coupons-special-holiday-offers-vector-isolated-concept-metaphor-illustration_335657-2766.jpg"
                        alt="Logo"
                        width="40"
                        height="40"
                        className="d-inline-block align-text-top me-2 rounded"
                    />
                    {/* <span>Ecommerce</span> */}
                </Link>

                {/* Search Bar (for users only) */}
                {!isAdmin && (
                    <form
                        className="mx-auto  my-2 my-lg-0 flex-grow-1"
                        role="search"
                        style={{ maxWidth: "600px" }}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            className="form-control form-control-sm w-100"
                            type="search"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                )}

                {/* Hamburger */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Right Links */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-sm-0 align-items-center">

                        {/* USER NAV */}
                        {!isAdmin && (
                            <>
                                <li className="nav-item ">
                                    <Link className="nav-link text-light px-3" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-light px=3" to="/cart">Cart</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-light px-3" to="/orders">Orders</Link>
                                </li>
                            </>
                        )}

                        {/* ADMIN NAV */}
                        {isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/admin/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/admin/products">Product List</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/admin/orders">Order List</Link>
                                </li>
                            </>
                        )}

                        {/* AUTH / PROFILE */}
                        {!isLoggedIn ? (
                            <>
                                <li className="nav-item ms-2 py-2 d-flex ">
                                    <Link to="/signup" className="btn btn-outline-light btn-sm">Signup</Link>
                                </li>
                                <li className="nav-item ms-2 py-2 d-flex">
                                    <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item ms-3 position-relative">
                                <div
                                    className="d-flex align-items-center"
                                    style={{ cursor: "pointer" }}
                                    onClick={toggleDropdown}
                                >
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        width="36"
                                        height="36"
                                        className="rounded-circle border"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>

                                {/* Dropdown menu */}
                                {dropdownOpen && (
                                    <div
                                        className="position-absolute bg-white text-dark p-3 rounded shadow"
                                        style={{
                                            right: 0,
                                            top: "45px",
                                            minWidth: "220px",
                                            zIndex: 1000
                                        }}
                                    >
                                        <p className="mb-1"><strong>{name}</strong></p>
                                        <p className="mb-1 small">{email}</p>
                                        <p className="mb-2 small text-muted">Role: {role}</p>
                                        <button
                                            className="btn btn-sm btn-outline-danger w-100"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </li>
                        )}

                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;

