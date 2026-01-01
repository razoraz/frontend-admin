import styles from '../../styles/struk_print.module.css';

const StrukPrint = ({ pemesanan }) => {
  if (!pemesanan) return null;

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
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  return (
    <div id="strukContent" className={styles.strukPage}>
      {/* BRAND */}
      <div className={styles.strukBrand}>
        <h1 className={styles.strukTitle}>BASECAMP KOPI JEMBER</h1>

        <img src="/logo_kafe/Logo.PNG" className={`${styles.strukLogo} ${styles.logoColor}`} />
        <img src="/logo_kafe/Logo-hitam.png" className={`${styles.strukLogo} ${styles.logoBlack}`} />

        <p className={styles.strukBrandInfo}>Jl. Kaliurang No. 23, Jember</p>
        <p className={styles.strukBrandInfo}>Telp: 0812-3456-7890</p>
        <p className={styles.strukBrandInfo}>IG: @basecampkopi</p>
      </div>

      {/* INFO */}
      <div className={styles.strukInfo}>
        <div className={styles.strukRow}>
          <span className={styles.strukLabel}>Nama Pelanggan</span>
          <span className={styles.strukColon}>:</span>
          <span className={styles.strukValue}>{pemesanan.nama_pelanggan}</span>
        </div>

        <div className={styles.strukRow}>
          <span className={styles.strukLabel}>No Meja</span>
          <span className={styles.strukColon}>:</span>
          <span className={styles.strukValue}>{pemesanan.no_meja}</span>
        </div>

        <div className={styles.strukRow}>
          <span className={styles.strukLabel}>Tanggal Bayar</span>
          <span className={styles.strukColon}>:</span>
          <span className={styles.strukValue}>
            {pemesanan.waktu_bayar ? new Date(pemesanan.waktu_bayar).toLocaleDateString() : '-'}
          </span>
        </div>

        <div className={styles.strukRow}>
          <span className={styles.strukLabel}>Jam Bayar</span>
          <span className={styles.strukColon}>:</span>
          <span className={styles.strukValue}>
            {pemesanan.waktu_bayar
              ? new Date(pemesanan.waktu_bayar).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '-'}
          </span>
        </div>

        <div className={styles.strukRow}>
          <span className={styles.strukLabel}>Metode Pembayaran</span>
          <span className={styles.strukColon}>:</span>
          <span className={styles.strukValue}>{pemesanan.metode_pembayaran || '-'}</span>
        </div>

        <div className={`${styles.strukRow} ${styles.strukStatusRow}`}>
          <span className={styles.strukLabel}>Status Pembayaran</span>
          <span className={styles.strukColon}>:</span>
          <span className={`${styles.strukStatusText} ${isPaid ? styles.strukPaid : styles.strukUnpaid}`}>
            {formatStatusPembayaran(pemesanan.status_pembayaran)}
          </span>
        </div>

        {/* =============== INFO ADMIN =============== */}
        {hasAdmin && (
          <>
            <div className={styles.strukSeparator}></div>
            <div className={styles.strukAdminSection}>
              <div className={styles.strukAdminHeader}>
                <span className={styles.strukAdminTitle}>Dikonfirmasi Oleh</span>
              </div>
              <div className={styles.strukAdminInfo}>
                <div className={styles.strukAdminRow}>
                  <span className={styles.strukAdminLabel}>Admin:</span>
                  <span className={styles.strukAdminValue}>
                    {formatAdminName(pemesanan.email_admin)}
                  </span>
                </div>
                {pemesanan.kode_admin && (
                  <div className={styles.strukAdminRow}>
                    <span className={styles.strukAdminLabel}>Kode:</span>
                    <span className={styles.strukAdminCode}>{pemesanan.kode_admin}</span>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.strukSeparator}></div>
          </>
        )}
      </div>

      {/* RESERVASI */}
      {pemesanan.reservasi && (
        <>
          <div className={styles.strukSeparator}></div>
          <div className={styles.strukSectionTitle}>Informasi Reservasi</div>
          
          <div className={styles.strukInfo}>
            <div className={styles.strukRow}>
              <span className={styles.strukLabel}>Tanggal Reservasi</span>
              <span className={styles.strukColon}>:</span>
              <span className={styles.strukValue}>
                {new Date(pemesanan.reservasi.tanggal_reservasi).toLocaleDateString('id-ID')}
              </span>
            </div>

            <div className={styles.strukRow}>
              <span className={styles.strukLabel}>Jam Reservasi</span>
              <span className={styles.strukColon}>:</span>
              <span className={styles.strukValue}>{pemesanan.reservasi.jam_reservasi}</span>
            </div>
          </div>
          <div className={styles.strukSeparator}></div>
        </>
      )}

      {/* TABEL */}
      <div className={styles.strukSectionTitle}>Detail Pesanan</div>
      <table className={styles.strukTable}>
        <thead>
          <tr>
            <th>Menu</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>
          {pemesanan.detail_menu?.map((item, i) => (
            <tr key={i}>
              <td>{item.nama_menu}</td>
              <td>{item.jumlah}</td>
              <td>Rp {item.subtotal.toLocaleString()}</td>
              <td>{item.catatan || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.strukSeparator}></div>

      <div className={styles.strukTotal}>
        <strong>Total:</strong> Rp {pemesanan.total_harga.toLocaleString()}
      </div>

      {/* FOOTER */}
      <div className={styles.strukFooter}>
        Terima kasih telah berkunjung ke Basecamp Kopi!
      </div>
    </div>
  );
};

export default StrukPrint;