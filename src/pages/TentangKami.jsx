import { useEffect } from 'react';
import HeaderPagePelanggan from '../components/component-html/HeaderPagePelanggan';
import FooterPage from '../components/component-html/FooterPage';
import styles from '../styles/tentang_kami.module.css';
import { FaCoffee, FaHeart, FaUsers, FaAward, FaMugHot, FaLeaf } from 'react-icons/fa';

function TentangKamiPage() {
    useEffect(() => {
    document.title = 'Tentang Kami - Basecamp Kopi';
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={styles.pageWrapper}>
      <HeaderPagePelanggan 
        title="Tentang Basecamp Kopi" 
        subtitle="Lebih dari sekadar kopi, sebuah pengalaman yang menginspirasi." 
        bg_video="/background_video/navVideo.mp4"
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Kisah <span className={styles.highlight}>Rasa</span> yang <span className={styles.highlight}>Menginspirasi</span></h1>
          <p className={styles.heroSubtitle}>
            Di setiap cangkir, kami menyajikan cerita, dedikasi, dan cinta pada kopi terbaik Jember.
          </p>
        </div>
        <div className={styles.heroOverlay}></div>
      </section>

      {/* Philosophy Section */}
      <section className={styles.philosophy}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Filosofi <span className={styles.accent}>Kami</span></h2>
            <p className={styles.sectionSubtitle}>Tiga pilar yang menjadi fondasi setiap sajian kami</p>
          </div>
          
          <div className={styles.philosophyCards}>
            <div className={styles.philosophyCard}>
              <div className={styles.cardIcon}>
                <FaLeaf />
              </div>
              <h3>Keaslian Rasa</h3>
              <p>Kami menggunakan biji kopi pilihan langsung dari perkebunan lokal Jember, dipanggang dengan teknik tradisional untuk menjaga karakter asli setiap rasa.</p>
            </div>
            
            <div className={styles.philosophyCard}>
              <div className={styles.cardIcon}>
                <FaHeart />
              </div>
              <h3>Dibuat dengan Hati</h3>
              <p>Setiap cangkir dibuat dengan perhatian penuh, dari pemilihan biji hingga penyajian terakhir, karena kami percaya kopi terbaik dibuat dengan cinta.</p>
            </div>
            
            <div className={styles.philosophyCard}>
              <div className={styles.cardIcon}>
                <FaUsers />
              </div>
              <h3>Komunitas yang Hangat</h3>
              <p>Basecamp Kopi bukan hanya tempat minum kopi, tapi ruang di mana cerita dibagikan, ide berkembang, dan hubungan bermakna tercipta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className={styles.journey}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Perjalanan <span className={styles.accent}>Kami</span></h2>
          </div>
          
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>2020</div>
              <div className={styles.timelineContent}>
                <h3>Dimulai dengan Satu Mimpi</h3>
                <p>Basecamp Kopi lahir dari passion untuk menghadirkan kopi berkualitas dengan suasana yang nyaman di jantung Jember.</p>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>2022</div>
              <div className={styles.timelineContent}>
                <h3>Pengakuan Lokal</h3>
                <p>Mendapat penghargaan sebagai "Coffee Shop Terfavorit Jember" dari komunitas pecinta kopi lokal.</p>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>2024</div>
              <div className={styles.timelineContent}>
                <h3>Ekspansi dan Inovasi</h3>
                <p>Memperkenalkan konsep "Coffee Experience" dengan workshop dan coffee tasting reguler untuk masyarakat.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.values}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Nilai <span className={styles.accent}>Inti</span></h2>
          </div>
          
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <FaCoffee className={styles.valueIcon} />
              <h4>Kualitas Terbaik</h4>
              <p>Hanya bahan terpilih yang kami gunakan dalam setiap sajian</p>
            </div>
            
            <div className={styles.valueItem}>
              <FaMugHot className={styles.valueIcon} />
              <h4>Konsistensi Rasa</h4>
              <p>Standar penyajian yang sama di setiap kunjungan Anda</p>
            </div>
            
            <div className={styles.valueItem}>
              <FaHeart className={styles.valueIcon} />
              <h4>Pelayanan Ramah</h4>
              <p>Tim kami siap membuat pengalaman Anda tak terlupakan</p>
            </div>
            
            <div className={styles.valueItem}>
              <FaAward className={styles.valueIcon} />
              <h4>Inovasi Berkelanjutan</h4>
              <p>Selalu menghadirkan varian dan konsep baru</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Siap Menikmati Pengalaman Kopi yang Berbeda?</h2>
          <p className={styles.ctaText}>Kunjungi Basecamp Kopi hari ini dan temukan mengapa kami lebih dari sekadar coffee shop biasa.</p>
          <div className={styles.ctaButtons}>
            <a href="/menu" className={styles.primaryBtn}>Lihat Menu Kami</a>
            <a href="/lokasi" className={styles.secondaryBtn}>Lihat Lokasi</a>
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  );
}

export default TentangKamiPage;