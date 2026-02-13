import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './oneproduct.css';
import Header from "../header/Header"
import Footer from '../footer/Footer';
import Title from '../title/title';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/items/${id}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.item);
        } else {
          setError(data.message || "Hiba történt a letöltéskor.");
        }
      } catch (err) {
        setError("Nem sikerült kapcsolódni a szerverhez.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="status-msg">Betöltés...</div>;
  if (error) return <div className="status-msg-error">{error}</div>;
  if (!product) return <div className="status-msg">A termék nem található.</div>;

  return (
    <>
    <Header/>
    <Title titlemessage={product.product_name}/>
    <div className="product-page-container">
      <div className="top-nav">
        <button className="back-btn" onClick={() => navigate(-1)}>Vissza</button>
      </div>

      <div className="product-main-content">
        <div className="product-image-section">
          <div className="image-container">
            <div className="image-placeholder">
              <img 
                src={product.image_url} 
                alt={product.product_name}
              />
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
          >
            {product.stock > 0 ? "Kosárhoz adás" : "Elfogyott"}
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default OneProduct;