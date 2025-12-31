// Import Library
import { useEffect } from "react";

// Main Function useFadeOnScroll
// Hook ini digunakan untuk membuat animasi fade in pada elemen-elemen tertentu ketika user melakukan scroll.
export default function useFadeOnScroll() {
  useEffect(() => {
    const sections = document.querySelectorAll(".fade-section");

    const handleScroll = () => {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && rect.bottom > 100) {
          section.classList.add("show");
          section.classList.remove("hide");
        } else {
          section.classList.remove("show");
          section.classList.add("hide");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}
