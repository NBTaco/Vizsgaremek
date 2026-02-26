import { useEffect, useState } from "react";
import OneOrder from "../oneOrder/oneorder";
import "./adminorders.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Title from "../title/title";

const statusStyles: Record<string, React.CSSProperties> = {
  ordered: { backgroundColor: "#ffffff", borderLeftColor: "#a0a0a0" },
  shipped: { backgroundColor: "#fffbea", borderLeftColor: "#f0b429" },
  delivered: { backgroundColor: "#f0fdf4", borderLeftColor: "#22c55e" },
  cancelled: { backgroundColor: "#fff5f5", borderLeftColor: "#ef4444" },
};

export default function AdminOrders() {

  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
    }, []);

  async function fetchOrders() {
    try {
      const response = await fetch("http://localhost:3000/orders", {
        headers: {
          "x-access-token": localStorage.getItem("token") || "",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders);
      } else {
        console.error("Error fetching orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  async function updateOrderStatus(orderId: number, status: string) {
    try {
      const response = await fetch("http://localhost:3000/orders/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchOrders();
      } else {
        console.error("Error updating order status:", data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  const filteredOrders = orders
    .filter((order) => order.status !== "in_progress")
    .filter((order) => {
      const q = search.toLowerCase();
      return (
        (order.username || "").toLowerCase().includes(q) ||
        (order.billing_name || "").toLowerCase().includes(q)
      );
    });

  return (
    <>
      <Header />
      <Title titlemessage="ÖSSZES RENDELÉS" />
      <div className="admin-orders-search">
        <input
          type="text"
          placeholder="Keresés név alapján..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="admin-orders-container">
        {filteredOrders.map((order) => (
          <div
            key={order.order_id}
            className="admin-order-card"
            style={statusStyles[order.status] ?? {}}
          >
            <OneOrder
              orderId={order.order_id}
              createdAt={order.created_at}
              status={order.status}
              items={order.items}
              total_price={order.total_price}
              billingInfo={{
                billing_name: order.billing_name,
                billing_phone: order.billing_phone,
                billing_country: order.billing_country,
                billing_zip: order.billing_zip,
                billing_city: order.billing_city,
                billing_address: order.billing_address,
              }}
            />
            <div className="admin-order-actions">
              {order.status === "ordered" && (
                <>
                  <button
                    onClick={() => updateOrderStatus(order.order_id, "shipped")}
                  >
                    Elfogad
                  </button>
                  <button
                    onClick={() =>
                      updateOrderStatus(order.order_id, "cancelled")
                    }
                  >
                    Elutasít
                  </button>
                </>
              )}
              {order.status === "shipped" && (
                <>
                  <button
                    onClick={() =>
                      updateOrderStatus(order.order_id, "delivered")
                    }
                  >
                    Kiszállítva
                  </button>
                  <button
                    onClick={() =>
                      updateOrderStatus(order.order_id, "cancelled")
                    }
                  >
                    Visszavon
                  </button>
                </>
              )}
              {order.status === "delivered" && (
                <span className="done">Kiszállítva</span>
              )}
              {order.status === "cancelled" && (
                <span className="cancelled">Visszautasítva</span>
              )}
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <p className="admin-orders-empty">Nincs találat.</p>
        )}
      </div>
      <Footer />
    </>
  );
}
