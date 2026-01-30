import { useEffect, useState } from "react";
import axios from "axios";

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ======================
     FETCH ADMIN PRODUCTS
  ====================== */
  const fetchProducts = async () => {
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
    fetchProducts();
  }, []);

  /* ======================
     OPEN UPDATE MODAL
  ====================== */
  const openEditModal = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
      category: product.category
    });
    setShowEditModal(true);
  };

  /* ======================
     UPDATE PRODUCT
  ====================== */
  const updateProduct = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/products/${editProduct._id}`,
        formData,
        { withCredentials: true }
      );
      setShowEditModal(false);
      setEditProduct(null);
      fetchProducts();
    } catch {
      alert("Failed to update product");
    }
  };

  /* ======================
     DELETE PRODUCT
  ====================== */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(
        `http://localhost:8000/api/products/${id}`,
        { withCredentials: true }
      );
      fetchProducts();
    } catch {
      alert("Failed to delete product");
    }
  };

  /* ======================
     ADD PRODUCT
  ====================== */
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/products",
        formData,
        { withCredentials: true }
      );

      setShowAddModal(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        category: ""
      });
      fetchProducts();
    } catch (error) {
      console.error("Add product error:", error);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading products...</p>;
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">My Products</h4>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add New Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-muted text-center">No products found</p>
      ) : (
        <div className="d-flex flex-column gap-4">
          {products.map((product) => (
            <div key={product._id} className="card shadow-sm border-0">
              <div className="row g-0 align-items-center p-3">
                <div className="col-md-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid rounded"
                    style={{ height: "170px", objectFit: "cover", width: "100%" }}
                  />
                </div>

                <div className="col-md-6 px-4">
                  <h5 className="fw-bold">{product.name}</h5>
                  <p className="text-muted small">{product.description}</p>
                  <p>🏷 {product.category}</p>
                  <p>📦 Stock: {product.stock}</p>
                  <p className="fw-bold text-success">₹ {product.price}</p>
                </div>

                <div className="col-md-3 d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => openEditModal(product)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================
          UPDATE MODAL
      ====================== */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Update Product</h5>
                <button className="btn-close" onClick={() => setShowEditModal(false)} />
              </div>

              <div className="modal-body d-flex flex-column gap-2">
                <input className="form-control" name="name" value={formData.name} onChange={handleChange} />
                <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
                <input className="form-control" name="category" value={formData.category} onChange={handleChange} />
                <input className="form-control" name="price" type="number" value={formData.price} onChange={handleChange} />
                <input className="form-control" name="stock" type="number" value={formData.stock} onChange={handleChange} />
                <input className="form-control" name="image" value={formData.image} onChange={handleChange} />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={updateProduct}>Update</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================
          ADD MODAL
      ====================== */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.6)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleAddProduct}>
                <div className="modal-header">
                  <h5>Add New Product</h5>
                  <button className="btn-close" onClick={() => setShowAddModal(false)} />
                </div>

                <div className="modal-body row g-3">
                  {["name", "category", "price", "stock", "image"].map((f) => (
                    <div key={f} className="col-md-6">
                      <input
                        className="form-control"
                        name={f}
                        placeholder={f}
                        onChange={handleChange}
                        required={f !== "stock"}
                      />
                    </div>
                  ))}
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      name="description"
                      placeholder="Description"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductList;



