import { useEffect, useState } from "react";
import "./additem.css";

type Category = {
  category_id: number;
  name: string;
};

export default function AddItem({ onClose }: any) {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      setError("Kategóriák betöltése sikertelen");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategory = (id: number) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(c => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!productName || !price || !stock) {
      setError("Minden mező kitöltése kötelező");
      return;
    }

    if (!image) {
      setError("Kép kiválasztása kötelező");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("product_name", productName);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("image", image);

      selectedCategories.forEach(id =>
        formData.append("category_ids", id.toString())
      );

      const res = await fetch("http://localhost:3000/items", {
        method: "POST",
        headers: {
    "x-access-token": localStorage.getItem("token") || "",  
  },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Termék sikeresen hozzáadva");

        setProductName("");
        setPrice("");
        setStock("");
        setImage(null);
        setSelectedCategories([]);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Szerver hiba");
    }
  };

  return (
    <div className="additem-modal">
      <div className="additem-box">

        <div className="additem-header">
          <span>Termék hozzáadása</span>
          <button className="additem-close" onClick={onClose}>×</button>
        </div>

        <div className="additem-content">

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

          <label>Kép</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) setImage(e.target.files[0]);
            }}
          />

          <label>Kategóriák</label>

          <div className="category-list">
            {categories.map(cat => (
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

          <button className="additem-btn" onClick={handleSubmit}>
            Termék hozzáadása
          </button>

        </div>

      </div>
    </div>
  );
}