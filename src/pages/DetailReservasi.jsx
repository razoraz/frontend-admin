import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/detail_pemesanan.module.css';
import useBlockBack from '../hooks/BlockBack';
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

function DetailReservasi() {
  useBlockBack();
  const { id_reservasi } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);

  // 🔥 STATE MODAL
  const [modal, setModal] = useState({
    open: false,
    type: '',
    title: '',
    message: '',
    onConfirm: null,
  });

  // Set page title
  useEffect(() => {
    document.title = 'Detail Reservasi - Basecamp Kopi';
  }, []);

  useEffect(() => {
    axios
      .get(`https://backend-production-8cf7.up.railway.app/api/reservasi/detail-reservasi/${id_reservasi}`)
      .then((res) => {
        setData(res.data.reservasi);
        setItems(res.data.items);
      })
      .catch((err) => console.log(err));
  }, [id_reservasi]);

  if (!data) return <p className={styles.loading}>Memuat...</p>;
  const formatTanggalIndoLengkap = (tanggal, jam) => {
    if (!tanggal) return '—';

    const date = new Date(tanggal);

    // Validasi Date
    if (isNaN(date.getTime())) return '—';

    const hari = date.toLocaleDateString('id-ID', { weekday: 'long' });
    const tanggalIndo = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    let jamIndo = '';
    if (jam) {
      // ambil HH:mm dari HH:mm:ss
      jamIndo = jam.substring(0, 5);
    }

    return jamIndo ? `${hari}, ${tanggalIndo} • ${jamIndo} WIB` : `${hari}, ${tanggalIndo}`;
  };

  // 🧨 BUKA MODAL KONFIRMASI
  const openDeleteModal = () => {
    setModal({
      open: true,
      type: 'question',
      title: 'Hapus Reservasi',
      message: 'Apakah Anda yakin ingin menghapus reservasi ini?',
      onConfirm: handleDelete,
    });
  };

  // 🚮 FUNGSI PROSES DELETE
  const handleDelete = async () => {
    try {
      await axios.delete(`https://backend-production-8cf7.up.railway.app/api/reservasi/delete-reservasi/${id_reservasi}`);

      // Tutup modal pertanyaan
      setModal({ open: false });

      // 🔥 Tampilkan modal sukses
      setTimeout(() => {
        setModal({
          open: true,
          type: 'success',
          title: 'Berhasil!',
          message: 'Reservasi berhasil dihapus.',
          onConfirm: () => {
            setModal({ open: false });
            navigate('/reservasi');
          },
        });
      }, 200);
    } catch (err) {
      setModal({
        open: true,
        type: 'error',
        title: 'Gagal',
        message: 'Gagal menghapus reservasi.',
      });
      console.error(err);
    }
  };

   const getStatusReservasiText = (status) => {
    switch (status) {
      case 'menunggu_pembayaran':
        return 'Menunggu Pembayaran';
      case 'menunggu_konfirmasi':
        return 'Menunggu Konfirmasi';
      case 'dikonfirmasi':
        return 'Dikonfirmasi';
      case 'selesai':
        return 'Selesai';
      case 'dibatalkan':
        return 'Dibatalkan';
      default:
        return '-';
    }
  };

  const getStatusPembayaranText = (status) => {
    switch (status) {
      case 'belum_bayar':
        return 'Belum Bayar';
      case 'sudah_bayar':
        return 'Sudah Bayar';
      case 'dibatalkan':
        return 'Dibatalkan';
      default:
        return '-';
    }
  };

  return (
    <div>
      <HeaderPage title="DETAIL RESERVASI" />

      <main className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate('/reservasi')}>
          <i className="fas fa-arrow-left"></i> Kembali
        </button>

        <div className={styles.infoBox}>
          <div className={styles.infoRow}>
            <span className={styles.label}>ID Reservasi</span>
            <span className={styles.value}>{data.id_reservasi}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Order ID</span>
            <span className={styles.value}>{data.nama_metode !== 'Tunai di Kasir' ? data.order_id : '-'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Nama Pelanggan</span>
            <span className={styles.value}>{data.nama_pelanggan}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Waktu Reservasi</span>
            <span className={styles.value}>{formatTanggalIndoLengkap(data.tanggal_reservasi, data.jam_reservasi)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Meja</span>
            <span className={styles.value}>{data.no_meja}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Metode Pembayaran</span>
            <span className={styles.value}>{data.nama_metode || '-'}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Status Pembayaran</span>
            <span className={styles.value}>{getStatusPembayaranText(data.status_pembayaran)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Status Reservasi</span>
            <span className={styles.value}>{getStatusReservasiText(data.status_reservasi)}</span>
          </div>
        </div>

        <h2 className={styles.subtitle}>Item Pesanan</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Jumlah</th>
              <th>Harga</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>{it.nama_menu}</td>
                <td>{it.jumlah}</td>
                <td>Rp {it.harga}</td>
                <td>Rp {it.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.actionRow}>
          <button className={styles.deleteBtn} onClick={openDeleteModal}>
            <i className="fas fa-trash"></i> Hapus
          </button>

          <button className={styles.editBtn} onClick={() => navigate(`/ubah-reservasi/${data.id_reservasi}`)}>
            <i className="fas fa-edit"></i> Ubah
          </button>
        </div>
      </main>

      <FooterPage />

      {/* 🔥 MODAL NOTIFIKASI */}
      <Modal
        isOpen={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => {
          if (modal.onConfirm) modal.onConfirm(); // 🔥 jalankan navigasi di modal success
          setModal({ open: false });
        }}
        onConfirm={modal.onConfirm}
        confirmLabel="Ya"
        cancelLabel="Tidak"
      />
    </div>
  );
}

export default DetailReservasi;
