// Import Library
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import html2pdf from 'html2pdf.js';
import StrukPrint from '../components/component-struk/StrukPrint';

// Import Style (CSS Module)
import styles from '../styles/reservasi.module.css';

// Import Component
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import useBlockBack from '../hooks/BlockBack';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

function formatIdReservasi(row, index, data) {
  const date = new Date(row.tanggal_dibuat);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const today = `${yyyy}${mm}${dd}`;

  const sameDayOrders = data.filter((item) => {
    const d = new Date(item.tanggal_dibuat);
    return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate();
  });

  sameDayOrders.sort((a, b) => a.id_reservasi - b.id_reservasi);
  const orderIndex = sameDayOrders.indexOf(row) + 1;
  const orderStr = String(orderIndex).padStart(4, '0');

  return `RSV${today}-${orderStr}`;
}

function KelolaReservasi() {
  const navigate = useNavigate();
  useBlockBack();

  const [selectedPemesanan, setSelectedPemesanan] = useState(null);

  const [dataReservasi, setReservasi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // =========================
  // STATE MODAL NOTIFIKASI
  // =========================
  const [modal, setModal] = useState({
    isOpen: false,
    type: '',
    title: '',
    message: '',
    onConfirm: null,
  });

  // Fetch data
  useEffect(() => {
    // Set page title
    document.title = 'Kelola Reservasi - Basecamp Kopi';
    // Fetch data
    axios
      .get('https://backend-production-8cf7.up.railway.app/api/reservasi/list-reservasi')
      .then((res) => {
        setReservasi(res.data);
        setFilteredData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  // Handle search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(dataReservasi);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = dataReservasi.filter((item) => {
      return (
        (item.id_reservasi && item.id_reservasi.toString().toLowerCase().includes(term)) ||
        (item.nama_pelanggan && item.nama_pelanggan.toLowerCase().includes(term)) ||
        (item.no_meja && item.no_meja.toString().toLowerCase().includes(term)) ||
        (item.total_harga && item.total_harga.toString().toLowerCase().includes(term)) ||
        (item.metode_pembayaran && item.metode_pembayaran.toLowerCase().includes(term)) ||
        (item.status_reservasi && getStatusReservasiText(item.status_reservasi).toLowerCase().includes(term)) ||
        (item.status_pembayaran && getStatusPembayaranText(item.status_pembayaran).toLowerCase().includes(term)) ||
        formatIdReservasi(item, 0, dataReservasi).toLowerCase().includes(term)
      );
    });

    setFilteredData(filtered);
  }, [searchTerm, dataReservasi]);

  // Helper functions for status text
  const getStatusReservasiText = (status) => {
    switch (status) {
      case 'menunggu_pembayaran':
        return 'Menunggu Pembayaran';
      case 'menunggu_konfirmasi':
        return 'Menunggu Konfirmasi';
      case 'dikonfirmasi':
        return 'Dikonfirmasi';
      case 'selesai':
        return 'Selesai';
      case 'dibatalkan':
        return 'Dibatalkan';
      default:
        return '-';
    }
  };

  const getStatusPembayaranText = (status) => {
    switch (status) {
      case 'belum_bayar':
        return 'Belum Bayar';
      case 'sudah_bayar':
        return 'Sudah Bayar';
      case 'dibatalkan':
        return 'Dibatalkan';
      default:
        return '-';
    }
  };

  // ======================================================
  // 🔥 HANDLE DELETE DENGAN MODAL QUESTION + SUCCESS
  // ======================================================
  // di dalam komponen KelolaReservasi
  const handleDelete = useCallback(
    (id_reservasi) => {
      setModal({
        isOpen: true,
        type: 'question',
        title: 'Hapus Reservasi',
        message: 'Apakah anda yakin ingin menghapus data reservasi ini?',
        onConfirm: async () => {
          try {
            await axios.delete(`https://backend-production-8cf7.up.railway.app/api/reservasi/delete-reservasi/${id_reservasi}`);

            setModal((prev) => ({ ...prev, isOpen: false }));
            setTimeout(() => {
              setModal({
                isOpen: true,
                type: 'success',
                title: 'Berhasil Dihapus',
                message: 'Data reservasi berhasil dihapus.',
                onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
              });
            }, 100);

            const updatedData = dataReservasi.filter((item) => item.id_reservasi !== id_reservasi);
            setReservasi(updatedData);
            setFilteredData(updatedData);
          } catch (err) {
            setModal({
              isOpen: true,
              type: 'error',
              title: 'Gagal!',
              message: 'Terjadi kesalahan saat menghapus reservasi.',
              onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
            });
            console.error(err);
          }
        },
      });
    },
    [dataReservasi],
  );

  const handleDownloadStruk = async (id_pemesanan) => {
    try {
      const res = await axios.get(`https://backend-production-8cf7.up.railway.app/api/pemesanan/detail/${id_pemesanan}`);

      setSelectedPemesanan(res.data);

      setTimeout(() => {
        html2pdf()
          .set({
            margin: 5,
            filename: `Struk-${res.data.nama_pelanggan}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: [80, 200], orientation: 'portrait' },
          })
          .from(document.getElementById('strukContent'))
          .save()
          .then(() => {
            document.body.classList.remove(styles.printMode);
          });
      }, 200);
    } catch (err) {
      console.error(err);
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Gagal',
        message: 'Gagal mengunduh struk.',
        onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };
  // Setup react-table
  const columns = useMemo(
    () => [
      { Header: 'Reservasi Order', accessor: (row, i) => formatIdReservasi(row, i, dataReservasi) },
      { Header: 'ID Reservasi', accessor: 'id_reservasi' },
      { Header: 'Nama Pelanggan', accessor: 'nama_pelanggan' },
      { Header: 'Nomor Meja', accessor: 'no_meja' },
      { Header: 'Total Harga', accessor: (row) => `Rp ${Number(row.total_harga).toLocaleString()}` },
      { Header: 'Metode Pembayaran', accessor: (row) => row.metode_pembayaran || '-' },
      {
        Header: 'Status Reservasi',
        Cell: ({ row }) => {
          const status = row.original.status_reservasi;
          return <span className={`${styles.statusChip} ${styles[`status-${status}`]}`}>{getStatusReservasiText(status)}</span>;
        },
      },
      {
        Header: 'Status Pembayaran',
        Cell: ({ row }) => {
          const status = row.original.status_pembayaran;
          return <span className={`${styles.statusChip} ${styles[`status-${status}`]}`}>{getStatusPembayaranText(status)}</span>;
        },
      },

      {
        Header: 'Aksi',
        accessor: 'aksi',
        Cell: ({ row }) => (
          <div className={styles.actionColumn}>
            <button className={styles.detailBtn} onClick={() => navigate(`/detail-reservasi/${row.original.id_reservasi}`)}>
              <i className="fas fa-file-alt"></i> Detail
            </button>
            <button className={styles.ubahBtn} onClick={() => navigate(`/ubah-reservasi/${row.original.id_reservasi}`)}>
              <i className="fas fa-edit"></i> Ubah
            </button>
            <button className={styles.deleteBtn} onClick={() => handleDelete(row.original.id_reservasi)}>
              <i className="fas fa-trash"></i> Hapus
            </button>
            <button className={styles.downloadBtn} onClick={() => handleDownloadStruk(row.original.id_pemesanan)}>
              <i className="fas fa-file-pdf"></i> Struk
            </button>
          </div>
        ),
      },
    ],
    [dataReservasi, navigate, handleDelete],
  );
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
    usePagination,
  );

  return (
    <div>
      <HeaderPage title="RESERVASI" />
      <main className={styles.container}>
        <div className={styles.actionBar}>
          <button className={styles.grafikBtn} onClick={() => navigate('/grafik-reservasi')}>
            <i className="fas fa-chart-bar"></i> Lihat Grafik Reservasi
          </button>
        </div>

        <h2 className={styles.sectionTitle}>🛍️ Daftar Reservasi</h2>
        <div className={styles.decorativeLine2}></div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <i className={`fas fa-search ${styles.searchIcon}`}></i>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari berdasarkan ID, nama, meja, status..." className={styles.searchInput} />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className={styles.clearSearchBtn}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <div className={styles.searchInfo}>
            <span>
              Menampilkan {filteredData.length} dari {dataReservasi.length} reservasi
              {searchTerm && ` untuk "${searchTerm}"`}
            </span>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => {
                const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
                return (
                  <tr key={key} {...restHeaderGroupProps}>
                    {headerGroup.headers.map((column) => {
                      const { key: columnKey, ...restColumnProps } = column.getHeaderProps();
                      return (
                        <th key={columnKey} {...restColumnProps}>
                          {column.render('Header')}
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.length > 0 ? (
                page.map((row) => {
                  prepareRow(row);
                  const { key: rowKey, ...restRowProps } = row.getRowProps();
                  return (
                    <tr key={rowKey} {...restRowProps}>
                      {row.cells.map((cell) => {
                        const { key: cellKey, ...restCellProps } = cell.getCellProps();
                        return (
                          <td key={cellKey} {...restCellProps}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className={styles.noData}>
                    <div className={styles.noDataContent}>
                      <i className="fas fa-search"></i>
                      <p>Tidak ada data reservasi yang ditemukan</p>
                      {searchTerm && (
                        <button className={styles.clearFilterBtn} onClick={() => setSearchTerm('')}>
                          Hapus pencarian
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredData.length > 0 && (
          <div className={styles.pagination}>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              <i className="fas fa-chevron-left"></i> Prev
            </button>
            <span>
              Page {pageIndex + 1} of {Math.ceil(filteredData.length / pageSize)}
            </span>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              Next <i className="fas fa-chevron-right"></i>
            </button>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </main>
      {selectedPemesanan && (
        <div style={{ display: 'none' }}>
          <StrukPrint pemesanan={selectedPemesanan} />
        </div>
      )}
      <FooterPage />

      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => modal.onConfirm && modal.onConfirm()}
      />
    </div>
  );
}

export default KelolaReservasi;
