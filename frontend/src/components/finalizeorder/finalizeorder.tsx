import Header from "../header/Header";
import Title from "../title/title";
import Footer from "../footer/Footer";
import "./finalizeorder.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const orderId = localStorage.getItem("orderId");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
        throw new Error(errorText);
      }

      navigate("/profile");
    } catch (error) {
      console.error(error);
    }
  };

  const token = localStorage.getItem("token");

  if (!token)
    return (
      <div className="cart-msg">
        Az oldal megtekintéséhez be kell jelentkezned. <br></br>
        <button onClick={() => navigate("/")}>Vissza a föoldalra</button>
      </div>
    );

  return (
    <>
      <Header />
      <Title titlemessage="Rendelés véglegesítése" />
      <div className="finalize-order">
        <form className="finalize-form" onSubmit={handleSubmit}>
          <h2>Rendelés véglegesítése</h2>
          <label>Név:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Telefonszám:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <label>Ország:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
          <label>Város:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <label>Irányítószám:</label>
          <input
            type="text"
            name="postalcode"
            value={formData.postalcode}
            onChange={handleChange}
            required
          />
          <label>Utca:</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
          />
          <label>Házszám:</label>
          <input
            type="text"
            name="housenumber"
            value={formData.housenumber}
            onChange={handleChange}
            required
          />
          <label>Fizetési mód:</label>
          <select
            name="payment"
            value={formData.payment}
            onChange={handleChange}
            required
          >
            <option value="cash">utánvét</option>
          </select>
          <button type="submit">Rendelés leadása</button>
        </form>
      </div>
      <Footer />
    </>
  );
}
