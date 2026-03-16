import "./oneorder.css";

interface OneOrderProps {
  orderId: number;
  createdAt: string;
  status: string;
  items?: any[];
  total_price: number;
  billingInfo?: any;
  isAdmin?: boolean;
  onClose: () => void;
  onUpdateStatus?: (orderId: number, status: string) => void;
}

export default function OneOrder({
  orderId,
  createdAt,
  status,
  items = [],
  total_price,
  billingInfo,
  isAdmin = false,
  onClose,
  onUpdateStatus,
}: OneOrderProps) {
  return (
    <div className="one-order-overlay" onClick={onClose}>
      <div className="one-order-modal" onClick={(e) => e.stopPropagation()}>
        <button className="one-order-close" onClick={onClose}>✕</button>

        <h1 className="one-order-header">Rendelés részletei</h1>

        <div className="one-order-details">
          <p><strong>Rendelés ID:</strong> {orderId}</p>
          <p><strong>Rendelés dátuma:</strong> {createdAt}</p>
          <p><strong>Állapot:</strong> {status}</p>
          <p><strong>Végösszeg:</strong> {total_price} Ft</p>
        </div>

        {billingInfo && (
          <div className="one-order-billing">
            <h2 className="one-order-subheader">Rendelő adatai</h2>
            <div className="one-order-details">
              <p><strong>Név:</strong> {billingInfo.billing_name || "—"}</p>
              <p><strong>Telefon:</strong> {billingInfo.billing_phone || "—"}</p>
              <p>
                <strong>Szállítási cím:</strong>{" "}
                {billingInfo.billing_country}, {billingInfo.billing_zip}{" "}
                {billingInfo.billing_city}, {billingInfo.billing_address}
              </p>
            </div>
          </div>
        )}

        <h2 className="one-order-subheader">Rendelt termékek</h2>
        <ul className="one-order-items">
          {items.map((item: any, index: number) => (
            <li key={item.productId || index} className="one-order-item">
              <p><strong>Termék neve:</strong> {item.product_name}</p>
              <p><strong>Ár:</strong> {item.price} Ft</p>
              <p><strong>Mennyiség:</strong> {item.quantity} db</p>
            </li>
          ))}
        </ul>

        {isAdmin && onUpdateStatus && (
          <div className="one-order-actions">
            {status === "ordered" && (
              <>
                <button
                  className="btn-accept"
                  onClick={() => { onUpdateStatus(orderId, "shipped"); onClose(); }}
                >
                  Elfogad
                </button>
                <button
                  className="btn-reject"
                  onClick={() => { onUpdateStatus(orderId, "cancelled"); onClose(); }}
                >
                  Elutasít
                </button>
              </>
            )}
            {status === "shipped" && (
              <>
                <button
                  className="btn-accept"
                  onClick={() => { onUpdateStatus(orderId, "delivered"); onClose(); }}
                >
                  Kiszállítva
                </button>
                <button
                  className="btn-reject"
                  onClick={() => { onUpdateStatus(orderId, "cancelled"); onClose(); }}
                >
                  Visszavon
                </button>
              </>
            )}
            {status === "delivered" && (
              <span className="status-done">✓ Kiszállítva</span>
            )}
            {status === "cancelled" && (
              <span className="status-cancelled">✗ Visszautasítva</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
