import { useEffect, useState } from "react";
import "./edititem.css";

type Category = {
  category_id: number;
  name: string;
};

type Product = {
  product_id: number;
  product_name: string;
  price: number;
  stock: number;
  category_ids?: number[];
};

type Props = {
  product: Product;
  onClose: () => void;
  onUpdated?: () => void;
};

type UpdatePayload = {
  product_name?: string;
  price?: number;
  stock?: number;
  category_ids: number[];
};

export default function EditItem({ product, onClose, onUpdated }: Props) {
  const [productName, setProductName] = useState(product.product_name);
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    product.category_ids ?? []
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/categories");
        const data = await res.json();
        setCategories(data);
      } catch {
        setError("Kategóriák betöltése sikertelen");
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (id: number) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError("Az ár nem lehet negatív szám");
      return;
    }

    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      setError("A készlet nem lehet negatív szám");
      return;
    }

    const payload: UpdatePayload = {
      category_ids: selectedCategories,
    };

    if (productName.trim() !== product.product_name) {
      payload.product_name = productName.trim();
    }
    if (parsedPrice !== product.price) {
      payload.price = parsedPrice;
    }
    if (parsedStock !== product.stock) {
      payload.stock = parsedStock;
    }

    if (payload.product_name === undefined && payload.price === undefined && payload.stock === undefined && payload.category_ids.length > 0) {
      const original = [...(product.category_ids ?? [])].sort((a, b) => a - b);
      const updated = [...selectedCategories].sort((a, b) => a - b);
      if (JSON.stringify(original) === JSON.stringify(updated)) {
        setError("Nincs módosítás");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/items/${product.product_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-access-token": token } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Termék sikeresen frissítve");
        onUpdated?.();
      } else {
        setError(data.message || "Ismeretlen hiba");
      }
    } catch {
      setError("Szerver hiba");
    }
  };

  return (
    <div className="edititem-modal">
      <div className="edititem-box">
        <div className="edititem-header">
          <span>Termék szerkesztése</span>
          <button className="edititem-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="edititem-content">
          <label>Termék neve</label>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <label>Ár</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label>Készlet</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <label>Kategóriák</label>
          <div className="category-list">
            {categories.map((cat) => (
              <label key={cat.category_id} className="category-item">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.category_id)}
                  onChange={() => toggleCategory(cat.category_id)}
                />
                {cat.name}
              </label>
            ))}
          </div>

          {error && <div className="error-text">{error}</div>}
          {message && <div className="success-text">{message}</div>}

          <button className="edititem-btn" onClick={handleSubmit}>
            Mentés
          </button>
        </div>
      </div>
    </div>
  );
}