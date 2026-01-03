// Import Library
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Component
import ProtectedRoute from './components/component-auth/ProtectRoute';

// Import Page Admin
import LoginPage from './pages/LoginAdmin';
import BerandaPage from './pages/BerandaAdmin';
import ForgotPasswordPage from './pages/LupaPassword';
import NewPasswordPage from './pages/PasswordBaru';
import MenuAdminPage from './pages/KelolaMenu';
import PemesananAdminPage from './pages/KelolaPemesanan';
import ReservasiAdminPage from './pages/KelolaReservasi';
import KelolaFeedback from './pages/KelolaFeedback';
import TambahMenu from './pages/TambahMenu';
import UbahMenu from './pages/UbahMenu';
import UbahPemesanan from './pages/UbahPemesanan';
import UbahReservasi from './pages/UbahReservasi';
import GrafikPemesanan from './pages/GrafikPemesanan';
import GrafikReservasi from './pages/GrafikReservasi';
import KelolaMeja from './pages/KelolaMeja';
import KelolaKategori from './pages/KelolaKategori';
import DetailPemesanan from './pages/DetailPemesanan';
import DetailReservasi from './pages/DetailReservasi';
import TambahFeedback from './pages/TambahFeedback';
import KelolaEvent from './pages/KelolaEvent';
import TambahEvent from './pages/TambahEvent';
import UbahEvent from './pages/UbahEvent';
import KelolaLaporan from './pages/KelolaLaporan';

// Import Page Pelanggan
import BerandaPelangganPage from './pages/BerandaPelanggan';
import Scanner from './pages/Scanner';
import FeedbackPage from './pages/Feedback';
import FormPemesanan from './pages/FormPemesanan';
import FormReservasi from './pages/FormReservasi';
import PemesananPelanggan from './pages/PemesananMenu';
import Keranjang from './pages/ManajemenKeranjang';
import KeranjangReservasi from './pages/ManajemenKeranjangReservasi';
import DaftarMenu from './pages/DaftarMenu';
import MetodePembayaran from './pages/MetodePembayaran';
import MenungguPembayaran from './pages/MenungguPembayaran';
import Struk from './pages/Struk';
import TentangKamiPage from './pages/TentangKami';

// Import Style Global
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Router Admin */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
        <Route
          path="/beranda"
          element={
            <ProtectedRoute>
              <BerandaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <MenuAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tambah-menu"
          element={
            <ProtectedRoute>
              <TambahMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ubah-menu/:id"
          element={
            <ProtectedRoute>
              <UbahMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pemesanan"
          element={
            <ProtectedRoute>
              <PemesananAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ubah-pemesanan/:id_pemesanan"
          element={
            <ProtectedRoute>
              <UbahPemesanan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grafik-pemesanan"
          element={
            <ProtectedRoute>
              <GrafikPemesanan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservasi"
          element={
            <ProtectedRoute>
              <ReservasiAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ubah-reservasi/:id_reservasi"
          element={
            <ProtectedRoute>
              <UbahReservasi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grafik-reservasi"
          element={
            <ProtectedRoute>
              <GrafikReservasi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <KelolaFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kelola-meja"
          element={
            <ProtectedRoute>
              <KelolaMeja />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kelola-kategori"
          element={
            <ProtectedRoute>
              <KelolaKategori />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-pemesanan/:id_pemesanan"
          element={
            <ProtectedRoute>
              <DetailPemesanan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-reservasi/:id_reservasi"
          element={
            <ProtectedRoute>
              <DetailReservasi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kelola-event"
          element={
            <ProtectedRoute>
              <KelolaEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kelola-laporan"
          element={
            <ProtectedRoute>
              <KelolaLaporan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tambah-event"
          element={
            <ProtectedRoute>
              <TambahEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ubah-event/:id_event"
          element={
            <ProtectedRoute>
              <UbahEvent />
            </ProtectedRoute>
          }
        />

        {/* Router Pelanggan */}
        <Route path="/beranda-pelanggan" element={<BerandaPelangganPage />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/feedback-pelanggan" element={<FeedbackPage />} />
        <Route path="/form-pemesanan" element={<FormPemesanan />} />
        <Route path="/form-reservasi" element={<FormReservasi />} />
        <Route path="/pemesanan-menu" element={<PemesananPelanggan />} />
        <Route path="/keranjang" element={<Keranjang />} />
        <Route path="/daftar-menu" element={<DaftarMenu />} />
        <Route path="/metode-pembayaran" element={<MetodePembayaran />} />
        <Route path="/menunggu-pembayaran/:id_pemesanan" element={<MenungguPembayaran />} />
        <Route path="/struk/pemesanan/:id_pemesanan" element={<Struk />} />
        <Route path="/struk/reservasi/:id_reservasi" element={<Struk />} />
        <Route path="/tambah-feedback/:id_pemesanan" element={<TambahFeedback />} />
        <Route path="/keranjang-reservasi" element={<KeranjangReservasi />} />
        <Route path="/tentang-kami" element={<TentangKamiPage />} />


      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
