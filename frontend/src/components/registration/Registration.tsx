import "./registration.css";
import { useState } from "react";

const Registration = ({ onClose, onRegistrationSuccess }: any) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
    passwordRepeat?: string;
    server?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};

    if (!email.trim()) {
      e.email = "Az email cím megadása kötelező.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Érvénytelen email cím formátum.";
    }

    if (!username.trim()) {
      e.username = "A felhasználónév megadása kötelező.";
    } else if (username.trim().length < 3) {
      e.username = "A felhasználónév legalább 3 karakter legyen.";
    }

    if (!password) {
      e.password = "A jelszó megadása kötelező.";
    } else if (password.length < 6) {
      e.password = "A jelszó legalább 6 karakter legyen.";
    }

    if (!passwordRepeat) {
      e.passwordRepeat = "A jelszó ismétlése kötelező.";
    } else if (password !== passwordRepeat) {
      e.passwordRepeat = "A két jelszó nem egyezik meg.";
    }

    return e;
  };

  const handleRegister = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ server: data.message || "Sikertelen regisztráció." });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onRegistrationSuccess(data.user);
      onClose();
    } catch {
      setErrors({ server: "Szerver hiba, próbáld újra később." });
    }
  };

  const clearError = (field: keyof typeof errors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <div className="registration-modal">
      <div className="registration-box">
        <div className="registration-header">Regisztráció</div>
        <div className="registration-content">

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}

          <label>Felhasználónév</label>
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); clearError("username"); }}
          />
          {errors.username && <span className="field-error">{errors.username}</span>}

          <label>Jelszó</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}

          <label>Jelszó ismétlése</label>
          <input
            type="password"
            value={passwordRepeat}
            onChange={(e) => { setPasswordRepeat(e.target.value); clearError("passwordRepeat"); }}
          />
          {errors.passwordRepeat && <span className="field-error">{errors.passwordRepeat}</span>}

          {errors.server && <span className="field-error">{errors.server}</span>}

          <button className="registration-btn" onClick={handleRegister}>Regisztráció</button>
          <button className="cancel-btn" onClick={onClose}>Mégse</button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
