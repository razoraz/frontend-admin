// Import Library
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import Style
import styles from '../../styles/login.module.css';

// Main Function LoginForm
function LoginForm({ error, setError, onSuccess, onError }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi Data Kosong
    if (!email || !password) {
      setError('Harap isi semua kolom');
      onError({
        title: 'Data Kosong',
        message: 'Data wajib diisi.',
        type: 'warning',
      });
      return;
    }

    try {
      const res = await fetch('https://backend-production-8cf7.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // Modal Error Login
      if (!res.ok) {
        setError(data.message || 'Login gagal');
        if (onError) {
          onError({
            title: 'Login Gagal',
            message: 'Periksa kembali email dan password anda.',
            type: 'error',
          });
        }
        return;
      }

      // Modal Success Login
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem(
        'adminData',
        JSON.stringify({
          id_admin: data.id_admin, // Sekarang sudah ada nilainya
          email: data.email, // Dari backend
          kode_admin: data.kode_admin, // Dari backend
        })
      );
      if (onSuccess) {
        onSuccess({
          title: 'Login Berhasil',
          message: 'Anda berhasil masuk. Selamat datang!',
          type: 'success',
        });
      }

      // redirect setelah modal tampil sebentar
      setTimeout(() => navigate('/beranda', { replace: true }), 1500);
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');

      if (onError) {
        onError({
          title: 'Server Error',
          message: 'Terjadi masalah pada server. Coba lagi nanti.',
          type: 'warning',
        });
      }
    }
  };

  return (
    <form id="login-form" onSubmit={handleSubmit} autoComplete="off">
      {error && <p className={styles.errorText}>{error}</p>}

      <div className={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan Email" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password">Password</label>
        <div className={styles.inputWrapper}>
          <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" />
          <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.togglePassword}`} onClick={() => setShowPassword(!showPassword)}></i>
        </div>
      </div>

      <div className={styles.actions}>
        <Link to="/forgot-password" className={styles.link}>
          <i className="ph ph-lock-keyhole"></i> Lupa Password?
        </Link>
      </div>

      <button type="submit" className={styles.loginButton}>
        <i className="ph ph-sign-in"></i> Login
      </button>
    </form>
  );
}

export default LoginForm;
