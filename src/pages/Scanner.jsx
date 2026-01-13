// Import Library
import { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import jsQR from 'jsqr';

// Import Hooks & Komponen
import useBlockBack from '../hooks/BlockBack';
import useFadeOnScroll from '../hooks/FadeOnScrool';
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPage from '../components/component-html/FooterPagePelanggan';

// Import CSS
import styles from '../styles/scanner.module.css';

function ScannerPage() {
  useEffect(() => {
    document.title = 'Scanner - Basecamp Kopi';
  });
  useBlockBack();
  useFadeOnScroll();

  const [data, setData] = useState('Belum ada hasil scan');
  const [errorMsg, setErrorMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const previewStyle = {
    width: '100%',
    borderRadius: '16px',
  };

  const handleStart = () => {
    setIsScanning(true);
    setData('Memulai pemindaian...');
    setErrorMsg('');
  };

  const handleStop = () => {
    setIsScanning(false);
  };

  // 🖼️ Upload Gambar
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        setData(code.data);
        if (code.data.startsWith('http')) {
          window.location.href = code.data;
        }
      } else {
        setData('❌ QR Code tidak terdeteksi dalam gambar');
      }
    };
  };

  return (
    <div>
      <HeaderPagePelanggan title="PESAN LEBIH MUDAH TANPA ANTRE" subtitle="Cukup scan QR Code di mejamu dan nikmati sajian pilihan" bg_video="/background_video/navVideo5.mp4" />

      <section className={styles.scannerSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>📸 Pindai QR Code Pemesanan</h2>

          <div className={styles.cameraBox}>
            {isScanning ? (
              <div className={styles.cameraWrapper}>
                <QrReader
                  constraints={{ facingMode: 'environment' }}
                  onResult={(result, error) => {
                    if (result?.text) {
                      setData(result.text);
                      setIsScanning(false);
                      if (result.text.startsWith('http')) {
                        window.location.href = result.text;
                      }
                    }

                    if (error) {
                      console.warn('QR Reader Error:', error);
                      setErrorMsg('⚠️ Tidak dapat membaca QR. Pastikan kamera fokus dan pencahayaan cukup.');
                    }
                  }}
                  style={previewStyle}
                />
                {/* ✨ Garis Putih Scanner */}
                <div className={styles.scanLine}></div>
              </div>
            ) : (
              <p style={{ color: '#ccc', padding: '30px' }}>Kamera belum aktif. Tekan tombol “Mulai Scan” atau unggah gambar.</p>
            )}
          </div>

          {/* Tombol kontrol */}
          <div className={styles.buttonGroup}>
            {isScanning ? (
              <button onClick={handleStop} className={`${styles.btn} ${styles.btnStop}`}>
                🔴 Berhenti Scan
              </button>
            ) : (
              <button onClick={handleStart} className={`${styles.btn} ${styles.btnStart}`}>
                📷 Mulai Scan
              </button>
            )}

            <label htmlFor="file-upload" className={`${styles.btn} ${styles.btnUpload}`}>
              🖼️ Upload Gambar
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </div>

          {/* Hasil & Error */}
          <div className={styles.resultBox}>
            <h3>🔍 Hasil Scan:</h3>
            <p>{data}</p>
            {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</p>}
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  );
}

export default ScannerPage;
