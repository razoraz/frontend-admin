// Import Library
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import Style
import styles from '../styles/beranda.module.css';

// Import Component
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import useBlockBack from '../hooks/BlockBack';
import useFadeOnScroll from '../hooks/FadeOnScrool';

function Beranda() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Title
  useEffect(() => {
    document.title = 'Beranda Admin - Basecamp Kopi';
  }, []);

  useBlockBack();
  useFadeOnScroll();

  // Auth
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) navigate('/login', { replace: true });
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [summaryRes, notifRes] = await Promise.all([axios.get('https://backend-production-8cf7.up.railway.app/api/beranda/summary'), axios.get('https://backend-production-8cf7.up.railway.app/api/beranda/notifications')]);

      setSummary(summaryRes.data);
      setNotifications(notifRes.data);
    } catch (error) {
      console.error('Error fetch beranda:', error);
    }
  };

  useEffect(() => {
    fetchData(); // load awal

    const interval = setInterval(() => {
      fetchData();
    }, 60000); // 1 menit

    return () => clearInterval(interval);
  }, []);

  if (!summary) return <div style={{ color: '#fff615', padding: 40 }}>Loading beranda...</div>;

  return (
    <div>
      <HeaderPage title="BERANDA" />

      <main className={styles.container}>
        {/* 🔔 NOTIFIKASI */}
        <div className={styles.notificationBox}>
          <div className={styles.notificationHeader}>
            🔔 Notifikasi Penting
            <span className={styles.badge}>{notifications.length}</span>
          </div>

          {notifications.length === 0 ? (
            <p style={{ color: '#ccc' }}>Tidak ada notifikasi</p>
          ) : (
            <ul className={styles.notificationItems}>
              {notifications.map((notif, i) => (
                <li key={i} className={notif.tipe === 'menu' ? styles.warning : notif.tipe === 'reservasi' ? styles.info : notif.tipe === 'feedback' ? styles.feedback : styles.danger}>
                  {notif.pesan}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 📊 AKTIVITAS */}
        <section className={styles.activitySection}>
          <div className={styles.activityHeader}>
            <h2 className={styles.sectionTitle}>📊 Aktivitas Kafe Hari Ini</h2>
            <span className={styles.activityDate}>Hari ini</span>
          </div>
          <div className={styles.decorativeLine2}></div>

          <div className={styles.cardContainer}>
            <div className={styles.card}>
              <h3>🛍️ Pemesanan</h3>
              <p className={styles.value}>{summary.pemesanan.hari_ini}</p>
              <span className={styles.cardSub}>
                {summary.pemesanan.selisih >= 0 ? '+' : ''}
                {summary.pemesanan.selisih} dari kemarin
              </span>
            </div>

            <div className={styles.card}>
              <h3>📅 Reservasi</h3>
              <p className={styles.value}>{summary.reservasi.hari_ini}</p>
              <span className={styles.cardSub}>
                {summary.reservasi.selisih >= 0 ? '+' : ''}
                {summary.reservasi.selisih} dari kemarin
              </span>
            </div>

            <div className={styles.card}>
              <h3>💵 Pendapatan</h3>
              <p className={styles.value}>Rp {summary.pendapatan.hari_ini.toLocaleString('id-ID')}</p>
              <span className={styles.cardSub}>
                {summary.pendapatan.selisih >= 0 ? '+' : ''}
                Rp {summary.pendapatan.selisih.toLocaleString('id-ID')}
              </span>
            </div>

            <div className={styles.card}>
              <h3>🍽️ Menu Terlaris</h3>
              <ul className={styles.menuList}>
                {summary.menuTerlaris.map((menu, i) => (
                  <li key={i}>
                    {menu.nama_menu} ({menu.total}x)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ⚡ AKSI CEPAT */}
        <section className={styles.quickActionSection}>
          <h2 className={styles.sectionTitle}>⚡ Aksi Cepat Admin</h2>
          <div className={styles.decorativeLine2}></div>

          <div className={styles.quickActionGrid}>
            <button className={styles.quickActionCard} onClick={() => navigate('/pemesanan')}>
              🧾<span>Kelola Pemesanan</span>
            </button>
            <button className={styles.quickActionCard} onClick={() => navigate('/reservasi')}>
              📅<span>Kelola Reservasi</span>
            </button>
            <button className={styles.quickActionCard} onClick={() => navigate('/menu')}>
              🍽️<span>Kelola Menu</span>
            </button>
            <button className={styles.quickActionCard} onClick={() => navigate('/feedback')}>
              📝<span>Kelola Feedback</span>
            </button>
          </div>
        </section>

        {/* 📌 STATUS */}
        <section className={styles.statusSection}>
          <h2 className={styles.sectionTitle}>📌 Status Operasional</h2>
          <div className={styles.decorativeLine2}></div>

          <div className={styles.statusList}>
            <div className={styles.statusItem}>🪑 Meja tersedia: {summary.mejaTersedia}</div>
            <div className={styles.statusItem}>⚠️ Menu habis: {summary.menuHabis}</div>
            <div className={styles.statusItem}>⏳ Menunggu pembayaran: {summary.menungguPembayaran}</div>
          </div>
        </section>
      </main>

      <FooterPage />
    </div>
  );
}

export default Beranda;
