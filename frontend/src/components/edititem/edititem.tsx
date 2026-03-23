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
  onDeleted?: () => void;
};

type UpdatePayload = {
  product_name?: string;
  price?: number;
  stock?: number;
  category_ids: number[];
};

export default function EditItem({ product, onClose, onUpdated, onDeleted }: Props) {
  const [productName, setProductName] = useState(product.product_name);
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(product.category_ids ?? []);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    productName?: string;
    price?: string;
    stock?: string;
    server?: string;
  }>({});
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/categories");
        const data = await res.json();
        setCategories(data);
      } catch {
        setErrors((prev) => ({ ...prev, server: "Kategóriák betöltése sikertelen" }));
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

  const validate = () => {
    const e: typeof errors = {};
    if (!productName.trim()) {
      e.productName = "A termék neve nem lehet üres.";
    } else if (productName.trim().length < 2) {
      e.productName = "A termék neve legalább 2 karakter legyen.";
    }
    const parsedPrice = Number(price);
    if (price === "" || isNaN(parsedPrice)) {
      e.price = "Az ár megadása kötelező.";
    } else if (parsedPrice < 0) {
      e.price = "Az ár nem lehet negatív.";
    }
    const parsedStock = Number(stock);
    if (stock === "" || isNaN(parsedStock)) {
      e.stock = "A készlet megadása kötelező.";
    } else if (parsedStock < 0) {
      e.stock = "A készlet nem lehet negatív.";
    } else if (!Number.isInteger(parsedStock)) {
      e.stock = "A készlet csak egész szám lehet.";
    }
    return e;
  };

  const clearError = (field: keyof typeof errors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleSubmit = async () => {
    setMessage("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    const payload: UpdatePayload = { category_ids: selectedCategories };
    if (productName.trim() !== product.product_name) payload.product_name = productName.trim();
    if (parsedPrice !== product.price) payload.price = parsedPrice;
    if (parsedStock !== product.stock) payload.stock = parsedStock;

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
        setErrors({ server: data.message || "Ismeretlen hiba" });
      }
    } catch {
      setErrors({ server: "Szerver hiba" });
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/items/${product.product_id}`, {
        method: "DELETE",
        headers: { "x-access-token": token || "" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onDeleted?.();
        onClose();
      } else {
        setErrors({ server: data.message || "Nem sikerült törölni a terméket" });
        setDeleting(false);
        setDeleteConfirm(false);
      }
    } catch {
      setErrors({ server: "Szerver hiba – nem sikerült törölni" });
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  return (
    <div className="edititem-modal">
      <div className="edititem-box">
        <div className="edititem-header">
          <span>Termék szerkesztése</span>
          <button className="edititem-close" onClick={onClose}>×</button>
        </div>

        <div className="edititem-content">
          <label>Termék neve</label>
          <input
            value={productName}
            onChange={(e) => { setProductName(e.target.value); clearError("productName"); }}
          />
          {errors.productName && <span className="field-error">{errors.productName}</span>}

          <label>Ár</label>
          <input
            type="number"
            value={price}
            onChange={(e) => { setPrice(e.target.value); clearError("price"); }}
          />
          {errors.price && <span className="field-error">{errors.price}</span>}

          <label>Készlet</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => { setStock(e.target.value); clearError("stock"); }}
          />
          {errors.stock && <span className="field-error">{errors.stock}</span>}

          <label>Kategóriák</label>
          <div className="category-pills">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.category_id);
              return (
                <button
                  key={cat.category_id}
                  type="button"
                  className={`category-pill${isSelected ? " category-pill--selected" : ""}`}
                  onClick={() => toggleCategory(cat.category_id)}
                >
                  {isSelected && <span className="category-pill-check">✓</span>}
                  {cat.name}
                </button>
              );
            })}
            {categories.length === 0 && (
              <span className="category-pills-empty">Nincsenek kategóriák</span>
            )}
          </div>

          {errors.server && <span className="field-error">{errors.server}</span>}
          {message && <div className="success-text">{message}</div>}

          <button className="edititem-btn" onClick={handleSubmit}>Mentés</button>

          <div className="edititem-divider" />

          {!deleteConfirm ? (
            <button
              className="edititem-delete-btn"
              onClick={() => setDeleteConfirm(true)}
              disabled={deleting}
            >
              Termék törlése
            </button>
          ) : (
            <div className="delete-confirm-box">
              <span className="field-error">Biztosan törlöd a terméket? Ez nem visszavonható.</span>
              <div className="delete-confirm-actions">
                <button className="edititem-delete-btn" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Törlés..." : "Igen, törlöm"}
                </button>
                <button className="edititem-btn" onClick={() => setDeleteConfirm(false)}>Mégse</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
