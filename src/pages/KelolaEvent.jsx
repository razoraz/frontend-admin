import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import styles from '../styles/event.module.css';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

function KelolaEvent() {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // state modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuccessOpen, setModalSuccessOpen] = useState(false); // modal success

  const fetchEvent = async () => {
    try {
      const res = await axios.get('https://backend-production-8cf7.up.railway.app/api/event');
      setEvent(res.data.length > 0 ? res.data[0] : null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    document.title = 'Kelola Event - Basecamp Kopi';
  }, []);

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleDelete = async () => {
    if (!event) return;

    try {
      await axios.delete(`https://backend-production-8cf7.up.railway.app/api/event/${event.id_event}`);
      setEvent(null);
      setModalOpen(false); // tutup modal question
      setModalSuccessOpen(true); // buka modal success
    } catch (err) {
      alert('Gagal hapus event');
      console.error(err);
      setModalOpen(false);
    }
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '';
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isVideo = (file) => file?.endsWith('.mp4') || file?.endsWith('.webm');

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div>
      <HeaderPage title="KELOLA EVENT" />
      <div className={styles.container}>
        {!event && (
          <div className={styles.emptyState}>
            <h2>Belum Ada Event</h2>
            <p>Silakan tambahkan event untuk ditampilkan di website.</p>
            <button onClick={() => navigate('/tambah-event')}>Tambah Event</button>
          </div>
        )}

        {event && (
          <section className={styles.eventSection}>
            <div className={styles.eventPromo}>
              <h3 className={styles.eventTitle}>{event.judul}</h3>
              <p className={styles.eventDate}>{formatTanggal(event.tanggal)}</p>

              <div className={styles.eventMedia}>{isVideo(event.gambar_event) ? <video src={event.gambar_event} controls /> : <img src={event.gambar_event} alt={event.judul} />}</div>

              <p className={styles.eventDesc}>{event.deskripsi}</p>

              <div className={styles.action}>
                <button onClick={() => navigate(`/ubah-event/${event.id_event}`)}>Ubah</button>
                <button className={styles.delete} onClick={() => setModalOpen(true)}>
                  Hapus
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={handleDelete} title="Hapus Event" message="Apakah anda yakin ingin menghapus data event ini?" type="question" confirmLabel="Hapus" cancelLabel="Batal" />

      {/* Modal Success */}
      <Modal isOpen={modalSuccessOpen} onClose={() => setModalSuccessOpen(false)} title="Berhasil Dihapus" message="Data event berhasil dihapus." type="success" />

      <FooterPage />
    </div>
  );
}

export default KelolaEvent;
