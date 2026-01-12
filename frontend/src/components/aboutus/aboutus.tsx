import Footer from "../footer/Footer";
import Header from "../header/Header";
import Title from "../title/title";
import "./aboutus.css";

export default function Aboutus() {
  return (
    <>
      <Header />
      <Title titlemessage="Rólunk" />
      <div className="card">
        <div className="top">
          <div className="image-container">
            <img src=""/>
          </div>

          <div className="side-content">
            <div className="box"></div>
            <div className="box"></div>
            <div className="box small"></div>
          </div>
        </div>

        <div className="bottom">
        </div>
      </div>
      <Footer />
    </>
  );
}
