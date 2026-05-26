/* ═══════════════════════════════════════
   SAI HARSHA PHOTOGRAPHY — main.js
   ═══════════════════════════════════════ */
'use strict';

/* ── PHOTO DATA (26 total, 2 new animal portraits) ── */
const PHOTOS = [
  { src:'https://i.imgur.com/HVBIIy3.jpeg', cat:'portrait', label:'Portrait' },
  { src:'https://i.imgur.com/qMJnqkD.jpeg', cat:'nature',   label:'Nature'   },
  { src:'https://i.imgur.com/s4i0zmI.jpeg', cat:'portrait', label:'Portrait' },
  { src:'https://i.imgur.com/SkfUf8Y.jpeg', cat:'street',   label:'Street'   },
  { src:'https://i.imgur.com/forCSOD.jpeg', cat:'nature',   label:'Nature'   },
  { src:'https://i.imgur.com/9nGAK7D.jpeg', cat:'portrait', label:'Portrait' },
  { src:'https://i.imgur.com/IUfOffU.jpeg', cat:'street',   label:'Street'   },
  { src:'https://i.imgur.com/KWtPqRg.jpeg', cat:'nature',   label:'Nature'   },
  { src:'https://i.imgur.com/nEi9r2z.jpeg', cat:'portrait', label:'Portrait' },
  { src:'https://i.imgur.com/3lnWeCg.jpeg', cat:'street',   label:'Street'   },
  { src:'https://i.imgur.com/uhwrlVO.jpeg', cat:'nature',   label:'Nature'   },
  { src:'https://i.imgur.com/F3YvV1y.jpeg', cat:'portrait', label:'Portrait' },
  { src:'https://i.imgur.com/10Na2Es.jpeg', cat:'street',   label:'Street'   },
  { src:'https://i.imgur.com/YWFcL8T.jpeg', cat:'nature',   label:'Nature'   },
  { src:'https://i.imgur.com/zKcBDil.jpeg', cat:'portrait', label:'Portrait' },
  { src:'https://i.imgur.com/XLdv5iY.jpeg', cat:'street',   label:'Street'   },
  { src:'https://i.imgur.com/c4rhzN7.jpeg', cat:'nature',   label:'Nature'   },
  { src:'https://i.imgur.com/3EYiNHT.jpeg', cat:'portrait', label:'Portrait' },
  { src:'https://i.imgur.com/N6r79NT.jpeg', cat:'street',   label:'Street'   },
  { src:'https://i.imgur.com/pP3xIxa.jpeg', cat:'nature',   label:'Nature'   },
  { src:'https://i.imgur.com/pUhK4EE.jpeg', cat:'portrait', label:'Portrait' },
  { src:'https://i.imgur.com/hteGmof.jpeg', cat:'street',   label:'Street'   },
  { src:'https://i.imgur.com/cA87MH5.jpeg', cat:'nature',   label:'Nature'   },
  { src:'https://i.imgur.com/pTk7WpX.jpeg', cat:'portrait', label:'Portrait' },
  /* ── NEW: Labrador B&W animal portraits ── */
  { src:'https://i.imgur.com/y3rd2TI.jpeg', cat:'animal',   label:'Animal Portrait' },
  { src:'https://i.imgur.com/1jHyoaZ.jpeg', cat:'animal',   label:'Animal Portrait' },
];

/* active set for lightbox navigation */
let activePhotos = [...PHOTOS];
let lbIndex = 0;
let touchStartX = 0;

/* ═══════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════ */
(function () {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct.toFixed(2) + '%';
  }, { passive: true });
})();

/* ═══════════════════════════════════════
   CURSOR
═══════════════════════════════════════ */
(function () {
  const main  = document.getElementById('cursor-main');
  const trail = document.getElementById('cursor-trail');
  let mx = -200, my = -200, tx = -200, ty = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    main.style.left = mx + 'px';
    main.style.top  = my + 'px';
  });

  /* lagging trail */
  (function loop() {
    tx += (mx - tx) * 0.11;
    ty += (my - ty) * 0.11;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mouseleave', () => { main.style.opacity = '0'; trail.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { main.style.opacity = '1'; trail.style.opacity = '1'; });

  /* hover state — interactive elements */
  const hoverSel = 'a, button, .gallery-card, .filter-tab, .contact-link, #lbClose, #lbPrev, #lbNext';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) document.body.classList.add('hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) document.body.classList.remove('hovering');
  });

  /* view-cursor state over gallery cards */
  document.addEventListener('mouseover', e => {
    if (e.target.closest('.gallery-card')) document.body.classList.add('cursor-view');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('.gallery-card')) document.body.classList.remove('cursor-view');
  });
})();

/* ═══════════════════════════════════════
   PARTICLE SYSTEM
═══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x        = Math.random() * W;
      this.y        = init ? Math.random() * H : H + 10;
      this.size     = Math.random() * 1.2 + 0.3;
      this.speedY   = -(Math.random() * 0.3 + 0.08);
      this.speedX   = (Math.random() - 0.5) * 0.15;
      this.life     = 0;
      this.maxLife  = Math.random() * 400 + 200;
      this.maxAlpha = Math.random() * 0.4 + 0.05;
      this.alpha    = 0;
    }
    update() {
      this.x += this.speedX; this.y += this.speedY; this.life++;
      if (this.life < 60)                        this.alpha = (this.life / 60) * this.maxAlpha;
      else if (this.life > this.maxLife - 60)    this.alpha = ((this.maxLife - this.life) / 60) * this.maxAlpha;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,169,110,${this.alpha})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 80 }, () => new Particle());

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();

/* ═══════════════════════════════════════
   NAV — scroll shrink + burger
═══════════════════════════════════════ */
(function () {
  const nav  = document.getElementById('navbar');
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  window.toggleMenu = function () {
    const open = menu.classList.toggle('open');
    ham.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  window.closeMenu = function () {
    menu.classList.remove('open');
    ham.classList.remove('open');
    document.body.style.overflow = '';
  };
})();

/* ═══════════════════════════════════════
   HERO COUNTER
═══════════════════════════════════════ */
(function () {
  const el = document.getElementById('heroCounter');
  if (!el) return;
  let n = 0;
  const total = PHOTOS.length; /* 26 */
  const iv = setInterval(() => {
    n++;
    el.textContent = String(n).padStart(2, '0');
    if (n >= total) clearInterval(iv);
  }, 75);
})();

/* ═══════════════════════════════════════
   GALLERY — filter + reveal + tilt
═══════════════════════════════════════ */
(function () {
  const grid = document.getElementById('galleryGrid');
  const cards = Array.from(grid.querySelectorAll('.gallery-card'));

  /* Map card DOM nodes to PHOTOS data by data-idx */
  cards.forEach(card => {
    const idx = parseInt(card.dataset.idx);
    card.addEventListener('click', () => {
      /* find position in activePhotos */
      const src = PHOTOS[idx].src;
      const pos = activePhotos.findIndex(p => p.src === src);
      if (pos !== -1) openLightbox(pos);
    });
  });

  /* ── Intersection reveal ── */
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        cardObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  cards.forEach((c, i) => {
    c.style.transitionDelay = (i % 4) * 0.08 + 's';
    cardObs.observe(c);
  });

  /* ── 3D tilt on hover ── */
  if (!window.matchMedia('(hover:none)').matches) {
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
        const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
        card.style.transform    = `scale(1.02) rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg)`;
        card.style.transition   = 'transform .08s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform  = 'scale(1) rotateY(0) rotateX(0)';
        card.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1), opacity .7s ease';
      });
    });
  }

  /* ── Filter ── */
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      activePhotos = filter === 'all' ? PHOTOS : PHOTOS.filter(p => p.cat === filter);

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        if (!match) {
          card.style.opacity   = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => { card.style.display = 'none'; }, 380);
        } else {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity   = '1';
            card.style.transform = 'scale(1) translateY(0)';
          });
        }
      });
    });
  });
})();

/* ═══════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════ */
function openLightbox(idx) {
  lbIndex = idx;
  renderLb();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('lbImg').src = ''; }, 500);
}

function navigateLb(dir) {
  lbIndex = (lbIndex + dir + activePhotos.length) % activePhotos.length;
  const img = document.getElementById('lbImg');
  img.style.opacity   = '0';
  img.style.transform = `translateX(${dir * 24}px)`;
  setTimeout(() => {
    renderLb();
    img.style.opacity   = '1';
    img.style.transform = 'translateX(0)';
  }, 200);
}

function renderLb() {
  const photo = activePhotos[lbIndex];
  const img   = document.getElementById('lbImg');
  const meta  = document.getElementById('lbMeta');
  img.src     = photo.src;
  img.alt     = photo.label;
  if (meta) meta.textContent = photo.label.toUpperCase() + '  ·  ' + (lbIndex + 1) + ' / ' + activePhotos.length;
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click',  () => navigateLb(-1));
document.getElementById('lbNext').addEventListener('click',  () => navigateLb(1));
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  navigateLb(-1);
  if (e.key === 'ArrowRight') navigateLb(1);
});

/* touch swipe in lightbox */
document.getElementById('lightbox').addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
document.getElementById('lightbox').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 45) navigateLb(dx < 0 ? 1 : -1);
});

/* ═══════════════════════════════════════
   SCROLL REVEAL (.reveal / .reveal-left)
═══════════════════════════════════════ */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal, .reveal-left').forEach(el => io.observe(el));
})();

/* ═══════════════════════════════════════
   ANIMATED STAT COUNTERS
═══════════════════════════════════════ */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target.querySelector('.stat-number');
      if (!el) return;
      const target = parseInt(el.dataset.target);
      let n = 0;
      const step = () => { el.textContent = ++n; if (n < target) setTimeout(step, 55); };
      step();
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.reveal.d1, .reveal.d2, .reveal.d3, .reveal.d4').forEach(el => {
    if (el.querySelector('.stat-number')) io.observe(el);
  });
})();

/* ═══════════════════════════════════════
   SMOOTH ANCHOR SCROLL
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ═══════════════════════════════════════
   PAGE VISIBILITY — pause heavy animations
═══════════════════════════════════════ */
document.addEventListener('visibilitychange', () => {
  const state = document.hidden ? 'paused' : 'running';
  document.querySelectorAll('.orb, .scan-line').forEach(el => {
    el.style.animationPlayState = state;
  });
});
