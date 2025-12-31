// Komponen Form Tambah Menu
// Import Library
import { Link } from 'react-router-dom';

// Import Style
import styles from '../../styles/tambah_menu.module.css';

// Main Function TambahMenuForm
function TambahMenuForm({ formData, setFormData, kategoriList, onSubmit }) {
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
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
        <input type="text" id="nama_menu" name="nama_menu" placeholder="Masukkan nama menu" value={formData.nama_menu} onChange={handleChange} />
      </div>
      {/* Kategori Menu */}
      <div className={styles.formGroup}>
        <label htmlFor="id_kategori">Kategori Menu</label>
        <select id="id_kategori" name="id_kategori" value={formData.id_kategori} onChange={handleChange}>
          <option value="">-- Pilih Kategori --</option>
          {kategoriList.map((item) => (
            <option key={item.id_kategori} value={item.id_kategori}>
              {item.nama_kategori}
            </option>
          ))}
        </select>
      </div>
      {/* Status Menu */}
      <div className={styles.formGroup}>
        <label htmlFor="status_tersedia">Status Menu</label>
        <select id="status_tersedia" name="status_tersedia" value={formData.status_tersedia} onChange={handleChange}>
          <option value="">-- Pilih Status --</option>
          <option value="tersedia">Tersedia</option>
          <option value="habis">Habis</option>
        </select>
      </div>

      {/* Harga */}
      <div className={styles.formGroup}>
        <label htmlFor="harga">Harga</label>
        <input
          type="number"
          id="harga"
          name="harga"
          value={formData.harga}
          onKeyDown={(e) => {
            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
              e.preventDefault();
            }
          }}
          onChange={handleChange}
          placeholder="Masukkan harga menu"
          min="0"
        />
      </div>

      {/* Gambar Menu */}
      <div className={styles.formGroup}>
        <label htmlFor="gambar_menu">Gambar Menu</label>
        <input type="file" id="gambar_menu" name="gambar_menu" accept="image/*" onChange={handleChange} />
      </div>

      {/* Deskripsi Menu */}
      <div className={styles.formGroup}>
        <label htmlFor="deskripsi">Deskripsi</label>
        <textarea id="deskripsi" name="deskripsi" value={formData.deskripsi} placeholder="Masukkan deskripsi menu" onChange={handleChange}></textarea>
      </div>

      {/* Tombol Tambah */}
      <div className={styles.formButtons}>
        <button type="submit" className={styles.btnSubmit}>
          <i className="fas fa-plus"></i> Tambahkan
        </button>
      </div>
    </form>
  );
}

export default TambahMenuForm;
