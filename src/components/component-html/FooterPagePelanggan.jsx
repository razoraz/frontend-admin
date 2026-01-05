// Import Library
import { Link } from 'react-router-dom';

// Import Style
import styles from '../../styles/footer.module.css';

// Main Function FooterPage
function FooterPagePelanggan() {
  return (
    <footer className={styles.footer}>
      <div className={styles.rowFooter}>
        <div className={`${styles.footerCol} ${styles.footLeft}`}>
          <div className={styles.headFooter}>
            <img src="/logo_kafe/Logo.PNG" alt="logo" />
            <h1>Basecamp Kopi Jember</h1>
          </div>
          <div className={styles.socialLinks}>
            <Link to="#">
              <i className="fa-solid fa-location-dot"></i>Jl. Mastrip Jember
            </Link>
            <Link to="#">
              <i className="fa-solid fa-phone"></i>(+62) xxxxxxxxx
            </Link>
            <Link to="#">
              <i className="fa-solid fa-envelope"></i>xxxxxxxxxxxx
            </Link>
          </div>
        </div>

        <div className={styles.footerCol}>
          <div className={styles.footerContent}>
            <h4>Kontak Kami</h4>
            <div className="decorativeLine"></div>
            <ul>
              <li>
                <Link to="https://wa.me/6281337142265" target="_blank">
                  <i className="ph ph-whatsapp-logo"></i> WhatsApp
                </Link>
              </li>
              <li>
                <a href="https://www.instagram.com/basecampkopi?igsh=MXNzazgxOHhqNXZoNQ==" target="_blank" rel="noopener noreferrer">
                  <i className="ph ph-instagram-logo"></i> Instagram
                </a>
              </li>

              <li>
                <a href="https://www.tiktok.com/@basecamp_kopi?_r=1&_t=ZS-92mBJwtAUID" target="_blank" rel="noopener noreferrer">
                  <i className="ph ph-tiktok-logo"></i> TikTok
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.footerContent}>
            <h4>Layanan</h4>
            <div className="decorativeLine"></div>
            <ul>
              <li>
                <Link to="/scanner">Pemesanan Kopi</Link>
              </li>
              <li>
                <Link to="/form-reservasi">Reservasi Meja</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerContent}>
            <h4>Keunggulan</h4>
            <div className="decorativeLine"></div>
            <ul>
              <li>
                <Link to="/beranda-pelanggan">Kualitas Terbaik</Link>
              </li>
              <li>
                <Link to="/beranda-pelanggan">Konsisten Rasa</Link>
              </li>
              <li>
                <Link to="/beranda-pelanggan">Pelayanan Ramah</Link>
              </li>
              <li>
                <Link to="/beranda-pelanggan">Inovasi Berkelanjutan</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.row2}>
        <br />
        <p>@2026 Basecamp Kopi Jember. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default FooterPage;
