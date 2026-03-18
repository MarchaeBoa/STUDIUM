/* ============================================================
   STUDIUM — Full-site premium dark background effects
   Subtle particles, ambient depth, and soft glow
   ============================================================ */

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // --- Full-page particle system ---
  var canvas = document.querySelector('.site-particles');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'site-particles';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);
  }

  var ctx = canvas.getContext('2d');
  var w, h, particles;
  var PARTICLE_COUNT = 50;
  var mouse = { x: -1000, y: -1000 };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        dx: (Math.random() - 0.5) * 0.12,
        dy: (Math.random() - 0.5) * 0.08 - 0.02,
        o: Math.random() * 0.2 + 0.03,
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

      // Gentle flicker
      var flicker = 0.5 + 0.5 * Math.sin(t * 0.0006 + p.phase);
      var alpha = p.o * (0.5 + 0.5 * flicker);

      // Wrap around
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Subtle mouse proximity glow
      var dx = p.x - mouse.x;
      var dy = p.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var proximity = dist < 200 ? (1 - dist / 200) * 0.3 : 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + proximity * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(110,231,183,' + (alpha + proximity) + ')';
      ctx.fill();

      // Draw subtle glow halo for larger particles
      if (p.r > 1) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(52,211,153,' + (alpha * 0.15) + ')';
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  requestAnimationFrame(draw);

  window.addEventListener('resize', function () {
    resize();
  });

  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
})();
