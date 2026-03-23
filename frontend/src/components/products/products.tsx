import Header from "../header/Header";
import Footer from "../footer/Footer";
import Title from "../title/title";
import Product from "../product/product";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import EditCategories from "../addcategory/editcategories";
import "./products.css";
import AddItem from "../additem/additem";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [role, setRole] = useState<string | null>(null);
  const [showEditCategories, setShowEditCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddItem, setShowAddItem] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") ?? ""
  );

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") ?? "");
  }, [searchParams]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value) {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

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

    const matchesCategory =
      selectedCategory === "" ||
      p.category_names.includes(selectedCategory);

    return matchesSearch && matchesCategory;
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
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Kategóriák</option>
            {categories.map((e: any) => (
              <option key={e.category_id} value={e.name}>{e.name}</option>
            ))}
          </select>
          {role === "admin" && (
            <div>
              <button onClick={() => setShowEditCategories(true)}>Kategória kezelése</button>
              <button onClick={() => setShowAddItem(true)}>Termék hozzáadása</button>
            </div>
          )}
        </div>
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p: any) => (
              <Product
                id={p.product_id}
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
      {showAddItem && (
        <AddItem
          onClose={() => {
            setShowAddItem(false);
          }}
        />
      )}
      <Footer />
    </>
  );
}