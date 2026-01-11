import MenuCategory from './MenuCategory';
import styles from '../../styles/menu.module.css';

function MenuList({ filteredMenu, onDelete }) {
  // Mengelompokkan menu berdasarkan kategori
  const menusByCategory = filteredMenu.reduce((acc, item) => {
    const cat = item.nama_kategori || 'Lainnya';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.keys(menusByCategory);
  const noData = filteredMenu.length === 0;

  // Mapping kategori ke icon (sudah dinormalisasi)
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
    if (a.toLowerCase() === 'food') return -1;
    if (b.toLowerCase() === 'food') return 1;
    return 0;
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
              onDelete={onDelete}
            />
          )
        );
      })}

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
