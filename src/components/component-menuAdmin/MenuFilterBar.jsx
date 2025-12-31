// Component Filter Bar Menu
// Import Style
import styles from '../../styles/menu.module.css';

// Main Function MenuFilterBar
function MenuFilterBar({ kategori, setKategori, search, setSearch, onAdd }) {
  return (
    <div className={styles.menuHeader}>
      <select className={styles.menuFilter} value={kategori} onChange={(e) => setKategori(e.target.value)}>
        <option value="">Semua Kategori</option>
        <option value="makanan">Makanan</option>
        <option value="minuman">Minuman</option>
        <option value="snack">Snack</option>
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

      <button className={styles.addMenuBtn} onClick={onAdd}>
        <i className="fas fa-plus"></i> Tambah Menu
      </button>
    </div>
  );
}

export default MenuFilterBar;
