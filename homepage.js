// Daily Aquarian - JavaScript Functionality

document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for anchor links
  initializeSmoothScrolling();

  // Hero carousel functionality
  initializeHeroCarousel();

  // Scroll animations
  initializeScrollAnimations();

  // Newsletter form handling
  initializeNewsletterForm();

  // Mobile navigation enhancements
  initializeMobileNavigation();

  // Performance optimizations
  initializePerformanceOptimizations();
});

// Smooth scrolling for internal links
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Hero section carousel functionality
function initializeHeroCarousel() {
  const slides = document.querySelectorAll(".highlight-slide");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  const slideInterval = 4000; // 4 seconds

  if (slides.length === 0) return;

  // Function to show a specific slide
  function showSlide(index) {
    // Hide all slides
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Show current slide
    slides[index].classList.add("active");
    dots[index].classList.add("active");

    currentSlide = index;
  }

  // Function to go to next slide
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  // Add click handlers to dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      // Restart auto-advance timer
      clearInterval(carouselTimer);
      carouselTimer = setInterval(nextSlide, slideInterval);
    });
  });

  // Auto-advance slides
  let carouselTimer = setInterval(nextSlide, slideInterval);

  // Pause on hover
  const carouselContainer = document.querySelector(".highlights-carousel");
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", () => {
      clearInterval(carouselTimer);
    });

    carouselContainer.addEventListener("mouseleave", () => {
      carouselTimer = setInterval(nextSlide, slideInterval);
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      const prev = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
      showSlide(prev);
      clearInterval(carouselTimer);
      carouselTimer = setInterval(nextSlide, slideInterval);
    } else if (e.key === "ArrowRight") {
      nextSlide();
      clearInterval(carouselTimer);
      carouselTimer = setInterval(nextSlide, slideInterval);
    }
  });
}

// Scroll animations using Intersection Observer
function initializeScrollAnimations() {
  // Create intersection observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate");
      }
    });
  }, observerOptions);

  // Observe all elements with data-aos attributes
  document.querySelectorAll("[data-aos]").forEach((element) => {
    observer.observe(element);
  });

  // Hero content animation on load
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    // Trigger animation after a short delay
    setTimeout(() => {
      heroContent.style.opacity = "1";
      heroContent.style.transform = "translateY(0)";
    }, 300);
  }
}

// Newsletter form handling
function initializeNewsletterForm() {
  const newsletterForm = document.querySelector(".newsletter-form");
  const newsletterInput = document.querySelector(".newsletter-input");
  const newsletterBtn = document.querySelector(".newsletter-btn");

  if (!newsletterForm) return;

  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = newsletterInput.value.trim();

    // Basic email validation
    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Show loading state
    const originalBtnText = newsletterBtn.innerHTML;
    newsletterBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin me-2"></i>Subscribing...';
    newsletterBtn.disabled = true;

    // Simulate API call (replace with actual implementation)
    setTimeout(() => {
      // Reset button
      newsletterBtn.innerHTML = originalBtnText;
      newsletterBtn.disabled = false;

      // Clear input
      newsletterInput.value = "";

      // Show success message
      showNotification(
        "Thank you for subscribing! Check your email for confirmation.",
        "success"
      );
    }, 2000);
  });

  // Real-time email validation
  newsletterInput.addEventListener("input", function () {
    const email = this.value.trim();
    if (email && !isValidEmail(email)) {
      this.style.borderColor = "#e74c3c";
    } else {
      this.style.borderColor = "";
    }
  });
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".custom-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `custom-notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${
              type === "success"
                ? "check-circle"
                : type === "error"
                ? "exclamation-circle"
                : "info-circle"
            } me-2"></i>
            ${message}
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: ${
          type === "success"
            ? "#2ecc71"
            : type === "error"
            ? "#e74c3c"
            : "#3498db"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-family: var(--primary-font);
    `;

  // Add to page
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Mobile navigation enhancements
function initializeMobileNavigation() {
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!navbarToggler || !navbarCollapse) return;

  // Close mobile menu when clicking on nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse.classList.contains("show")) {
        navbarToggler.click();
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !navbarCollapse.contains(e.target) &&
      !navbarToggler.contains(e.target) &&
      navbarCollapse.classList.contains("show")
    ) {
      navbarToggler.click();
    }
  });

  // Handle escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navbarCollapse.classList.contains("show")) {
      navbarToggler.click();
    }
  });
}

// Performance optimizations
function initializePerformanceOptimizations() {
  // Lazy loading for images
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Preload critical resources
  const criticalResources = [
    "/images/hero-bg.jpg",
    "/images/morning-rituals.jpg",
  ];

  criticalResources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = resource;
    link.as = "image";
    document.head.appendChild(link);
  });

  // Optimize carousel performance
  const carousel = document.querySelector(".highlights-carousel");
  if (carousel) {
    // Use transform3d for hardware acceleration
    const slides = carousel.querySelectorAll(".highlight-slide");
    slides.forEach((slide) => {
      slide.style.willChange = "transform";
    });
  }
}

// Utility functions
const utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Format date for articles
  formatDate(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  },
};

// Error handling
window.addEventListener("error", function (e) {
  console.error("JavaScript error:", e.error);
  // Could send error to analytics service here
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled promise rejection:", e.reason);
  // Could send error to analytics service here
});

// Performance monitoring
if ("performance" in window) {
  window.addEventListener("load", function () {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);

      // Could send performance data to analytics service here
    }, 0);
  });
}

// Accessibility enhancements
function initializeAccessibility() {
  // Skip to main content link
  const skipLink = document.createElement("a");
  skipLink.href = "#main";
  skipLink.textContent = "Skip to main content";
  skipLink.className = "skip-link";
  skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--rich-umber);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;

  skipLink.addEventListener("focus", () => {
    skipLink.style.top = "6px";
  });

  skipLink.addEventListener("blur", () => {
    skipLink.style.top = "-40px";
  });

  document.body.insertBefore(skipLink, document.body.firstChild);

  // Announce page changes to screen readers
  const announcer = document.createElement("div");
  announcer.setAttribute("aria-live", "polite");
  announcer.setAttribute("aria-atomic", "true");
  announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
  document.body.appendChild(announcer);

  // Function to announce text to screen readers
  window.announceToScreenReader = function (text) {
    announcer.textContent = text;
    setTimeout(() => {
      announcer.textContent = "";
    }, 1000);
  };
}

// Initialize accessibility features
document.addEventListener("DOMContentLoaded", initializeAccessibility);

// Export utilities for potential module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { utils };
}
