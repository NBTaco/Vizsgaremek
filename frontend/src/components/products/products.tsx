import Header from "../header/Header";
import Footer from "../footer/Footer";
import Title from "../title/title";
import Product from "../product/product";
import { useEffect, useState } from "react";
  
export default function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await fetch("http://localhost:3000/categories");
        const resData = await response.json();
        setCategories(resData);
      } catch (e) {
        console.log("Lekérdezési hiba:");
      }
    }
    getCategories();
  }, []);

  useEffect(() => {
    async function getProducts() {
        try{
          const response = await fetch("http://localhost:3000/items")
          const resData = await response.json()
          setProducts(resData.items)
          console.log(resData.items[1].image_url)
        }
        catch(e){
          console.log(`hiba: ${e}`)
        }
      }
      getProducts();
    }, [])
;

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
          {products.map((p : any) => (
            <Product key={p.product_id} image={p.image_url} name={p.product_name}/>
          ))
          }
        </div>

        
      </div>
      <Footer />
    </>
  );
}
