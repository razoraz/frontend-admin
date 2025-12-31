// Import Library
import { Link } from 'react-router-dom';

// Import Style
import styles from '../../styles/footer.module.css';

// Main Function FooterPage
function FooterPage() {
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
            <ul>
              <li>
                <Link to="https://wa.me/6281337142265" target="_blank">
                  <i className="ph ph-whatsapp-logo"></i> WhatsApp
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.instagram.com/bbs.trans/profilecard/?igsh=OGM1YTM1YW9zbGho"
                  target="_blank"
                >
                  <i className="ph ph-instagram-logo"></i> Instagram
                </Link>
              </li>
              <li>
                <Link to="https://wa.me/6281234567890" target="_blank">
                  <i className="ph ph-facebook-logo"></i> Facebook
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerContent}>
            <h4>Layanan</h4>
            <ul>
              <li>
                <Link to="">Pemesanan Kopi</Link>
              </li>
              <li>
                <Link to="">Reservasi Meja</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerContent}>
            <h4>Keunggulan</h4>
            <ul>
              <li>
                <Link to="#">Cepat dan Efisien</Link>
              </li>
              <li>
                <Link to="#">Modern dan Nyaman</Link>
              </li>
              <li>
                <Link to="#">Pelayanan Terbaik</Link>
              </li>
              <li>
                <Link to="#">Harga Terjangkau</Link>
              </li>
              <li>
                <Link to="#">Kualitas Terbaik</Link>
              </li>
              <li>
                <Link to="#">Kenyamanan Terbaik</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.row2}>
        <br />
        <p>@2025 Basecamp Kopi Jember. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default FooterPage;
