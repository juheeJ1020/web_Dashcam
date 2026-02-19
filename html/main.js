// main.js
// Simple interactions for IAM landing page:
// - Navbar shadow on scroll
// - Animated architecture SVG lines (class-based, CSS keyframes)
// - Auto-scrolling client logo carousel

document.addEventListener("DOMContentLoaded", function () {
  const navPill = document.querySelector(".nav-pill");
  const clientsStrip = document.querySelector(".clients-strip");
  const clientsTrack = document.querySelector(".clients-track");

  /* ================================
     Navbar scroll shadow effect
     ================================ */
  function handleScroll() {
    if (!navPill) return;
    if (window.scrollY > 8) {
      navPill.classList.add("nav-shadow");
    } else {
      navPill.classList.remove("nav-shadow");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ================================
     Smooth scroll for anchor links
     ================================ */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  /* ================================
     Auto-scrolling client logo carousel
     ================================ */
  if (clientsStrip && clientsTrack) {
    // Duplicate content for seamless loop
    clientsTrack.innerHTML += clientsTrack.innerHTML;

    let scrollPos = 0;
    const speed = 0.4; // pixels per frame

    function step() {
      scrollPos += speed;
      if (scrollPos >= clientsTrack.scrollWidth / 2) {
        scrollPos = 0;
      }
      clientsStrip.scrollLeft = scrollPos;
      requestAnimationFrame(step);
    }

    // Pause on hover
    let isPaused = false;
    clientsStrip.addEventListener("mouseenter", () => {
      isPaused = true;
    });
    clientsStrip.addEventListener("mouseleave", () => {
      isPaused = false;
      requestAnimationFrame(step);
    });

    (function loop() {
      if (!isPaused) {
        step();
      } else {
        requestAnimationFrame(loop);
      }
    })();
  }
});

