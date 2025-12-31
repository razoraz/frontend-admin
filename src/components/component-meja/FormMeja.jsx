// Komponen Kelola Meja - Form Meja
// Import Style
import styles from '../../styles/kelola_meja.module.css';

// Main Function FormMeja
function FormMeja({
  mejaInput,
  kapasitasInput,
  setMejaInput,
  setKapasitasInput,
  editingId,
  onSubmit,
  onCancel
}) {

  return (
    <div className={styles.formSide}>
      <h2 className={styles.title}>
        {editingId ? "Ubah Meja" : "Tambah Meja"}
      </h2>

      <img
        src="/logo_kafe/Logo.PNG"
        alt="Logo Basecamp Kopi"
        className={styles.logoForm}
      />

      <input
        type="number"
        placeholder="No Meja"
        value={mejaInput}
        onChange={(e) => setMejaInput(e.target.value)}
        className={styles.mejaInput}
      />

      <input
        type="number"
        placeholder="Kapasitas"
        value={kapasitasInput}
        onChange={(e) => setKapasitasInput(e.target.value)}
        className={styles.mejaInput}
      />

      <button onClick={onSubmit} className={styles.addBtn}>
        {editingId ? "Simpan Perubahan" : "Tambah Meja"}
      </button>

      {editingId && (
        <button onClick={onCancel} className={styles.backBtn}>
          Kembali
        </button>
      )}
    </div>
  );
}

export default FormMeja;
