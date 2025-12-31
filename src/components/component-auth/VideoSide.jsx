// Import Style
import styles from '../../styles/login.module.css';

// Main Function VideoSide
function VideoSide() {
  return (
    <div className={styles.videoSide}>
      <video autoPlay muted loop className={styles.previewVideo}>
        <source src="/background_video/kopi_video.mp4" type="video/mp4" />
        Browser kamu tidak mendukung video.
      </video>
    </div>
  );
}

export default VideoSide;
