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
              <i className="fa-solid fa-location-dot"></i>Jl. Mastrip, Kec. Sumbersari, Kabupaten Jember, Jawa Timur 68121
            </Link>
            <Link to="#">
              <i className="fa-solid fa-phone"></i>(+62)852-3315-6241
            </Link>
            <Link to="#">
              <i className="fa-solid fa-envelope"></i> gakun8458@gmail.com
            </Link>
          </div>
        </div>

        <div className={styles.footerCol}>
          <div className={styles.footerContent}>
            <h4>Kontak Kami</h4>
            <ul>
              <li>
                <Link to="https://wa.me/628980454405?text=Halo%20saya%20ingin%20memesan%20menu%20di%20Basecamp%20Kopi%20☕" target="_blank" rel="noopener noreferrer">
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
            <ul>
              <li>
                <Link to="/pemesanan">Kelola Pemesanan</Link>
              </li>
              <li>
                <Link to="/reservasi">Kelola Reservasi</Link>
              </li>
              <li>
                <Link to="/feedback">Kelola Feedback</Link>
              </li>
              <li>
                <Link to="/menu">Kelola Menu</Link>
              </li>
              <li>
                <Link to="/kelola-meja">Kelola Meja</Link>
              </li>
              <li>
                <Link to="/kelola-kategori">Kelola Kategori</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerContent}>
            <h4>Keunggulan</h4>
            <ul>
              <li>
                <Link to="/beranda">Cepat dan Efisien</Link>
              </li>
              <li>
                <Link to="/beranda">Modern dan Nyaman</Link>
              </li>
              <li>
                <Link to="/beranda">Pelayanan Terbaik</Link>
              </li>
              <li>
                <Link to="/beranda">Harga Terjangkau</Link>
              </li>
              <li>
                <Link to="/beranda">Kualitas Terbaik</Link>
              </li>
              <li>
                <Link to="/beranda">Kenyamanan Terbaik</Link>
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
