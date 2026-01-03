// Page Kelola Menu
// Import Library
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import Component
import useBlockBack from '../hooks/BlockBack';
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import MenuFilterBar from '../components/component-menuAdmin/MenuFilterBar';
import MenuList from '../components/component-menuAdmin/MenuList';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

// Import Style
import styles from '../styles/menu.module.css';

// Main Function KelolaMenu
function KelolaMenu() {
  const [menu, setMenu] = useState([]);
  const [kategori, setKategori] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  useBlockBack();

  // Ambil data menu dari server
  useEffect(() => {
    document.title = 'Kelola Menu - Basecamp Kopi';
    axios
      .get('https://backend-production-8cf7.up.railway.app/api/menu/menu')
      .then((res) => setMenu(res.data))
      .catch((err) => console.error('Gagal ambil menu:', err));
  }, []);

  const getImageUrl = (filename) => `https://backend-production-8cf7.up.railway.app/uploads/${filename}`;

  // Saat klik tombol hapus
  const handleDelete = (id) => {
    setDeleteId(id);
    setModalType('question');
    setModalTitle('Hapus Menu');
    setModalMessage('Apakah anda yakin ingin menghapus data menu ini?');
    setModalOpen(true);
  };

  // Saat user menekan hapus pada modal
  const confirmDelete = async () => {
    try {
      await axios.delete(`https://backend-production-8cf7.up.railway.app/api/menu/menu/${deleteId}`);
      setMenu((prev) => prev.filter((item) => item.id_menu !== deleteId));
      setModalType('success');
      setModalTitle('Berhasil Dihapus');
      setModalMessage('Data menu berhasil dihapus.');
      setModalOpen(true);
    } catch (err) {
      setModalType('error');
      setModalTitle('Gagal');
      setModalMessage('Terjadi kesalahan saat menghapus menu.');
      setModalOpen(true);
      console.error('Gagal menghapus menu:', err);
    }
  };
  // Filter menu berdasarkan kategori dan pencarian
  const filteredMenu = menu.filter((item) => {
    const cocokKategori = kategori === '' || item.nama_kategori?.toLowerCase() === kategori.toLowerCase();
    const cocokSearch = search === '' || item.nama_menu?.toLowerCase().includes(search.toLowerCase()) || item.deskripsi?.toLowerCase().includes(search.toLowerCase());
    return cocokKategori && cocokSearch;
  });

  return (
    <div>
      {/* Header */}
      <HeaderPage title="MENU" />

      {/* Main Content */}
      <main className={styles.container}>
        {/* Filter Menu */}
        <MenuFilterBar
          menu={menu} // semua menu di state
          kategori={kategori}
          setKategori={setKategori}
          search={search}
          setSearch={setSearch}
          onAdd={() => navigate('/tambah-menu')}
        />

        {/* List Menu */}
        <MenuList
          filteredMenu={filteredMenu} // semua menu sudah difilter berdasarkan search/kategori
          onDelete={handleDelete}
          getImageUrl={getImageUrl}
        />

        {/* Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={confirmDelete} title={modalTitle} message={modalMessage} type={modalType} confirmLabel="Hapus" cancelLabel="Batal" />
      </main>

      {/* Footer */}
      <FooterPage />
    </div>
  );
}

export default KelolaMenu;
