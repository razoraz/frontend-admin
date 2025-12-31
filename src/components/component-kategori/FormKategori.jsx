// Komponen Kelola Kategori - Form Kategori
// Import Style
import styles from '../../styles/kelola_kategori.module.css';

// Main Function FormKategori
function FormKategori({
  kategoriInput,
  setKategoriInput,
  editingId,
  onSubmit,
  onCancel
}) {

  return (
    <div className={styles.formSide}>
      <h2 className={styles.title}>
        {editingId ? "Ubah Kategori" : "Tambah Kategori"}
      </h2>

      <img
        src="/logo_kafe/Logo.PNG"
        alt="Logo Basecamp Kopi"
        className={styles.logoForm}
      />

      <input
        type="text"
        placeholder="Nama Kategori"
        value={kategoriInput}
        onChange={(e) => setKategoriInput(e.target.value)}
        className={styles.kategoriInput}
      />

      <button onClick={onSubmit} className={styles.addBtn}>
        {editingId ? "Simpan Perubahan" : "Tambah Kategori"}
      </button>

      {editingId && (
        <button onClick={onCancel} className={styles.backBtn}>
          Kembali
        </button>
      )}
    </div>
  );
}

export default FormKategori;
