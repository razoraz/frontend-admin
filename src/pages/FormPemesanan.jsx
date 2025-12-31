// Import Library
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Import Component
import useBlockBack from '../hooks/BlockBack';
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPage from '../components/component-html/FooterPage';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

// Import CSS Module
import styles from '../styles/form_pemesanan.module.css';

// Form Pemesanan
function FormPemesanan() {
  useBlockBack();
  const navigate = useNavigate();

  // Ambil token dari URL
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token') || '';

  // Modal error
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', message: '' });
  const showModal = (type, title, message) => {
    setModal({ isOpen: true, type, title, message });
  };
  const closeModal = () => {
  setModal({ ...modal, isOpen: false });

  // Jika error terkait akses / token
  if (modal.title === 'Akses Ditolak') {
    navigate('/scanner'); // arahkan ke halaman scanner
  }
};

  // State form
  const [formData, setFormData] = useState({
    nama_pelanggan: '',
    tanggal: new Date().toISOString().split('T')[0],
    no_meja: '',
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama_pelanggan, tanggal, no_meja } = formData;
    if (!nama_pelanggan || !tanggal || !no_meja) {
      showModal('error', 'Data Tidak Lengkap', 'Data yang anda isi tidak sesuai. Silahkan periksa kembali.');
      return;
    }
    sessionStorage.setItem('formPemesanan', JSON.stringify(formData));
    navigate('/pemesanan-menu');
  };

  // Verifikasi Token
  useEffect(() => {
    if (!token) {
      showModal('error', 'Akses Ditolak', 'QR Code tidak valid atau token kosong!');
      return;
    }
    fetch(`https://backend-production-8cf7.up.railway.app/api/meja/form-pemesanan?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Token invalid');
        return res.json();
      })
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          no_meja: data.meja,
        }));
      })
      .catch(() => {
        showModal('error', 'Akses Ditolak', 'QR Code tidak valid atau sudah kadaluarsa!');
      });
  }, [token]);
  useEffect(() => {
    document.title = 'Form Pemesanan - Basecamp Kopi';
  }, []);

  return (
    <>
      {/* Header */}
      <HeaderPagePelanggan title="Isi Form Pemesanan" subtitle="Lengkapi data sebelum mulai memesan menu" bg_video="/background_video/navVideo.mp4" />
      {/* Form Pemesanan */}
      <div className={styles.centerWrapper}>
        <div className={styles.pemesananCard}>
          {/* Gambar Samping */}
          <div className={styles.imageSide}>
            <img src="/photo/poster.png" alt="Kopi Basecamp" className={styles.previewImage} />
          </div>
          {/* Form Sisi Kanan */}
          <div className={styles.formSide}>
            <div className={styles.pemesananHeader}>
              <img src="/logo_kafe/Logo.PNG" alt="Basecamp Logo" />
              <h2>Form Pemesanan</h2>
            </div>
            <form id="pemesanan-form" onSubmit={handleSubmit} autoComplete="off">
              <div className={styles.inputGroup}>
                <label htmlFor="nama">Nama</label>
                <input type="text" id="nama" name="nama_pelanggan" placeholder="Masukkan nama Anda" value={formData.nama_pelanggan} onChange={handleChange} />
              </div>
              {/* Nomor Meja Otomatis */}
              <div className={styles.inputGroup}>
                <label htmlFor="no_meja">Nomor Meja</label>
                <input type="text" id="no_meja" name="no_meja" value={formData.no_meja} readOnly className={styles.inputDisabled} />
              </div>
              {/* Tanggal */}
              <div className={styles.inputGroup}>
                <label htmlFor="tanggal">Tanggal</label>
                <input type="date" id="tanggal" name="tanggal" value={formData.tanggal} readOnly className={styles.inputDisabled} />
              </div>
              {/* Buttons */}
              <button type="submit" className={styles.pemesananButton}>
                <i className="ph ph-coffee"></i> Pesan Sekarang
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Footer */}
      <FooterPage />
      {/* Modal hanya error */}
      <Modal isOpen={modal.isOpen} type="error" title={modal.title} message={modal.message} onClose={closeModal}/>
    </>
  );
}

export default FormPemesanan;
