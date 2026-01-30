import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



function Cart() {
    const isLoggedIn = !!localStorage.getItem("role");

    const navigate = useNavigate();

    const [showOrderModal, setShowOrderModal] = useState(false);
    const [shipping, setShipping] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: ""
    });


    const [cartItems, setCartItems] = useState([]);

    /* ======================
       FETCH CART
    ====================== */
    useEffect(() => {
        if (isLoggedIn) {
            fetchServerCart();
        } else {
            fetchLocalCart();
        }
    }, []);

    const fetchServerCart = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/cart", {
                withCredentials: true
            });
            setCartItems(res.data.items || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchLocalCart = () => {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(localCart);
    };

    /* ======================
       QUANTITY HANDLERS
    ====================== */
    const updateQuantity = async (productId, qty) => {
        if (qty < 1) return;

        if (isLoggedIn) {
            await axios.put(
                "http://localhost:8000/api/cart/update",
                { productId, quantity: qty },
                { withCredentials: true }
            );
            fetchServerCart();
        } else {
            const updated = cartItems.map(item =>
                item.product._id === productId
                    ? { ...item, quantity: qty }
                    : item
            );
            localStorage.setItem("cart", JSON.stringify(updated));
            setCartItems(updated);
        }
    };

    /* ======================
       REMOVE ITEM
    ====================== */
    const removeItem = async (productId) => {
        if (isLoggedIn) {
            await axios.delete(
                `http://localhost:8000/api/cart/remove/${productId}`,
                { withCredentials: true }
            );
            fetchServerCart();
        } else {
            const updated = cartItems.filter(
                item => item.product._id !== productId
            );
            localStorage.setItem("cart", JSON.stringify(updated));
            setCartItems(updated);
        }
    };

    /* ======================
       TOTAL PRICE
    ====================== */
    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );


    const handlePlaceOrderClick = () => {
        if (!isLoggedIn) {
            navigate("/login");
        } else {
            setShowOrderModal(true);
        }
    };

    const handleOrderConfirm = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8000/api/orders",
                { shippingAddress: shipping },
                { withCredentials: true }
            );

            alert("Order placed successfully!");
            setCartItems([]);
            setShowOrderModal(false);
        } catch (err) {
            alert(err.response?.data?.message || "Order failed");
        }
    };


    return (
        <div className="container my-4">
            <h4 className="fw-bold mb-4">Your Cart</h4>

            {cartItems.length === 0 ? (
                <p className="text-muted">Your cart is empty</p>
            ) : (
                <>
                    <div className="list-group">
                        {cartItems.map(item => (
                            <div
                                key={item.product._id}
                                className="list-group-item mb-3 shadow-sm rounded"
                            >
                                <div className="row align-items-center">

                                    {/* IMAGE */}
                                    <div className="col-md-2 col-4">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="img-fluid rounded"
                                            style={{ height: "80px", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* NAME */}
                                    <div className="col-md-3 col-8">
                                        <h6 className="mb-1">{item.product.name}</h6>
                                        <small className="text-muted">
                                            ₹ {item.product.price}
                                        </small>
                                    </div>

                                    {/* QUANTITY */}
                                    <div className="col-md-3 d-flex align-items-center gap-2 mt-2 mt-md-0">
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product._id,
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <span className="fw-bold">
                                            {item.quantity}
                                        </span>

                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product._id,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* PRICE */}
                                    <div className="col-md-2 mt-2 mt-md-0">
                                        <strong>
                                            ₹ {item.product.price * item.quantity}
                                        </strong>
                                    </div>

                                    {/* REMOVE */}
                                    <div className="col-md-2 text-end mt-2 mt-md-0">
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() =>
                                                removeItem(item.product._id)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TOTAL & ORDER */}
                    <div className="d-flex justify-content-end mt-4">
                        <div className="bg-light p-3 rounded shadow-sm text-end" style={{ minWidth: "260px" }}>
                            <h6 className="mb-2">
                                Total Amount
                            </h6>

                            <h5 className="fw-bold mb-3">
                                ₹ {total}
                            </h5>

                            <button
                                className="btn btn-success w-100"
                                disabled={cartItems.length === 0}
                                onClick={handlePlaceOrderClick}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>

                    {showOrderModal && (
                        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h5 className="modal-title">Shipping Details</h5>
                                        <button
                                            className="btn-close"
                                            onClick={() => setShowOrderModal(false)}
                                        />
                                    </div>

                                    <div className="modal-body">
                                        {["fullName", "phone", "address", "city", "postalCode"].map(field => (
                                            <input
                                                key={field}
                                                type="text"
                                                className="form-control mb-2"
                                                placeholder={field.replace(/([A-Z])/g, " $1")}
                                                value={shipping[field]}
                                                onChange={(e) =>
                                                    setShipping({ ...shipping, [field]: e.target.value })
                                                }
                                            />
                                        ))}
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setShowOrderModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            onClick={handleOrderConfirm}
                                        >
                                            Confirm Order
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                </>
            )}
        </div>
    );
}

export default Cart;
