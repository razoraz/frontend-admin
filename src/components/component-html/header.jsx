// Import Library
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Import Component
import Modal from '../modal-notifikasi/ModalNotifikasi';

// Import Style
import styles from '../../styles/header.module.css';

// Main Function HeaderPage
function HeaderPage({ title }) {
  const navigate = useNavigate();

  // State untuk modal logout
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  // Fungsi logout
  const handleLogout = () => {
    sessionStorage.removeItem('token');

    // Munculkan modal sukses logout
    setModalType('success');
    setModalTitle('Logout Berhasil');
    setModalMessage('Logout sukses. Terima kasih atas kerja keras hari ini!');
    setModalOpen(true);
  };

  // Setelah modal ditutup, baru arahkan ke login
  const handleCloseModal = () => {
    setModalOpen(false);
    navigate('/login', { replace: true });
  };

  // Fungsi toggle menu mobile
  const toggleMenu = () => {
    const navList = document.getElementById('nav-list');
    const menuExtra = document.getElementById('menu-extra');

    navList.classList.toggle(styles.show);
    menuExtra.classList.toggle(styles.show);
  };

  // Tutup menu saat layar diperlebar
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      document.getElementById('nav-list')?.classList.remove(styles.show);
      document.getElementById('menu-extra')?.classList.remove(styles.show);
    }
  });

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.navLogo}>
          <Link to="/">
            <img src="/logo_kafe/Logo.PNG" alt="Logo Kafe" />
          </Link>
        </div>
        <div className={styles.navbarNav}>
          <ul id="nav-list">
            <li><Link to="/beranda">Beranda</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/reservasi">Reservasi</Link></li>
            <li><Link to="/pemesanan">Pemesanan</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
            <li><Link to="/future">Future</Link></li>
            <li>
              <button onClick={handleLogout} className={styles.btnLogout}>
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            </li>
          </ul>
        </div>
        <div id="menu-extra" className={styles.menuIcon} onClick={toggleMenu}>
          <i className="ph ph-list"></i>
        </div>
      </div>

      <section className={styles.navbarTitle}>
        <h1>{title}</h1>
        <div className={styles.decorativeLine}></div>
      </section>

      {/* Modal Notifikasi Logout */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </nav>
  );
}

export default HeaderPage;
