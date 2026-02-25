import Header from "../header/Header";
import Title from "../title/title";
import Footer from "../footer/Footer";
import "./profile.css";
import OneOrder from "../oneOrder/oneorder";
import { useEffect, useState } from "react";

export default function Profile() {
  const [ordersbyuser, setOrdersbyuser] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch("http://localhost:3000/orders/user", {
        headers: {
          "x-access-token": localStorage.getItem("token") || "",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrdersbyuser(data.orders);
      } else {
        console.error("Hiba a rendelések lekérésekor:", data.message);
      }
    } catch (error) {
      console.error("Hiba a rendelések lekérésekor:", error);
    }
  }

  console.log("Rendelések a felhasználóhoz:", ordersbyuser);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <>
      <Header />
      <Title titlemessage={user.username} />
      <div className="profile-container">
        <div className="profile-info">
          <h2>Felhasználói adatok</h2>
          <p>Felhasználónév: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
        <div className="profile-orders">
          <h2>Rendeléseim</h2>
          {ordersbyuser.length === 0 ? (
            <p>Nincsenek rendeléseid.</p>
          ) : (
            ordersbyuser.map((order) => (
              <OneOrder
                key={order.order_id}
                orderId={order.order_id}
                createdAt={order.created_at}
                status={order.status}
                items={order.items}
                total_price={order.total_price}
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
