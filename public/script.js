// ======================== MASTER LEVEL JAVASCRIPT ========================

// ==================== ACHIEVEMENT SYSTEM ====================
class AchievementSystem {
  constructor() {
    this.unlocked = new Set(
      JSON.parse(localStorage.getItem("ach_unlocked") || "[]"),
    );
    this.queue = [];
    this.busy = false;
    window.__achievementSystem = this;

    this.catalog = {
      madrugador: {
        es: ["Madrugador", "Son las tantas. Eso se respeta."],
        en: ["Night Owl", "It's late. That's respect."],
        icon: "🌙",
      },
      console_hacker: {
        es: ["Console Hacker", "Sabía que inspeccionarías el código."],
        en: ["Console Hacker", "I knew you'd inspect the code."],
        icon: "👾",
      },
      dm_fan: {
        es: ["DM Superfan", "5 clics en el logo. Dedicación pura."],
        en: ["DM Superfan", "5 clicks on the logo. Pure dedication."],
        icon: "⚡",
      },
      lector: {
        es: ["El Lector", "Llegaste al final. Muy pocos lo hacen."],
        en: ["The Reader", "You made it to the end. Very few do."],
        icon: "📖",
      },
    };

    this._setupTriggers();
  }

  unlock(id) {
    if (this.unlocked.has(id) || !this.catalog[id]) return;
    this.unlocked.add(id);
    localStorage.setItem("ach_unlocked", JSON.stringify([...this.unlocked]));
    this.queue.push(id);
    this._processQueue();
  }

  _processQueue() {
    if (this.busy || !this.queue.length) return;
    this.busy = true;
    this._show(this.queue.shift());
  }

  _show(id) {
    const lang = localStorage.getItem("language") || "es";
    const d = this.catalog[id];
    const [title, desc] = d[lang] || d.es;
    const label = lang === "en" ? "Achievement unlocked" : "Logro desbloqueado";

    const el = document.createElement("div");
    el.className = "ach-toast";
    el.innerHTML = `
            <div class="ach-toast-icon">${d.icon}</div>
            <div class="ach-toast-body">
                <span class="ach-toast-label">${label}</span>
                <span class="ach-toast-title">${title}</span>
                <span class="ach-toast-desc">${desc}</span>
            </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => el.classList.add("show")),
    );

    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => {
        el.remove();
        this.busy = false;
        this._processQueue();
      }, 500);
    }, 4500);
  }

  _setupTriggers() {
    // Madrugador — visita entre las 00:00 y las 05:00
    const h = new Date().getHours();
    if (h < 5) setTimeout(() => this.unlock("madrugador"), 2000);

    // DM Superfan — 5 clics rápidos en el logo
    let clicks = 0,
      timer;
    document.querySelector(".logo")?.addEventListener("click", (e) => {
      e.preventDefault();
      clearTimeout(timer);
      if (++clicks >= 5) {
        clicks = 0;
        this.unlock("dm_fan");
        return;
      }
      timer = setTimeout(() => {
        clicks = 0;
      }, 1400);
    });

    // El Lector — llegar al footer
    const footer = document.querySelector("footer");
    if (footer) {
      const fo = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            this.unlock("lector");
            fo.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      fo.observe(footer);
    }
  }
}

// ==================== LANGUAGE MANAGER ====================
class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem("language") || "es";
    this.init();
  }

  init() {
    this.setLanguage(this.currentLang);
    this.attachEventListeners();
  }

  attachEventListeners() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        this.setLanguage(lang);
        localStorage.setItem("language", lang);
      });
    });
  }

  setLanguage(lang) {
    this.currentLang = lang;

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active");
      }
    });

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-es][data-en]").forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (!text) return;
      if (el.tagName === "META") {
        el.setAttribute("content", text);
      } else {
        el.textContent = text;
      }
    });

    // Notify other components that language changed
    window.dispatchEvent(
      new CustomEvent("languageChanged", { detail: { lang } }),
    );

    // Update CV viewer
    const cvIframe = document.getElementById("cv-iframe");
    if (cvIframe) {
      cvIframe.src =
        lang === "en"
          ? "/Curriculum Vitae (English).pdf"
          : "/Curriculum Vitae.pdf";
    }

    const cvDownloadLink = document.getElementById("cv-download-link");
    if (cvDownloadLink) {
      cvDownloadLink.href =
        lang === "en"
          ? "/Curriculum Vitae (English).pdf"
          : "/Curriculum Vitae.pdf";
    }

    // Update form placeholders
    document.querySelectorAll(`[data-${lang}-placeholder]`).forEach((el) => {
      const ph = el.getAttribute(`data-${lang}-placeholder`);
      if (ph) el.placeholder = ph;
    });
  }
}

// ==================== FAST CURSOR - ULTRA RÁPIDO ====================
class FastCursor {
  constructor() {
    this.cursor = document.createElement("div");
    this.cursor.className = "custom-cursor";
    document.body.appendChild(this.cursor);

    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.easing = 0.15; // Reduced easing for faster following

    this.init();
  }

  init() {
    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    this.animate();
    this.attachHoverListeners();
  }

  animate() {
    // Faster cursor movement
    this.cursorX += (this.mouseX - this.cursorX) * this.easing;
    this.cursorY += (this.mouseY - this.cursorY) * this.easing;

    this.cursor.style.left = this.cursorX - 12 + "px";
    this.cursor.style.top = this.cursorY - 12 + "px";

    requestAnimationFrame(() => this.animate());
  }

  attachHoverListeners() {
    document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
      el.addEventListener("mouseenter", () => {
        this.cursor.classList.add("active");
      });
      el.addEventListener("mouseleave", () => {
        this.cursor.classList.remove("active");
      });
    });
  }
}

// ==================== SCROLL PROGRESS BAR ====================
class ScrollProgress {
  constructor() {
    this.bar = document.querySelector(".scroll-progress-bar");
    this.init();
  }

  init() {
    window.addEventListener("scroll", () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      this.bar.style.width = scrolled + "%";
    });
  }
}

// ==================== COUNTER ANIMATIONS ====================
class CounterField {
  constructor() {
    this.counters = document.querySelectorAll(".counter");
    this.setupObserver();
  }

  setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            if (!el.dataset.animated) {
              this.animate(el);
              el.dataset.animated = "true";
            }
          }
        });
      },
      { threshold: 0.5 },
    );

    this.counters.forEach((counter) => observer.observe(counter));
  }

  animate(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = Date.now();

    const update = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };

    requestAnimationFrame(update);
  }
}

// ==================== CV MODAL ====================
class CVModal {
  constructor() {
    this.modal = document.getElementById("cv-modal");
    this.openBtn = document.getElementById("cv-viewer-btn");
    this.closeBtn = document.getElementById("cv-modal-close");
    this.overlay = document.querySelector(".cv-modal-overlay");

    this.init();
  }

  init() {
    this.openBtn?.addEventListener("click", () => this.open());
    this.closeBtn?.addEventListener("click", () => this.close());
    this.overlay?.addEventListener("click", () => this.close());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });
  }

  open() {
    this.modal.classList.add("active");
  }

  close() {
    this.modal.classList.remove("active");
  }
}

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
class FadeInOnScroll {
  constructor() {
    this.elements = document.querySelectorAll(".fade");
    this.setupObserver();
  }

  setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    this.elements.forEach((el) => observer.observe(el));
  }
}

// ==================== SMOOTH SCROLL ====================
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (href !== "#") {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      });
    });
  }
}

// ==================== HEADER ON SCROLL ====================
class HeaderScroll {
  constructor() {
    this.header = document.querySelector(".header");
    this.lastScrollTop = 0;
    this.init();
  }

  init() {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        this.header.classList.add("scrolled");
      } else {
        this.header.classList.remove("scrolled");
      }
      this.lastScrollTop = scrollTop;
    });
  }
}

// ==================== INTERACTIVE PARTICLES ON CANVAS ====================
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById("interactive-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;

    this.setupCanvas();
    this.createParticles();
    this.setupMouse();
    this.animate();
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  createParticles() {
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
  }

  setupMouse() {
    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p) => {
      // Move towards mouse
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const angle = Math.atan2(dy, dx);
        p.vx = Math.cos(angle) * 0.5;
        p.vy = Math.sin(angle) * 0.5;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Draw
      this.ctx.fillStyle = `rgba(6, 182, 212, ${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ==================== SMOOTH LETTER ANIMATIONS ====================
class StaggeredText {
  constructor() {
    this.init();
  }

  init() {
    const hero = document.querySelector(".hero-title");
    if (hero) {
      const letters = hero.querySelectorAll(".title-letter");
      letters.forEach((letter, index) => {
        letter.style.animationDelay = `${index * 0.05}s`;
      });
    }
  }
}

// ==================== SMOOTH GLITCH EFFECT (SUBTLE) ====================
class SubtleGlitch {
  constructor() {
    this.titles = document.querySelectorAll("h1, h2");
    this.setupGlitch();
  }

  setupGlitch() {
    this.titles.forEach((title) => {
      title.addEventListener("mouseenter", () => {
        this.triggerGlitch(title);
      });
    });
  }

  triggerGlitch(element) {
    element.style.animation = "none";
    setTimeout(() => {
      element.style.animation = "subtleGlitch 0.4s ease-out";
    }, 10);
  }
}

// ==================== CAROUSEL AUTOPLAY ====================
class CarouselAutoplay {
  constructor() {
    this.track = document.querySelector(".carousel-track");
    if (this.track) {
      this.track.style.animationPlayState = "running";
    }
  }
}

// ==================== NAV SCROLL INDICATOR ====================
class NavIndicator {
  constructor() {
    this.indicator = document.querySelector(".nav-indicator");
    this.navLinks = document.querySelectorAll(".nav-links a");
    if (!this.indicator) return;
    this.updateIndicator();

    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.updateIndicator();
      });
    });

    window.addEventListener("scroll", () => {
      this.updateIndicator();
    });

    window.addEventListener("languageChanged", () => {
      setTimeout(() => {
        this.updateIndicator();
      }, 50);
    });
  }

  updateIndicator() {
    if (!this.indicator) return;

    const activeLink = Array.from(this.navLinks).find((link) => {
      const href = link.getAttribute("href");
      if (!href || !href.includes("#")) return false;

      const hash = href.substring(href.indexOf("#"));
      if (hash === "#") return false;

      try {
        const section = document.querySelector(hash);
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top < 100 && rect.bottom > 100;
      } catch (e) {
        return false;
      }
    });

    if (activeLink) {
      this.indicator.style.opacity = "1";
      this.indicator.style.left = activeLink.offsetLeft + "px";
      this.indicator.style.width = activeLink.offsetWidth + "px";
    } else {
      this.indicator.style.opacity = "0";
    }
  }
}

// ==================== EASTER EGGS & DEVELOPER FUN ====================
class DeveloperEasterEggs {
  constructor() {
    this.setupKonamiCode();
    this.setupConsoleArt();
    this.setupMatrixEffect();
  }

  setupKonamiCode() {
    const sequence = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let current = 0;

    document.addEventListener("keydown", (e) => {
      if (e.key === sequence[current]) {
        current++;
        if (current === sequence.length) {
          this.triggerMatrixMode();
          current = 0;
        }
      } else {
        current = 0;
      }
    });
  }

  setupConsoleArt() {
    console.log(
      "%c╔═══════════════════════════════════════════════════╗\n" +
        "║   BIENVENIDO AL PORTFOLIO DE DARÍO v2.0          ║\n" +
        "║   >> 4 logros ocultos esperan ser descubiertos   ║\n" +
        "║   >> Pista #1 : prueba  dario()  en la consola   ║\n" +
        "╚═══════════════════════════════════════════════════╝",
      "color:#06b6d4;font-family:monospace;font-size:12px;line-height:1.6",
    );

    window.dario = () => {
      window.__achievementSystem?.unlock("console_hacker");
      console.log(
        "%c¡Logro desbloqueado! Quedan 3 más por descubrir...",
        "color:#00ff88;font-size:14px;font-family:monospace",
      );
      console.log(
        "%c→ dmartinezperandres@gmail.com",
        "color:#06b6d4;font-size:12px;font-family:monospace",
      );
    };
  }

  triggerMatrixMode() {
    const matrixCanvas = document.getElementById("interactive-canvas");
    const overlay = document.createElement("div");
    overlay.className = "matrix-overlay";
    document.body.appendChild(overlay);
    if (matrixCanvas) matrixCanvas.style.opacity = "0.8";

    setTimeout(() => {
      overlay.remove();
      if (matrixCanvas) matrixCanvas.style.opacity = "";
    }, 3000);

    console.log(
      "%c🌀 MATRIX MODE ACTIVATED",
      "color: #22c55e; font-weight: bold;",
    );
  }

  setupMatrixEffect() {
    document.addEventListener("click", (e) => {
      if (Math.random() > 0.95) {
        const spark = document.createElement("div");
        spark.style.cssText = `
                    position: fixed;
                    left: ${e.clientX}px;
                    top: ${e.clientY}px;
                    width: 10px;
                    height: 10px;
                    background: radial-gradient(circle, #06b6d4, transparent);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: sparkPop 0.6s ease-out forwards;
                    z-index: 10000;
                `;
        document.body.appendChild(spark);

        setTimeout(() => spark.remove(), 600);
      }
    });

    // Add spark animation to styles
    const style = document.createElement("style");
    style.textContent = `
            @keyframes sparkPop {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(3); }
            }
        `;
    document.head.appendChild(style);
  }
}

// ==================== INTERACTIVE ELEMENTS ====================
class CodeGlyphs {
  constructor() {
    document.querySelectorAll("h1, h2, h3").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        el.style.textShadow = "0 0 20px rgba(6, 182, 212, 0.8)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.textShadow = "none";
      });
    });
  }
}

// ==================== ACCESSIBILITY WIDGET ====================
class AccessibilityWidget {
  constructor() {
    this.prefs = JSON.parse(localStorage.getItem("a11y_prefs") || "{}");
    this.applyAll();
    this.attachEvents();
  }

  applyAll() {
    if (this.prefs.font) this.applyFont(this.prefs.font, false);
    if (this.prefs.contrast) this.applyContrast(this.prefs.contrast, false);
    if (this.prefs.color) this.applyColor(this.prefs.color, false);
    if (this.prefs.motion) this.applyMotion(this.prefs.motion, false);
  }

  save() {
    localStorage.setItem("a11y_prefs", JSON.stringify(this.prefs));
  }

  applyFont(val, save = true) {
    document.documentElement.style.setProperty("--a11y-base", val + "px");
    this.prefs.font = val;
    if (save) this.save();
    this.markActive("font", String(val));
  }

  applyContrast(val, save = true) {
    document.body.classList.remove("a11y-high-contrast", "a11y-inverted");
    if (val === "high") document.body.classList.add("a11y-high-contrast");
    if (val === "inverted") document.body.classList.add("a11y-inverted");
    this.prefs.contrast = val;
    if (save) this.save();
    this.markActive("contrast", val);
  }

  applyColor(val, save = true) {
    document.body.classList.remove(
      "a11y-deuteranopia",
      "a11y-protanopia",
      "a11y-grayscale",
    );
    if (val !== "normal") document.body.classList.add("a11y-" + val);
    this.prefs.color = val;
    if (save) this.save();
    this.markActive("color", val);
  }

  applyMotion(val, save = true) {
    document.body.classList.remove("a11y-reduced-motion", "a11y-no-motion");
    if (val === "reduced") document.body.classList.add("a11y-reduced-motion");
    if (val === "off") document.body.classList.add("a11y-no-motion");
    this.prefs.motion = val;
    if (save) this.save();
    this.markActive("motion", val);
  }

  markActive(type, val) {
    document.querySelectorAll(`[data-a11y="${type}"]`).forEach((btn) => {
      btn.classList.toggle("active", String(btn.dataset.val) === String(val));
    });
  }

  attachEvents() {
    const toggle = document.getElementById("a11y-toggle");
    const panel = document.getElementById("a11y-panel");
    const close = document.getElementById("a11y-close");
    const reset = document.getElementById("a11y-reset");

    toggle?.addEventListener("click", () => panel?.classList.toggle("open"));
    close?.addEventListener("click", () => panel?.classList.remove("open"));

    document.querySelectorAll("[data-a11y]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.a11y;
        const val = btn.dataset.val;
        if (type === "font") this.applyFont(Number(val));
        if (type === "contrast") this.applyContrast(val);
        if (type === "color") this.applyColor(val);
        if (type === "motion") this.applyMotion(val);
      });
    });

    reset?.addEventListener("click", () => {
      localStorage.removeItem("a11y_prefs");
      this.prefs = {};
      document.documentElement.style.removeProperty("--a11y-base");
      document.body.classList.remove(
        "a11y-high-contrast",
        "a11y-inverted",
        "a11y-deuteranopia",
        "a11y-protanopia",
        "a11y-grayscale",
        "a11y-reduced-motion",
        "a11y-no-motion",
      );
      this.markActive("font", "16");
      this.markActive("contrast", "normal");
      this.markActive("color", "normal");
      this.markActive("motion", "normal");
    });
  }
}

// ==================== CONTACT POPUP ====================
class ContactPopup {
  constructor() {
    this.popup = document.getElementById("contact-popup");
    if (!this.popup) return;

    this.closeBtn = document.getElementById("popup-close");
    this.laterBtn = document.getElementById("popup-later-btn");
    this.contactBtn = document.getElementById("popup-contact-btn");
    this.overlay = this.popup.querySelector(".contact-popup-overlay");

    if (sessionStorage.getItem("popupShown")) return;

    this.attachEvents();
    this.scheduleShow();
  }

  scheduleShow() {
    // Exit-intent: mouse leaves the viewport through the top edge
    const onMouseLeave = (e) => {
      if (e.clientY <= 5) {
        document.removeEventListener("mouseleave", onMouseLeave);
        this.show();
      }
    };
    document.addEventListener("mouseleave", onMouseLeave);
  }

  show() {
    this.popup.classList.add("active");
    sessionStorage.setItem("popupShown", "true");
  }

  close() {
    this.popup.classList.remove("active");
  }

  attachEvents() {
    this.closeBtn?.addEventListener("click", () => this.close());
    this.laterBtn?.addEventListener("click", () => this.close());
    this.overlay?.addEventListener("click", () => this.close());

    this.contactBtn?.addEventListener("click", () => {
      this.close();
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.popup.classList.contains("active")) {
        this.close();
      }
    });
  }
}

// ==================== INITIALIZE ALL ====================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all systems
  new LanguageManager();
  new FastCursor();
  new ScrollProgress();
  new CounterField();
  new CVModal();
  new FadeInOnScroll();
  new SmoothScroll();
  new HeaderScroll();
  new ParticleSystem();
  new StaggeredText();
  new SubtleGlitch();
  new CarouselAutoplay();
  new NavIndicator();
  new AchievementSystem();
  new DeveloperEasterEggs();
  new CodeGlyphs();
  new ContactPopup();
  new AccessibilityWidget();

  // Secret button — store CV lang hint and navigate to curiosity page
  const secretBtn = document.getElementById("curiosity-btn");
  if (secretBtn) {
    secretBtn.addEventListener("click", () => {
      sessionStorage.setItem("secretEntry", "true");
      window.location.href = "/curiosity";
    });
  }

  // Hamburger menu
  const hamburger = document.getElementById("nav-hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);
    });
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Scroll-to-top button
  const scrollTopBtn = document.getElementById("scroll-top-btn");
  if (scrollTopBtn) {
    window.addEventListener(
      "scroll",
      () => {
        scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
      },
      { passive: true },
    );
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Add subtle glitch keyframes dynamically
  const style = document.createElement("style");
  style.textContent = `
        @keyframes subtleGlitch {
            0% { transform: translate(0, 0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(-1px, 1px); }
            80% { transform: translate(1px, -1px); }
            100% { transform: translate(0, 0); }
        }
    `;
  document.head.appendChild(style);

  console.log(
    "%c🚀 ARCADE PORTFOLIO LOADED - PASIÓN INFINITA 🚀",
    "color: #06b6d4; font-size: 14px; font-weight: bold;",
  );
});
