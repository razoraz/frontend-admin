// Component: HeaderPage

// Import Library
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Import Component
import Modal from '../modal-notifikasi/ModalNotifikasi';

// Import Style
import styles from '../../styles/header_2.module.css';

// Main Function HeaderPage
function HeaderPage({ title }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setModalType('success');
    setModalTitle('Logout Berhasil');
    setModalMessage('Logout sukses. Terima kasih atas kerja keras hari ini!');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    navigate('/login', { replace: true });
  };

  const toggleMenu = () => {
    const navList = document.getElementById('nav-list');
    navList.classList.toggle(styles.show);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        document.getElementById('nav-list')?.classList.remove(styles.show);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            <li>
              <Link to="/beranda">Beranda</Link>
            </li>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/reservasi">Reservasi</Link>
            </li>
            <li>
              <Link to="/pemesanan">Pemesanan</Link>
            </li>
            <li>
              <Link to="/feedback">Feedback</Link>
            </li>

            {/* Dropdown Future */}
            <li className={styles.dropdown}>
              <button className={styles.dropdownBtn} onClick={() => setDropdownOpen(!dropdownOpen)}>
                Master <i className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
              </button>
              {dropdownOpen && (
                <ul className={`${styles.dropdownMenu} ${styles.show}`}>
                  <li>
                    <Link to="/kelola-meja">Data Meja</Link>
                  </li>
                  <li>
                    <Link to="/future/statistik">Statistik</Link>
                  </li>
                  <li>
                    <Link to="/future/laporan">Laporan</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={styles.dropdown}>
              <button className={styles.dropdownBtn} onClick={() => setDropdownOpen(!dropdownOpen)}>
                Laporan <i className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
              </button>
              {dropdownOpen && (
                <ul className={`${styles.dropdownMenu} ${styles.show}`}>
                  <li>
                    <Link to="/kelola-meja">Dowload Laporan Hari Ini</Link>
                  </li>
                  <li>
                    <Link to="/future/statistik">Statistik</Link>
                  </li>
                  <li>
                    <Link to="/future/laporan">Laporan</Link>
                  </li>
                </ul>
              )}
            </li>

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

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={modalTitle} message={modalMessage} type={modalType} />
    </nav>
  );
}

export default HeaderPage;
