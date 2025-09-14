document.addEventListener("DOMContentLoaded", function() {
  // --- Mobile Menu Toggle ---
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // --- Priority+ Responsive Navigation ---
  const visibleLinksContainer = document.getElementById('visible-nav-links');
  const overflowContainer = document.getElementById('overflow-nav-container');
  const overflowMenu = document.getElementById('overflow-nav-menu');
  const overflowButton = document.getElementById('overflow-nav-button');
  const masterLinks = document.querySelectorAll('#master-nav-links a');
  const nav = document.querySelector('nav'); // fixed: target nav generally

  function updateResponsiveNav() {
    if (!nav || !visibleLinksContainer || !overflowContainer) return;

    const availableWidth = nav.offsetWidth;
    visibleLinksContainer.innerHTML = '';
    overflowMenu.innerHTML = '';
    overflowContainer.style.display = 'none';

    masterLinks.forEach(link => {
      visibleLinksContainer.appendChild(link.cloneNode(true));
    });

    let totalWidth = 0;
    const visibleLinks = Array.from(visibleLinksContainer.children);
    visibleLinks.forEach(link => {
      totalWidth += link.offsetWidth;
    });

    if (visibleLinks.length > 1) {
      totalWidth += (visibleLinks.length - 1) * 24;
    }

    if (totalWidth > availableWidth) {
      while (totalWidth > availableWidth && visibleLinksContainer.children.length > 0) {
        const lastLink = visibleLinksContainer.lastElementChild;
        const linkWidth = lastLink.offsetWidth + 24;

        const overflowLink = lastLink.cloneNode(true);
        overflowLink.className = 'block py-2 px-4 text-sm hover:text-primary-foreground hover:font-bold hover:bg-red-700 hover:text-lg transition-colors';

        overflowMenu.insertBefore(overflowLink, overflowMenu.firstChild);
        visibleLinksContainer.removeChild(lastLink);
        totalWidth -= linkWidth;
      }
      overflowContainer.style.display = 'block';
    }
  }

  if (overflowButton) {
    overflowButton.addEventListener('click', () => overflowMenu.classList.toggle('hidden'));
    overflowMenu.addEventListener('mouseleave', () => overflowMenu.classList.add('hidden'));
  }

  updateResponsiveNav();
  window.addEventListener('resize', updateResponsiveNav);

  // --- Location Detection and Selection ---
  const locationWidget = document.getElementById('location-widget');
  const locationDisplay = document.getElementById('location-display');
  const locationMenu = document.getElementById('location-menu');
  const locationList = document.getElementById('location-list');
  const locationArrow = document.getElementById('location-arrow');
  const inAreaMessage = document.getElementById('in-area-message');
  const outOfAreaMessage = document.getElementById('out-of-area-message');

  // Updated service area pages
  const serviceAreaPages = {
    "Manatee County": "manatee-county.html",
    "Sarasota County": "sarasota.html",
    "Bradenton Beach": "bradenton-beach.html",
    "Siesta Key": "siesta-key.html", // fixed broken quote
    "Holmes Beach": "holmes-beach.html",
    "Lakewood Ranch": "lakewood-ranch.html",
    "Anna Maria Island": "anna-maria-island.html",
    "Tampa": "tampa.html",
    "St. Petersburg": "st-petersburg.html",
    "Port Charlotte": "port-charlotte.html"
  };

  // Define the primary counties you serve
  const serviceCounties = ["Manatee", "Sarasota"];

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  function populateLocationMenu() {
    if (!locationList) return;
    locationList.innerHTML = ''; 
    for (const area in serviceAreaPages) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = serviceAreaPages[area];
      a.textContent = area;
      a.className = "block px-4 py-2 text-sm text-foreground hover:bg-muted";
      li.appendChild(a);
      locationList.appendChild(li);
    }
  }

  function showInAreaMessage() {
    if (inAreaMessage) {
      inAreaMessage.textContent = "(We serve your area!)";
    }
  }

  function showOutOfAreaMessage() {
    if (outOfAreaMessage) {
      outOfAreaMessage.textContent = "(Out of Service Area)";
    }
  }

  async function getLocation() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const city = data.city;
      const state = data.region_code;
      const county = data.county;

      locationDisplay.textContent = `${city || "Your Location"}, ${state || ""}`;

      // Check if the location is in one of the service counties or cities
      const inServiceCounty = serviceCounties.some(c => county && county.includes(c));
      const inServiceCity = Object.keys(serviceAreaPages).some(area => city && city.includes(area));

      if (inServiceCounty || inServiceCity) {
        showInAreaMessage();
      } else {
        showOutOfAreaMessage();
      }

    } catch (error) {
      console.error("Error fetching location:", error);
      locationDisplay.textContent = "Select Location";
    } finally {
      if (locationWidget) {
        locationWidget.classList.remove('hidden');
      }
    }
  }

  async function handleLocationLogic() {
    const isLocationPage = Object.values(serviceAreaPages).includes(currentPage);

    if (currentPage === 'index.html' || currentPage === '') {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const detectedCity = data.city;
        const detectedState = data.region_code;
        const detectedCounty = data.county;

        let matchedPage = null;
        for (const area in serviceAreaPages) {
          if (detectedCity && detectedCity.includes(area)) {
            matchedPage = serviceAreaPages[area];
            break;
          }
        }

        if (matchedPage) {
          window.location.href = matchedPage;
        } else {
          locationDisplay.textContent = `${detectedCity || "Select Location"}, ${detectedState || ""}`;
          const inServiceCounty = serviceCounties.some(c => detectedCounty && detectedCounty.includes(c));
          if (inServiceCounty) {
            showInAreaMessage();
          } else {
            showOutOfAreaMessage();
          }
          locationWidget.classList.remove('hidden');
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        locationDisplay.textContent = "Select Location";
        locationWidget.classList.remove('hidden');
      }
    } else if (isLocationPage) {
      const pageTitle = document.title.split(' ')[0].replace('-', ' ');
      locationDisplay.textContent = `${pageTitle}, FL`;
      showInAreaMessage();
      locationWidget.classList.remove('hidden');
    } else {
      getLocation();
    }
  }

  if (locationWidget) {
    populateLocationMenu();
    handleLocationLogic();

    if (locationArrow) {
      locationArrow.addEventListener('click', (event) => {
        event.stopPropagation();
        if (locationMenu) {
          locationMenu.classList.toggle('hidden');
        }
      });
    }

    document.addEventListener('click', function(event) {
      if (locationWidget && !locationWidget.contains(event.target)) {
        if (locationMenu) {
          locationMenu.classList.add('hidden');
        }
      }
    });
  }

  // --- Interactive Map Logic ---
  const mapLinks = document.querySelectorAll('.map-link');
  const serviceAreaMap = document.getElementById('service-area-map');

  if (mapLinks && serviceAreaMap) {

    // Helper function to validate URL (same origin and relative paths only, or HTTPS images/maps)
    function isSafeMapSrc(src) {
      // Only allow relative URLs or absolute URLs with HTTPS protocol and same origin
      try {
        const url = new URL(src, window.location.origin);
        // Allow only same origin or relative resource
        if (
          url.origin === window.location.origin ||
          (url.protocol === 'https:' && url.hostname === window.location.hostname)
        ) {
          return true;
        }
      } catch (e) {
        // If constructing URL fails, treat as unsafe
        return false;
      }
      return false;
    }

    mapLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        const newSrc = this.getAttribute('data-src');
        if (newSrc && isSafeMapSrc(newSrc)) {
          serviceAreaMap.src = newSrc;
        } else {
          console.warn("Blocked unsafe src value for serviceAreaMap:", newSrc);
        }
      });
    });
  }

  // --- Gorilla Roof Leads Widget ---
  function triggerWidget() {
    const button = document.querySelector(".es-roof-calc-widget button");
    if (button) {
      button.click();
    } else {
      console.warn("Roof quote button not found, retrying...");
      setTimeout(triggerWidget, 500);
    }
  }
  if (document.querySelector(".es-roof-calc-widget")) {
    setTimeout(triggerWidget, 1000);
  }

  // --- Gallery Auto-Slide ---
  const sliders = document.querySelectorAll('.c');
  const slideInterval = 5000;

  sliders.forEach(slider => {
    let intervalId;
    const sliderName = slider.querySelector('input[type="radio"]').name;
    const radioButtons = slider.querySelectorAll('input[name="' + sliderName + '"]');
    const totalSlides = radioButtons.length;
    let currentSlide = 0;

    const startAutoSlide = () => {
      intervalId = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        radioButtons[currentSlide].checked = true;
      }, slideInterval);
    };

    const stopAutoSlide = () => {
      clearInterval(intervalId);
    };

    startAutoSlide();

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    radioButtons.forEach(radio => {
      radio.addEventListener('click', () => {
        stopAutoSlide();
        currentSlide = Array.from(radioButtons).indexOf(radio);
        startAutoSlide();
      });
    });
  });

});

// --- Function to load external scripts ---
function loadScript(src, isAsync = true) {
  let script = document.createElement('script');
  script.src = src;
  script.async = isAsync;
  document.body.appendChild(script);
}

loadScript("https://widget.gorillaroofleads.com/index.js");
loadScript("https://static.elfsight.com/platform/platform.js");
