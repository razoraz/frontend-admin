import axios from 'axios';
import { useEffect } from 'react';
import styles from '../styles/kelola_laporan.module.css';
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';
import useBlockBack from '../hooks/BlockBack';

const ranges = [
  { label: 'Harian', value: 'hari' },
  { label: 'Mingguan', value: 'minggu' },
  { label: 'Bulanan', value: 'bulan' },
  { label: 'Tahunan', value: 'tahun' },
];

function LaporanPage() {
  useBlockBack();
  const downloadLaporan = async (tipe, range) => {
    try {
      const response = await axios.get(`https://backend-production-8cf7.up.railway.app/api/laporan/${tipe}/${range}`, {
        responseType: 'blob', // penting biar bisa download file
      });

      // Buat blob dan link untuk download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan_${tipe}_${range}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Gagal download laporan:', err);
      alert('Gagal download laporan!');
    }
  };
  useEffect(() => {
    document.title = 'Beranda Admin - Basecamp Kopi';
  }, []);

  return (
    <div>
      <HeaderPage title="KELOLA LAPORAN" />
      <div className={styles.container}>
        <section className={styles.section}>
          <h2>Laporan Pemesanan</h2>
          {ranges.map((r) => (
            <button key={`pemesanan-${r.value}`} className={styles.downloadBtn} onClick={() => downloadLaporan('pemesanan', r.value)}>
              Download {r.label}
            </button>
          ))}
        </section>

        <section className={styles.section}>
          <h2>Laporan Reservasi</h2>
          {ranges.map((range) => (
            <button key={`reservasi-${range}`} className={styles.downloadBtn} onClick={() => downloadLaporan('reservasi', range)}>
              Download {range}
            </button>
          ))}
        </section>
      </div>
      <FooterPage />
    </div>
  );
}

export default LaporanPage;
