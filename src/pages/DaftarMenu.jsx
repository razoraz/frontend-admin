// Page Kelola Menu
// Import Library
import { useEffect, useState } from 'react';
import axios from 'axios';

// Import Component
import useBlockBack from '../hooks/BlockBack';
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPage from '../components/component-html/FooterPage';
import MenuFilterBar from '../components/component-menuPelanggan/MenuFilterBar2';
import MenuList from '../components/component-menuPelanggan/MenuList2';

// Import Style
import styles from '../styles/menu_pelanggan.module.css';

// Main Function KelolaMenu
function DaftarMenu() {
  const [menu, setMenu] = useState([]);
  const [kategori, setKategori] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  useBlockBack();

  // Ambil data menu dari server
  useEffect(() => {
    document.title = 'Kelola Menu - Basecamp Kopi';
    setLoading(true);
    axios
      .get('https://backend-production-8cf7.up.railway.app/api/menu/menu')
      .then((res) => {
        setMenu(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal ambil menu:', err);
        setLoading(false);
      });
  }, []);

  const getImageUrl = (filename) => `https://backend-production-8cf7.up.railway.app/uploads/${filename}`;

  // Filter menu berdasarkan kategori dan pencarian
  const filteredMenu = menu.filter((item) => {
    const cocokKategori = kategori === '' || item.nama_kategori?.toLowerCase() === kategori.toLowerCase();
    const cocokSearch = search === '' || item.nama_menu?.toLowerCase().includes(search.toLowerCase()) || item.deskripsi?.toLowerCase().includes(search.toLowerCase());
    return cocokKategori && cocokSearch;
  });

  // Mengelompokkan menu berdasarkan kategori
  const makanan = filteredMenu.filter((i) => i.nama_kategori?.toLowerCase() === 'makanan');
  const minuman = filteredMenu.filter((i) => i.nama_kategori?.toLowerCase() === 'minuman');
  const snack = filteredMenu.filter((i) => i.nama_kategori?.toLowerCase() === 'snack');

  return (
    <div className={styles.pageContainer}>
      {/* Navbar */}
      <HeaderPagePelanggan 
        title="Nikmati Harimu dengan Secangkir Kebahagiaan" 
        subtitle="Rasakan cita rasa kopi yang menemani langkahmu" 
        bg_video="/background_video/navVideo.mp4" 
      />

      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>Menu Kami</h1>
          <p className={styles.heroSubtitle}>Temukan berbagai pilihan makanan dan minuman terbaik</p>
          <div className={styles.goldLine}></div>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.container}>
        {/* Loading State */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Memuat menu...</p>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className={styles.statsBar}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{filteredMenu.length}</span>
                <span className={styles.statLabel}>Total Menu</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{minuman.length}</span>
                <span className={styles.statLabel}>Minuman</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{makanan.length}</span>
                <span className={styles.statLabel}>Makanan</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{snack.length}</span>
                <span className={styles.statLabel}>Snack</span>
              </div>
            </div>

            {/* Filter Menu - MASIH MENGGUNAKAN KOMPONEN ASLI */}
            <div className={styles.filterWrapper}>
              <MenuFilterBar kategori={kategori} setKategori={setKategori} search={search} setSearch={setSearch} />
            </div>

            {/* List Menu - MASIH MENGGUNAKAN KOMPONEN ASLI */}
            <div className={styles.menuListWrapper}>
              <MenuList 
                kategori={kategori} 
                makanan={makanan} 
                minuman={minuman} 
                snack={snack} 
                filteredMenu={filteredMenu} 
                getImageUrl={getImageUrl} 
              />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <FooterPage />
    </div>
  );
}

export default DaftarMenu;