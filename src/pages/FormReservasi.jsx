import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPage from '../components/component-html/FooterPage';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

import styles from '../styles/form_reservasi.module.css';

function FormReservasi() {
  const navigate = useNavigate();

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  const [mejaList, setMejaList] = useState([]);

  const [formData, setFormData] = useState({
    nama_pelanggan: '',
    nomor_whatsapp: '',
    no_meja: '',
    tanggal_reservasi: '',
    jam_reservasi: '',
    tanggal_dibuat: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    document.title = 'Reservasi Meja - Basecamp Kopi';

    fetch('https://backend-production-8cf7.up.railway.app/api/meja')
      .then((res) => res.json())
      .then((data) => setMejaList(data))
      .catch(() => {
        setModal({
          isOpen: true,
          title: 'Error',
          message: 'Gagal mengambil data meja',
        });
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { nama_pelanggan, nomor_whatsapp, no_meja, tanggal_reservasi, jam_reservasi } = formData;

    if (!nama_pelanggan || !nomor_whatsapp || !no_meja || !tanggal_reservasi || !jam_reservasi) {
      setModal({
        isOpen: true,
        title: 'Data Tidak Lengkap',
        message: 'Semua field wajib diisi',
      });
      return;
    }

    // SIMPAN KE SESSION STORAGE
    sessionStorage.removeItem('cartPemesanan');
    sessionStorage.removeItem('konteksPemesanan');
    sessionStorage.setItem('reservasi', JSON.stringify(formData));

    // OPTIONAL: cek di console
    console.log('Data reservasi disimpan:', formData);

    // ARAHKAN KE HALAMAN PEMESANAN MENU
    navigate('/pemesanan-menu');
  };

  return (
    <>
      <HeaderPagePelanggan title="Reservasi Meja" subtitle="Amankan meja favoritmu sebelum datang" bg_video="/background_video/navVideo.mp4" />

      <div className={styles.centerWrapper}>
        <div className={styles.reservasiCard}>
          {/* SISI GAMBAR */}
          <div className={styles.imageSide}>
            <img src="/photo/poster.png" alt="Reservasi Basecamp" />
          </div>

          {/* SISI FORM */}
          <div className={styles.formSide}>
            <div className={styles.reservasiHeader}>
              <img src="/logo_kafe/Logo.PNG" alt="Logo" />
              <h2>Form Reservasi</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Nama Lengkap</label>
                <input type="text" name="nama_pelanggan" value={formData.nama_pelanggan} onChange={handleChange} />
              </div>

              <div className={styles.inputGroup}>
                <label>No WhatsApp</label>
                <input type="tel" name="nomor_whatsapp" value={formData.nomor_whatsapp} onChange={handleChange} placeholder="08xxxxxxxxxx" />
              </div>
              <div className={styles.inputGroup}>
                <label>No Meja</label>
                <select name="no_meja" value={formData.no_meja} onChange={handleChange}>
                  <option value="">-- Pilih Meja --</option>
                  {mejaList
                    .filter((meja) => meja.status_meja === 'tersedia' || meja.status_meja === 'dipesan') // ✅ filter meja
                    .map((meja) => (
                      <option key={meja.id_meja} value={meja.no_meja}>
                        {meja.no_meja} - {meja.kapasitas} Orang ({meja.status_meja})
                      </option>
                    ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Tanggal Reservasi</label>
                <input type="date" name="tanggal_reservasi" value={formData.tanggal_reservasi} onChange={handleChange} />
              </div>

              <div className={styles.inputGroup}>
                <label>Jam Reservasi</label>
                <input type="time" name="jam_reservasi" value={formData.jam_reservasi} onChange={handleChange} />
              </div>

              <div className={styles.inputGroup}>
                <label>Tanggal Dibuat</label>
                <input type="date" value={formData.tanggal_dibuat} readOnly className={styles.inputDisabled} />
              </div>

              <button type="submit" className={styles.reservasiButton}>
                Reservasi Sekarang
              </button>
            </form>
          </div>
        </div>
      </div>

      <FooterPage />

      <Modal isOpen={modal.isOpen} type="error" title={modal.title} message={modal.message} onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))} />
    </>
  );
}

export default FormReservasi;
