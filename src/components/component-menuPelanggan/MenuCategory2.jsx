// Component Category Menu
// Import Component
import MenuCard from './MenuCard2';

// Import Style
import styles from '../../styles/menu_pelanggan.module.css';

// Main Function MenuCategory
function MenuCategory({ title, icon, items}) {
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
            image={item.gambar_menu}
            status={item.status_tersedia}
          />
        ))}
      </div>
    </div>
  );
}

export default MenuCategory;
