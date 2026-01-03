import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/tambah_feedback.module.css';

import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPagePelanggan from '../components/component-html/FooterPagePelanggan';
import useBlockBack from '../hooks/BlockBack';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

const TambahFeedback = ({ idPemesanan: propId }) => {
  useBlockBack();
  const { id_pemesanan } = useParams();
  const idPemesanan = propId || id_pemesanan;

  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [pesan, setPesan] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // === Modal States ===
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Tambah Feedback - Basecamp Kopi';
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 3MB!');
      return;
    }

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // === SUBMIT FEEDBACK ===
  const submitFeedback = async () => {
    if (!idPemesanan) {
      alert('ID pemesanan tidak ditemukan!');
      return;
    }

    setLoading(true);
    setModalOpen(false); // tutup modal question

    try {
      const formData = new FormData();
      formData.append('id_pemesanan', idPemesanan);
      formData.append('rating', rating);
      formData.append('email', email);
      formData.append('pesan', pesan);
      if (image) formData.append('image', image);

      await axios.post('https://backend-production-8cf7.up.railway.app/api/feedback/tambah-feedback', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      // Reset form
      setRating(0);
      setEmail('');
      setPesan('');
      setImage(null);
      setPreview(null);

      // Tampilkan modal success
      setModalSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim feedback!');
    }

    setLoading(false);
  };

  // === KETIKA TOMBOL KIRIM DIKLIK ===
  const handleSubmitClick = (e) => {
    e.preventDefault();
    setModalOpen(true); // buka modal konfirmasi
  };

  return (
    <div>
      <HeaderPagePelanggan bg_video="/video/feedback.mp4" title="Feedback" subtitle="Beri penilaian dan komentar untuk meningkatkan kualitas pelayanan kami." />

      <div className={styles.page}>
        <div className={styles.card}>
          <h2 className={styles.title}>Tambah Feedback</h2>

          <form onSubmit={handleSubmitClick} className={styles.form}>
            {/* Rating */}
            <div className={styles.rating}>
              {[1, 2, 3, 4, 5].map((value) => (
                <span key={value} className={`${styles.star} ${rating >= value ? styles.active : ''}`} onClick={() => setRating(value)}>
                  ★
                </span>
              ))}
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input type="email" className={styles.input} placeholder="contoh@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            {/* Upload */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Upload Gambar</label>
              <input type="file" accept="image/*" className={styles.fileInput} placeholder="Upload gambar feedback dengan format .jpg, .jpeg, .png" onChange={handleImageUpload} />
              {preview && (
                <div className={styles.previewBox}>
                  <img src={preview} className={styles.previewImage} alt="preview" />
                </div>
              )}
            </div>

            {/* Pesan */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Pesan Feedback</label>
              <textarea className={styles.textarea} placeholder="Tulis feedback Anda..." value={pesan} onChange={(e) => setPesan(e.target.value)} required />
            </div>

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Feedback'}
            </button>
          </form>
        </div>
      </div>

      <FooterPagePelanggan />

      {/* === MODAL QUESTION (KONFIRMASI) === */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={submitFeedback} type="question" title="Kirim Feedback?" message="Apakah Anda yakin ingin mengirimkan feedback ini?" confirmLabel="Kirim" cancelLabel="Batal" />

      {/* === MODAL SUCCESS === */}
      <Modal
        isOpen={modalSuccess}
        onClose={() => {
          setModalSuccess(false);
          navigate('/feedback-pelanggan');
        }}
        type="success"
        title="Berhasil!"
        message="Feedback Anda berhasil dikirim. Terima kasih!"
      />
    </div>
  );
};

export default TambahFeedback;
