import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h3>Naményi Dominik</h3>
          <p>Backend / Adatbázis fejlesztő</p>
          <p>Tel.: +36 30 123 4567</p>
          <p>E-mail: namenyi.dominik@namero1.hu</p>
        </div>

        <div className="footer-col">
          <h3>Mészáros Nándor</h3>
          <p>Frontend fejlesztő</p>
          <p>Tel.: +36 30 987 6543</p>
          <p>E-mail: meszaros.nandor@namero1.hu</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-logo">NAMERO.1</span>
        <div className="footer-line"></div>
      </div>
    </footer>
  );
}

export default Footer;
