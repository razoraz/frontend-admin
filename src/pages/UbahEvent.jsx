import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import styles from '../styles/tambah_event.module.css';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

function UbahEvent() {
  const navigate = useNavigate();
  const { id_event } = useParams();

  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState(null);
  const [gambarLama, setGambarLama] = useState('');
  const [loading, setLoading] = useState(true);

  // state modal
  const [modalQuestionOpen, setModalQuestionOpen] = useState(false);
  const [modalSuccessOpen, setModalSuccessOpen] = useState(false);

  // AMBIL DATA EVENT
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`https://backend-production-8cf7.up.railway.app/api/event/${id_event}`);
        const data = res.data;

        setJudul(data.judul);
        setDeskripsi(data.deskripsi);
        setGambarLama(data.gambar_event);
      } catch (err) {
        console.error(err);
        navigate('/kelola-event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id_event, navigate]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('judul', judul);
      formData.append('deskripsi', deskripsi);

      if (gambar) {
        formData.append('gambar_event', gambar);
      } else {
        formData.append('gambar_lama', gambarLama);
      }

      await axios.put(`https://backend-production-8cf7.up.railway.app/api/event/${id_event}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setModalQuestionOpen(false); // tutup modal question
      setModalSuccessOpen(true); // buka modal success
    } catch (err) {
      console.error(err);
      alert('Gagal update event');
      setModalQuestionOpen(false);
    }
  };

  if (loading) return null;

  return (
    <div className={styles.container}>
      <HeaderPage title="UBAH EVENT" />

      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Ubah Event</h2>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            setModalQuestionOpen(true); // buka modal konfirmasi
          }}
        >
          <label>Judul Event</label>
          <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Masukkan judul event" required />

          <label>Gambar Event</label>
          <input type="file" accept="image/*" placeholder="Masukkan gambar event dengan format jpg, png, atau jpeg" onChange={(e) => setGambar(e.target.files[0])} />

          {gambarLama && (
            <div className={styles.currentImage}>
              Gambar saat ini: <span className={styles.filename}>{gambarLama}</span>
            </div>
          )}

          <label>Deskripsi</label>
          <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Masukkan deskripsi event" />

          <button type="submit" className={styles.saveBtn}>
            Simpan
          </button>
        </form>
      </div>

      {/* Modal Konfirmasi Sebelum Update */}
      <Modal
        isOpen={modalQuestionOpen}
        onClose={() => setModalQuestionOpen(false)}
        onConfirm={handleSubmit}
        title="Update Event"
        message="Apakah kamu yakin ingin menyimpan perubahan event ini?"
        type="question"
        confirmLabel="Ya, Simpan"
        cancelLabel="Batal"
      />

      {/* Modal Success Setelah Update */}
      <Modal
        isOpen={modalSuccessOpen}
        onClose={() => {
          setModalSuccessOpen(false);
          navigate('/kelola-event'); // arahkan ke kelola event
        }}
        title="Sukses"
        message="Event berhasil diperbarui!"
        type="success"
      />

      <FooterPage />
    </div>
  );
}

export default UbahEvent;
