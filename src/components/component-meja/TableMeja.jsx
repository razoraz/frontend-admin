// Komponen Kelola Meja - Tabel Meja
// Import Library
import { QRCodeCanvas } from 'qrcode.react';

// Import Style
import styles from '../../styles/kelola_meja.module.css';

// Main Function TableMeja
function TableMeja({ currentItems, startIndex, handleEdit, handleDelete, handleDownloadQR, currentPage, totalPages, setCurrentPage, FRONTEND_URL }) {
  return (
    <div className={styles.listSide}>
      <h2 className={styles.title}>Daftar Meja</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.tableMeja}>
          <thead>
            <tr>
              <th>No</th>
              <th>No Meja</th>
              <th>Kapasitas</th>
              <th>Status</th>
              <th>QR</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyMessage}>
                  Belum ada data meja
                </td>
              </tr>
            ) : (
              currentItems.map((meja, index) => (
                <tr key={meja.id_meja}>
                  <td>{startIndex + index + 1}</td>
                  <td>{meja.nama}</td>
                  <td>{meja.kapasitas}</td>
                  <td>
                    <span className={`${styles.status} ${meja.status === 'tersedia' ? styles.available : styles.occupied}`}>{meja.status}</span>
                  </td>

                  <td>
                    <QRCodeCanvas id_meja={`qr-${meja.nama}`} value={`${FRONTEND_URL}/form-pemesanan?token=${meja.token}`} size={60} fgColor="#ffd700" bgColor="#1e1e1e" />
                  </td>

                  <td>
                    <div className={styles.mejaActions}>
                      <button className={styles.editBtn} onClick={() => handleEdit(meja)}>
                        Ubah
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(meja.id_meja)}>
                        Hapus
                      </button>
                      <button className={styles.downloadBtn} onClick={() => handleDownloadQR(meja.nama)}>
                        QR
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>

        <span className={styles.pageInfo}>
          {currentPage} / {totalPages}
        </span>

        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default TableMeja;
