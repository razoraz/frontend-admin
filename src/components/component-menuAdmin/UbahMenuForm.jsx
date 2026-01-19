// Komponen Form Ubah Menu
// Import Library
import { Link } from 'react-router-dom';

// Import Style
import styles from '../../styles/ubah_menu.module.css';

// Main Function UbahMenuForm
function UbahMenuForm({ menu, setMenu, kategoriList, setGambarBaru, onSubmit }) {
  const handleChange = (e) => setMenu({ ...menu, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setGambarBaru(e.target.files[0]);

  return (
    <form className={styles.menuForm} onSubmit={onSubmit}>
      {/* Tombol Kembali */}
      <Link to="/menu" className={styles.btnBack}>
        <i className="fas fa-arrow-left"></i> Kembali
      </Link>
      {/* Form Group */}
      {/* Nama Menu */}
      <div className={styles.formGroup}>
        <label htmlFor="nama_menu">Nama Menu</label>
        <input type="text" id="nama_menu" name="nama_menu" value={menu.nama_menu} onChange={handleChange} />
      </div>
      {/* Kategori Menu */}
      <div className={styles.formGroup}>
        <label htmlFor="id_kategori">Kategori Menu</label>
        <select id="id_kategori" name="id_kategori" value={menu.id_kategori} onChange={handleChange}>
          <option value="">-- Pilih Kategori --</option>
          {kategoriList.map((kat) => (
            <option key={kat.id_kategori} value={kat.id_kategori}>
              {kat.nama_kategori}
            </option>
          ))}
        </select>
      </div>
      {/* Status Menu */}
      <div className={styles.formGroup}>
        <label htmlFor="status_tersedia">Status Menu</label>
        <select id="status_tersedia" name="status_tersedia" value={menu.status_tersedia} onChange={handleChange}>
          <option value="">-- Pilih Status --</option>
          <option value="tersedia">Tersedia</option>
          <option value="habis">Habis</option>
        </select>
      </div>
      {/* Harga Menu */}
      <div className={styles.formGroup}>
        <label htmlFor="harga">Harga</label>
        <input
          type="number"
          id="harga"
          name="harga"
          value={menu.harga}
          onKeyDown={(e) => {
            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
              e.preventDefault();
            }
          }}
          onChange={handleChange}
          min="0"
        />
      </div>
      {/* Gambar Menu */}
      <div className={styles.formGroup}>
        <label htmlFor="gambar_menu">Gambar Menu</label>
        <input type="file" id="gambar_menu" placeholder="Masukkan gambar menu dengan format .jpg, .jpeg, .png" accept="image/*" onChange={handleFileChange} />
        {menu.gambar_menu && (
          <div className={styles.currentImage}>
            Gambar saat ini: <span className={styles.filename}>{menu.gambar_menu}</span>
          </div>
        )}
      </div>
      {/* Deskripsi Menu */}
      <div className={styles.formGroup}>
        <label htmlFor="deskripsi">Deskripsi</label>
        <textarea id="deskripsi" name="deskripsi" value={menu.deskripsi} onChange={handleChange}></textarea>
      </div>
      {/* Tombol Simpan */}
      <div className={styles.formButtons}>
        <button type="submit" className={styles.btnSubmit}>
          <i className="fas fa-save"></i> Simpan
        </button>
      </div>
    </form>
  );
}

export default UbahMenuForm;
