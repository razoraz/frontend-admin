// Component Category Menu
// Import Component
import MenuCard from './MenuCard';

// Import Style
import styles from '../../styles/menu.module.css';

// Main Function MenuCategory
function MenuCategory({ title, icon, items, onDelete, getImageUrl }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.menuCategory}>
      <h2 className={styles.menuSectionTitle}>
        {icon} {title}
      </h2>
      <div className={styles.decorativeLine2}></div>
      <div className={styles.menuCardContainer}>
        {items.map((item, i) => (
          <MenuCard
            key={i}
            id={item.id_menu}
            name={item.nama_menu}
            desc={item.deskripsi}
            price={`Rp ${parseInt(item.harga).toLocaleString('id-ID')}`}
            image={getImageUrl(item.gambar_menu)}
            status={item.status_tersedia}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default MenuCategory;
