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

// Import Icons (jika menggunakan react-icons)
import { FaFire, FaStar, FaLeaf, FaSpicy } from 'react-icons/fa';

// Main Function KelolaMenu
function DaftarMenu() {
  const [menu, setMenu] = useState([]);
  const [kategori, setKategori] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab] = useState('all'); // Untuk tab kategori
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
    const cocokSearch = search === '' || 
      item.nama_menu?.toLowerCase().includes(search.toLowerCase()) || 
      item.deskripsi?.toLowerCase().includes(search.toLowerCase());
    return cocokKategori && cocokSearch;
  });

  // Mengelompokkan menu berdasarkan kategori
  const makanan = filteredMenu.filter((i) => i.nama_kategori?.toLowerCase() === 'makanan');
  const minuman = filteredMenu.filter((i) => i.nama_kategori?.toLowerCase() === 'minuman');
  const snack = filteredMenu.filter((i) => i.nama_kategori?.toLowerCase() === 'snack');

  // Fungsi untuk menentukan badge spesial
  const getSpecialBadge = (menuItem) => {
    const specialItems = {
      'Kopi Hitam Spesial': { icon: <FaStar />, label: 'Spesial', color: '#FFD700' },
      'Kopi Pedas': { icon: <FaSpicy />, label: 'Pedas', color: '#FF6B6B' },
      'Kopi Organik': { icon: <FaLeaf />, label: 'Organik', color: '#4CAF50' },
      'Kopi Baru': { icon: <FaFire />, label: 'Baru', color: '#FF4081' }
    };
    
    return specialItems[menuItem.nama_menu] || null;
  };

  // Format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Navbar */}
      <HeaderPagePelanggan 
        title="Nikmati Harimu dengan Secangkir Kebahagiaan" 
        subtitle="Rasakan cita rasa kopi yang menemani langkahmu" 
        bg_video="/background_video/navVideo.mp4" 
      />

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Menu Kami</h1>
          <p className={styles.heroSubtitle}>Temukan berbagai pilihan makanan dan minuman terbaik kami</p>
          <div className={styles.heroLine}></div>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.container}>
        {/* Filter Menu dengan Tab */}
        <div className={styles.filterSection}>
          <div className={styles.filterTabs}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
              onClick={() => setKategori('')}
            >
              Semua Menu
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'drinks' ? styles.activeTab : ''}`}
              onClick={() => setKategori('minuman')}
            >
              Minuman
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'food' ? styles.activeTab : ''}`}
              onClick={() => setKategori('makanan')}
            >
              Makanan
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'snacks' ? styles.activeTab : ''}`}
              onClick={() => setKategori('snack')}
            >
              Snack
            </button>
          </div>
          
          <div className={styles.searchWrapper}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Cari menu favoritmu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              <button className={styles.searchButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Memuat menu...</p>
          </div>
        ) : (
          <>
            {/* Statistik Menu */}
            <div className={styles.menuStats}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{filteredMenu.length}</span>
                <span className={styles.statLabel}>Total Menu</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{minuman.length}</span>
                <span className={styles.statLabel}>Minuman</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{makanan.length}</span>
                <span className={styles.statLabel}>Makanan</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{snack.length}</span>
                <span className={styles.statLabel}>Snack</span>
              </div>
            </div>

            {/* List Menu dengan Grid Modern */}
            {filteredMenu.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIllustration}>
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="80" fill="#2C2C2C"/>
                    <path d="M70 70L130 130" stroke="#fff615" strokeWidth="4"/>
                    <path d="M130 70L70 130" stroke="#fff615" strokeWidth="4"/>
                    <circle cx="100" cy="100" r="60" fill="#1A1A1A"/>
                    <text x="100" y="105" textAnchor="middle" fill="#ffd633" fontSize="24">?</text>
                  </svg>
                </div>
                <h3>Menu tidak ditemukan</h3>
                <p>Coba kata kunci lain atau pilih kategori berbeda</p>
              </div>
            ) : (
              <div className={styles.menuGrid}>
                {filteredMenu.map((item) => {
                  const specialBadge = getSpecialBadge(item);
                  const isAvailable = item.stok > 0;
                  
                  return (
                    <div 
                      key={item.id_menu} 
                      className={`${styles.menuCard} ${!isAvailable ? styles.unavailable : ''}`}
                    >
                      {/* Badge Khusus */}
                      {specialBadge && (
                        <div 
                          className={styles.specialBadge}
                          style={{ backgroundColor: specialBadge.color }}
                        >
                          {specialBadge.icon}
                          <span>{specialBadge.label}</span>
                        </div>
                      )}
                      
                      {/* Badge Stok Habis */}
                      {!isAvailable && (
                        <div className={styles.soldOutBadge}>
                          <span>HABIS</span>
                        </div>
                      )}
                      
                      {/* Gambar Menu */}
                      <div className={styles.cardImageContainer}>
                        <img 
                          src={getImageUrl(item.gambar)} 
                          alt={item.nama_menu}
                          className={styles.cardImage}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-food.jpg';
                          }}
                        />
                        <div className={styles.imageOverlay}></div>
                      </div>
                      
                      {/* Konten Card */}
                      <div className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                          <h3 className={styles.cardTitle}>{item.nama_menu}</h3>
                          <span className={styles.cardCategory}>{item.nama_kategori}</span>
                        </div>
                        
                        <p className={styles.cardDescription}>
                          {item.deskripsi || "Nikmati cita rasa yang istimewa"}
                        </p>
                        
                        <div className={styles.cardFooter}>
                          <div className={styles.priceContainer}>
                            <span className={styles.cardPrice}>{formatPrice(item.harga)}</span>
                            {item.stok < 10 && item.stok > 0 && (
                              <span className={styles.lowStock}>Stok: {item.stok}</span>
                            )}
                          </div>
                          
                          {/* Rating (simulasi) */}
                          <div className={styles.rating}>
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`${styles.star} ${i < 4 ? styles.filled : ''}`}
                              >
                                ★
                              </span>
                            ))}
                            <span className={styles.ratingValue}>4.5</span>
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <button 
                          className={`${styles.orderButton} ${!isAvailable ? styles.disabledButton : ''}`}
                          disabled={!isAvailable}
                        >
                          {isAvailable ? 'Tambah ke Keranjang' : 'Stok Habis'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ingin Menu Khusus?</h2>
          <p>Kami bisa membuatkan menu khusus sesuai keinginan Anda</p>
          <button className={styles.ctaButton}>Hubungi Kami</button>
        </div>
      </div>

      {/* Footer */}
      <FooterPage />
    </div>
  );
}

export default DaftarMenu;