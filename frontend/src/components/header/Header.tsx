import { useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import LogIn from "../login/LogIn";
import Registration from "../registration/Registration";

function Header({ user }: any) {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedInUser, setloggedInUser] = useState(user || null);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLoginSuccess = (user: any) => {
    setloggedInUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setloggedInUser(null);
    localStorage.removeItem("user");
  };

  const handleRegistrationSuccess = (user: any) => {
    setloggedInUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setShowRegistration(false);
  };


  return (
    <header className="header">
      <div className="logo"><Link to="/">NAMERO.1</Link></div>

      <nav className="nav">
        <Link to="/products">Termékek</Link>
        <Link to="/contact">Kapcsolat</Link>
        <Link to="/aboutus">Rólunk</Link>
      </nav>

      <div className="menu-container">
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>

        {open && (
          <div className="dropdown">
            {loggedInUser && (
              <>
                <a href="#">Profil ({loggedInUser.username})</a>
                <a href="#" onClick={handleLogout}>Kijelentkezés</a>
              </>
            )}
            {!loggedInUser && (
              <>
                <a href="#" onClick={() => setShowLogin(true)}>Bejelentkezés</a>
                <a href="#" onClick={() => setShowRegistration(true)}>Regisztráció</a>
              </>
            )}
            <a href="#">Beállítások</a>

          </div>
        )}
      </div>

      {showLogin && (
        <LogIn
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showRegistration && (
        <Registration
          onClose={() => setShowRegistration(false)}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      )}
    </header>
  );
}

export default Header;
