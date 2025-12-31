// import Library
import { useEffect } from "react";

// Main Function useBlockBack
// Hook ini ngeblok navigasi ke halaman React sebelumnya, bukan ke luar aplikasi. Jadi, user gak bisa pake tombol back di browser untuk navigasi ke halaman React sebelumnya. seperti halaman login, beranda, dsb.

export default function useBlockBack() {
  useEffect(() => {

    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
}
