// Import Library
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Style
import styles from '../../styles/password_baru.module.css';

// Main Function NewPasswordForm
function NewPasswordForm({ onError, onSuccess }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // cek apakah resetToken ada
  useEffect(() => {
    const token = sessionStorage.getItem('resetToken');
    if (!token) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // tampilkan modal error
      onError?.({
        title: 'Perubahan Gagal',
        message: 'Pastikan anda mengetikan kata sandi yang sama di kedua kolom.',
        type: 'error',
      });
      return;
    }

    const resetToken = sessionStorage.getItem('resetToken');
    if (!resetToken) {
      onError?.({
        title: 'Token Tidak Valid',
        message: 'Token reset tidak ditemukan. Silakan ulangi proses lupa password.',
        type: 'error',
      });
      navigate('/forgot-password', { replace: true });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/reset-password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({ newPassword: password, confirmPassword, resetToken }),
      });

      const data = await res.json();

      if (data.success) {
        // tampilkan modal sukses
        onSuccess?.({
          title: 'Password Diperbarui',
          message: 'Password berhasil diubah. Silakan login kembali.',
          type: 'success',
        });

        // pindah halaman setelah 2 detik
        setTimeout(() => {
          sessionStorage.removeItem('resetToken');
          navigate('/login');
        }, 2000);
      } else {
        onError?.({
          title: 'Gagal Memperbarui Password',
          message: data.message || 'Terjadi kesalahan saat memperbarui password.',
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Error reset password:', err);
      onError?.({
        title: 'Kesalahan Server',
        message: 'Terjadi kesalahan pada server. Coba lagi nanti.',
        type: 'warning',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className={styles.inputGroup}>
        <label htmlFor="password">Password Baru</label>
        <div className={styles.inputWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            required
            placeholder="Masukkan password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.togglePassword}`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="confirm-password">Konfirmasi Password</label>
        <div className={styles.inputWrapper}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirm-password"
            required
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <i
            className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.togglePassword}`}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          ></i>
        </div>
      </div>

      <button type="submit" className={styles.resetButton} disabled={loading}>
        {loading ? (
          'Menyimpan...'
        ) : (
          <>
            <i className="ph ph-lock-keyhole"></i> Simpan Password
          </>
        )}
      </button>
    </form>
  );
}

export default NewPasswordForm;
