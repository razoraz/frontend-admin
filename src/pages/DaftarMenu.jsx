// Page Kelola Menu
// Import Library
import { useEffect, useState } from 'react';
import axios from 'axios';

// Import Component
import useBlockBack from '../hooks/BlockBack';
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPage from '../components/component-html/FooterPage';
import MenuFilterBar from '../components/component-menuPelanggan/MenuFilterBar2';
import MenuList from '../components/component-menuPelanggan/MenuList2';


// Import Style
import styles from '../styles/menu_pelanggan.module.css';

// Main Function KelolaMenu
function DaftarMenu() {
  const [menu, setMenu] = useState([]);
  const [kategori, setKategori] = useState('');
  const [search, setSearch] = useState('');
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

 
  // Filter menu berdasarkan kategori dan pencarian
  const filteredMenu = menu.filter((item) => {
    const cocokKategori = kategori === '' || item.nama_kategori?.toLowerCase() === kategori.toLowerCase();
    const cocokSearch = search === '' || item.nama_menu?.toLowerCase().includes(search.toLowerCase()) || item.deskripsi?.toLowerCase().includes(search.toLowerCase());
    return cocokKategori && cocokSearch;
  });

  // Mengelompokkan menu berdasarkan kategori
  const makanan = filteredMenu.filter((i) => i.nama_kategori?.toLowerCase() === 'makanan');
  const minuman = filteredMenu.filter((i) => i.nama_kategori?.toLowerCase() === 'minuman');
  const snack = filteredMenu.filter((i) => i.nama_kategori?.toLowerCase() === 'snack');

  return (
    <div>
      {/* Navbar */}
      <HeaderPagePelanggan title="Nikmati Harimu dengan Secangkir Kebahagaian" subtitle="Rasakan cita rasa kopi yang menemani langkahmi" bg_video="/background_video/navVideo.mp4" />

      {/* Main Content */}
      <main className={styles.container}>
        {/* Filter Menu */}
        <MenuFilterBar kategori={kategori} setKategori={setKategori} search={search} setSearch={setSearch} />

        {/* List Menu */}
        <MenuList kategori={kategori} makanan={makanan} minuman={minuman} snack={snack} filteredMenu={filteredMenu} getImageUrl={getImageUrl} />
      </main>

      {/* Footer */}
      <FooterPage />
    </div>
  );
}

export default DaftarMenu;
