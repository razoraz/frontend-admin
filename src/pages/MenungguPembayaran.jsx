import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/menunggu_pembayaran.module.css';
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPagePelanggan from '../components/component-html/FooterPagePelanggan';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

const MenungguPembayaranKasir = () => {
  const { id_pemesanan } = useParams();
  const navigate = useNavigate();

  const [pemesanan, setPemesanan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch & polling status pembayaran
  useEffect(() => {
    const fetchPemesanan = async () => {
      try {
        const res = await axios.get(
          `https://backend-production-8cf7.up.railway.app/api/pemesanan/detail/${id_pemesanan}`
        );
        setPemesanan(res.data);

        // ✅ Jika sudah bayar → munculkan modal
        if (res.data.status_pembayaran === 'sudah_bayar') {
          setShowModal(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPemesanan();

    // 🔁 Polling tiap 5 detik
    const interval = setInterval(fetchPemesanan, 5000);

    return () => clearInterval(interval);
  }, [id_pemesanan]);

  const handleModalClose = () => {
    setShowModal(false);
    navigate(`/struk/${id_pemesanan}`);
  };

  if (!pemesanan) {
    return (
      <div className={styles.container}>
        <h2>Memuat informasi pemesanan...</h2>
      </div>
    );
  }

  return (
    <div>
      <HeaderPagePelanggan
        title="Metode Pembayaran"
        subtitle="Silakan lakukan pembayaran langsung di kasir"
        bg_video="/background_video/navVideo.mp4"
      />

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.icon}>💵</div>

          <h1 className={styles.title}>Menunggu Pembayaran</h1>
          <p className={styles.subtitle}>
            Tunjukkan ID pemesanan Anda kepada kasir untuk menyelesaikan pembayaran
          </p>

          <div className={styles.infoBox}>
            <div>
              <span>Nama Pelanggan</span>
              <strong>{pemesanan.nama_pelanggan}</strong>
            </div>
            <div>
              <span>Pemesanan Order</span>
              <strong>#{pemesanan.id_pemesanan}</strong>
            </div>
            <div>
              <span>Total Harga</span>
              <strong>Rp {Number(pemesanan.total_harga).toLocaleString()}</strong>
            </div>
          </div>

          <p className={styles.note}>
            🛎️ Nikmati kopi sambil menunggu kasir memproses pembayaran Anda.
          </p>
        </div>
      </div>

      <FooterPagePelanggan />

      {/* 🔔 MODAL NOTIFIKASI */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title="Pembayaran Berhasil"
        message="Pembayaran Anda telah dikonfirmasi oleh kasir. Struk siap ditampilkan."
        type="success"
      />
    </div>
  );
};

export default MenungguPembayaranKasir;
