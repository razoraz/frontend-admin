// Komponen Kelola Kategori - Tabel Kategori
// Import Style
import styles from '../../styles/kelola_kategori.module.css';

// Main Function TableKategori
function TableKategori({ currentItems, startIndex, handleEdit, handleDelete, currentPage, totalPages, setCurrentPage }) {
  return (
    <div className={styles.listSide}>
      <h2 className={styles.title}>Daftar Kategori</h2>

      <table className={styles.tableKategori}>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Kategori</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="3" className={styles.emptyMessage}>
                Belum ada data Kategori
              </td>
            </tr>
          ) : (
            currentItems.map((kategori, index) => (
              <tr key={kategori.id_kategori}>
                <td>{startIndex + index + 1}</td>
                <td>{kategori.nama}</td>

                <td>
                  <div className={styles.kategoriActions}>
                    <button className={styles.editBtn} onClick={() => handleEdit(kategori)}>
                      Ubah
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(kategori.id_kategori)}>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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

export default TableKategori;
