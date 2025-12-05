import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      {/* FELSŐ SZÜRKE RÉSZ */}
      <div className="footer-top">
        <div className="footer-col">
          <h3>Kapcsolat</h3>
          <p>Tel.:</p>
          <p>E-mail:</p>
        </div>

        <div className="footer-col">
          <h3>Kapcsolat</h3>
          <p>Tel.:</p>
          <p>E-mail:</p>
        </div>

        <div className="footer-col">
          <h3>Kapcsolat</h3>
          <p>Tel.:</p>
          <p>E-mail:</p>
        </div>
      </div>

      {/* ALSÓ SÖTÉT SÁV */}
      <div className="footer-bottom">
        <span className="footer-logo">NAMERO.1</span>
        <div className="footer-line"></div>
      </div>
    </footer>
  );
}

export default Footer;
