// Import Library
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import Component
import useBlockBack from '../hooks/BlockBack';
import useFadeOnScroll from '../hooks/FadeOnScrool';
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPage from '../components/component-html/FooterPagePelanggan';

// Import Style
import styles from '../styles/pemesanan_menu.module.css';

// ======================
// Component MenuCategory
// ======================
function MenuCategory({ title, icon, items, cart, addToCart, updateQty }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.menuCategory}>
      <h2 className={styles.menuSectionTitle}>
        {icon} {title}
      </h2>
      <div className={styles.decorativeLine2}></div>
      <div className={styles.menuCardContainer}>
        {items.map((item) => {
          const qty = cart[item.id_menu] || 0;
          const isHabis = item.status_tersedia?.toLowerCase() === 'habis';

          return (
            <div className={`${styles.menuCard} ${isHabis ? styles.habisCard : ''}`} key={item.id_menu}>
              <div className={styles.menuImageContainer}>
                <img src={item.gambar_menu} alt={item.nama_menu} className={`${styles.menuImage} ${isHabis ? styles.habisImage : ''}`} />
              </div>

              <div className={styles.decorativeLine}></div>

              <div className={styles.menuInfo}>
                <h3 className={styles.menuName}>{item.nama_menu}</h3>
                <p className={styles.menuPrice}>Rp {item.harga.toLocaleString()}</p>

                {isHabis && <p className={styles.habisText}>Habis</p>}
              </div>

              {/* Tombol */}
              {!isHabis &&
                (qty === 0 ? (
                  <button className={styles.addBtn} onClick={() => addToCart(item.id_menu)}>
                    <img src="/photo/icon-plus.png" alt="Tambah" />
                  </button>
                ) : (
                  <div className={styles.menuQuantity}>
                    <button className={styles.qtyBtn} onClick={() => updateQty(item.id_menu, qty - 1)}>
                      -
                    </button>
                    <span className={styles.qtyValue}>{qty}</span>
                    <button className={styles.qtyBtn} onClick={() => updateQty(item.id_menu, qty + 1)}>
                      +
                    </button>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ======================
// Component MenuList
// ======================
function MenuList({ filteredMenu, cart, addToCart, updateQty }) {
  const menusByCategory = filteredMenu.reduce((acc, item) => {
    const cat = item.nama_kategori || 'Lainnya';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
  const categories = Object.keys(menusByCategory);
  const noData = filteredMenu.length === 0;
  const kategoriIcons = {
    food: '🍽️',
    snack: '🍟',
    teabased: '🍵',
    squash: '🥤',
    icecoffe: '☕',
    milkbased: '🥛',
    specialhot: '🔥',
  };
  // Pastikan "Food" paling atas
  categories.sort((a, b) => {
    if (a.toLowerCase() === 'food') return -1; // food dulu
    if (b.toLowerCase() === 'food') return 1;
    return 0; // kategori lain urut sesuai munculnya
  });

  return (
    <div>
      {categories.map((cat) => {
        const normalizeCat = cat.toLowerCase().replace(/\s+/g, '');
        return (
          menusByCategory[cat].length > 0 && (
            <MenuCategory
              key={cat}
              title={cat}
              icon={kategoriIcons[normalizeCat] || '🍽️'}
              items={menusByCategory[cat]}
              cart={cart}
              addToCart={addToCart}
              updateQty={updateQty}
            />
          )
        );
      })}

      {noData && (
        <div className={styles.emptyContainer}>
          <img src="/photo/empty-foto.png" alt="Tidak ada menu" className={styles.emptyImage} />
          <p className={styles.noMenuText}>Tidak ada menu ditemukan.</p>
        </div>
      )}
    </div>
  );
}

// ======================
// Main Page PemesananPelanggan
// ======================
function PemesananPelanggan() {
  useEffect(() => {
    document.title = 'Pemesanan Menu - Basecamp Kopi';
  }, []);

  const navigate = useNavigate();

  useBlockBack();
  useFadeOnScroll();

  // Ambil data session
  const formPemesanan = JSON.parse(sessionStorage.getItem('formPemesanan'));
  const reservasi = JSON.parse(sessionStorage.getItem('reservasi'));

  // Prioritas nama dari reservasi
  const namaPelanggan = reservasi?.nama_pelanggan || formPemesanan?.nama_pelanggan || 'Pelanggan';

  const konteksPemesanan = JSON.parse(sessionStorage.getItem('konteksPemesanan'));
  const tujuanKeranjang = konteksPemesanan?.tipe === 'reservasi' ? '/keranjang-reservasi' : '/keranjang';

  const [menu, setMenu] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState({}); // {idMenu: qty}
  const [isCartLoaded, setIsCartLoaded] = useState(false); // ✅ flag load cart

  useEffect(() => {
    if (reservasi) {
      sessionStorage.setItem(
        'konteksPemesanan',
        JSON.stringify({
          tipe: 'reservasi',
        })
      );
    } else if (formPemesanan) {
      sessionStorage.setItem(
        'konteksPemesanan',
        JSON.stringify({
          tipe: 'langsung',
        })
      );
    }
  }, [reservasi, formPemesanan]);

  // ======================
  // Load cart dari sessionStorage ketika halaman dibuka
  // ======================
  useEffect(() => {
    const savedCart = JSON.parse(sessionStorage.getItem('cartPemesanan')) || {};
    setCart(savedCart);
    setIsCartLoaded(true); // sudah selesai load
  }, []);

  // ======================
  // Simpan cart setiap berubah, tapi tunggu sampai load cart selesai
  // ======================
  useEffect(() => {
    if (isCartLoaded) {
      sessionStorage.setItem('cartPemesanan', JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

  // ======================
  // Ambil menu dari backend
  // ======================
  useEffect(() => {
    axios
      .get('https://backend-production-8cf7.up.railway.app/api/menu/menu')
      .then((res) => setMenu(res.data))
      .catch((err) => console.error('Gagal ambil menu:', err));
  }, []);

  const addToCart = (id) => setCart((prev) => ({ ...prev, [id]: 1 }));

  const updateQty = (id, newQty) => {
    if (newQty <= 0) {
      setCart((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } else {
      setCart((prev) => ({ ...prev, [id]: newQty }));
    }
  };

  const filteredMenu = menu.filter((item) => {
    const cocokKategori = filter === '' || item.nama_kategori?.toLowerCase() === filter.toLowerCase();
    const cocokSearch = search === '' || item.nama_menu?.toLowerCase().includes(search.toLowerCase()) || item.deskripsi?.toLowerCase().includes(search.toLowerCase());

    return cocokKategori && cocokSearch;
  });

  const kategoriList = Array.from(new Set(menu.map((item) => item.nama_kategori).filter(Boolean)));

  kategoriList.sort((a, b) => {
    if (a.toLowerCase() === 'food') return -1;
    if (b.toLowerCase() === 'food') return 1;
    return a.localeCompare(b);
  });

  const totalItem = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalHarga = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menu.find((m) => m.id_menu === Number(id));
    return sum + (item?.harga || 0) * qty;
  }, 0);

  useEffect(() => {
    const formPemesanan = sessionStorage.getItem('formPemesanan');
    const reservasi = sessionStorage.getItem('reservasi');

    // ❌ Jika tidak lewat form dan tidak lewat reservasi
    if (!formPemesanan && !reservasi) {
      navigate('/scanner', { replace: true });
    }
  }, [navigate]);

  return (
    <div className={styles.wrapper}>
      <HeaderPagePelanggan title={`Halo kak ${namaPelanggan}`} subtitle="Mau pesan apa hari ini? 😊" bg_video="/background_video/navVideo.mp4" />

      <main className={styles.container}>
        <div className={styles.menuHeader}>
          <select className={styles.menuFilter} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Semua Kategori</option>
            {kategoriList.map((kat) => (
              <option key={kat} value={kat.toLowerCase()}>
                {kat}
              </option>
            ))}
          </select>

          <div className={styles.searchContainer}>
            <input type="text" placeholder="Cari menu..." className={styles.searchInput} onChange={(e) => setSearch(e.target.value)} />
            <button className={styles.searchBtn}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        <MenuList filteredMenu={filteredMenu} cart={cart} addToCart={addToCart} updateQty={updateQty} />
      </main>

      {totalItem > 0 && (
        <Link to={tujuanKeranjang} className={styles.floatingCart}>
          <div className={styles.totalItems}>{totalItem}</div>
          <span>Rp {totalHarga.toLocaleString()}</span>
        </Link>
      )}

      <FooterPage />
    </div>
  );
}

export default PemesananPelanggan;
