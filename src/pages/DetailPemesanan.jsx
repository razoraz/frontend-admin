import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/detail_pemesanan.module.css';
import useBlockBack from '../hooks/BlockBack';
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

function DetailPemesanan() {
  useBlockBack();
  const { id_pemesanan } = useParams();
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
    document.title = 'Detail Pemesanan - Basecamp Kopi';
  }, []);

  useEffect(() => {
    axios
      .get(`https://backend-production-8cf7.up.railway.app/api/pemesanan/detail-pemesanan/${id_pemesanan}`)
      .then((res) => {
        setData(res.data.pemesanan);
        setItems(res.data.items);
      })
      .catch((err) => console.log(err));
  }, [id_pemesanan]);

  if (!data) return <p className={styles.loading}>Memuat...</p>;

  // 🧨 BUKA MODAL KONFIRMASI
  const openDeleteModal = () => {
    setModal({
      open: true,
      type: 'question',
      title: 'Hapus Pemesanan',
      message: 'Apakah Anda yakin ingin menghapus pemesanan ini?',
      onConfirm: handleDelete,
    });
  };

  // 🚮 FUNGSI PROSES DELETE
  const handleDelete = async () => {
    try {
      await axios.delete(`https://backend-production-8cf7.up.railway.app/api/pemesanan/delete-pemesanan/${id_pemesanan}`);

      // Tutup modal pertanyaan
      setModal({ open: false });

      // 🔥 Tampilkan modal sukses
      setTimeout(() => {
        setModal({
          open: true,
          type: 'success',
          title: 'Berhasil!',
          message: 'Pemesanan berhasil dihapus.',
          onConfirm: () => {
            setModal({ open: false });
            navigate('/pemesanan');
          },
        });
      }, 200);
    } catch (err) {
      setModal({
        open: true,
        type: 'error',
        title: 'Gagal',
        message: 'Gagal menghapus pemesanan.',
      });
      console.error(err);
    }
  };

    const getStatusPemesananText = (status) => {
    switch (status) {
      case 'menunggu_pembayaran':
        return 'Menunggu Pembayaran';
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
      <HeaderPage title="DETAIL PEMESANAN" />

      <main className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate('/pemesanan')}>
          <i className="fas fa-arrow-left"></i> Kembali
        </button>

        <div className={styles.infoBox}>
          <div className={styles.infoRow}>
            <span className={styles.label}>ID Pemesanan</span>
            <span className={styles.value}>{data.id_pemesanan}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Order ID</span>
            <span className={styles.value}>{data.nama_metode  !== 'Tunai di Kasir' ? data.order_id : '-'}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Nama Pelanggan</span>
            <span className={styles.value}>{data.nama_pelanggan}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Tanggal</span>
            <span className={styles.value}>{new Date(data.tanggal_pemesanan).toISOString().split('T')[0]}</span>
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
            <span className={styles.label}>Status Pemesanan</span>
            <span className={styles.value}>{getStatusPemesananText(data.status_pemesanan)}</span>
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
              <th>Catatan</th>
            </tr>
          </thead>

          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>{it.nama_menu}</td>
                <td>{it.jumlah}</td>
                <td>Rp {it.harga}</td>
                <td>Rp {it.subtotal}</td>
                <td>{it.catatan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.actionRow}>
          <button className={styles.deleteBtn} onClick={openDeleteModal}>
            <i className="fas fa-trash"></i> Hapus
          </button>

          <button className={styles.editBtn} onClick={() => navigate(`/ubah-pemesanan/${data.id_pemesanan}`)}>
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

export default DetailPemesanan;
