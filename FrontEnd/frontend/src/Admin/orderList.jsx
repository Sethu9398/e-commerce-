import { useEffect, useState } from "react";
import axios from "axios";

function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/orders",
        { withCredentials: true }
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:8000/api/orders/${orderId}/status`,
        { status },
        { withCredentials: true }
      );
      fetchOrders();
    } catch {
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading orders...</p>;
  }

  return (
    <div className="container my-5">
      <h4 className="fw-bold mb-4 text-center">Admin Order List</h4>

      {orders.length === 0 ? (
        <p className="text-muted text-center">No orders found</p>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order._id} className="card shadow-sm border-0 p-4">

              {/* PRODUCTS */}
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="row align-items-center border-bottom pb-3 mb-3"
                >
                  {/* IMAGE */}
                  <div className="col-md-2 d-flex justify-content-center">
                    <img
                      src={item.product?.image || "https://via.placeholder.com/120"}
                      alt={item.name}
                      className="rounded border"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover"
                      }}
                    />
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="col-md-10">
                    <h6 className="fw-bold mb-1">{item.name}</h6>
                    <p className="mb-0 text-muted">
                      Quantity: <strong>{item.quantity}</strong>
                    </p>
                    <p className="mb-0 text-success">₹ {item.price}</p>
                  </div>
                </div>
              ))}

              {/* USER DETAILS */}
              <div className="mb-3">
                <p className="mb-1">
                  👤 <strong>{order.shippingAddress.fullName}</strong>
                </p>
                <p className="mb-1">📞 {order.shippingAddress.phone}</p>
                <p className="mb-0">
                  🏠 {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city} -{" "}
                  {order.shippingAddress.postalCode}
                </p>
              </div>

              {/* STATUS */}
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">
                  Status:{" "}
                  <span className="text-primary">
                    {order.orderStatus}
                  </span>
                </span>

                <select
                  className="form-select w-auto"
                  value={order.orderStatus}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* FOOTER */}
              <div className="mt-3 d-flex justify-content-between text-muted small">
                <span>Total: ₹ {order.totalAmount}</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString()}{" "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrderList;
