import { useEffect, useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import LogIn from "../login/LogIn";
import Registration from "../registration/Registration";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Header({ user }: any) {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedInUser, setloggedInUser] = useState(user || null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  
  if (storedUser) {
    setloggedInUser(JSON.parse(storedUser));
  }

  const token = localStorage.getItem("token");

    if (!token) {
      setRole(null);
      return;
    }

    try {
      const decoded = jwtDecode<{ role?: string }>(token);
      setRole(decoded?.role ?? null);
    } catch (err) {
      console.error("Invalid token", err);
      setRole(null);
    }
    
}, []);
  
  const handleLoginSuccess = (user: any) => {
    setloggedInUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setShowLogin(false);
    window.location.reload();
  };

  const handleLogout = () => {
    setloggedInUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("orderId");
      navigate("/");
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
        <Link to="/">Főoldal</Link>
        <Link to="/products">Termékek</Link>
        <Link to="/aboutus">Rólunk</Link>
        {role ==  "admin" && (
          <Link to="/adminorder">Rendelések kezelése (Admin)</Link>
        )}
      </nav>

      <div className="menu-container">

        {loggedInUser && (
          <button className="cart-btn" onClick={() => navigate("/cart")}>
            <span >🛒</span>
          </button>
        )}

        <button className="menu-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>

        {open && (
          <div className="dropdown">
            {loggedInUser && (
              <>
                <a onClick={() => navigate("/profile")}>Profil ({loggedInUser.username})</a>
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
