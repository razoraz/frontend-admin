// Import Library
import { Navigate } from 'react-router-dom';

// Main Function ProtectedRoute
// Cek apakah user sudah login dengan memeriksa token di sessionStorage. Jika belum tidak bisa memasuki halaman utama seperti beranda.
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
