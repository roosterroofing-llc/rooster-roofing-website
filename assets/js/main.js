// ================================
// Rooster Roofing - Main Scripts
// ================================

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggleBtn && mobileMenu) {
    // Ensure initial state
    mobileMenu.classList.add(
      "transition-all", 
      "duration-300", 
      "ease-in-out", 
      "opacity-0", 
      "max-h-0", 
      "overflow-hidden"
    );

    toggleBtn.addEventListener("click", () => {
      const isClosed = mobileMenu.classList.contains("max-h-0");

      if (isClosed) {
        // Open animation
        mobileMenu.classList.remove("opacity-0", "max-h-0");
        mobileMenu.classList.add("opacity-100", "max-h-screen");
        toggleBtn.setAttribute("aria-expanded", "true");
      } else {
        // Close animation
        mobileMenu.classList.remove("opacity-100", "max-h-screen");
        mobileMenu.classList.add("opacity-0", "max-h-0");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
});
