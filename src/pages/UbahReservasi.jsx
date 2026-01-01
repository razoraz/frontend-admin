import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/ubah_reservasi.module.css';

import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import useBlockBack from '../hooks/BlockBack';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

function UbahReservasi() {
  useBlockBack();
  const { id_reservasi } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    tanggal_reservasi: '',
    jam_reservasi: '',
    nama_pelanggan: '',
    no_meja: '',
    catatan: '',
    status_reservasi: '',
    status_pembayaran: '',
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  useEffect(() => {
    document.title = 'Ubah Reservasi - Basecamp Kopi';
  }, []);

  // GET data existing
  useEffect(() => {
    axios
      .get(`https://backend-production-8cf7.up.railway.app/api/reservasi/detail-reservasi/${id_reservasi}`)
      .then((res) => {
        const r = res.data.reservasi;

        // 🔥 FORMAT TANGGAL KHUSUS UNTUK INPUT DATE
        const tanggalFormatted = r.tanggal_reservasi
          ? new Date(r.tanggal_reservasi).toISOString().split('T')[0]
          : '';

        setItems(res.data.items);

        setForm({
          tanggal_reservasi: tanggalFormatted,
          jam_reservasi: r.jam_reservasi?.substring(0, 5) || '',
          nama_pelanggan: r.nama_pelanggan,
          no_meja: r.no_meja,
          catatan: r.catatan || '',
          status_reservasi: r.status_reservasi,
          status_pembayaran: r.status_pembayaran,
        });
      })
      .catch((err) => console.log(err));
  }, [id_reservasi]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Modal question
    setModalType('question');
    setModalTitle('Simpan Perubahan?');
    setModalMessage('Apakah Anda yakin ingin menyimpan perubahan ini?');
    setOnConfirmAction(() => handleConfirmUpdate);
    setModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    try {
       // ⭐ AMBIL DATA ADMIN DARI SESSIONSTORAGE
    const adminData = JSON.parse(sessionStorage.getItem('adminData'));
    const id_admin = adminData?.id_admin;
    
    console.log('🔍 Admin yang login:', adminData);
    console.log('📝 id_admin yang akan dikirim:', id_admin);

    // ⭐ TAMBAHKAN id_admin KE FORM DATA
    const formData = {
      ...form,
      id_admin: id_admin  // ⭐ INI YANG DITAMBAHKAN
    };

    console.log('📤 Data yang dikirim ke backend:', formData);
      await axios.put(`https://backend-production-8cf7.up.railway.app/api/reservasi/update-reservasi/${id_reservasi}`, formData);

      // Modal success
      setModalType('success');
      setModalTitle('Berhasil!');
      setModalMessage('Reservasi berhasil diperbarui.');
      setOnConfirmAction(() => () => {
        setModalOpen(false);
        navigate('/reservasi'); // redirect setelah klik Oke
      });
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      // Modal error
      setModalType('error');
      setModalTitle('Gagal!');
      setModalMessage('Terjadi kesalahan saat menyimpan reservasi.');
      setOnConfirmAction(() => () => setModalOpen(false));
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    if (modalType === 'success') navigate('/reservasi');
    setModalOpen(false);
  };

  return (
    <div>
      <HeaderPage title="UBAH RESERVASI" />

      <main className={styles.formContainer}>
        <form className={styles.reservasiForm} onSubmit={handleSubmit}>
          <Link to="/reservasi" className={styles.btnBack}>
            <i className="fas fa-arrow-left"></i> Kembali
          </Link>

          {/* Nama Pelanggan & No Meja */}
          <div className={styles.rowGroup}>
            <div className={styles.formGroup}>
              <label>Nama Pelanggan</label>
              <input type="text" name="nama_pelanggan" value={form.nama_pelanggan} onChange={handleChange} readOnly className={styles.inputDisabled} />
            </div>

            <div className={styles.formGroup}>
              <label>No Meja</label>
              <input type="number" name="no_meja" value={form.no_meja} onChange={handleChange} readOnly className={styles.inputDisabled} />
            </div>
          </div>

          {/* Tanggal & Jam */}
          <div className={styles.rowGroup}>
            <div className={styles.formGroup}>
              <label>Tanggal Reservasi</label>
              <input type="date" name="tanggal_reservasi" value={form.tanggal_reservasi} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Jam Reservasi</label>
              <input type="time" name="jam_reservasi" value={form.jam_reservasi} onChange={handleChange} />
            </div>
          </div>

          {/* Item Dipesan */}
          <div className={styles.formGroup}>
            <label>Item Dipesan</label>
            <table className={styles.tableItems}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Menu</th>
                  <th>Jumlah</th>
                  <th>Subtotal</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{it.nama_menu}</td>
                    <td>{it.jumlah}</td>
                    <td>Rp {Number(it.subtotal).toLocaleString()}</td>
                    <td>{it.catatan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Status */}
          <div className={styles.formGroup}>
            <label>Status Reservasi</label>
            <select name="status_reservasi" value={form.status_reservasi} onChange={handleChange}>
              <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
              <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
              <option value="dikonfirmasi">Dikonfirmasi</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Status Pembayaran</label>
            <select name="status_pembayaran" value={form.status_pembayaran} onChange={handleChange}>
              <option value="belum_bayar">Belum Bayar</option>
              <option value="sudah_bayar">Sudah Bayar</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>

          <div className={styles.formButtons}>
            <button type="submit" className={styles.btnSubmit}>
              <i className="fas fa-save"></i> Simpan
            </button>
          </div>
        </form>
      </main>

      <FooterPage />

      {/* Modal Notifikasi */}
      <Modal
        isOpen={modalOpen}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onClose={handleCloseModal}
        onConfirm={onConfirmAction}
        confirmLabel="Ya"
        cancelLabel="Batal"
      />
    </div>
  );
}

export default UbahReservasi;
