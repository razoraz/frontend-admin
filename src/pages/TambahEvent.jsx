import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import styles from '../styles/tambah_event.module.css';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

function TambahEvent() {
  const navigate = useNavigate();

  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState(null);
  const [eventExist, setEventExist] = useState(false);
  const [loading, setLoading] = useState(true);

  // state modal
  const [modalQuestionOpen, setModalQuestionOpen] = useState(false);
  const [modalSuccessOpen, setModalSuccessOpen] = useState(false);

  useEffect(() => {
    document.title = 'Tambah Event - Basecamp Kopi';
  }, []);

  // CEK APAKAH EVENT SUDAH ADA
  useEffect(() => {
    const cekEvent = async () => {
      try {
        const res = await axios.get('https://backend-production-8cf7.up.railway.app/api/event');

        if (Array.isArray(res.data) && res.data.length > 0) {
          setEventExist(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cekEvent();
  }, []);

  useEffect(() => {
    if (!loading && eventExist) {
      navigate('/kelola-event');
    }
  }, [eventExist, loading, navigate]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('judul', judul);
      formData.append('deskripsi', deskripsi);
      formData.append('gambar_event', gambar);

      await axios.post('https://backend-production-8cf7.up.railway.app/api/event', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setModalQuestionOpen(false); // tutup modal question
      setModalSuccessOpen(true);    // buka modal success
    } catch (err) {
      console.error(err);
      alert('Gagal simpan event');
      setModalQuestionOpen(false);
    }
  };

  if (loading) return null;

  return (
    <div className={styles.container}>
      <HeaderPage title="TAMBAH EVENT" />

      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Tambah Event</h2>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            setModalQuestionOpen(true); // buka modal konfirmasi
          }}
        >
          <label>Judul Event</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Masukkan judul event"
            required
          />

          <label>Gambar Event</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setGambar(e.target.files[0])}
            placeholder="Pilih gambar event format jpg, jpeg, png."
            required
          />

          <label>Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Masukkan deskripsi event"
          />

          <button type="submit" className={styles.saveBtn}>
            Simpan
          </button>
        </form>
      </div>

      {/* Modal Konfirmasi Sebelum Simpan */}
      <Modal
        isOpen={modalQuestionOpen}
        onClose={() => setModalQuestionOpen(false)}
        onConfirm={handleSubmit}
        title="Simpan Event"
        message="Apakah kamu yakin ingin menyimpan event ini?"
        type="question"
        confirmLabel="Ya, Simpan"
        cancelLabel="Batal"
      />

      {/* Modal Success Setelah Simpan */}
      <Modal
        isOpen={modalSuccessOpen}
        onClose={() => {
          setModalSuccessOpen(false);
          navigate('/kelola-event'); // arahkan ke kelola event
        }}
        title="Sukses"
        message="Event berhasil disimpan!"
        type="success"
      />

      <FooterPage />
    </div>
  );
}

export default TambahEvent;
