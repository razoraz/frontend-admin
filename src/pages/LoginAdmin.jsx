// Import Library
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Style
import styles from '../styles/login.module.css';

// Import Component
import VideoSide from '../components/component-auth/VideoSide';
import LoginForm from '../components/component-auth/FormLogin';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

// Main Function LoginPage
function LoginPage() {
  // Title Halaman
  useEffect(() => {
    document.title = 'Login Admin - Basecamp Kopi';
  }, []);
  // State untuk mengelola error, modal, dan data modal
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '', type: '' });

  // Cek apakah user sudah login
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/beranda', { replace: true });
    }
  }, [navigate]);

  return (
    <div className={styles.centerWrapper}>
      <div class="floatingToy"></div>
      <div className={styles.loginCard}>
        {/* Component VideoSide */}
        <VideoSide />
        <div className={styles.formSide}>
          <div className={styles.loginHeader}>
            <img src="/logo_kafe/Logo.PNG" alt="Basecamp Logo" />
          </div>
          {/* Component LoginForm */}
          <LoginForm
            error={error}
            setError={setError}
            onSuccess={(data) => {
              setModalData(data);
              setModalOpen(true);
            }}
            onError={(data) => {
              setModalData(data);
              setModalOpen(true);
            }}
          />
          {/* Component Modal */}
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalData.title} message={modalData.message} type={modalData.type} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
