// Import Library
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Component
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import useBlockBack from '../hooks/BlockBack';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';
import TambahMenuForm from '../components/component-menuAdmin/TambahMenuForm';

// Import Style
import styles from '../styles/tambah_menu.module.css';

function TambahMenu() {
  useBlockBack();
  const navigate = useNavigate();

  // Title Halaman
  useEffect(() => {
    document.title = 'Tambah Menu - Basecamp Kopi';
  }, []);

  // State form tambah menu
  const [formData, setFormData] = useState({
    nama_menu: '',
    id_kategori: '',
    harga: '',
    deskripsi: '',
    status_tersedia: '',
    gambar_menu: null,
  });

  const [kategoriList, setKategoriList] = useState([]);

  // State modal utama
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  // State khusus untuk modal konfirmasi
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch kategori menu
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/menu/kategori');
        const data = await res.json();
        setKategoriList(data);
      } catch (error) {
        console.error('Gagal mengambil kategori:', error);
      }
    };
    fetchKategori();
  }, []);

  // Fungsi kirim data (dipanggil setelah konfirmasi)
  const submitData = async () => {
    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);

    try {
      const res = await fetch('http://localhost:5000/api/menu/tambah', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setModalType('success');
        setModalTitle('Penambahan Berhasil');
        setModalMessage('Menu berhasil ditambahkan.');
      } else {
        setModalType('error');
        setModalTitle('Penambahan Gagal');
        setModalMessage(result.message || 'Gagal menambahkan menu!');
      }
      setModalOpen(true);
    } catch (error) {
      console.error(error);
      setModalType('error');
      setModalTitle('Penambahan Gagal');
      setModalMessage('Terjadi kesalahan koneksi ke server!');
      setModalOpen(true);
    }
  };

  // Handle submit form (munculkan modal konfirmasi)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi form dulu
    if (!formData.nama_menu.trim() || !formData.id_kategori || !formData.harga || !formData.deskripsi.trim() || !formData.status_tersedia || !formData.gambar_menu) {
      setModalType('error');
      setModalTitle('Penambahan Gagal');
      setModalMessage('Data yang anda isi tidak sesuai. Silahkan periksa kembali.');
      setModalOpen(true);
      return;
    }
    if (parseInt(formData.harga) <= 0) {
      setModalType('error');
      setModalTitle('Penambahan Gagal');
      setModalMessage('Harga tidak boleh 0 atau negatif!');
      setModalOpen(true);
      return;
    }

    // Tampilkan modal konfirmasi
    setConfirmOpen(true);
  };

  // Jika user klik "Tambah" di modal konfirmasi
  const handleConfirmYes = () => {
    setConfirmOpen(false);
    submitData(); // lanjut kirim data
  };

  // Jika user klik "Batal"
  const handleConfirmNo = () => {
    setConfirmOpen(false);
  };

  // Handle close modal hasil
  const handleModalClose = () => {
    if (modalType === 'success') navigate('/menu');
    setModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <HeaderPage title="TAMBAH MENU" />

      {/* Form Tambah Menu */}
      <main className={styles.formContainer}>
        <TambahMenuForm formData={formData} setFormData={setFormData} kategoriList={kategoriList} onSubmit={handleSubmit} />
      </main>

      {/* Modal Konfirmasi (Question) */}
      {confirmOpen && <Modal isOpen={confirmOpen} onClose={handleConfirmNo} title="Tambah Menu" message="Apakah Anda yakin menambah data menu ini?" type="question" onConfirm={handleConfirmYes} confirmLabel="Tambah" cancelLabel="Batal" />}

      {/* Modal Hasil (Success / Error) */}
      <Modal isOpen={modalOpen} onClose={handleModalClose} title={modalTitle} message={modalMessage} type={modalType} />

      {/* Footer */}
      <FooterPage />
    </div>
  );
}

export default TambahMenu;
