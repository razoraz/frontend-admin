import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/ubah_pemesanan.module.css';

import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import useBlockBack from '../hooks/BlockBack';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

function UbahPemesanan() {
  useBlockBack();
  const { id_pemesanan } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    nama_pelanggan: '',
    no_meja: '',
    catatan: '',
    status_pemesanan: '',
    status_pembayaran: '',
  });

  // Modal state seperti UbahMenu
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  useEffect(() => {
    document.title = 'Ubah Pemesanan - Basecamp Kopi';
  }, []);

  // GET data existing
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/pemesanan/detail-pemesanan/${id_pemesanan}`)
      .then((res) => {
        const p = res.data.pemesanan;
        setItems(res.data.items);
        setForm({
          nama_pelanggan: p.nama_pelanggan,
          no_meja: p.no_meja,
          catatan: p.catatan || '',
          status_pemesanan: p.status_pemesanan,
          status_pembayaran: p.status_pembayaran,
        });
      })
      .catch((err) => console.log(err));
  }, [id_pemesanan]);

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
      await axios.put(`http://localhost:5000/api/pemesanan/update-pemesanan/${id_pemesanan}`, form);

      // Modal success
      setModalType('success');
      setModalTitle('Berhasil!');
      setModalMessage('Pemesanan berhasil diperbarui.');
      setOnConfirmAction(() => () => {
        setModalOpen(false);
        navigate('/pemesanan'); // ← redirect setelah klik Oke
      });
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      // Modal error
      setModalType('error');
      setModalTitle('Gagal!');
      setModalMessage('Terjadi kesalahan saat menyimpan pemesanan.');
      setOnConfirmAction(() => () => setModalOpen(false));
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    if (modalType === 'success') navigate('/pemesanan');
    setModalOpen(false);
  };

  return (
    <div>
      <HeaderPage title="UBAH PEMESANAN" />

      <main className={styles.formContainer}>
        <form className={styles.pemesananForm} onSubmit={handleSubmit}>
          <Link to="/pemesanan" className={styles.btnBack}>
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
            <label>Status Pemesanan</label>
            <select name="status_pemesanan" value={form.status_pemesanan} onChange={handleChange}>
              <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
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
      <Modal isOpen={modalOpen} type={modalType} title={modalTitle} message={modalMessage} onClose={handleCloseModal} onConfirm={onConfirmAction} confirmLabel="Ya" cancelLabel="Batal" />
    </div>
  );
}

export default UbahPemesanan;
