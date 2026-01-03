// Import Library
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Import Component
import useBlockBack from '../hooks/BlockBack';
import useFadeOnScroll from '../hooks/FadeOnScrool';
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPage from '../components/component-html/FooterPage';

// Import Style
import styles from '../styles/pemesanan_menu.module.css';

// ======================
// Component MenuCategory
// ======================
function MenuCategory({ title, icon, items, getImageUrl, cart, addToCart, updateQty }) {
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
                <img src={getImageUrl(item.gambar_menu)} alt={item.nama_menu} className={`${styles.menuImage} ${isHabis ? styles.habisImage : ''}`} />
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
function MenuList({ filter, makanan, minuman, snack, filteredMenu, getImageUrl, cart, addToCart, updateQty }) {
  const noData = filteredMenu.length === 0;

  return (
    <div>
      {(filter === '' || filter === 'makanan') && makanan.length > 0 && <MenuCategory title="Makanan" icon="🥗" items={makanan} getImageUrl={getImageUrl} cart={cart} addToCart={addToCart} updateQty={updateQty} />}

      {(filter === '' || filter === 'minuman') && minuman.length > 0 && <MenuCategory title="Minuman" icon="🥤" items={minuman} getImageUrl={getImageUrl} cart={cart} addToCart={addToCart} updateQty={updateQty} />}

      {(filter === '' || filter === 'snack') && snack.length > 0 && <MenuCategory title="Snack" icon="🍩" items={snack} getImageUrl={getImageUrl} cart={cart} addToCart={addToCart} updateQty={updateQty} />}

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

  const getImageUrl = (filename) => `https://backend-production-8cf7.up.railway.app/uploads/${filename}`;

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

  const makanan = filteredMenu.filter((i) => i.nama_kategori?.toLowerCase() === 'makanan');
  const minuman = filteredMenu.filter((i) => i.nama_kategori?.toLowerCase() === 'minuman');
  const snack = filteredMenu.filter((i) => i.nama_kategori?.toLowerCase() === 'snack');

  const totalItem = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalHarga = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menu.find((m) => m.id_menu === Number(id));
    return sum + (item?.harga || 0) * qty;
  }, 0);

  return (
    <div className={styles.wrapper}>
      <HeaderPagePelanggan title={`Halo kak ${namaPelanggan}`} subtitle="Mau pesan apa hari ini? 😊" bg_video="/background_video/navVideo.mp4" />

      <main className={styles.container}>
        <div className={styles.menuHeader}>
          <select className={styles.menuFilter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Semua Kategori</option>
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
            <option value="snack">Snack</option>
          </select>

          <div className={styles.searchContainer}>
            <input type="text" placeholder="Cari menu..." className={styles.searchInput} onChange={(e) => setSearch(e.target.value)} />
            <button className={styles.searchBtn}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        <MenuList filter={filter} makanan={makanan} minuman={minuman} snack={snack} filteredMenu={filteredMenu} getImageUrl={getImageUrl} cart={cart} addToCart={addToCart} updateQty={updateQty} />
      </main>

      {totalItem > 0 && (
        <Link to={tujuanKeranjang} className={styles.floatingCart}>
          <div className={styles.totalItems}>{totalItem}</div>
          <span>
            {totalItem} Item — Rp {totalHarga.toLocaleString()}
          </span>
        </Link>
      )}

      <FooterPage />
    </div>
  );
}

export default PemesananPelanggan;
