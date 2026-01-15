import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPage from '../components/component-html/FooterPagePelanggan';
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
    tanggal_dibuat: new Date().toLocaleDateString('sv-SE'),
  });
  const today = new Date();
  const besok = new Date(today);
  besok.setDate(today.getDate() + 1);

  const formatDate = (date) => date.toLocaleDateString('sv-SE');
  const minTanggal = formatDate(today);
  const maxTanggal = formatDate(besok);

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
        title: 'Reservasi Gagal',
        message: 'Data yang anda isi tidak sesuai. Silahkan periksa kembali.',
      });
      return;
    }
    const now = new Date();

    // Gabungkan tanggal + jam reservasi
    const selectedDateTime = new Date(`${tanggal_reservasi}T${jam_reservasi}`);

    // Jika waktu reservasi sudah lewat dari sekarang
    if (selectedDateTime <= now) {
      setModal({
        isOpen: true,
        title: 'Reservasi Gagal',
        message: 'Tanggal atau jam reservasi sudah melewati waktu yang ditentukan.',
      });
      return;
    }

    // SIMPAN KE SESSION STORAGE
    sessionStorage.removeItem('cartPemesanan');
    sessionStorage.removeItem('cartNotes');
    sessionStorage.removeItem('konteksPemesanan');
    sessionStorage.removeItem('formPemesanan');
    sessionStorage.setItem('reservasi', JSON.stringify(formData));

    // OPTIONAL: cek di console
    console.log('Data reservasi disimpan:', formData);

    // ARAHKAN KE HALAMAN PEMESANAN MENU
    navigate('/pemesanan-menu');
  };

  return (
    <>
      <HeaderPagePelanggan title="SIAPKAN TEMPAT UNTUK MOMEN SPESIALMU" subtitle="Pesan meja favoritmu sekarang! Reservasi hanya berlaku 1 hari ke depan." bg_video="/background_video/navVideo3.mp4" />

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
                <label>Nama</label>
                <input type="text" name="nama_pelanggan" value={formData.nama_pelanggan} onChange={handleChange} placeholder="Masukkan nama anda" />
              </div>

              <div className={styles.inputGroup}>
                <label>No WhatsApp</label>
                <input type="tel" name="nomor_whatsapp" value={formData.nomor_whatsapp} onChange={handleChange} placeholder="Masukkan nomor WhatsApp Anda - Contoh: 628123456789" />
              </div>
              <div className={styles.inputGroup}>
                <label>No Meja</label>
                <select name="no_meja" value={formData.no_meja} onChange={handleChange}>
                  <option value="">-- Pilih Meja --</option>
                  {mejaList
                    .filter((meja) => meja.status_meja === 'tersedia')
                    .map((meja) => (
                      <option key={meja.id_meja} value={meja.no_meja}>
                        Meja {meja.no_meja} - {meja.kapasitas} Orang
                      </option>
                    ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Tanggal Reservasi</label>
                <input type="date" name="tanggal_reservasi" value={formData.tanggal_reservasi} onChange={handleChange} max={maxTanggal} min={minTanggal} />
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
