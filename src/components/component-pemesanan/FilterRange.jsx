import { useState } from "react";
import styles from "../../styles/grafik.module.css";

function FilterRange({ onDataLoaded }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = () => {
    if (!start || !end) {
      alert("Tanggal mulai dan akhir harus diisi!");
      return;
    }
    onDataLoaded(start, end);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <label>Dari Tanggal:</label>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>

      <div className={styles.filterGroup}>
        <label>Sampai Tanggal:</label>
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>

      <button className={styles.filterBtn} onClick={handleSubmit}>
        Terapkan
      </button>
    </div>
  );
}

export default FilterRange;
