import Header from "../header/Header";
import Title from "../title/title";
import Footer from "../footer/Footer";
import "./finalizeorder.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormErrors = {
  name?: string;
  phone?: string;
  country?: string;
  city?: string;
  postalcode?: string;
  street?: string;
  housenumber?: string;
  server?: string;
};

export default function FinalizeOrder() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    country: "",
    city: "",
    postalcode: "",
    street: "",
    housenumber: "",
    payment: "cash",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};

    if (!formData.name.trim()) {
      e.name = "A név megadása kötelező.";
    } else if (!/\s/.test(formData.name.trim())) {
      e.name = "A névnek tartalmaznia kell legalább egy szóközt (vezeték- és keresztnév).";
    }

    if (!formData.phone.trim()) {
      e.phone = "A telefonszám megadása kötelező.";
    } else if (/\s/.test(formData.phone)) {
      e.phone = "A telefonszám nem tartalmazhat szóközt.";
    } else if (!/^\+?[0-9]{7,15}$/.test(formData.phone)) {
      e.phone = "Érvénytelen telefonszám (csak számok, opcionálisan + előjel).";
    }

    if (!formData.country.trim()) {
      e.country = "Az ország megadása kötelező.";
    }

    if (!formData.city.trim()) {
      e.city = "A város megadása kötelező.";
    }

    if (!formData.postalcode.trim()) {
      e.postalcode = "Az irányítószám megadása kötelező.";
    } else if (!/^[0-9]{4,10}$/.test(formData.postalcode.trim())) {
      e.postalcode = "Az irányítószám csak számokat tartalmazhat (4–10 jegy).";
    }

    if (!formData.street.trim()) {
      e.street = "Az utca megadása kötelező.";
    }

    if (!formData.housenumber.trim()) {
      e.housenumber = "A házszám megadása kötelező.";
    }

    return e;
  };

  const orderId = localStorage.getItem("orderId");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      const response = await fetch("http://localhost:3000/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          orderId,
          status: "ordered",
          billing_name: formData.name,
          billing_phone: formData.phone,
          billing_country: formData.country,
          billing_zip: formData.postalcode,
          billing_city: formData.city,
          billing_address: `${formData.street} ${formData.housenumber}`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrors({ server: errorText || "Szerver hiba történt." });
        return;
      }

      navigate("/profile");
    } catch {
      setErrors({ server: "Szerver hiba, próbáld újra később." });
    }
  };

  const token = localStorage.getItem("token");

  if (!token)
    return (
      <div className="cart-msg">
        Az oldal megtekintéséhez be kell jelentkezned. <br />
        <button onClick={() => navigate("/")}>Vissza a főoldalra</button>
      </div>
    );

  return (
    <>
      <Header />
      <Title titlemessage="Rendelés véglegesítése" />
      <div className="finalize-order">
        <form className="finalize-form" onSubmit={handleSubmit} noValidate>
          <h2>Rendelés véglegesítése</h2>

          <label>Név:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}

          <label>Telefonszám:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}

          <label>Ország:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
          {errors.country && <span className="field-error">{errors.country}</span>}

          <label>Város:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <span className="field-error">{errors.city}</span>}

          <label>Irányítószám:</label>
          <input
            type="text"
            name="postalcode"
            value={formData.postalcode}
            onChange={handleChange}
          />
          {errors.postalcode && <span className="field-error">{errors.postalcode}</span>}

          <label>Utca:</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
          />
          {errors.street && <span className="field-error">{errors.street}</span>}

          <label>Házszám:</label>
          <input
            type="text"
            name="housenumber"
            value={formData.housenumber}
            onChange={handleChange}
          />
          {errors.housenumber && <span className="field-error">{errors.housenumber}</span>}

          <label>Fizetési mód:</label>
          <select name="payment" value={formData.payment} onChange={handleChange}>
            <option value="cash">utánvét</option>
          </select>

          {errors.server && <span className="field-error">{errors.server}</span>}

          <button type="submit">Rendelés leadása</button>
        </form>
      </div>
      <Footer />
    </>
  );
}
