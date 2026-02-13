import { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Title from "../title/title";
import "./cart.css";

export default function Cart() {
  const [items, setItems] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/cart", {
        headers: { "x-access-token": token || "" }
      });
      const data = await res.json();
      
      if (data.success) {
        setItems(data.items);
      }
    } catch (e) {
      console.error("Hiba a kosár lekérésekor:", e);
    } finally {
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
        "x-access-token": token 
      },
      body: JSON.stringify({ productId }) 
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

  const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  if (!token) return <div className="cart-msg">A kosár megtekintéséhez be kell jelentkezned.</div>;

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
          </div>

          {items.length > 0 ? (
            items.map((item) => (
              <div className="cart-row" key={item.product_id}>
                <div className="i-cell product-info">
                  <img src={item.image_url} alt={item.product_name} className="cart-img" />
                  <div className="name-and-del">
                    <span>{item.product_name}</span>
                  </div>
                </div>
                <div className="i-cell">{item.price.toLocaleString()} Ft</div>
                <div className="i-cell">{item.quantity} db</div>
                 <button className="del-btn" onClick={() => handleDelete(item.product_id)}>🗑️</button>
              </div>
            ))
          ) : (
            <div className="empty-msg">{ "A kosarad jelenleg üres."}</div>
          )}
        </div>

        <div className="cart-summary-section">
          <div className="total-box">
            <p><strong>Összesen:</strong> {total.toLocaleString()} Ft</p>
            <button className="checkout-btn" disabled={items.length === 0}>
              Tovább a fizetéshez
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}