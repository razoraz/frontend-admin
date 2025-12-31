import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import styles from '../styles/grafik.module.css';
import HeaderPage from '../components/component-html/HeaderPage';
import FooterPage from '../components/component-html/FooterPage';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function GrafikPemesanan() {
  const [mode, setMode] = useState('harian');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];


  // HARlAN
  const [startDate, setStartDate] = useState('2025-12-01');
  const [endDate, setEndDate] = useState(today);

  // BULANAN
  const [year, setYear] = useState(2025);

  // Set page title
  useEffect(() => {
    document.title = 'Grafik Pemesanan - Basecamp Kopi';
  }, []);

  // ───────────────────────────────────────────
  // 🔥 FETCH DATA (safe version)
  // ───────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let url = '';

      if (mode === 'harian') {
        url = `https://backend-production-8cf7.up.railway.app/api/statistik/harian-pemesanan?start=${startDate}&end=${endDate}`;
      } else if (mode === 'bulanan') {
        url = `https://backend-production-8cf7.up.railway.app/api/statistik/bulanan-pemesanan?year=${year}`;
      } else {
        url = `https://backend-production-8cf7.up.railway.app/api/statistik/tahunan-pemesanan`;
      }

      const res = await axios.get(url);

      // Format label
      let labels = res.data.labels;

      // Buang "Txx:00:00.000Z" dari mode harian
      if (mode === 'harian') {
        labels = labels.map((tgl) => tgl.split('T')[0]);
      }

      // Format bulanan → Jan 2025
      if (mode === 'bulanan') {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        labels = labels.map((ym) => {
          const [yy, mm] = ym.split('-');
          return `${monthNames[parseInt(mm) - 1]} ${yy}`;
        });
      }

      setChartData({
        labels,
        datasets: [
          {
            label: 'Jumlah Pemesanan Selesai',
            data: res.data.values,
            backgroundColor: 'rgba(255, 215, 0, 0.6)',
            borderColor: '#FFD700',
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: 'rgba(255, 215, 0, 0.9)',
          },
        ],
      });
    } catch (err) {
      console.error('Gagal mengambil data grafik:', err);
    }
    setLoading(false);
  }, [mode, startDate, endDate, year]);

  // Auto load saat mode + tanggal berubah
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <HeaderPage title="GRAFIK PEMESANAN" />

      <main className={styles.container}>
        {/* SELECT MODE */}
        <div className={styles.filterBox}>
          <label>Pilih Grafik: </label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="harian">Harian</option>
            <option value="bulanan">Bulanan</option>
            <option value="tahunan">Tahunan</option>
          </select>
          <div className={styles.actionBar}>
            <button className={styles.tabelBtn} onClick={() => navigate('/pemesanan')}>
              <i className="fas fa-chart-bar"></i> Lihat Tabel Pemesanan
            </button>
          </div>
        </div>

        {/* Input Harian */}
        {mode === 'harian' && (
          <div className={styles.filterBox}>
            <div className={styles.filterGroup}>
              <label>Dari Tanggal:</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className={styles.filterGroup}>
              <label>Sampai Tanggal:</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        )}

        {/* Input Bulanan */}
        {mode === 'bulanan' && (
          <div className={styles.filterBox}>
            <label>Pilih Tahun:</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={2025 + i}>
                  {2025 + i}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading && <p className={styles.loading}>Memuat grafik...</p>}

        {chartData && (
          <div className={styles.chartWrapper}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: 'top' },
                  title: {
                    display: true,
                    text: mode === 'harian' ? 'Data Pemesanan Per Hari' : mode === 'bulanan' ? 'Data Pemesanan Per Bulan' : 'Data Pemesanan Per Tahun',
                    font: { size: 18 },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    suggestedMax: Math.max(...chartData.datasets[0].data) + 2,
                  },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        )}
      </main>

      <FooterPage />
    </>
  );
}

export default GrafikPemesanan;
