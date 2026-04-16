import Footer from "../footer/Footer";
import Header from "../header/Header";
import Title from "../title/title";
import rolunk from "./rolunk.png"
import "./aboutus.css";

export default function Aboutus() {
  return (
    <>
      <Header />
      <Title titlemessage="Rólunk" />
      <div className="aboutus-card">
        <div className="top">
          <div className="image-container">
            <img src={rolunk} alt="rolunk" />
          </div>

          <div className="side-content">
            <div className="box">
              Modern és biztonságos webáruház barkácsolóknak és lámpavásárlóknak.
            </div>
            <div className="box">
              TypeScript, React és Node.js alapú professzionális fejlesztés.
            </div>
            <div className="box small">
              Gyors kereső, reszponzív design, könnyű kezelhetőség minden eszközön.
            </div>
          </div>
        </div>

        <div className="bottom">
          <strong>Namero 1. – Barkács és Világítástechnika</strong><br/><br/>
          
          Küldetésünk egy gyors, biztonságos webshop a barkácsolás és világítástechnika szerelmeseinek. Modern technológiákra építkezve garantáljuk a megbízható működést és az adatbiztonságot.<br/><br/>
          
          <strong>Miért mi?</strong><br/>
          • Átlátható termékkatalógus keresővel és szűrőkkel<br/>
          • Biztonságos regisztráció és bejelentkezés<br/>
          • Kosárkezelés és rendeléskövetés<br/>
          • Reszponzív felület minden eszközön<br/><br/>
          
          <strong>Fejlesztőink:</strong><br/>
          <strong>Naményi Dominik</strong> (Backend) – adatbázis, API és szerverbiztonság<br/>
          <strong>Mészáros Nándor</strong> (Frontend) – felhasználói felület és élmény
        </div>
      </div>
      <Footer />
    </>
  );
}