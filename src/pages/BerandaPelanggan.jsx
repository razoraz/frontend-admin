// Import Library
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import Hooks
import useBlockBack from '../hooks/BlockBack';
import useFadeOnScroll from '../hooks/FadeOnScrool';

// Import Component
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPage from '../components/component-html/FooterPage';

// Import Style
import styles from '../styles/beranda_pelanggan.module.css';

function BerandaPage() {
  /* ======================
     STATE
  ====================== */
  const [menuTerlaris, setMenuTerlaris] = useState([]);
  const [event, setEvent] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const navigate = useNavigate();

  /* ======================
     EFFECT
  ====================== */
  useEffect(() => {
    document.title = 'Beranda Pelanggan - Basecamp Kopi';

    // Menu Terlaris
    axios
      .get('http://localhost:5000/api/beranda-pelanggan/menu-terlaris')
      .then((res) => setMenuTerlaris(res.data))
      .catch((err) => console.error('Menu terlaris error:', err));

    // Event / Promo
    axios
      .get('http://localhost:5000/api/beranda-pelanggan/event')
      .then((res) => setEvent(res.data))
      .catch((err) => console.error('Event error:', err));

    // Feedback
    axios
      .get('http://localhost:5000/api/beranda-pelanggan/feedback')
      .then((res) => setFeedback(res.data))
      .catch((err) => console.error('Feedback error:', err));
  }, []);

  useBlockBack();
  useFadeOnScroll();

  /* ======================
     RENDER
  ====================== */
  return (
    <div>
      {/* Navbar */}
      <HeaderPagePelanggan title="Nikmati Harimu dengan Secangkir Kebahagiaan" subtitle="Rasakan cita rasa kopi yang menemani langkahmu" bg_video="/background_video/navVideo.mp4" />

      {/* Content */}
      <main className={styles.homeContainer}>
        {/* Aksi Utama */}
        <section className={styles.actionSection}>
          <h2>☕ Mau Ngopi Apa Hari Ini?</h2>
          <p>Pilih menu favoritmu dan nikmati suasana Basecamp Kopi</p>

          <div className={styles.actionButtons}>
            <button className={styles.primaryBtn} onClick={() => navigate('/scanner')}>Pesan Sekarang</button>
            <button className={styles.secondaryBtn} onClick={() => navigate('/form-reservasi')}>Reservasi Sekarang</button>
          </div>
        </section>

        {/* Menu Terlaris */}
        <section className={styles.favoriteSection}>
          <h3 className={styles.sectionTitle}>🔥 Menu Favorit Pelanggan</h3>

          <div className={styles.menuGrid}>
            {menuTerlaris.length > 0 ? (
              menuTerlaris.map((menu) => (
                <div key={menu.id_menu} className={styles.menuCard}>
                  <img src={`http://localhost:5000/uploads/${menu.gambar_menu}`} alt={menu.nama_menu} />
                  <h4>{menu.nama_menu}</h4>
                  <span>⭐ Terlaris</span>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', opacity: 0.7 }}>Menu favorit belum tersedia</p>
            )}
          </div>
        </section>
        {/* Feedback */}
        <section className={styles.feedbackSection}>
          <h3>💬 Apa Kata Pelanggan</h3>

          <div className={styles.feedbackGrid}>
            {feedback.length > 0 ? (
              feedback.map((fb, index) => (
                <div key={index} className={styles.feedbackCard}>
                  <p>"{fb.feedback}"</p>
                  <img src={`http://localhost:5000/uploads/feedback/${fb.gambar_feedback}`} alt={fb.nama_pelanggan} />
                  <strong>{fb.nama_pelanggan}</strong>
                  <span>⭐ {fb.rating}/5</span>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', opacity: 0.7 }}>Belum ada feedback pelanggan</p>
            )}
          </div>
        </section>

        {/* Promo / Event */}
        {event && (
          <section className={styles.promoSection}>
            <h3>🎁 {event.judul}</h3>
            <p>{event.deskripsi}</p>

            <img
              src={`http://localhost:5000/uploads/event/${event.gambar_event}`}
              alt={event.judul}
              style={{
                marginTop: '20px',
                maxWidth: '100%',
                borderRadius: '14px',
              }}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <FooterPage />
    </div>
  );
}

export default BerandaPage;
