import { useState } from "react";
import "./header.css";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">NAMERO.1</div>

      <nav className="nav">
        <a href="#">Termékek</a>
        <a href="#">Kapcsolat</a>
        <a href="#">Rólunk</a>
      </nav>

      <div className="menu-container">
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>

        {open && (
          <div className="dropdown">
            <a href="#">Profil</a>
            <a href="#">Beállítások</a>
            <a href="#">Kijelentkezés</a>
            <a href="#">Bejelentkezés</a>
            <a href="#">Regisztráció</a>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
