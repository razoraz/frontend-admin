import { useEffect, useState } from 'react';
import styles from '../styles/metode_pembayaran.module.css';
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import axios from 'axios';

const MetodePembayaran = () => {
  const [metode, setMetode] = useState('');
  const [keranjang, setKeranjang] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [metodeList, setMetodeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const METODE_KASIR = 2;
  const METODE_QRIS = 1;

  useEffect(() => {
    document.title = 'Metode Pembayaran - Basecamp Kopi';
  }, []);

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
            }
          : null;
      })
      .filter(Boolean);
    setKeranjang(cartArray);
  }, [menuData]);

  // Ambil metode pembayaran
  useEffect(() => {
    axios
      .get('https://backend-production-8cf7.up.railway.app/api/pemesanan/metode-pembayaran')
      .then((res) => {
        if (res.data.success) {
          setMetodeList(res.data.data);
        }
      })
      .catch((err) => console.error('Error fetch metode:', err));
  }, []);

  const total = keranjang.reduce((acc, item) => acc + item.harga * item.qty, 0);

  const handleBayar = async () => {
    if (!metode) {
      alert('Pilih metode pembayaran terlebih dahulu!');
      return;
    }

    // Ambil data pemesanan dari session
    const form = JSON.parse(sessionStorage.getItem('formPemesanan')) || {};
    const catatan = JSON.parse(sessionStorage.getItem('cartNotes')) || {};

    // Ambil data reservasi jika ada
    const reservasi = JSON.parse(sessionStorage.getItem('reservasi')) || null;

    // Mapping detail menu
    const detail_menu = keranjang.map((item) => ({
      id_menu: item.id,
      qty: item.qty,
      harga: item.harga,
      catatan: catatan[item.id] || null,
    }));

    // Total harga
    const total = keranjang.reduce((acc, item) => acc + item.harga * item.qty, 0);

    // Tentukan endpoint & payload
    const endpoint = reservasi ? 'https://backend-production-8cf7.up.railway.app/api/reservasi/add-reservasi' : 'https://backend-production-8cf7.up.railway.app/api/pemesanan/add-pemesanan';

    const payload = reservasi
      ? {
          // Flat data reservasi + pemesanan
          tanggal_dibuat: reservasi.tanggal_dibuat,
          nama_pelanggan: reservasi.nama_pelanggan,
          no_meja: reservasi.no_meja,
          tanggal_pemesanan: reservasi.tanggal_dibuat, // 
          tanggal_reservasi: reservasi.tanggal_reservasi,
          jam_reservasi: reservasi.jam_reservasi,
          nomor_whatsapp: reservasi.nomor_whatsapp,
          total_harga: total,
          detail_menu,
          id_metode: metode,
        }
      : {
          // Pemesanan biasa
          nama_pelanggan: form.nama_pelanggan,
          no_meja: form.no_meja,
          tanggal_pemesanan: form.tanggal,
          total_harga: total,
          detail_menu,
          id_metode: metode,
        };

    try {
      setLoading(true);

      console.log('SESSION RESERVASI:', reservasi);

      const res = await axios.post(endpoint, payload);

      if (!res.data.success) {
        alert(res.data.message || 'Gagal membuat pemesanan');
        return;
      }

      const idPemesanan = res.data.id_pemesanan;

      // 🔥 Jika bayar di kasir
      if (metode === METODE_KASIR) {
        window.location.href = `/menunggu-pembayaran/${idPemesanan}`;
        return;
      }

      // 🔥 Jika QRIS → Midtrans
      if (metode === METODE_QRIS && res.data.redirect_url) {
        window.location.href = res.data.redirect_url;
        return;
      }

      alert('Metode pembayaran tidak dikenali');
    } catch (err) {
      console.error(err);
      alert('Gagal membuat pemesanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <HeaderPagePelanggan title="Metode Pembayaran" subtitle="Pilih metode pembayaran yang kamu inginkan" bg_video="/background_video/navVideo.mp4" />

      <div className={styles.container}>
        <h2 className={styles.title}>Pilih Metode Pembayaran</h2>

        <div className={styles.list}>
          {metodeList.map((m) => (
            <label key={m.id_metode} className={styles.option}>
              <input type="radio" name="metode_pembayaran" value={m.id_metode} onChange={(e) => setMetode(Number(e.target.value))} />
              <span>{m.nama_metode}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.checkoutBar}>
        <div className={styles.totalInfo}>
          <p>Total:</p>
          <h3>Rp {total.toLocaleString()}</h3>
        </div>
        <button className={styles.payBtn} onClick={handleBayar} disabled={loading || !metode}>
          {loading ? 'Memproses...' : 'Bayar'}
        </button>
      </div>
    </div>
  );
};

export default MetodePembayaran;
