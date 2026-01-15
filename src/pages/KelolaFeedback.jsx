import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTable, usePagination } from 'react-table';
import axios from 'axios';

import styles from '../styles/feedback.module.css';

import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import useBlockBack from '../hooks/BlockBack';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

function KelolaFeedback() {
  useBlockBack();

  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState({
    isOpen: false,
    type: '',
    title: '',
    message: '',
    onConfirm: null,
  });

  // ================= FETCH DATA =================
  useEffect(() => {
    document.title = 'Kelola Feedback - Basecamp Kopi';

    axios
      .get('https://backend-production-8cf7.up.railway.app/api/feedback')
      .then((res) => {
        setFeedbackList(res.data.data);
        setFilteredData(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(feedbackList);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = feedbackList.filter((item) => {
      return (
        (item.email && item.email.toLowerCase().includes(term)) ||
        (item.feedback && item.feedback.toLowerCase().includes(term)) ||
        (item.rating && item.rating.toString().includes(term)) ||
        (item.tanggal_feedback && item.tanggal_feedback.includes(term))
      );
    });

    setFilteredData(filtered);
  }, [searchTerm, feedbackList]);

  // ================= DELETE =================
  const handleDelete = useCallback(
    (id_feedback) => {
      setModal({
        isOpen: true,
        type: 'question',
        title: 'Hapus Feedback',
        message: 'Apakah nda yakin ingin menghapus data feedback ini?',
        onConfirm: async () => {
          try {
            await axios.delete(`https://backend-production-8cf7.up.railway.app/api/feedback/${id_feedback}`);

            const updated = feedbackList.filter((item) => item.id_feedback !== id_feedback);
            setFeedbackList(updated);
            setFilteredData(updated);

            setModal({
              isOpen: true,
              type: 'success',
              title: 'Berhasil Dihapus',
              message: 'Data feedback berhasil dihapus.',
              onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
            });
          } catch (err) {
            console.error(err);
            setModal({
              isOpen: true,
              type: 'error',
              title: 'Gagal!',
              message: 'Terjadi kesalahan saat menghapus feedback.',
              onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
            });
          }
        },
      });
    },
    [feedbackList]
  );

  // ================= COLUMNS =================
  const columns = useMemo(
    () => [
      {
        Header: 'No',
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: 'Tanggal',
        accessor: (row) => new Date(row.tanggal_feedback).toLocaleDateString('id-ID'),
      },
      {
        Header: 'Gambar',
        Cell: ({ row }) => (row.original.gambar_feedback ? <img src={row.original.gambar_feedback} alt="Feedback" width="50" height="50" style={{ borderRadius: 8, objectFit: 'cover' }} /> : '—'),
      },

      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Feedback',
        accessor: 'feedback',
      },
      {
        Header: 'Rating',
        accessor: 'rating',
      },
      {
        Header: 'Aksi',
        Cell: ({ row }) => (
          <button className={styles.deleteBtn} onClick={() => handleDelete(row.original.id_feedback)}>
            <i className="fas fa-trash"></i> Hapus
          </button>
        ),
      },
    ],
    [handleDelete]
  );

  // ================= TABLE =================
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex, pageSize },
    setPageSize,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageSize: 10 },
    },
    usePagination
  );

  return (
    <div>
      <HeaderPage title="FEEDBACK" />

      <main className={styles.container}>
        <h2 className={styles.sectionTitle}>💬 Daftar Feedback</h2>
        <div className={styles.decorativeLine2}></div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <i className={`fas fa-search ${styles.searchIcon}`}></i>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari berdasarkan email, tanggal, feedback, rating" className={styles.searchInput} />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className={styles.clearSearchBtn}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <div className={styles.searchInfo}>
            <span>
              Menampilkan {filteredData.length} dari {feedbackList.length} feedback
              {searchTerm && ` untuk "${searchTerm}"`}
            </span>
          </div>
        </div>

        {/* TABLE */}
        <div className={styles.tableContainer}>
          <table {...getTableProps()} className={styles.feedbackTable}>
            <thead>
              {headerGroups.map((hg) => (
                <tr {...hg.getHeaderGroupProps()}>
                  {hg.headers.map((col) => (
                    <th {...col.getHeaderProps()}>{col.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {page.length > 0 ? (
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className={styles.noData}>
                    Tidak ada feedback
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className={styles.pagination}>
          <button onClick={previousPage} disabled={!canPreviousPage}>
            Prev
          </button>
          <span>Page {pageIndex + 1}</span>
          <button onClick={nextPage} disabled={!canNextPage}>
            Next
          </button>

          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            {[5, 10, 25].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </main>

      <FooterPage />

      <Modal isOpen={modal.isOpen} type={modal.type} title={modal.title} message={modal.message} confirmLabel='Hapus' cancelLabel='Batal' onConfirm={modal.onConfirm} onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))} />
    </div>
  );
}

export default KelolaFeedback;
