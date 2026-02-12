import Header from "../header/Header";
import Footer from "../footer/Footer";
import Title from "../title/title";
import Product from "../product/product";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import EditCategories from "../addcategory/editcategories";
import "./products.css";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [role, setRole] = useState<string | null>(null);
  const [showEditCategories, setShowEditCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setRole(null);
      return;
    }

    try {
      const decoded = jwtDecode<{ role?: string }>(token);
      setRole(decoded?.role ?? null);
    } catch (err) {
      console.error("Invalid token", err);
      setRole(null);
    }
  }, []);

  async function getCategories() {
    try {
      const response = await fetch("http://localhost:3000/categories");
      const resData = await response.json();
      setCategories(resData);
    } catch (e) {
      console.log("Lekérdezési hiba:");
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await fetch("http://localhost:3000/items");
        const resData = await response.json();
        setProducts(resData.items);
      } catch (e) {
        console.log(`hiba: ${e}`);
      }
    }
    getProducts();
  }, []);

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <>
      <Header />
      <Title titlemessage="Termékek" />
      <div className="search-bar">
        Keresés név alapján:
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Írj be egy nevet..."
        />
      </div>
      <div className="products-layout">
        <div className="filters">
          <p>Szűrés</p>
          <select>
            <option>Kategóriák</option>
            {categories.map((e: any) => (
              <option key={e.category_id}>{e.name}</option>
            ))}
          </select>
          {role === "admin" && (
            <div>
              <button onClick={() => setShowEditCategories(true)}>
                Kategóriák szerkesztése
              </button>
            </div>
          )}
        </div>
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p: any) => (
              <Product
                key={p.product_id}
                image={p.image_url}
                name={p.product_name}
                price={p.price}
              />
            ))
          ) : (
            <p>Nincs a keresésnek megfelelő termék.</p>
          )}
        </div>
      </div>
      {showEditCategories && (
        <EditCategories
          onClose={() => {
            setShowEditCategories(false);
            getCategories();
          }}
        />
      )}
      <Footer />
    </>
  );
}
