import { useEffect, useState } from "react";
import "./additem.css";

type Category = {
  category_id: number;
  name: string;
};

export default function AddItem({ onClose }: any) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    productName?: string;
    description?: string;
    price?: string;
    stock?: string;
    image?: string;
    server?: string;
  }>({});

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      setErrors((prev) => ({ ...prev, server: "Kategóriák betöltése sikertelen" }));
    }
  };

  useEffect(() => {
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
      e.productName = "A termék neve kötelező.";
    } else if (productName.trim().length < 2) {
      e.productName = "A termék neve legalább 2 karakter legyen.";
    }
    if (!description.trim()) {
      e.description = "A leírás megadása kötelező.";
    } else if (description.trim().length < 5) {
      e.description = "A leírás legalább 5 karakter legyen.";
    }
    if (!price) {
      e.price = "Az ár megadása kötelező.";
    } else if (isNaN(Number(price)) || Number(price) < 0) {
      e.price = "Az ár érvénytelen (nem negatív szám).";
    }
    if (!stock) {
      e.stock = "A készlet megadása kötelező.";
    } else if (isNaN(Number(stock)) || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      e.stock = "A készlet egész szám kell legyen, és nem lehet negatív.";
    }
    if (!image) {
      e.image = "Kép kiválasztása kötelező.";
    }
    return e;
  };

  const handleSubmit = async () => {
    setMessage("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("product_name", productName);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("image", image!);
      selectedCategories.forEach((id) => formData.append("category_ids", id.toString()));

      const res = await fetch("http://localhost:3000/items", {
        method: "POST",
        headers: { "x-access-token": localStorage.getItem("token") || "" },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Termék sikeresen hozzáadva");
        setProductName("");
        setDescription("");
        setPrice("");
        setStock("");
        setImage(null);
        setSelectedCategories([]);
      } else {
        setErrors({ server: data.message });
      }
    } catch {
      setErrors({ server: "Szerver hiba" });
    }
  };

  const clearError = (field: keyof typeof errors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

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
            onChange={(e) => { setProductName(e.target.value); clearError("productName"); }}
          />
          {errors.productName && <span className="field-error">{errors.productName}</span>}

          <label>Leírás</label>
          <textarea
            value={description}
            rows={4}
            onChange={(e) => { setDescription(e.target.value); clearError("description"); }}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
          
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

          <label>Kép</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) setImage(e.target.files[0]);
              clearError("image");
            }}
          />
          {errors.image && <span className="field-error">{errors.image}</span>}

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

          <button className="additem-btn" onClick={handleSubmit}>
            Termék hozzáadása
          </button>
        </div>
      </div>
    </div>
  );
}