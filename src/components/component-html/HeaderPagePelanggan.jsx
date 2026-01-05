// Import Library
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Import Style (pakai module)
import styles from '../../styles/header_pelanggan.module.css'; // pastikan path benar

// Main Function HeaderPagePelanggan
function HeaderPagePelanggan({ bg_video, title, subtitle }) {
  // Gunakan state untuk menu responsive
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <video autoPlay muted loop playsInline className={styles.bgVideo}>
          <source src={bg_video} type="video/mp4" />
        </video>

        {/* ✨ Motivasi Tengah ✨ */}
        <div className={styles.motivasiTengah}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className={styles.navContent}>
          <div className={styles.navLogo}>
            <Link to="/Beranda-Pelanggan">
              <img src="/logo_kafe/Logo.PNG" alt="Logo Kafe" />
            </Link>
          </div>

          <div className={styles.navbarNav}>
            {/* Gunakan conditional class */}
            <ul className={menuActive ? styles.show : ''}>
              <li>
                <Link to="/beranda-pelanggan">Beranda</Link>
              </li>
              <li>
                <Link to="/daftar-menu">Menu</Link>
              </li>
              <li>
                <Link to="/form-reservasi">Reservasi</Link>
              </li>
              <li>
                <Link to="/feedback-pelanggan">Feedback</Link>
              </li>
              <li>
                <Link to="/tentang-kami">Tentang Kami</Link>
              </li>
              <li>
                <Link to="/scanner" className={styles.btnNavbar}>
                  <i className="fa-solid fa-mug-saucer"></i> Pesan Disini
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.menuIcon} onClick={toggleMenu}>
            <i className="ph ph-list"></i>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HeaderPagePelanggan;
