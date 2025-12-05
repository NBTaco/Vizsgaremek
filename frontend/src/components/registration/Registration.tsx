import "./registration.css";

const Registration = () => {
  return (
    <div className="registration-modal">
        <div className="registration-box">
            <div className="registration-header">Regisztráció</div>

            <div className="registration-content">
                <label>Email</label>
                <input type="email" />  
                <label>Felhasználónév</label>
                <input type="text" />

                <label>Jelszó</label>
                <input type="password" />   
                <label>Jelszó ismétlése</label>
                <input type="password" />   
              <button className="registration-btn">Regisztráció</button>
            </div>
        </div>
    </div>
  );
};

export default Registration;
