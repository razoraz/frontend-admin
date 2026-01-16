import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/struk.module.css';

import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPagePelanggan from '../components/component-html/FooterPagePelanggan';

const Struk = () => {
  const { id_pemesanan } = useParams();
  const navigate = useNavigate();
  const [pemesanan, setPemesanan] = useState(null);

  useEffect(() => {
    document.title = 'Struk Pemesanan';
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://backend-production-8cf7.up.railway.app/api/pemesanan/detail/${id_pemesanan}`);
        setPemesanan(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id_pemesanan]);

  if (!pemesanan) return <div className={styles.loading}>Loading...</div>;

  const isPaid = pemesanan.status_pembayaran === 'sudah_bayar';
  const hasAdmin = !!pemesanan.email_admin || !!pemesanan.kode_admin;
  
  const formatStatusPembayaran = (status) => {
    if (status === 'sudah_bayar') return 'Sudah Bayar';
    if (status === 'belum_bayar') return 'Belum Bayar';
    if (status === 'dibatalkan') return 'Dibatalkan';
    return status;
  };

  // Format nama admin dari email
  const formatAdminName = (email) => {
    if (!email) return '-';
    const username = email.split('@')[0];
    // Capitalize first letter
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  return (
    <div>
      <HeaderPagePelanggan 
        title="Struk Anda" 
        subtitle="Berikut ringkasan pesanan dan detail pembayaran Anda" 
        bg_video="/background_video/navVideo13.mp4" 
      />

      {/* Wrapping konten struk */}
      <div id="strukContent" className={styles.page}>
        {/* BRANDING */}
        <div className={styles.brand}>
          <h1 className={styles.brandTitle}>BASECAMP KOPI JEMBER</h1>
          {/* LOGO */}
          <img src="/logo_kafe/Logo.PNG" alt="Basecamp Kopi Logo" className={`${styles.brandLogo} ${styles.logoColor}`} />
          <img src="/logo_kafe/Logo-hitam.png" alt="Basecamp Kopi Logo" className={`${styles.brandLogo} ${styles.logoBlack}`} />

          <p className={styles.brandInfo}>Jl. Kaliurang No. 23, Jember</p>
          <p className={styles.brandInfo}>Telp: 0812-3456-7890</p>
          <p className={styles.brandInfo}>IG: @basecampkopi</p>
        </div>

        <div className={styles.separator}></div>

        {/* ================= INFO UTAMA ================ */}
        <div className={styles.info}>
          <div className={styles.row}>
            <span className={styles.label}>Nama Pelanggan</span>
            <span className={styles.colon}>:</span>
            <span className={styles.value}>{pemesanan.nama_pelanggan}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>No Meja</span>
            <span className={styles.colon}>:</span>
            <span className={styles.value}>{pemesanan.no_meja}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Tanggal Bayar</span>
            <span className={styles.colon}>:</span>
            <span className={styles.value}>{pemesanan.waktu_bayar ? new Date(pemesanan.waktu_bayar).toLocaleDateString() : '-'}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Jam Bayar</span>
            <span className={styles.colon}>:</span>
            <span className={styles.value}>{pemesanan.waktu_bayar ? new Date(pemesanan.waktu_bayar).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Metode Pembayaran</span>
            <span className={styles.colon}>:</span>
            <span className={styles.value}>{pemesanan.metode_pembayaran || '-'}</span>
          </div>

          <div className={`${styles.row} ${styles.statusRow}`}>
            <span className={styles.label}>Status Pembayaran</span>
            <span className={styles.colon}>:</span>
            <span className={`${styles.statusText} ${isPaid ? styles.paid : styles.unpaid}`}>
              {formatStatusPembayaran(pemesanan.status_pembayaran)}
            </span>
          </div>

          {/* =============== INFO ADMIN =============== */}
          {hasAdmin && (
            <div className={styles.adminSection}>
              <div className={styles.adminHeader}>
                <i className="fas fa-user-tie"></i>
                <span>Dikonfirmasi Oleh</span>
              </div>
              <div className={styles.adminInfo}>
                <div className={styles.adminBadge}>
                  <span className={styles.adminLabel}>Admin:</span>
                  <span className={styles.adminName}>
                    {formatAdminName(pemesanan.email_admin)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.separator}></div>

        {/* ================= INFO RESERVASI (OPSIONAL) ================= */}
        {pemesanan.reservasi && (
          <>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Informasi Reservasi</h3>
            </div>

            <div className={styles.info}>
              <div className={styles.row}>
                <span className={styles.label}>Tanggal Reservasi</span>
                <span className={styles.colon}>:</span>
                <span className={styles.value}>
                  {new Date(pemesanan.reservasi.tanggal_reservasi).toLocaleDateString('id-ID')}
                </span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Jam Reservasi</span>
                <span className={styles.colon}>:</span>
                <span className={styles.value}>{pemesanan.reservasi.jam_reservasi}</span>
              </div>
            </div>
            <div className={styles.separator}></div>
          </>
        )}

        {/* ================= TABEL MENU ================= */}
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Detail Pesanan</h3>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Menu</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {pemesanan.detail_menu?.map((item, idx) => (
              <tr key={idx}>
                <td>{item.nama_menu}</td>
                <td>{item.jumlah}</td>
                <td>Rp {item.subtotal.toLocaleString()}</td>
                <td>{item.catatan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.separator}></div>

        {/* ================= TOTAL ================= */}
        <div className={styles.totalSection}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total:</span>
            <span className={styles.totalValue}>Rp {pemesanan.total_harga.toLocaleString()}</span>
          </div>
          <div className={styles.totalNote}>
            Terima kasih telah berkunjung ke Basecamp Kopi!
          </div>
        </div>
      </div>

      {/* ================= AKSI ================= */}
      <div className={styles.actions}>
        <button 
          className={styles.actionBtn} 
          onClick={() => navigate(`/tambah-feedback/${id_pemesanan}`)}
        >
          <i className="fas fa-comment-alt"></i> Tambah Feedback
        </button>
      </div>

      <FooterPagePelanggan />
    </div>
  );
};

export default Struk;