import "./homecategories.css";

const categories = [
  { id: 1, title: "Kategória 1", image: "asd"},
  { id: 2, title: "Kategória 2", image: "asd"},
  { id: 3, title: "Kategória 3", image: "asd"},
  { id: 4, title: "Kategória 4", image: "asd"},
  { id: 5, title: "Kategória 5", image: "asd"},
];

const HomeCategories = () => {
  return (
    <div className="home-categories">
        {categories.map(i => (
            <div className="category-card" key={i.id}>
                    <div className="category-image"><img src={i.image} alt="betöltés..." /> </div>        
                <div className="category-button">
                    <button>{i.title}</button>
                </div>
            </div>
        ))}
    </div>
  );
};

export default HomeCategories;
