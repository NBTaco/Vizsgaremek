import { useEffect, useState } from "react";
import "./editcategories.css";

type Category = {
  category_id: number;
  name: string;
};

export default function EditCategories({ onClose }: any) {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/categories");
      const data = await response.json();
      setCategories(data);
    } catch (e) {
      console.error("Nem sikerült lekérni a kategóriákat");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!categoryName.trim()) {
      setError("A kategória neve nem lehet üres");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/addcategory", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access-token": localStorage.getItem("token") || "" },
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
    } catch (err) {
      console.error(err);
      setError("Nem sikerült kapcsolódni a szerverhez");
    }
  };

  const deleteCategory = async (categoryId: number) => {
    const token = localStorage.getItem("token")
    if (!window.confirm("Biztosan törlöd ezt a kategóriát?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/deletecategory/${categoryId}`,
        {
          method: "DELETE",
          headers: {
          "x-access-token": token || "",
        },
        }
      );

      if (!response.ok) {
        alert("Nem sikerült törölni a kategóriát");
        return;
      }

      fetchCategories();
    } catch (e) {
      console.error("Törlési hiba", e);
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
            onChange={(e) => setCategoryName(e.target.value)}
          />

          {error && <div className="error-text">{error}</div>}

          <button className="addcategory-btn" onClick={addCategory}>
            Hozzáadás
          </button>
        </div>

        <div className="category-delete-section">
          <h4>Kategória törlése</h4>

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
                    <button
                      className="delete-btn"
                      onClick={() => deleteCategory(cat.category_id)}
                    >
                      Törlés
                    </button>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center" }}>
                    Nincs kategória
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
