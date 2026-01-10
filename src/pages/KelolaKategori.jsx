// Import Library
import { useState, useEffect } from 'react';

// Import Component
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';
import TableKategori from '../components/component-kategori/TableKategori';
import FormKategori from '../components/component-kategori/FormKategori';
import useBlockBack from '../hooks/BlockBack';

// Import Style
import styles from '../styles/kelola_kategori.module.css';

// API URL
const API_URL = 'https://backend-production-8cf7.up.railway.app/api/kategori';

// Pagination Items Per Page
const ITEMS_PER_PAGE = 5;

function KelolaKategori() {
  useBlockBack();

  // State
  const [kategoriList, setKategoriList] = useState([]);
  const [kategoriInput, setKategoriInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', message: '', onConfirm: null });
  const [currentPage, setCurrentPage] = useState(1);

  const showModal = (type, title, message, onConfirm = null) => {
    setModal({ isOpen: true, type, title, message, onConfirm });
  };
  const closeModal = () => setModal({ ...modal, isOpen: false });

  // ===============================
  // GET DATA + GENERATE TOKEN UNTUK SEMUA KATEGORI
  // ===============================
  useEffect(() => {
    document.title = 'Kelola Kategori - Basecamp Kopi';

    const fetchKategori = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const kelolaKategori = data.map((m) => ({
          id_kategori: m.id_kategori,
          nama: m.nama_kategori,
        }));

        setKategoriList(kelolaKategori);
      } catch (err) {
        showModal('error', 'Error', 'Gagal fetch data kategori!');
        console.log(err);
      }
    };

    fetchKategori();
  }, []);

  // HANDLER EDIT
  const handleEdit = (kategori) => {
    setKategoriInput(kategori.nama);
    setEditingId(kategori.id_kategori);
  };

  // HANDLER ADD / UPDATE
  const handleAddOrUpdate = () => {
    // HANDLER ADD
    if (!editingId) {
      if (!kategoriInput.trim()) {
        showModal('error', 'Penambahan Gagal', 'Nama kategori tidak boleh kosong!');
        return;
      }

      showModal('question', 'Tambah Kategori', 'Apakah anda yakin ingin menambah data kategori ini?', async () => {
        closeModal();

        try {
          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nama_kategori: kategoriInput,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Gagal menambahkan kategori');
          }

          setKategoriList((prev) => [
            ...prev,
            {
              id_kategori: data.id_kategori,
              nama: data.nama_kategori,
            },
          ]);

          showModal('success', 'Penambahan Berhasil', 'Data kategori berhasil ditambahkan.');

          setKategoriInput('');
        } catch (err) {
          showModal('error', 'Penambahan Gagal', err.message);
          console.log(err);
        }
      });
    } else {
      // UPDATE
      if (!kategoriInput) {
        showModal('error', 'Perubahan Gagal', 'Silahkan isi semua kolom!');
        return;
      }
      const updatedKategori = { nama_kategori: kategoriInput };
      showModal('question', 'Simpan Perubahan', 'Apakah anda yakin ingin merubah data kategori ini?', async () => {
        closeModal();
        try {
          await fetch(`${API_URL}/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedKategori),
          });
          setKategoriList((prev) => prev.map((m) => (m.id_kategori === editingId ? { ...m, nama: updatedKategori.nama_kategori } : m)));
          showModal('success', 'Perubahan Berhasil', 'Data Kategori berhasil diubah.');
          setEditingId(null);
          setKategoriInput('');
        } catch (err) {
          showModal('error', 'Error', 'Gagal mengubah kategori!');
          console.log(err);
        }
      });
    }
  };

  // HANDLER DELETE
  const handleDelete = (id_kategori) => {
    showModal('question', 'Hapus Kategori', 'Apakah anda yakin ingin menghapus data kategori ini?', async () => {
      closeModal(); // tutup modal konfirmasi dulu
      try {
        await fetch(`${API_URL}/${id_kategori}`, { method: 'DELETE' });
        setKategoriList((prev) => prev.filter((m) => m.id_kategori !== id_kategori));
        showModal('success', 'Berhasil Dihapus', 'Data kategori berhasil dihapus.');
      } catch (err) {
        showModal('error', 'Error', 'Gagal menghapus kategori!');
        console.log(err);
      }
    });
  };

  // Pagination
  const totalPages = Math.ceil(kategoriList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = kategoriList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div>
      <HeaderPage title="KELOLA KATEGORI" />
      {/* CONTENT */}
      <div className={styles.kelolaContainer}>
        {/* HEADER */}

        {/* CONTENT */}
        <div className={styles.centerWrapper}>
          {/* TABLE */}
          <TableKategori currentItems={currentItems} startIndex={startIndex} handleEdit={handleEdit} handleDelete={handleDelete} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
          {/* FORM */}
          <FormKategori
            kategoriInput={kategoriInput}
            setKategoriInput={setKategoriInput}
            editingId={editingId}
            onSubmit={handleAddOrUpdate}
            onCancel={() => {
              setEditingId(null);
              setKategoriInput('');
            }}
          />
        </div>
      </div>
      {/* FOOTER */}
      <FooterPage />
      {/* MODAL */}
      <Modal isOpen={modal.isOpen} type={modal.type} title={modal.title} message={modal.message} onClose={closeModal} onConfirm={modal.onConfirm} />
    </div>
  );
}

export default KelolaKategori;
