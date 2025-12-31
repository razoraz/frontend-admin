// Halaman Ubah Menu
// Import Library
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Import Component
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import useBlockBack from '../hooks/BlockBack';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';
import UbahMenuForm from '../components/component-menuAdmin/UbahMenuForm';

// Import Style
import styles from '../styles/ubah_menu.module.css';

// Main Function UbahMenu
function UbahMenu() {
  useBlockBack();

  // Title Halaman
  useEffect(() => {
    document.title = 'Ubah Menu - Basecamp Kopi';
  }, []);

  // Get ID dari parameter URL
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState({
    nama_menu: '',
    id_kategori: '',
    harga: '',
    deskripsi: '',
    status_tersedia: '',
    gambar_menu: '',
  });
  const [gambarBaru, setGambarBaru] = useState(null);
  const [kategoriList, setKategoriList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  // Get data kategori & menu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const kategoriRes = await axios.get('https://backend-production-8cf7.up.railway.app/api/menu/kategori');
        setKategoriList(kategoriRes.data);
        const menuRes = await axios.get(`https://backend-production-8cf7.up.railway.app/api/menu/menu/${id}`);
        setMenu(menuRes.data);
      } catch (error) {
        console.error('Gagal ambil data:', error);
      }
    };
    fetchData();
  }, [id]);

  // Handle simpan
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!menu.nama_menu || !menu.id_kategori || !menu.harga || !menu.deskripsi || !menu.status_tersedia) {
      // Modal error
      setModalType('error');
      setModalTitle('Perubahan Gagal');
      setModalMessage('Data yang anda isi tidak sesuai. Silahkan periksa kembali.');
      setModalOpen(true);
      return;
    }

    // Modal konfirmasi
    setModalType('question');
    setModalTitle('Simpan Perubahan');
    setModalMessage('Apakah anda yakin ingin merubah data menu ini?');
    setOnConfirmAction(() => handleConfirmUpdate);
    setModalOpen(true);
  };

  // Jika user konfirmasi update
  const handleConfirmUpdate = async () => {
    try {
      const formData = new FormData();
      for (const key in menu) formData.append(key, menu[key]);
      if (gambarBaru) formData.append('gambar_menu', gambarBaru);
      await axios.put(`https://backend-production-8cf7.up.railway.app/api/menu/menu/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Modal success
      setModalType('success');
      setModalTitle('Perubahan Berhasil');
      setModalMessage('Data menu berhasil diubah.');
      setModalOpen(true);
      setOnConfirmAction(null);
    } catch (error) {
      setModalType('error');
      setModalTitle('Gagal');
      setModalMessage('Terjadi kesalahan saat memperbarui menu.');
      setModalOpen(true);
      console.error('Gagal memperbarui menu:', error);
    }
  };
  // Handle close modal
  const handleCloseModal = () => {
    if (modalType === 'success') navigate('/menu');
    setModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <HeaderPage title="UBAH MENU" />

      {/* Main Content */}
      <main className={styles.formContainer}>
        <UbahMenuForm menu={menu} setMenu={setMenu} kategoriList={kategoriList} setGambarBaru={setGambarBaru} onSubmit={handleSubmit} />
      </main>

      {/* Modal Notifikasi */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} onConfirm={onConfirmAction} title={modalTitle} message={modalMessage} type={modalType} confirmLabel="Ubah" cancelLabel="Batal" />

      {/* Footer */}
      <FooterPage />
    </div>
  );
}

export default UbahMenu;
