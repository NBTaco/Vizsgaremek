import { useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";

function Header({ onLoginClick,user, onLogout, onRegistrationClick}: any) {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo"><Link to="/">NAMERO.1</Link></div>

      <nav className="nav">
        <a href="#">Termékek</a>
        <a href="#">Kapcsolat</a>
        <Link to="/aboutus">Rólunk</Link>
      </nav>

      <div className="menu-container">
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>

        {open && (
          <div className="dropdown">
            {user && (
              <>
                <a href="#">Profil ({user.username})</a>
                <a href="#" onClick={onLogout}>Kijelentkezés</a>
              </>
            )}
            {!user && (
              <>
                <a href="#" onClick={onLoginClick}>Bejelentkezés</a>
                <a href="#" onClick={onRegistrationClick}>Regisztráció</a>
              </>
            )}
            <a href="#">Beállítások</a>

          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
