import Header from "../header/Header";
import Footer from "../footer/Footer";
import Title from "../title/title";

export default function Products() {
    return (
      <div>
        <Header />
        <Title titlemessage="Termékek" />
        <h1>Termékek</h1>
        <p>Ez a termékek oldal</p>
        <Footer />
    </div>
    )
}