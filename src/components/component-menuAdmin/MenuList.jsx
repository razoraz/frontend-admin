// Component List Menu
// Import Component
import MenuCategory from './MenuCategory';

// Import Style
import styles from '../../styles/menu.module.css';

// Main Function MenuList
function MenuList({ kategori, makanan, minuman, snack, filteredMenu, onDelete, getImageUrl }) {
  const noData = filteredMenu.length === 0;

  return (
    <div>
      {(kategori === '' || kategori === 'makanan') && makanan.length > 0 && (
        <MenuCategory title="Makanan" icon="🥗" items={makanan} onDelete={onDelete} getImageUrl={getImageUrl} />
      )}

      {(kategori === '' || kategori === 'minuman') && minuman.length > 0 && (
        <MenuCategory title="Minuman" icon="🥤" items={minuman} onDelete={onDelete} getImageUrl={getImageUrl} />
      )}

      {(kategori === '' || kategori === 'snack') && snack.length > 0 && (
        <MenuCategory title="Snack" icon="🍩" items={snack} onDelete={onDelete} getImageUrl={getImageUrl} />
      )}

      {/* Tampilan jika tidak ada menu */}
      {noData && (
        <div className={styles.emptyContainer}>
          <img
            src="/photo/empty-foto.png"
            alt="Gambar Tidak Ada Menu"
            className={styles.emptyImage}
          />
          <p className={styles.noMenuText}>Tidak ada menu ditemukan.</p>
        </div>
      )}
    </div>
  );
}

export default MenuList;
