import MenuCategory from './MenuCategory';
import styles from '../../styles/menu.module.css';

function MenuList({ filteredMenu, onDelete, getImageUrl }) {
  // Mengelompokkan menu berdasarkan kategori
  const menusByCategory = filteredMenu.reduce((acc, item) => {
    const cat = item.nama_kategori || 'Lainnya';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.keys(menusByCategory);
  const noData = filteredMenu.length === 0;

  // Opsional: mapping kategori ke icon
  const kategoriIcons = {
    Makanan: '🥗',
    Minuman: '🥤',
    Snack: '🍩',
    Dessert: '🍰',
    Promo: '🔥',
  };

  return (
    <div>
      {categories.map((cat) =>
        menusByCategory[cat].length > 0 && (
          <MenuCategory
            key={cat}
            title={cat}
            icon={kategoriIcons[cat] || '🍽️'}
            items={menusByCategory[cat]}
            onDelete={onDelete}
            getImageUrl={getImageUrl}
          />
        )
      )}

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
