// Component Card Menu
// Import Library
import { useNavigate } from 'react-router-dom';

// Import Style
import styles from '../../styles/menu.module.css';

// Main Function MenuCard
function MenuCard({ id, image, name, desc, price, status, onDelete }) {
  const navigate = useNavigate();
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
        <div className={styles.menuActions}>
          <button className={styles.ubahBtn} onClick={() => navigate(`/ubah-menu/${id}`)}>
            <i className="fas fa-pen"></i> Ubah
          </button>
          <button className={styles.deleteBtn} onClick={() => onDelete(id)}>
            <i className="fas fa-trash"></i> Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
