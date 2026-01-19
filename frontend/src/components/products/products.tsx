import Header from "../header/Header";
import Footer from "../footer/Footer";
import Title from "../title/title";
import Product from "../product/product";
import { useEffect, useState } from "react";

export default function Products() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function GetProducts() {
      try {
        const response = await fetch("http://localhost:3000/categories");
        const resData = await response.json();
        setCategories(resData);
      } catch (e) {
        console.log("Lekérdezési hiba:");
      }
    }
    GetProducts();
  }, []);

  console.log(categories);

  return (
    <>
      <Header />
      <Title titlemessage="Termékek" />
      <div className="p-3">
        Keresés név alapján: <input className="w-75" type="text"></input>
      </div>
      <div className="row">
        <div className="col-6 p-3">
          <p>Szűrés</p>
          <select>
            <option>Kategóriák</option>
            {categories.map((e: any) => (
              <option key={e.category_id}>{e.name}</option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <Product image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm5TVIo0GISXiQig8fH0SLz46LA5o62ejQqQ&s" name="naményi"/>
        </div>
      </div>
      <Footer />
    </>
  );
}
