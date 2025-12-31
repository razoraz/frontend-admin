// Component Modal Notifikasi
// Import Style
import '../../styles/modal.css';

// Main Function Modal
import { CheckCircle, XCircle, AlertTriangle, Info, HelpCircle } from 'lucide-react';

// Modal Notifikasi
const Modal = ({ isOpen, onClose, onConfirm, title, message, type, confirmLabel = 'Ya', cancelLabel = 'Tidak' }) => {
  if (!isOpen) return null;

  const getColor = () => {
    switch (type) {
      case 'success':
        return '#00ff88';
      case 'error':
        return '#ff0000';
      case 'warning':
        return '#ffcc00';
      case 'question':
        return '#3399ff';
      default:
        return '#ffffff';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle color={getColor()} size={26} />;
      case 'error':
        return <XCircle color={getColor()} size={26} />;
      case 'warning':
        return <AlertTriangle color={getColor()} size={26} />;
      case 'question':
        return <HelpCircle color={getColor()} size={26} />;
      default:
        return <Info color={getColor()} size={26} />;
    }
  };

  return (
    // Modal Overlay
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          {getIcon()}
          <h2 style={{ color: getColor(), margin: 0 }}>{title}</h2>
        </div>
        <p>{message}</p>
        {/* Modal Khusus Question */}
        {type === 'question' ? (
          <div className="modal-buttons">
            <button className="cancel-btn" onClick={onClose}>
              {cancelLabel}
            </button>
            <button className="confirm-btn" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        ) : (
          <button className="ok-btn" onClick={onClose}>
            Oke
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
