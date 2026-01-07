import "./registration.css";
import { useState } from "react";

const Registration = ({ onClose, onRegistrationSuccess }: any) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const RegistrationSuccess = async () => {
    if (!email || !username || !password || !passwordRepeat) {
      alert("Minden mező kitöltése kötelező!");
      return;
    }

    if (password !== passwordRepeat) {
      alert("A jelszavak nem egyeznek!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          username
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Sikertelen regisztráció");
        return;
      }

      console.log("Sikeres regisztráció:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onRegistrationSuccess(data.user);
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
      alert("Szerver hiba");
    }
  };

  return (
    <div className="registration-modal">
        <div className="registration-box">
            <div className="registration-header">Regisztráció</div>

            <div className="registration-content">
                <label>Email</label>
                <input type="email" onChange={e => setEmail(e.target.value)}/>   
                <label>Felhasználónév</label>
                <input type="text" onChange={e => setUsername(e.target.value)}/>

                <label>Jelszó</label>
                <input type="password" onChange={e => setPassword(e.target.value)}/>   
                <label>Jelszó ismétlése</label>
                <input type="password" onChange={e => setPasswordRepeat(e.target.value)}/>
              <button className="registration-btn" onClick={RegistrationSuccess}>Regisztráció</button>
              <button className="cancel-btn" onClick={onClose}>Mégse</button>
            </div>
        </div>
    </div>
  );
};

export default Registration;
