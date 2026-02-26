import "./oneorder.css";

export default function OneOrder({ orderId, createdAt, status, items = [], total_price, billingInfo }: any) {
    return (
        <div className="one-order-card">
            <h1 className="one-order-header">Rendelés részletei</h1>
            <div className="one-order-details">
                <p><strong>Rendelés ID:</strong> {orderId}</p>
                <p><strong>Rendelés dátuma:</strong> {createdAt}</p>
                <p><strong>Állapot:</strong> {status}</p>
                <p><strong>Végösszeg:</strong> {total_price} Ft</p>
            </div>

            {billingInfo && (
                <div className="one-order-billing">
                    <h2 className="one-order-header">Rendelő adatai</h2>
                    <div className="one-order-details">
                        <p><strong>Név:</strong> {billingInfo.billing_name || "—"}</p>
                        <p><strong>Telefon:</strong> {billingInfo.billing_phone || "—"}</p>
                        <p><strong>Szállítási cím:</strong> {billingInfo.billing_country}, {billingInfo.billing_zip} {billingInfo.billing_city}, {billingInfo.billing_address}</p>
                    </div>
                </div>
            )}

            <h2 className="one-order-header">Rendelt termékek</h2>
            <ul className="one-order-details">
                {items.map((item: any, index: number) => (
                    <li key={item.productId || index}>
                        <p><strong>Termék neve:</strong> {item.product_name}</p>
                        <p><strong>Ár:</strong> {item.price} Ft</p>
                        <p><strong>Mennyiség:</strong> {item.quantity} db</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}