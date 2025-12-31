import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/lupa_password.module.css';

function ForgotForm({ onError, setError }) {
  const [email, setEmail] = useState('');
  const [kode_admin, setKode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulasi waktu loading 5 detik
    setTimeout(async () => {
      // Validasi input kosong
      if (!email || !kode_admin) {
        setError('Data wajib diisi');
        onError({
          title: 'Verifikasi Gagal',
          message: 'Data yang anda isi tidak sesuai. Silahkan periksa kembali.',
          type: 'error',
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('https://backend-production-8cf7.up.railway.app/api/auth/lupa-password/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, kode_admin }),
        });

        const data = await res.json();

        if (data.success && data.resetToken) {
          sessionStorage.setItem('resetToken', data.resetToken);
          navigate('/new-password');
        } else {
          onError({
            title: 'Verifikasi Gagal',
            message: 'Data yang anda isi tidak sesuai. Silahkan periksa kembali.',
            type: 'error',
          });
        }
      } catch (err) {
        console.error('Verification error:', err);
        onError({
          title: 'Kesalahan Server',
          message: 'Terjadi kesalahan pada server. Coba lagi nanti.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan email" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="kode">Kode Admin</label>
        <input type="text" id="kode" value={kode_admin} onChange={(e) => setKode(e.target.value)} placeholder="Masukkan kode admin" />
      </div>

      <button type="submit" className={styles.forgotButton} disabled={loading}>
        {loading ? (
          <>
            <i className={`ph ph-spinner ${styles.spinnerIcon}`}></i> Memverifikasi
          </>
        ) : (
          <>
            <i className="ph ph-check-circle"></i> Verifikasi
          </>
        )}
      </button>

      <div className={styles.actions}>
        <Link to="/login" className={styles.link}>
          <i className="ph ph-arrow-left"></i> Kembali Login
        </Link>
      </div>
    </form>
  );
}

export default ForgotForm;
