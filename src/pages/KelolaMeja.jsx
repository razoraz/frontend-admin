// Import Library
import { useState, useEffect } from 'react';

// Import Component
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';
import TableMeja from '../components/component-meja/TableMeja';
import FormMeja from '../components/component-meja/FormMeja';
import useBlockBack from '../hooks/BlockBack';

// Import Style
import styles from '../styles/kelola_meja.module.css';

// API URL
const API_URL = 'https://backend-production-8cf7.up.railway.app/api/meja';

// Pagination Items Per Page
const ITEMS_PER_PAGE = 5;

function KelolaMeja() {
  useBlockBack();

  // State
  const [mejaList, setMejaList] = useState([]);
  const [mejaInput, setMejaInput] = useState('');
  const [kapasitasInput, setKapasitasInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', message: '', onConfirm: null });
  const [currentPage, setCurrentPage] = useState(1);

  const FRONTEND_URL = window.location.origin;

  const showModal = (type, title, message, onConfirm = null, confirmLabel = 'Ya', cancelLabel = 'Batal') => {
    setModal({ isOpen: true, type, title, message, onConfirm, confirmLabel, cancelLabel });
  };
  const closeModal = () => setModal({ ...modal, isOpen: false });

  // ===============================
  // GET DATA + GENERATE TOKEN UNTUK SEMUA MEJA
  // ===============================
  useEffect(() => {
    document.title = 'Kelola Meja - Basecamp Kopi';

    const fetchMeja = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const mejaWithTokens = data.map((m) => ({
          id_meja: m.id_meja,
          nama: m.no_meja,
          kapasitas: m.kapasitas,
          status: m.status_meja || 'tersedia',
          token: m.token, // ambil dari DB, sudah ada
        }));

        setMejaList(mejaWithTokens);
      } catch (err) {
        showModal('error', 'Error', 'Gagal fetch data meja!');
        console.log(err);
      }
    };

    fetchMeja();
  }, []);

  // HANDLER EDIT
  const handleEdit = (meja) => {
    setMejaInput(meja.nama);
    setKapasitasInput(meja.kapasitas);
    setEditingId(meja.id_meja);
  };

  // HANDLER ADD / UPDATE
  const handleAddOrUpdate = () => {
    if (!editingId) {
      // ADD
      if (!mejaInput || !kapasitasInput) {
        showModal('error', 'Penambahan Gagal', 'Data yang anda isi tidak sesuai. Silahkan periksa kembali.');
        return;
      }
      showModal('question', 'Tambah Meja', 'Apakah anda yakin ingin menambah data meja ini?', async () => {
        closeModal();
        try {
          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ no_meja: mejaInput, kapasitas: kapasitasInput }),
          });
          const newData = await res.json();

          setMejaList((prev) => [
            ...prev,
            {
              id_meja: newData.id_meja,
              nama: mejaInput,
              kapasitas: kapasitasInput,
              status: 'tersedia',
              token: newData.token,
            },
          ]);

          showModal('success', 'Penambahan Berhasil', 'Data berhasil ditambahkan');
          setMejaInput('');
          setKapasitasInput('');
        } catch (err) {
          showModal('error', 'Error', 'Gagal menambahkan meja!');
          console.log(err);
        }
      },
      'Tambah',
      'Batal'
    );
    } else {
      // UPDATE
      if (!mejaInput || !kapasitasInput) {
        showModal('error', 'Perubahan Gagal', 'Data yang anda isi tidak sesuai. Silahkan periksa kembali.');
        return;
      }
      const updatedMeja = { no_meja: mejaInput, kapasitas: kapasitasInput };
      showModal('question', 'Simpan Perubahan', 'Apakah anda yakin ingin merubah data meja ini?', async () => {
        closeModal();
        try {
          await fetch(`${API_URL}/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMeja),
          });
          setMejaList((prev) => prev.map((m) => (m.id_meja === editingId ? { ...m, nama: updatedMeja.no_meja, kapasitas: updatedMeja.kapasitas } : m)));
          showModal('success', 'Perubahan Berhasil', 'Data meja berhasil diubah.');
          setEditingId(null);
          setMejaInput('');
          setKapasitasInput('');
        } catch (err) {
          showModal('error', 'Error', 'Gagal mengubah meja!');
          console.log(err);
        }
      },
      'Ubah',
      'Batal'
    );
    }
  };

  // HANDLER DELETE
  const handleDelete = (id_meja) => {
    showModal('question', 'Hapus Meja', 'Apakah anda yakin ingin menghapus data meja ini?', async () => {
      closeModal(); // tutup modal konfirmasi dulu
      try {
        await fetch(`${API_URL}/${id_meja}`, { method: 'DELETE' });
        setMejaList((prev) => prev.filter((m) => m.id_meja !== id_meja));
        showModal('success', 'Berhasil Dihapus', 'Data meja berhasil dihapus.');
      } catch (err) {
        showModal('error', 'Error', 'Gagal menghapus meja!');
        console.log(err);
      }
    },
    'Hapus',
    'Batal'
  );
  };

  // DOWNLOAD QR
  const handleDownloadQR = async (noMeja) => {
    try {
      const res = await fetch(`${API_URL}/qr/${noMeja}`);
      const data = await res.json();
      setMejaList((prev) => prev.map((m) => (m.nama === noMeja ? { ...m, token: data.token } : m)));
      const link = document.createElement('a');
      link.href = data.qrImage;
      link.download = `QR-Meja-${noMeja}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      showModal('error', 'Error', 'Gagal generate QR code!');
    }
  };

  // Pagination
  const totalPages = Math.ceil(mejaList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = mejaList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div>
      {/* HEADER */}
      <HeaderPage title="KELOLA MEJA" />

      <div className={styles.kelolaContainer}>
        {/* CONTENT */}
        <div className={styles.centerWrapper}>
          {/* TABLE */}
          <TableMeja
            currentItems={currentItems}
            startIndex={startIndex}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleDownloadQR={handleDownloadQR}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            FRONTEND_URL={FRONTEND_URL}
          />
          {/* FORM */}
          <FormMeja
            mejaInput={mejaInput}
            kapasitasInput={kapasitasInput}
            setMejaInput={setMejaInput}
            setKapasitasInput={setKapasitasInput}
            editingId={editingId}
            onSubmit={handleAddOrUpdate}
            onCancel={() => {
              setEditingId(null);
              setMejaInput('');
              setKapasitasInput('');
            }}
          />
        </div>
      </div>
      {/* FOOTER */}
      <FooterPage />

      {/* MODAL */}
      <Modal isOpen={modal.isOpen} type={modal.type} title={modal.title} message={modal.message} confirmLabel={modal.confirmLabel} cancelLabel={modal.cancelLabel} onClose={closeModal} onConfirm={modal.onConfirm} />
    </div>
  );
}

export default KelolaMeja;
