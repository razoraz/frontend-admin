// Component Card Menu
// Import Style
import styles from '../../styles/menu_pelanggan.module.css';

// Main Function MenuCard
function MenuCard({ image, name, desc, price, status}) {
  const cardClass = `${styles.menuCard} ${status?.toLowerCase() === 'habis' ? styles.unavailable : ''}`;

  return (
    <div className={cardClass} data-status={status}>
      <div className={styles.menuImageContainer}>
        <img src={image} alt={name} className={styles.menuImage} />
        <p className={styles.menuPrice}>{price}</p>
        {status?.toLowerCase() === 'habis' && <span className={styles.badgeHabis}>HABIS</span>}
      </div>
      <div className={styles.menuInfo}>
        <h3>{name}</h3>
        <p className={styles.menuDesc}>{desc}</p>
      </div>
    </div>
  );
}

export default MenuCard;
