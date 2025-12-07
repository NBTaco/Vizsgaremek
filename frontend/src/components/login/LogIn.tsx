import "./login.css";
import users from "../testdata";
import { useState } from "react";

const LogIn = ({ onClose } : any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const LogInSuccess = () => {
    const userFound = users.find(
      user => user.email === email && user.password === password
    );

    if (userFound) {
      alert("Sikeres bejelentkezés!");
      console.log("Belépett felhasználó:", userFound);
    } else {
      alert("Hibás email vagy jelszó!");
    }
  };

  return (
    <div className="login-modal">
        <div className="login-box">
            <div className="login-header">Bejelentkezés</div>
            <div className="login-content">
                <label>Email</label>
                <input type="email" id="email" onChange={e => setEmail(e.target.value)}/>

                <label>Jelszó</label>
                <input type="password" id="password" onChange={e => setPassword(e.target.value)}/>

                <button className="login-btn" onClick={LogInSuccess}>Bejelentkezés</button>
                <button className="cancel-btn" onClick={onClose}>Mégse</button>
            </div>
        </div>
    </div>
  );
};

export default LogIn;
