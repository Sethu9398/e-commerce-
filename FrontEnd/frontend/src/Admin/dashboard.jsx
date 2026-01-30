import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH ADMIN PRODUCTS
  ====================== */
  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/products/admin/my-products",
        { withCredentials: true }
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Fetch admin products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading products...</p>;
  }

  return (
    <div className="container my-4">
      <h4 className="fw-bold mb-4">My Products</h4>

      {products.length === 0 ? (
        <p className="text-muted">No products added yet</p>
      ) : (
        <div className="row g-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="col-xl-3 col-lg-4 col-sm-6"
            >
              <div className="card h-100 shadow-sm">

                {/* IMAGE */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top"
                  style={{
                    height: "180px",
                    objectFit: "cover"
                  }}
                />

                {/* BODY */}
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold mb-1">
                    {product.name}
                  </h6>

                  <p
                    className="text-muted small mb-2"
                    style={{ flexGrow: 1 }}
                  >
                    {product.description}
                  </p>

                  <p className="mb-1 small">
                    📦 Stock:{" "}
                    <strong>{product.stock}</strong>
                  </p>

                  <p className="mb-0 fw-bold text-success">
                    ₹ {product.price}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
