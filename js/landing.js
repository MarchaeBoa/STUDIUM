/* ============================================================
   STUDIUM — Landing Page Interactivity
   ============================================================ */

/* ── Scroll Animations (Intersection Observer) ──── */
(function () {
  var elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  // Use a larger rootMargin to catch elements above viewport too
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '200px 0px 0px 0px' });

  elements.forEach(function (el) { observer.observe(el); });

  // Also check all elements on scroll in case observer misses them
  var checkVisible = function () {
    elements.forEach(function (el) {
      if (el.classList.contains('visible')) return;
      var rect = el.getBoundingClientRect();
      var inView = rect.top < window.innerHeight + 100 && rect.bottom > -100;
      if (inView) {
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { el.classList.add('visible'); }, delay);
      }
    });
  };
  window.addEventListener('scroll', checkVisible, { passive: true });
  // Initial check
  setTimeout(checkVisible, 100);
})();

/* ── Hero demo chat interaction ──────────────────── */
(function () {
  var body = document.getElementById('demo-body');
  var prompts = document.getElementById('demo-prompts');
  if (!body || !prompts) return;

  var promptBtns = prompts.querySelectorAll('.demo-prompt');
  var isAnimating = false;

  promptBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (isAnimating) return;
      isAnimating = true;

      var q = btn.getAttribute('data-q');
      var a = btn.getAttribute('data-a');

      // Add user message
      var userMsg = document.createElement('div');
      userMsg.className = 'demo-msg demo-msg-user';
      userMsg.innerHTML = '<div class="demo-avatar">V</div><div class="demo-bubble">' + q + '</div>';
      body.appendChild(userMsg);
      body.scrollTop = body.scrollHeight;

      // Hide prompts during interaction
      prompts.style.opacity = '0.3';
      prompts.style.pointerEvents = 'none';

      // Add typing indicator
      setTimeout(function () {
        var typing = document.createElement('div');
        typing.className = 'demo-msg demo-msg-ai';
        typing.id = 'typing-indicator';
        typing.innerHTML = '<div class="demo-avatar">S</div><div class="demo-bubble demo-typing">Pensando</div>';
        body.appendChild(typing);
        body.scrollTop = body.scrollHeight;

        // Replace with actual answer
        setTimeout(function () {
          var typingEl = document.getElementById('typing-indicator');
          if (typingEl) typingEl.remove();

          var aiMsg = document.createElement('div');
          aiMsg.className = 'demo-msg demo-msg-ai';
          aiMsg.innerHTML = '<div class="demo-avatar">S</div><div class="demo-bubble">' + a + '</div>';
          body.appendChild(aiMsg);
          body.scrollTop = body.scrollHeight;

          prompts.style.opacity = '1';
          prompts.style.pointerEvents = 'auto';
          isAnimating = false;
        }, 1200);
      }, 500);
    });
  });
})();

/* ── Nav scroll effect ─────────────────────────────── */
(function () {
  var nav = document.querySelector('.pub-nav');
  if (!nav) return;
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
})();

/* ── Pricing toggle ──────────────────────────────── */
(function () {
  var switchBtn = document.getElementById('pricing-switch');
  var monthlyLabel = document.getElementById('toggle-monthly');
  var annualLabel = document.getElementById('toggle-annual');
  if (!switchBtn) return;

  var isAnnual = false;

  switchBtn.addEventListener('click', function () {
    isAnnual = !isAnnual;
    switchBtn.classList.toggle('active', isAnnual);
    monthlyLabel.classList.toggle('active', !isAnnual);
    annualLabel.classList.toggle('active', isAnnual);

    document.querySelectorAll('.price-value[data-monthly]').forEach(function (el) {
      var price = isAnnual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
      el.textContent = 'R$ ' + price;
    });
  });
})();

/* ── Smooth scroll for anchor links ──────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ── Mobile menu toggle ──────────────────────────── */
(function () {
  var btn = document.querySelector('.mobile-menu-btn');
  var links = document.querySelector('.pub-links');
  if (!btn || !links) return;

  btn.addEventListener('click', function () {
    links.classList.toggle('open');
    btn.classList.toggle('active');
  });
})();

/* ── Hero floating particles ─────────────────────── */
(function () {
  var canvas = document.querySelector('.hero-particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var w, h, particles;
  var COUNT = 35;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  function resize() {
    var hero = canvas.closest('.hero');
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.15,
        dy: (Math.random() - 0.5) * 0.1 - 0.05,
        o: Math.random() * 0.3 + 0.05,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      var flicker = 0.5 + 0.5 * Math.sin(t * 0.0008 + p.phase);
      var alpha = p.o * (0.6 + 0.4 * flicker);
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(110,231,183,' + alpha + ')';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  init();
  requestAnimationFrame(draw);
  window.addEventListener('resize', resize);
})();
