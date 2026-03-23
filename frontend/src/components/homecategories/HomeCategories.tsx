import "./homecategories.css";
import { useNavigate } from "react-router-dom";
import aram from "../categoryimages/flash.png"
import elektromossz from "../categoryimages/hammer-drill.png"
import saw from "../categoryimages/chainsaw.png"
import szerszam from "../categoryimages/support.png"
import lampa from "../categoryimages/lightbulb.png"

const categories = [
  { id: 1, title: "Elektromos szerszámok", image: elektromossz},
  { id: 2, title: "Áram", image: aram},
  { id: 3, title: "Fűrészek", image: saw},
  { id: 4, title: "Kézi szerszámok", image: szerszam},
  { id: 5, title: "Lámpák", image: lampa},
];

const HomeCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryTitle: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <div className="home-categories">
      {categories.map(i => (
        <div className="category-card" key={i.id}>
          <div className="category-image">
            <img src={i.image} alt="betöltés..." />
          </div>
          <div className="category-button">
            <button onClick={() => handleCategoryClick(i.title)}>
              {i.title}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeCategories;
