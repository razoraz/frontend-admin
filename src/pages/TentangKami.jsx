import React from 'react';
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPage from '../components/component-html/FooterPage';
import styles from '../styles/tentang_kami.module.css';

function TentangKamiPage() {
  return (
    <div>
      <HeaderPagePelanggan title="Tentang Kami - Basecamp Kopi" subtitle="Tempat terbaik menikmati kopi dan suasana nyaman di Jember." />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Selamat Datang di Basecamp Kopi</h1>
          <p>Tempat terbaik menikmati kopi dan suasana nyaman di Jember.</p>
        </div>
      </section>

      <section className={styles.about}>
        <div className={styles.container}>
          <h2>Tentang Kami</h2>
          <p>
            Basecamp Kopi berdiri sejak tahun 2020 dengan misi memberikan pengalaman kopi terbaik 
            bagi setiap pelanggan. Kami percaya bahwa kopi bukan hanya tentang rasa, tapi juga tentang suasana, komunitas, dan momen berharga.
          </p>

          <h3>Visi Kami</h3>
          <p>Menciptakan tempat nongkrong nyaman yang menyatukan pecinta kopi dan komunitas lokal.</p>

          <h3>Misi Kami</h3>
          <ul>
            <li>Menyajikan kopi berkualitas dengan bahan pilihan.</li>
            <li>Menciptakan lingkungan yang nyaman dan ramah bagi semua pelanggan.</li>
            <li>Mendukung komunitas lokal melalui berbagai event dan kolaborasi.</li>
          </ul>

          <h3>Tim Kami</h3>
          <div className={styles.team}>
            <div className={styles.member}>
              <img src="/images/founder.jpg" alt="Founder" />
              <h4>Veri Ramadhan</h4>
              <p>Founder & Barista</p>
            </div>
            <div className={styles.member}>
              <img src="/images/manager.jpg" alt="Manager" />
              <h4>Alice Wijaya</h4>
              <p>Manager Operasional</p>
            </div>
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  );
}

export default TentangKamiPage;
