import "../../styles/footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div>
        Copyright ©
        <a
          className="footer-link"
          href="https://www.ntplindia.co.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {year} Navkar Transcore Pvt. Ltd. All Rights Reserved
        </a>
      </div>
    </footer>
  );
};

export default Footer;
