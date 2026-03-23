import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./oneproduct.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Title from "../title/title";
import EditItem from "../edititem/edititem";
import LogIn from "../login/LogIn";

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  stock: number;
  image_url: string;
  description: string;
  category_ids?: number[];
}

const OneProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRole(null);
      return;
    }
    try {
      const decoded = jwtDecode<{ role?: string }>(token);
      setRole(decoded?.role ?? null);
    } catch (err) {
      console.error("Invalid token", err);
      setRole(null);
    }
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/items/${id}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.item);
      } else {
        console.log("sikertelen");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="status-msg">Betöltés...</div>;
  if (!product) return <div className="status-msg">A termék nem található.</div>;

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLogin(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({
          productId: product.product_id,
          quantity: 1,
        }),
      });

      const data = await response.json();
      if (data.success) {
        navigate("/cart");
      } else {
        alert("Hiba: " + data.message);
      }
    } catch (err) {
      console.error("Hiba a kosárba tételkor:", err);
    }
  };

  return (
    <>
      <Header />
      <Title titlemessage={product.product_name} />
      <div className="product-page-container">
        <div className="top-nav">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Vissza
          </button>
        </div>

        <div className="product-main-content">
          <div className="product-image-section">
            <div className="image-container">
              <div className="image-placeholder">
                <img src={product.image_url} alt={product.product_name} />
              </div>
            </div>
          </div>
          <div className="product-details-section">
            <div className="description-box">
              <h3>{product.product_name}</h3>
              <p>{product.description}</p>
            </div>

            <div className="price-box">
              <p className="price-tag">{product.price.toLocaleString()} Ft</p>
              <span className="stock-info">Készleten: {product.stock} db</span>
            </div>

            <button
              className="add-to-cart-btn"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              {product.stock === 0
                ? "Elfogyott"
                : !localStorage.getItem("token")
                ? "Jelentkezz be a vásárláshoz"
                : "Kosárhoz adás"}
            </button>

            {role === "admin" && (
              <button className="edit-btn" onClick={() => setEditOpen(true)}>
                Termék szerkesztése
              </button>
            )}
          </div>
        </div>
      </div>

      {editOpen && (
        <EditItem
          product={product}
          onClose={() => setEditOpen(false)}
          onUpdated={() => {
            setEditOpen(false);
            fetchProduct();
          }}
        />
      )}

      {showLogin && (
        <LogIn
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(user: any) => {
            localStorage.setItem("user", JSON.stringify(user));
            setShowLogin(false);
            window.location.reload();
          }}
        />
      )}

      <Footer />
    </>
  );
};

export default OneProduct;