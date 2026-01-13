import styles from '../../styles/menu_pelanggan.module.css';

function MenuFilterBar({ menu, kategori, setKategori, search, setSearch}) {
  // Ambil semua kategori dari data menu
  let kategoriList = Array.from(new Set(menu.map((m) => m.nama_kategori))).filter(Boolean);

  // Pastikan "Food" selalu di atas
  kategoriList.sort((a, b) => {
    if (a.toLowerCase() === 'food') return -1;
    if (b.toLowerCase() === 'food') return 1;
    return a.localeCompare(b); // sisanya urut abjad
  });

  return (
    <div className={styles.menuHeader}>
      <select className={styles.menuFilter} value={kategori} onChange={(e) => setKategori(e.target.value)}>
        <option value="">Semua Kategori</option>
        {kategoriList.map((cat) => (
          <option key={cat} value={cat.toLowerCase()}>{cat}</option>
        ))}
      </select>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Cari menu..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className={styles.searchBtn}>
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
  );
}

export default MenuFilterBar;
