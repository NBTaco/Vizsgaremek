import { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Title from "../title/title";
import "./cart.css";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [items, setItems] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/cart", {
        headers: { "x-access-token": token || "" },
      });
      const data = await res.json();

      localStorage.setItem("orderId", data.orderId);

      if (data.success) {
        setItems(data.items);
      }
    } catch (e) {
      console.error("Hiba a kosár lekérésekor:", e);
    }
  };

  useEffect(() => {
    if (token) fetchCart();
  }, []);

  const handleDelete = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/cart/items", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (data.success) {
        fetchCart();
      } else {
        alert("Hiba: " + data.message);
      }
    } catch (e) {
      console.error("Hiba a törlés során:", e);
    }
  };

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setUpdatingId(productId);
    try {
      const res = await fetch("http://localhost:3000/cart/items", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((item) =>
            item.product_id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert(data.message || "Hiba történt a mennyiség módosításakor.");
      }
    } catch (e) {
      console.error("Hiba a mennyiség módosításakor:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const hasOutOfStock = items.some((item) => item.stock === 0);

  if (!token)
    return (
      <div className="cart-msg">
        Az oldal megtekintéséhez be kell jelentkezned. <br></br>
        <button onClick={() => navigate("/")}>Vissza a föoldalra</button>
      </div>
    );

  return (
    <>
      <Header />
      <Title titlemessage="Kosár" />
      <div className="cart-wrapper">
        <div className="cart-container">
          <div className="cart-table-header">
            <div className="h-cell">Termék</div>
            <div className="h-cell">Ár</div>
            <div className="h-cell">Mennyiség</div>
            <div className="h-cell"></div>
          </div>

          {items.length > 0 ? (
            items.map((item) => {
              const isOutOfStock = item.stock === 0;
              const atStockLimit = item.quantity >= item.stock;
              return (
                <div
                  className={`cart-row${isOutOfStock ? " cart-row--out-of-stock" : ""}`}
                  key={item.product_id}
                >
                  <div className="i-cell product-info">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className={`cart-img${isOutOfStock ? " cart-img--faded" : ""}`}
                    />
                    <div className="name-and-del">
                      <span>{item.product_name}</span>
                      {isOutOfStock && (
                        <span className="out-of-stock-badge">⚠️ Ez a termék elfogyott</span>
                      )}
                      {!isOutOfStock && atStockLimit && (
                        <span className="stock-limit-badge">📦 Maximum mennyiség ({item.stock} db)</span>
                      )}
                    </div>
                  </div>
                  <div className="i-cell">{item.price.toLocaleString()} Ft</div>
                  <div className="i-cell">
                    {isOutOfStock ? (
                      <span className="out-of-stock-qty">–</span>
                    ) : (
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingId === item.product_id}
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                          disabled={atStockLimit || updatingId === item.product_id}
                          title={atStockLimit ? `Csak ${item.stock} db érhető el` : undefined}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    className="del-btn"
                    onClick={() => handleDelete(item.product_id)}
                  >
                    🗑️
                  </button>
                </div>
              );
            })
          ) : (
            <div className="empty-msg">{"A kosarad jelenleg üres."}</div>
          )}
        </div>

        <div className="cart-summary-section">
          <div className="total-box">
            <p>
              <strong>Összesen:</strong> {total.toLocaleString()} Ft
            </p>
            {hasOutOfStock && (
              <p className="out-of-stock-warning">
                A kosarában elfogyott termék van. Kérjük, távolítsa el a továbblépés előtt.
              </p>
            )}
            <button
              className="checkout-btn"
              disabled={items.length === 0 || hasOutOfStock}
              onClick={() => navigate("/finalize")}
            >
              Tovább a fizetéshez
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}