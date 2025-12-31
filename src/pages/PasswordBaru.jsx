// Import Library
import { useState, useEffect } from 'react';
// Import Style
import styles from '../styles/password_baru.module.css';

// Import Component
import NewPasswordForm from '../components/component-auth/NewPasswordForm';
import Modal from '../components/modal-notifikasi/ModalNotifikasi';

// Main Function NewPasswordPage
function NewPasswordPage() {
  // Title Halaman
  useEffect(() => {
    document.title = 'Password Baru - Basecamp Kopi';
  }, []);
  // State modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '', type: '' });
  return (
    <div className={styles.centerWrapper}>
      <div className={styles.resetCard}>
        <div className={styles.resetHeader}>
          <img src="/logo_kafe/Logo.PNG" alt="Basecamp Logo" />
          <h2>Password Baru</h2>
          <p>Masukkan password baru anda dan konfirmasi kembali</p>
        </div>
        {/* Component NewPasswordForm */}
        <NewPasswordForm
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
  );
}

export default NewPasswordPage;
