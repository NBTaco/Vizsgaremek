import "./login.css";
import { useState } from "react";

const LogIn = ({ onClose, onLoginSuccess }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Az email cím megadása kötelező.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Érvénytelen email cím formátum.";
    }
    if (!password) {
      newErrors.password = "A jelszó megadása kötelező.";
    }
    return newErrors;
  };

  const handleLogin = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ server: data.message || "Sikertelen bejelentkezés." });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      onLoginSuccess(data.user);
      onClose();
    } catch {
      setErrors({ server: "Szerver hiba, próbáld újra később." });
    }
  };

  return (
    <div className="login-modal">
      <div className="login-box">
        <div className="login-header">Bejelentkezés</div>
        <div className="login-content">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}

          <label>Jelszó</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}

          {errors.server && <span className="field-error">{errors.server}</span>}

          <button className="login-btn" onClick={handleLogin}>Bejelentkezés</button>
          <button className="cancel-btn" onClick={onClose}>Mégse</button>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
