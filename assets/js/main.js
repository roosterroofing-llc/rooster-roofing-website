// ================================
// Rooster Roofing - Main Scripts
// ================================

// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("hidden");

      if (isOpen) {
        mobileMenu.classList.remove("hidden");
        mobileMenu.classList.add("block");
        toggleBtn.setAttribute("aria-expanded", "true");
      } else {
        mobileMenu.classList.remove("block");
        mobileMenu.classList.add("hidden");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
});
