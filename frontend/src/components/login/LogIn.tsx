import "./login.css";
import { useState } from "react";

const LogIn = ({ onClose, onLoginSuccess }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const LogInSuccess = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })  
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Sikertelen bejelentkezés");
        return;
      }

      console.log("Sikeres login:", data);

      localStorage.setItem("token", data.token);

      onLoginSuccess(data.user);
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      alert("Szerver hiba");
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
