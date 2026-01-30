import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ======================
       FETCH USER ORDERS
    ====================== */
    const fetchOrders = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8000/api/orders/my-orders",
                { withCredentials: true }
            );
            setOrders(res.data);
        } catch (err) {
            console.error("Fetch orders error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    /* ======================
       REMOVE PRODUCT FROM ORDER
    ====================== */
    const removeProduct = async (orderId, productId) => {
        if (!window.confirm("Remove this product from order?")) return;

        try {
            await axios.delete(
                `http://localhost:8000/api/orders/${orderId}/item/${productId}`,
                { withCredentials: true }
            );
            fetchOrders();
        } catch (err) {
            alert("Unable to remove product");
        }
    };

    if (loading) {
        return <p className="text-center mt-4">Loading orders...</p>;
    }

    return (
        <div className="container my-4">
            <h4 className="fw-bold mb-4">My Orders</h4>

            {orders.length === 0 ? (
                <p className="text-muted">No orders found</p>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {orders.map((order) => (
                        <div key={order._id} className="card shadow-sm p-3">

                            {/* ORDER INFO */}
                            <div className="mb-2">
                                <h6 className="fw-bold mb-1">
                                    {order.shippingAddress.fullName}
                                </h6>

                                <p className="mb-1 small">
                                    📞 {order.shippingAddress.phone}
                                </p>

                                <p className="mb-1 small">
                                    🏠 {order.shippingAddress.address},{" "}
                                    {order.shippingAddress.city} -{" "}
                                    {order.shippingAddress.postalCode}
                                </p>
                            </div>

                            {/* PRODUCTS */}
                            {order.items.map((item) => (
                                <div
                                    key={item.product}
                                    className="d-flex justify-content-between align-items-center border-top pt-2 mt-2"
                                >
                                    <div>
                                        <p className="mb-1 small fw-bold">
                                            {item.name}
                                        </p>
                                        <p className="mb-0 small text-muted">
                                            Qty: {item.quantity} × ₹{item.price}
                                        </p>
                                    </div>

                                    {order.orderStatus === "Pending" && (
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() =>
                                                removeProduct(order._id, item.product)
                                            }
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* FOOTER */}
                            <div className="d-flex justify-content-between align-items-end mt-3">
                                <span className="fw-bold">
                                    Total: ₹ {order.totalAmount}
                                </span>

                                <small className="text-muted">
                                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                                    {new Date(order.createdAt).toLocaleTimeString()}
                                </small>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;

