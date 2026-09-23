/**
 * Purelane Shopify Frontend Controller
 * Scoped, framework-free vanilla JavaScript for Online Store 2.0
 */

// Custom Element for Hero Product Stage (ensures strict section-scoping and Theme Editor safety)
class PurelaneHeroStage extends HTMLElement {
  connectedCallback() {
    this.init();
  }

  disconnectedCallback() {
    this.destroy();
  }

  init() {
    this.slides = Array.from(this.querySelectorAll('.hslide'));
    this.dots = Array.from(this.querySelectorAll('.hdots button'));
    if (!this.slides.length) return;

    this.currentIndex = 0;
    this.timer = null;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Attach click listeners to dots
    this.dotHandlers = this.dots.map((dot, index) => {
      const handler = (e) => {
        e.preventDefault();
        this.stop();
        this.goTo(index);
        this.play();
      };
      dot.addEventListener('click', handler);
      return { dot, handler };
    });

    // Keyboard navigation (Arrow keys, Home, End)
    this.onKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        this.stop();
        this.goTo((this.currentIndex + 1) % this.slides.length);
        this.dots[this.currentIndex]?.focus();
        this.play();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.stop();
        this.goTo((this.currentIndex - 1 + this.slides.length) % this.slides.length);
        this.dots[this.currentIndex]?.focus();
        this.play();
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.stop();
        this.goTo(0);
        this.dots[0]?.focus();
        this.play();
      } else if (e.key === 'End') {
        e.preventDefault();
        this.stop();
        this.goTo(this.slides.length - 1);
        this.dots[this.slides.length - 1]?.focus();
        this.play();
      }
    };

    this.dotsContainer = this.querySelector('.hdots');
    if (this.dotsContainer) {
      this.dotsContainer.addEventListener('keydown', this.onKeyDown);
    }

    // Pause on hover or touch
    this.onMouseEnter = () => this.stop();
    this.onMouseLeave = () => this.play();
    this.addEventListener('mouseenter', this.onMouseEnter);
    this.addEventListener('mouseleave', this.onMouseLeave);
    this.addEventListener('touchstart', this.onMouseEnter, { passive: true });
    this.addEventListener('touchend', this.onMouseLeave, { passive: true });

    // Viewport intersection observer to conserve CPU when off-screen
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.play();
          } else {
            this.stop();
          }
        });
      }, { threshold: 0.2 });
      this.observer.observe(this);
    } else {
      this.play();
    }
  }

  goTo(index) {
    this.currentIndex = (index + this.slides.length) % this.slides.length;
    this.slides.forEach((slide, i) => {
      const isActive = i === this.currentIndex;
      slide.classList.toggle('on', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    this.dots.forEach((dot, i) => {
      const isActive = i === this.currentIndex;
      dot.classList.toggle('on', isActive);
      dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      dot.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  }

  play() {
    if (this.timer || this.reduceMotion || this.slides.length <= 1) return;
    this.timer = setInterval(() => {
      this.goTo(this.currentIndex + 1);
    }, 3800);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  destroy() {
    this.stop();
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.dotHandlers) {
      this.dotHandlers.forEach(({ dot, handler }) => dot.removeEventListener('click', handler));
      this.dotHandlers = null;
    }
    if (this.dotsContainer && this.onKeyDown) {
      this.dotsContainer.removeEventListener('keydown', this.onKeyDown);
    }
    this.removeEventListener('mouseenter', this.onMouseEnter);
    this.removeEventListener('mouseleave', this.onMouseLeave);
  }
}

if (!customElements.get('purelane-hero-stage')) {
  customElements.define('purelane-hero-stage', PurelaneHeroStage);
}

// Scroll reveals for .rv elements
function initPurelaneReveals(container = document) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revs = container.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revs.forEach((el) => observer.observe(el));
  } else {
    revs.forEach((el) => el.classList.add('in'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initPurelaneReveals();
});

// Shopify Theme Editor Lifecycle support
document.addEventListener('shopify:section:load', (event) => {
  initPurelaneReveals(event.target);
});
