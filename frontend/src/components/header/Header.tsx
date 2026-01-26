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
  const [role, setRole] = useState("");

  const handleLoginSuccess = (user: any) => {
    setloggedInUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setShowLogin(false);
    getRole()
  };

  const handleLogout = () => {
    setloggedInUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setRole("")
  };

  const handleRegistrationSuccess = (user: any) => {
    setloggedInUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setShowRegistration(false);
  };

  async function getRole() {
    const username = await localStorage.getItem('username')
    const response = await fetch(`http://localhost:3000/role/${username}`)
    const resdata : any = await response.json()
    localStorage.setItem('role', resdata.role)
    setRole(resdata.role)
  }

  return (
    <header className="header">
      <div className="logo"><Link to="/">NAMERO.1</Link></div>

      <nav className="nav">
        <Link to="/products">Termékek</Link>
        <Link to="/contact">Kapcsolat</Link>
        <Link to="/aboutus">Rólunk</Link>
        {role == "admin" && 
          <Link to="/adminmain">ASD</Link>
        }
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
