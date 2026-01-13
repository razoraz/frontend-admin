// Component Card Menu
// Import Style
import styles from '../../styles/menu_pelanggan.module.css';

// Main Function MenuCard
function MenuCard({ image, name, desc, price, status }) {
  const cardClass = `${styles.menuCard} ${
    status?.toLowerCase() === 'habis' ? styles.unavailable : ''
  }`;

  return (
    <div className={cardClass} data-status={status}>
      {/* Nama */}
      <h3 className={styles.menuName}>{name}</h3>

      {/* Gambar */}
      <div className={styles.menuImageContainer}>
        <img src={image} alt={name} className={styles.menuImage} />
        {status?.toLowerCase() === 'habis' && (
          <span className={styles.badgeHabis}>HABIS</span>
        )}
      </div>

      {/* Decorative Line */}
      <div className={styles.decorativeLine}></div>

      {/* Deskripsi */}
      <p className={styles.menuDesc}>{desc}</p>

      {/* Harga */}
      <p className={styles.menuPrice}>{price}</p>
    </div>
  );
}


export default MenuCard;
