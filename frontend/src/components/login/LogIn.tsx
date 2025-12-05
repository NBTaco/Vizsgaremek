import "./login.css";

const LogIn = () => {
  return (
    <div className="login-modal">
        <div className="login-box">
            <div className="login-header">Bejelentkezés</div>
            <div className="login-content">
                <label>Email</label>
                <input type="email" />

                <label>Jelszó</label>
                <input type="password" />

                <button className="login-btn">Bejelentkezés</button>
            </div>
        </div>
    </div>
  );
};

export default LogIn;
