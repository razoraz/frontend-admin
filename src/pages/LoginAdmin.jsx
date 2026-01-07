// Import Library
import { useState, useEffect, useRef } from 'react';
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
  const toyRef = useRef(null);
  const cardRef = useRef(null);

  // Cek apakah user sudah login
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/beranda', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const toy = toyRef.current;
    const card = cardRef.current;
    const wrapper = toy.parentElement;

    if (!toy || !card || !wrapper) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const getPos = (e) => (e.touches ? e.touches[0] : e);

    const onDown = (e) => {
      e.preventDefault();
      isDragging = true;
      toy.style.animation = 'none';

      const p = getPos(e);
      offsetX = p.clientX - toy.offsetLeft;
      offsetY = p.clientY - toy.offsetTop;
    };

    const onMove = (e) => {
      if (!isDragging) return;

      const p = getPos(e);
      const x = p.clientX - offsetX;
      const y = p.clientY - offsetY;

      velocityX = x - toy.offsetLeft;
      velocityY = y - toy.offsetTop;

      toy.style.left = x + 'px';
      toy.style.top = y + 'px';
    };

    const onUp = () => {
      if (!isDragging) return;
      isDragging = false;
      applyPhysics();
    };

    const applyPhysics = () => {
      const friction = 0.94;

      const animate = () => {
        velocityX *= friction;
        velocityY *= friction;

        let x = toy.offsetLeft + velocityX;
        let y = toy.offsetTop + velocityY;

        const maxX = wrapper.clientWidth - toy.clientWidth;
        const maxY = wrapper.clientHeight - toy.clientHeight;

        /* Pantul tembok */
        if (x <= 0 || x >= maxX) velocityX *= -0.9;
        if (y <= 0 || y >= maxY) velocityY *= -0.9;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        toy.style.left = x + 'px';
        toy.style.top = y + 'px';

        checkCollision();

        if (Math.abs(velocityX) > 0.4 || Math.abs(velocityY) > 0.4) {
          requestAnimationFrame(animate);
        } else {
          toy.style.animation = 'floatIdle 4s ease-in-out infinite';
        }
      };

      animate();
    };

    const checkCollision = () => {
      const toyRect = toy.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      if (toyRect.right > cardRect.left && toyRect.left < cardRect.right && toyRect.bottom > cardRect.top && toyRect.top < cardRect.bottom) {
        velocityX *= -1.2;
        velocityY *= -1.2;
      }
    };

    toy.addEventListener('mousedown', onDown);
    toy.addEventListener('touchstart', onDown);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });

    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    return () => {
      toy.removeEventListener('mousedown', onDown);
      toy.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return (
    <div className={styles.centerWrapper}>
      {/* 🧸 MAINAN */}
      <div ref={toyRef} className={styles.floatingToy}></div>
      {/* 🟨 LOGIN CARD */}
      <div ref={cardRef} className={styles.loginCard}>
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
