(() => {
  /**
   * Purelane Shopify Frontend Controller
   * Scoped, framework-free vanilla JavaScript for Online Store 2.0
   */

  if (!customElements.get('purelane-hero-stage')) {
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

        // Theme Editor block select handler
        this.onBlockSelect = (e) => {
          if (e.target && this.contains(e.target)) {
            const slide = e.target.closest('.hslide');
            if (slide) {
              const idx = this.slides.indexOf(slide);
              if (idx !== -1) {
                this.stop();
                this.goTo(idx);
              }
            }
          }
        };
        document.addEventListener('shopify:block:select', this.onBlockSelect);

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
        if (this.onBlockSelect) {
          document.removeEventListener('shopify:block:select', this.onBlockSelect);
        }
        this.removeEventListener('mouseenter', this.onMouseEnter);
        this.removeEventListener('mouseleave', this.onMouseLeave);
      }
    }

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

  // Purelane Header Scroll & Mobile Navigation
  function initPurelaneHeader() {
    const hdr = document.getElementById('hdr');
    if (hdr && !hdr.dataset.initialized) {
      hdr.dataset.initialized = 'true';
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const y = window.scrollY || window.pageYOffset;
            hdr.classList.toggle('up', y > 90);
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    const burger = document.getElementById('purelaneBurger');
    const menu = document.getElementById('purelaneMobileMenu');
    if (burger && menu && !burger.dataset.initialized) {
      burger.dataset.initialized = 'true';
      burger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', !isExpanded);
        if (isExpanded) {
          menu.setAttribute('hidden', '');
        } else {
          menu.removeAttribute('hidden');
        }
      });

      document.addEventListener('click', (e) => {
        if (!menu.hasAttribute('hidden') && !menu.contains(e.target) && e.target !== burger && !burger.contains(e.target)) {
          burger.setAttribute('aria-expanded', 'false');
          menu.setAttribute('hidden', '');
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.hasAttribute('hidden')) {
          burger.setAttribute('aria-expanded', 'false');
          menu.setAttribute('hidden', '');
          burger.focus();
        }
      });
    }
  }

  // Purelane Parallax, Scene Crossfading & Rail Syncing
  function initPurelaneCinematics() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scenes = Array.from(document.querySelectorAll('.scene'));
    const stage = document.getElementById('scenes');
    const railLinks = Array.from(document.querySelectorAll('.rail a'));
    const targets = railLinks.map((a) => {
      const href = a.getAttribute('href');
      return href ? document.querySelector(href) : null;
    });

    let currentScene = 1;
    function setScene(n) {
      if (n === currentScene || !scenes.length) return;
      currentScene = n;
      scenes.forEach((s, i) => s.classList.toggle('on', i + 1 === n));
      if (stage) stage.setAttribute('data-d', String(n));
    }

    function syncRailAndScenes() {
      const y = window.scrollY || window.pageYOffset;
      const mid = y + window.innerHeight * 0.42;

      // Sync rail dots
      if (railLinks.length) {
        let activeIdx = 0;
        targets.forEach((t, i) => {
          if (t && t.offsetTop <= mid) activeIdx = i;
        });
        railLinks.forEach((a, i) => a.classList.toggle('on', i === activeIdx));
      }

      // Sync scene depth based on scroll position
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(Math.max(y / docHeight, 0), 1);
        if (progress < 0.25) setScene(1);
        else if (progress < 0.5) setScene(2);
        else if (progress < 0.75) setScene(3);
        else setScene(4);
      }
    }

    let raf = null, mx = 0, my = 0;
    const wlLayers = Array.from(document.querySelectorAll('#water .wl'));
    const heroProd = document.querySelector('.purelane-hero-section .hero-prod');

    function renderFrame() {
      raf = null;
      syncRailAndScenes();

      if (!reduce && wlLayers.length) {
        const y = window.scrollY || window.pageYOffset;
        wlLayers.forEach((layer, i) => {
          const d = [0.05, 0.09, 0.03, 0.02][i] || 0.05;
          layer.style.setProperty('--px', (mx * d * 130).toFixed(1) + 'px');
          layer.style.setProperty('--py', (-y * d + my * d * 90).toFixed(1) + 'px');
        });
      }
    }

    function onScrollOrResize() {
      if (!raf) raf = requestAnimationFrame(renderFrame);
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    if (!reduce && window.matchMedia('(min-width: 1024px)').matches) {
      window.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
        onScrollOrResize();
      }, { passive: true });
    }

    renderFrame();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPurelaneReveals();
    initPurelaneHeader();
    initPurelaneCinematics();
  });

  // Shopify Theme Editor Lifecycle support
  document.addEventListener('shopify:section:load', (event) => {
    initPurelaneReveals(event.target);
    initPurelaneHeader();
    initPurelaneCinematics();
  });
})();
