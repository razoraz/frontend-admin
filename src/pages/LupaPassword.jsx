// Import Style
import styles from '../styles/lupa_password.module.css';

// Import Component
import ForgotForm from '../components/component-auth/ForgotForm';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

// Import Library
import { useState, useEffect } from 'react';

// Main Function ForgotPage
function ForgotPage() {
  // Title Halaman
  useEffect(() => {
    document.title = 'Lupa Password - Basecamp Kopi';
  }, []);
  // State modal
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '', type: '' });

  return (
    <div className={styles.centerWrapper}>
      <div className={styles.forgotCard}>
        <div className={styles.forgotHeader}>
          <img src="/logo_kafe/Logo.PNG" alt="Basecamp Logo" />
          <h2>Lupa Password</h2>
          <p>Masukkan email dan kode untuk mereset password</p>
        </div>

        {/* ✅ Kirim props ke ForgotForm */}
        <ForgotForm
          setError={setError}
          error={error}
          onError={(data) => {
            setModalData(data);
            setModalOpen(true);
          }}
        />
      </div>

      {/* ✅ Modal untuk error */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalData.title} message={modalData.message} type={modalData.type} />
    </div>
  );
}

export default ForgotPage;
