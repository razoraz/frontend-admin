import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/keranjang.module.css';
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan.jsx';
import axios from 'axios';
import Modal from '../components/modal-notifikasi/ModalNotifikasi.jsx';

const Keranjang = () => {
  useEffect(() => {
    document.title = 'Keranjang - Basecamp Kopi';
  });
  const [keranjang, setKeranjang] = useState([]);
  const [menuData, setMenuData] = useState([]);

  // Form pelanggan
  const [namaPemesanan, setNamaPemesanan] = useState('');
  const [no_meja, setNomorMeja] = useState('');
  const [tanggal, setTanggal] = useState('');
  const navigate = useNavigate();

  const handleAddMore = () => {
    navigate('/pemesanan-menu'); // arahkan ke halaman pemesanan menu
  };

  // MODAL KONFIRMASI HAPUS
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Ambil menu dari backend
  useEffect(() => {
    axios
      .get('https://backend-production-8cf7.up.railway.app/api/menu/menu')
      .then((res) => setMenuData(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Ambil cart dari sessionStorage
  useEffect(() => {
    const cart = JSON.parse(sessionStorage.getItem('cartPemesanan')) || {};

    const cartArray = Object.entries(cart)
      .map(([id, qty]) => {
        const item = menuData.find((m) => m.id_menu === Number(id));
        return item
          ? {
              id: item.id_menu,
              nama: item.nama_menu,
              harga: item.harga,
              gambar: item.gambar_menu,
              qty,
              notes: [],
              tempNote: '',
              showNoteForm: false,
            }
          : null;
      })
      .filter(Boolean);

    setKeranjang(cartArray);
  }, [menuData]);

  // Ambil form pelanggan dari sessionStorage
  useEffect(() => {
    const savedForm = JSON.parse(sessionStorage.getItem('formPemesanan')) || {};
    if (savedForm.nama_pelanggan) setNamaPemesanan(savedForm.nama_pelanggan);
    if (savedForm.no_meja) setNomorMeja(savedForm.no_meja);
    if (savedForm.tanggal) setTanggal(savedForm.tanggal);
  }, []);

  // Simpan perubahan input ke sessionStorage
  useEffect(() => {
    sessionStorage.setItem('formPemesanan', JSON.stringify({ nama_pelanggan: namaPemesanan, no_meja, tanggal }));
  }, [namaPemesanan, no_meja, tanggal]);

  // ======= CATATAN SESSION STORAGE TERPISAH =======
  // Load catatan saat mount
  useEffect(() => {
    const notesStorage = JSON.parse(sessionStorage.getItem('cartNotes')) || {};
    setKeranjang((prev) =>
      prev.map((item) => {
        if (notesStorage[item.id]) {
          return { ...item, notes: notesStorage[item.id] };
        }
        return item;
      })
    );
  }, [menuData]);

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    navigate('/pemesanan-menu');
  };

  const updateQty = (id, type) => {
    const item = keranjang.find((i) => i.id === id);

    // 🔴 JIKA QTY = 1 DAN DIKURANGI → HAPUS LANGSUNG
    if (type === 'minus' && item.qty === 1) {
      const updated = keranjang.filter((i) => i.id !== id);
      setKeranjang(updated);

      // Update cartPemesanan
      const cartObj = {};
      updated.forEach((i) => (cartObj[i.id] = i.qty));

      if (updated.length === 0) {
        sessionStorage.removeItem('cartPemesanan');
      } else {
        sessionStorage.setItem('cartPemesanan', JSON.stringify(cartObj));
      }

      // Hapus catatan item
      const notesStorage = JSON.parse(sessionStorage.getItem('cartNotes')) || {};
      delete notesStorage[id];
      sessionStorage.setItem('cartNotes', JSON.stringify(notesStorage));

      // ✅ MODAL HANYA JIKA KERANJANG KOSONG
      if (updated.length === 0) {
        setSuccessModalOpen(true);
      }

      return;
    }

    // Normal plus / minus
    const updated = keranjang.map((item) => (item.id === id ? { ...item, qty: type === 'plus' ? item.qty + 1 : item.qty - 1 } : item));

    setKeranjang(updated);

    const cartObj = {};
    updated.forEach((i) => (cartObj[i.id] = i.qty));
    sessionStorage.setItem('cartPemesanan', JSON.stringify(cartObj));
  };

  // Toggle form catatan
  const toggleNoteForm = (id) => {
    setKeranjang((prev) => prev.map((item) => (item.id === id ? { ...item, showNoteForm: !item.showNoteForm } : item)));
  };

  // Update input sementara catatan
  const updateTempNote = (id, text) => {
    setKeranjang((prev) => prev.map((item) => (item.id === id ? { ...item, tempNote: text } : item)));
  };

  // Simpan catatan
  const saveNote = (id) => {
    setKeranjang((prev) =>
      prev.map((item) => {
        if (item.id === id && item.tempNote.trim() !== '') {
          const updatedNotes = [...item.notes, item.tempNote];

          // Simpan ke sessionStorage cartNotes
          const notesStorage = JSON.parse(sessionStorage.getItem('cartNotes')) || {};
          notesStorage[id] = updatedNotes;
          sessionStorage.setItem('cartNotes', JSON.stringify(notesStorage));

          return { ...item, notes: updatedNotes, tempNote: '', showNoteForm: false };
        }
        return item;
      })
    );
  };

  // Hapus semua catatan
  const clearNotes = (id) => {
    setKeranjang((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const notesStorage = JSON.parse(sessionStorage.getItem('cartNotes')) || {};
          delete notesStorage[id];
          sessionStorage.setItem('cartNotes', JSON.stringify(notesStorage));
          return { ...item, notes: [] };
        }
        return item;
      })
    );
  };

  const total = keranjang.reduce((acc, item) => acc + item.harga * item.qty, 0);

  useEffect(() => {
    const cartPemesanan = sessionStorage.getItem('cartPemesanan');

    // ❌ Jika tidak lewat form dan tidak lewat reservasi
    if (!cartPemesanan) {
      navigate('/scanner', { replace: true });
    }
  }, [navigate]);

  return (
    <div className={styles.page}>
      <HeaderPagePelanggan title="Keranjang Pemesanan Kamu" subtitle="Tinjau kembali informasi pemesanan dan pesanan sebelum proses pembayaran." bg_video="/background_video/navVideo7.mp4" />

      <div className={styles.container}>
        <h2 className={styles.title}>Pesanan Anda</h2>

        {/* FORM PELANGGAN */}
        <div className={styles.formBox}>
          <div className={styles.row}>
            <label>Nama Pemesanan:</label>
            <input value={namaPemesanan} onChange={(e) => setNamaPemesanan(e.target.value)} className={styles.inputFormBox} readOnly />
          </div>

          <div className={styles.row}>
            <label>Nomor Meja:</label>
            <input value={no_meja} onChange={(e) => setNomorMeja(e.target.value)} className={styles.inputFormBox} readOnly />

            <label className={styles.tanggalLabel}>Tanggal:</label>
            <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className={styles.inputFormBox} readOnly />
          </div>
        </div>

        {/* LIST MENU */}
        {keranjang.map((item) => (
          <div key={item.id} className={styles.cardItem}>
            <div className={styles.left}>
              <h3>{item.nama}</h3>
              <p className={styles.harga}>Rp {item.harga.toLocaleString()}</p>

              <p className={styles.catatanTitle}>Catatan 📝</p>

              {item.notes.length === 0 && <p className={styles.noNote}>Belum ada catatan</p>}

              {item.notes.map((note, idx) => (
                <p key={idx} className={styles.savedNote}>
                  - {note}
                </p>
              ))}

              {/* TOMBOL TAMBAH & HAPUS CATATAN */}
              <div className={styles.noteButtons}>
                <button className={styles.addNoteBtn} onClick={() => toggleNoteForm(item.id)}>
                  Tambah Catatan
                </button>

                {item.notes.length > 0 && (
                  <button className={styles.deleteNoteBtn} onClick={() => clearNotes(item.id)}>
                    Hapus Semua
                  </button>
                )}
              </div>

              {/* INPUT CATATAN */}
              {item.showNoteForm && (
                <div className={styles.textareaWrapper}>
                  <input type="text" placeholder="Tambahkan catatan..." value={item.tempNote} onChange={(e) => updateTempNote(item.id, e.target.value)} className={styles.textarea} />
                  <button className={styles.saveNoteBtn} onClick={() => saveNote(item.id)}>
                    Simpan Catatan
                  </button>
                </div>
              )}
            </div>

            <div className={styles.right}>
              <img src={item.gambar} className={styles.menuImage} alt={item.nama} />

              <div className={styles.qtyBox}>
                <button onClick={() => updateQty(item.id, 'minus')}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 'plus')}>+</button>
              </div>
            </div>
          </div>
        ))}

        <button className={styles.addMoreBtn} onClick={handleAddMore}>
          + Tambah Pesanan
        </button>
      </div>

      {/* FOOTER BAYAR */}
      <div className={styles.checkoutBar}>
        <div className={styles.totalInfo}>
          <p>Total:</p>
          <h3>Rp {total.toLocaleString()}</h3>
        </div>
        <button className={styles.payBtn} onClick={() => navigate('/metode-pembayaran')}>
          Bayar
        </button>
      </div>

      {/* MODAL KONFIRMASI */}
      <Modal isOpen={successModalOpen} onClose={handleSuccessClose} type="warning" title="Pesanan Dihapus" message="Maaf menu yang yang dipilih telah terhapus. Mohon pesan ulang pesanan anda." confirmLabel="Oke" />
    </div>
  );
};

export default Keranjang;
