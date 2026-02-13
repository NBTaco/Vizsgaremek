import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./oneproduct.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Title from "../title/title";

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  stock: number;
  image_url: string;
  description: string;
}

const OneProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/items/${id}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.item);
        } else {
            console.log("sikertelen")
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="status-msg">Betöltés...</div>;
  if (!product)
    return <div className="status-msg">A termék nem található.</div>;

  const handleAddToCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Kérlek, jelentkezz be a vásárláshoz!");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/cart/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      },
      body: JSON.stringify({
        productId: product.product_id,
        quantity: 1
      })
    });

    const data = await response.json();
    if (data.success) {
      alert("Termék sikeresen a kosárba került!");
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
              {product.stock > 0 ? "Kosárhoz adás" : "Elfogyott"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OneProduct;
