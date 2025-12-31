// Import Library
import { useEffect, useState } from 'react';

// Import Hooks
import useBlockBack from '../hooks/BlockBack';
import useFadeOnScroll from '../hooks/FadeOnScrool';

// Import Component
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPage from '../components/component-html/FooterPage';

// Import CSS Module
import styles from '../styles/feedback_pelanggan.module.css';

function FeedbackPage() {
  useBlockBack();
  useFadeOnScroll();

  // 🔸 State
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 🔸 Ambil data dari backend
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch('https://backend-production-8cf7.up.railway.app/api/feedback');
        const json = await res.json();
        setFeedbacks(json.data);
      } catch (error) {
        console.error('Gagal mengambil data feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  // 🔸 Filter rating
  const filteredFeedbacks = (() => {
    switch (filterRating) {
      case 'low': // ≤ 3
        return feedbacks.filter(f => f.rating <= 3);
      case 'mid': // 4–5
        return feedbacks.filter(f => f.rating >= 4);
      case 'five': // hanya 5
        return feedbacks.filter(f => f.rating === 5);
      default:
        return feedbacks;
    }
  })();

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  // Reset halaman saat filter berubah
  useEffect(() => setCurrentPage(1), [filterRating]);

  // Format tanggal
  const formatTanggalIndoLengkap = tanggal => {
    const date = new Date(tanggal);
    const hari = date.toLocaleDateString('id-ID', { weekday: 'long' });
    const tanggalIndo = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    return `${hari}, ${tanggalIndo}`;
  };

  // Pagination Component
  const Pagination = () => (
    <div className={styles.pagination}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
        >
          {page}
        </button>
      ))}
    </div>
  );

  // Feedback Card Component
  const FeedbackCard = ({ email, feedback, rating, tanggal_feedback, gambar_feedback }) => {
    const stars = Array.from({ length: 5 }, (_, i) => i < rating);
    const displayEmail = email || 'Anonim';

    return (
      <div className={styles.feedbackCard}>
        <div className={styles.feedbackInfo} style={{ textAlign: 'center' }}>
          <h4>{displayEmail}</h4>
          <div className={styles.stars}>
            {stars.map((filled, i) => (
              <span key={i} className={filled ? styles.starFilled : styles.star}>
                ★
              </span>
            ))}
          </div>
        </div>

        <div className={styles.feedbackImageWrapper}>
          {gambar_feedback ? (
            <img
              src={gambar_feedback.startsWith('http') ? gambar_feedback : `https://backend-production-8cf7.up.railway.app/uploads/feedback/${gambar_feedback}`}
              alt="Feedback Gambar"
              className={styles.feedbackImage}
            />
          ) : (
            <div className={styles.noImage}>Tidak ada gambar</div>
          )}
        </div>

        <p className={styles.feedbackComment}>"{feedback}"</p>
        <small className={styles.feedbackDate}>
          {tanggal_feedback ? formatTanggalIndoLengkap(tanggal_feedback) : '—'}
        </small>
      </div>
    );
  };

  return (
    <div>
      {/* Navbar */}
      <HeaderPagePelanggan
        title="Nikmati Harimu dengan Secangkir Kebahagiaan"
        subtitle="Rasakan cita rasa kopi yang menemani langkahmu"
        bg_video="../../public/background_video/navVideo.mp4"
      />

      {/* Konten Feedback */}
      <section className={styles.feedbackContainer}>
        <h2 className={styles.feedbackTitle}>Feedback Pelanggan</h2>

        {/* Dropdown Filter */}
        <div className={styles.filterRating}>
          <label>Filter Rating:</label>
          <select
            value={filterRating}
            onChange={e => setFilterRating(e.target.value)}
            className={styles.dropdownRating}
          >
            <option value="all">Semua Rating</option>
            <option value="low">Rating ≤ 3</option>
            <option value="mid">Rating 4–5</option>
            <option value="five">Rating 5 </option>
          </select>
        </div>

        {loading ? (
          <p className="loading-text">Memuat feedback...</p>
        ) : (
          <div className={styles.feedbackList}>
            {currentFeedbacks.length > 0
              ? currentFeedbacks.map((fb, i) => <FeedbackCard key={i} {...fb} />)
              : <p className="no-feedback">Tidak ada feedback.</p>}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && <Pagination />}
      </section>

      <FooterPage />
    </div>
  );
}

export default FeedbackPage;
