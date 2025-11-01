document.addEventListener('DOMContentLoaded', function () {
  console.log('Alasrambus site loaded');

  // ===== Theme Toggle =====
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  // Enable smooth transition on theme change
  function enableThemeTransition() {
    html.style.transition = 'background-color 0.4s ease, color 0.4s ease';
    document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
    setTimeout(() => {
      html.style.transition = '';
      document.body.style.transition = '';
    }, 600);
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    enableThemeTransition();
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-sun';
    } else {
      themeIcon.className = 'fas fa-moon';
    }
  }

  // ===== Floating Navigation =====
  const nav = document.getElementById('navFloating');
  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
          if (currentScroll > lastScroll) {
            // Scrolling down
            nav.classList.remove('visible');
          } else {
            // Scrolling up
            nav.classList.add('visible');
          }
        } else {
          nav.classList.remove('visible');
        }

        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  });

  // ===== Smooth Scroll for Navigation Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // Account for fixed nav
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Mark hero parts visible on load to trigger CSS keyframes
  document.querySelectorAll('.hero-left, .hero-right').forEach(el => {
    requestAnimationFrame(() => el.classList.add('visible'));
  });

  // ===== Intersection Observer for Fade-in Animations =====
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for multiple elements
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
      }
    });
  }, observerOptions);

  // Observe all elements with fade-in-scroll class and stat items
  document.querySelectorAll('.fade-in-scroll, .stat-item').forEach(el => {
    observer.observe(el);
  });

  // ===== Email Subscription Form =====
  const subscribeForm = document.getElementById('subscribeForm');
  const emailInput = document.getElementById('emailInput');

  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = emailInput.value.trim();

      if (email && validateEmail(email)) {
        // Show success message
        showNotification('Thank you for subscribing! You\'ll hear from me soon.', 'success');
        emailInput.value = '';
      } else {
        showNotification('Please enter a valid email address.', 'error');
      }
    });
  }

  // ===== Email Validation =====
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // ===== Notification System =====
  function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Use CSS variables for colors
    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue('--primary') || '#00B3FF';
    const danger = '#e74c3c';

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? primary : danger};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Append to body
    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  }

  // ===== Parallax Effect for Hero Section =====
  const hero = document.querySelector('.hero');
  let parallaxTicking = false;

  if (hero) {
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const parallax = scrolled * 0.3;
          hero.style.transform = `translateY(${parallax}px)`;
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    });
  }

  // ===== Enhanced Project Card Interactions =====
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach((card, index) => {
    // Staggered entrance animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * index);
    
    // Add ripple effect on click
    card.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      const styles = getComputedStyle(document.documentElement);
      const primary = styles.getPropertyValue('--primary').trim() || '#00B3FF';
      ripple.style.cssText += `
        position: absolute;
        border-radius: 50%;
        background: ${primary}30;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
    
    // Add 3D tilt effect on mouse move
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.03)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  // Add ripple animation and shimmer effect
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
    
    .project-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s ease;
    }
    
    .project-card:hover::after {
      left: 100%;
    }
  `;
  document.head.appendChild(style);

  // ===== Smooth Gradient Blobs Animation =====
  const blobs = document.querySelectorAll('.gradient-blob');
  blobs.forEach((blob, index) => {
    let x = 0, y = 0;
    const speed = 0.5 + index * 0.2;
    
    function animateBlob() {
      x += Math.sin(Date.now() * 0.001 * speed) * 0.5;
      y += Math.cos(Date.now() * 0.001 * speed) * 0.5;
      
      blob.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(animateBlob);
    }
    
    animateBlob();
  });

  // ===== Enhanced CTA Button Interactions =====
  const ctaButtons = document.querySelectorAll('.cta-button');
  ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  // ===== Smooth Page Load Animation =====
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease-in';
      document.body.style.opacity = '1';
    }, 100);
  });

  // ===== Add Hover Sound Effect (Optional) =====
  const interactiveElements = document.querySelectorAll('.cta-button, .project-card, .social-link');
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });

  // ===== Console Easter Egg =====
  console.log('%c👋 Hey there!', 'font-size: 24px; font-weight: bold; color: #00B3FF;');
  console.log('%cLooking at the code? I like your style!', 'font-size: 14px; color: #666666;');
  console.log('%cFeel free to reach out if you want to collaborate: hello@alasrambus.com', 'font-size: 12px; color: #8B5CF6;');
});