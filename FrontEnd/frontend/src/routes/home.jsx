import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { SearchContext } from "../context/SearchContext";


function Home() {

    const isLoggedIn = !!localStorage.getItem("role");

    const { searchTerm } = useContext(SearchContext);

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);


    const [sort, setSort] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/products");
                setProducts(res.data);
                setFilteredProducts(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let temp = [...products];

        // 🔍 SEARCH FILTER
        if (searchTerm) {
            temp = temp.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (category) temp = temp.filter(p => p.category === category);
        if (minPrice) temp = temp.filter(p => p.price >= Number(minPrice));
        if (maxPrice) temp = temp.filter(p => p.price <= Number(maxPrice));

        if (sort === "low-high") temp.sort((a, b) => a.price - b.price);
        if (sort === "high-low") temp.sort((a, b) => b.price - a.price);

        setFilteredProducts(temp);
    }, [sort, category, minPrice, maxPrice, products, searchTerm]);

    const categories = [...new Set(products.map(p => p.category))];

    const addToLocalCart = (product, quantity) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingIndex = cart.findIndex(
            (item) => item.product._id === product._id
        );

        if (existingIndex > -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({ product, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
    };

    const addToServerCart = async (productId, quantity) => {
        await axios.post(
            "http://localhost:8000/api/cart/add",
            { productId, quantity },
            { withCredentials: true }
        );
    };




    const openProductModal = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
    };

    const closeProductModal = () => {
        setSelectedProduct(null);
    };

    const increaseQty = () => {
        if (quantity < selectedProduct.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };


    return (
        <div
            className="bg-white p-3 shadow-sm rounded
             position-lg-sticky"
            style={{
                top: "80px",
                maxHeight: "calc(100vh - 100px)",
                overflowY: "auto"
            }}
        >
            <div className="row g-3">

                {/* FILTER SIDEBAR (2 columns) */}
                <div className="col-lg-2 col-md-3 col-12">
                    <div className="bg-white p-3 shadow-sm rounded h-100">
                        <h6 className="fw-bold border-bottom pb-2 mb-3">
                            Filters
                        </h6>

                        {/* Sort */}
                        <div className="mb-3">
                            <label className="small fw-semibold mb-1">
                                Sort by Price
                            </label>
                            <select
                                className="form-select form-select-sm"
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="">Default</option>
                                <option value="low-high">Low → High</option>
                                <option value="high-low">High → Low</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div className="mb-3">
                            <label className="small fw-semibold mb-1">
                                Category
                            </label>
                            <select
                                className="form-select form-select-sm"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        {/* Price */}
                        <div>
                            <label className="small fw-semibold mb-2">
                                Price Range
                            </label>

                            {/* Min Price */}
                            <div className="mb-2">
                                <small className="text-muted">
                                    Min: ₹ {minPrice || 0}
                                </small>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="0"
                                    max="100000"
                                    step="100"
                                    value={minPrice || 0}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                            </div>

                            {/* Max Price */}
                            <div>
                                <small className="text-muted">
                                    Max: ₹ {maxPrice || 100000}
                                </small>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="0"
                                    max="100000"
                                    step="100"
                                    value={maxPrice || 100000}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* PRODUCTS SECTION (10 columns) */}
                <div className="col-lg-10 col-md-9">
                    <div className="row g-4">

                        {filteredProducts.map(product => (
                            <div key={product._id} className="col-xl-3 col-lg-4 col-sm-6 col-xs">

                                <div
                                    className="card h-100 border-0 shadow-sm"
                                    style={{ transition: "0.3s" }}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="card-img-top"
                                        style={{
                                            height: "240px",
                                            objectFit: "cover"
                                        }}
                                    />

                                    <div className="card-body d-flex flex-column px-3">

                                        <h6 className="fw-bold mb-1 text-truncate">
                                            {product.name}
                                        </h6>

                                        <p
                                            className="small text-muted mb-2"
                                            style={{ height: "42px", overflow: "hidden" }}
                                        >
                                            {product.description}
                                        </p>

                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold fs-6">
                                                ₹ {product.price}
                                            </span>

                                            {product.stock === 0 ? (
                                                <span className="badge bg-danger">
                                                    Out of Stock
                                                </span>
                                            ) : (
                                                <span className="badge bg-success">
                                                    Stock: {product.stock}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            className="btn btn-primary btn-sm w-100 mt-auto"
                                            disabled={product.stock === 0} onClick={() => openProductModal(product)}
                                        >
                                            Add to Cart
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredProducts.length === 0 && (
                            <div className="text-center text-muted mt-5">
                                No products found
                            </div>
                        )}

                    </div>
                </div>

                {selectedProduct && (
                    <div
                        className="modal fade show d-block"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5 className="modal-title">{selectedProduct.name}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={closeProductModal}
                                    />
                                </div>

                                <div className="modal-body">
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        className="img-fluid rounded mb-3"
                                        style={{ maxHeight: "300px", width: "100%" }}
                                    />

                                    <p className="text-muted small">
                                        {selectedProduct.description}
                                    </p>

                                    <p className="fw-bold mb-1">
                                        Price: ₹ {selectedProduct.price}
                                    </p>

                                    <p className="small">
                                        Stock:{" "}
                                        <span className="fw-semibold">
                                            {selectedProduct.stock}
                                        </span>
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="d-flex align-items-center justify-content-center gap-3 my-3">
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={decreaseQty}
                                        >
                                            −
                                        </button>

                                        <span className="fw-bold">{quantity}</span>

                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={increaseQty}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="btn btn-success w-100"
                                        onClick={async () => {
                                            try {
                                                if (isLoggedIn) {
                                                    await addToServerCart(selectedProduct._id, quantity);
                                                } else {
                                                    addToLocalCart(selectedProduct, quantity);
                                                }
                                                closeProductModal();
                                            } catch (err) {
                                                console.error("Add to cart error:", err);
                                            }
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                            </div>

                        </div>
                    </div>
                    </div>
                )}

        </div>
        </div >
    );
}

export default Home;


