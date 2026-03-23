import { useEffect, useState } from "react";
import "./editcategories.css";

type Category = {
  category_id: number;
  name: string;
};

export default function EditCategories({ onClose }: any) {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/categories");
      const data = await response.json();
      setCategories(data);
    } catch {
      setError("Nem sikerült lekérni a kategóriákat");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!categoryName.trim()) {
      setError("A kategória neve nem lehet üres.");
      return;
    }
    if (categoryName.trim().length < 2) {
      setError("A kategória neve legalább 2 karakter legyen.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/addcategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ name: categoryName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Hiba történt");
        return;
      }

      setCategoryName("");
      setError("");
      fetchCategories();
    } catch {
      setError("Nem sikerült kapcsolódni a szerverhez");
    }
  };

  const deleteCategory = async (categoryId: number) => {
    setDeleteError("");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/deletecategory/${categoryId}`, {
        method: "DELETE",
        headers: { "x-access-token": token || "" },
      });

      if (!response.ok) {
        setDeleteError("Nem sikerült törölni a kategóriát.");
        setDeleteConfirmId(null);
        return;
      }

      setDeleteConfirmId(null);
      fetchCategories();
    } catch {
      setDeleteError("Szerver hiba a törlés során.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="addcategory-modal">
      <div className="addcategory-box">
        <div className="addcategory-header">
          <span>Kategória kezelése</span>
          <button className="addcategory-close" onClick={onClose}>×</button>
        </div>

        <div className="addcategory-content">
          <h4>Kategória hozzáadása</h4>

          <label>Kategória neve</label>
          <input
            value={categoryName}
            onChange={(e) => { setCategoryName(e.target.value); setError(""); }}
          />
          {error && <div className="error-text">{error}</div>}

          <button className="addcategory-btn" onClick={addCategory}>Hozzáadás</button>
        </div>

        <div className="category-delete-section">
          <h4>Kategória törlése</h4>
          {deleteError && <div className="error-text">{deleteError}</div>}

          <table className="category-table">
            <thead>
              <tr>
                <th>Név</th>
                <th>Művelet</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.category_id}>
                  <td>{cat.name}</td>
                  <td>
                    {deleteConfirmId === cat.category_id ? (
                      <div className="delete-inline-confirm">
                        <span className="delete-confirm-text">Biztosan törlöd?</span>
                        <button className="delete-btn" onClick={() => deleteCategory(cat.category_id)}>Igen</button>
                        <button className="cancel-small-btn" onClick={() => setDeleteConfirmId(null)}>Nem</button>
                      </div>
                    ) : (
                      <button className="delete-btn" onClick={() => setDeleteConfirmId(cat.category_id)}>
                        Törlés
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center" }}>Nincs kategória</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
