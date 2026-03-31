/* ============================================================
   STUDIUM — Shared Application Logic
   ============================================================ */

/* ── API Key config ───────────────────────────────────────── */
/* Set your Anthropic API key here for AI features to work */
window.STUDIUM_API_KEY = window.STUDIUM_API_KEY || 'YOUR_API_KEY_HERE';

/* ── Toast notification system ─────────────────────────── */
(function() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
})();

function toast(msg, type) {
  const container = document.querySelector('.toast-container');
  if (!container) return;
  const t = type || 'default';
  const el = document.createElement('div');
  el.className = 'toast toast-' + t;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity .3s, transform .3s';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

/* ── Sidebar toggle ────────────────────────────────────── */
function toggleSidebar() {
  const sb = document.querySelector('.sidebar');
  if (sb) {
    sb.classList.toggle('open');
    const isOpen = sb.classList.contains('open');
    const toggle = document.getElementById('sb-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Fechar menu lateral' : 'Abrir menu lateral');
    }
  }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(e) {
  const sb = document.querySelector('.sidebar');
  if (sb && sb.classList.contains('open') && !sb.contains(e.target) && !e.target.closest('#sb-toggle')) {
    sb.classList.remove('open');
  }
});

/* ── Tab system ────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabContainer => {
    const buttons = tabContainer.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', btn.classList.contains('active'));
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        // Deactivate all
        buttons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabContainer.parentElement.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        // Activate target
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const pane = document.getElementById(target);
        if (pane) pane.classList.add('active');
      });
    });
  });
}

/* ── Accordion system ──────────────────────────────────── */
function initAccordions() {
  document.querySelectorAll('.acc-btn').forEach(btn => {
    btn.setAttribute('aria-expanded', btn.closest('.acc-item')?.classList.contains('open') || false);
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      if (item) {
        const isOpen = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
      }
    });
  });
}

/* ── Goal checkboxes ───────────────────────────────────── */
function initGoals() {
  document.querySelectorAll('.goal-ck').forEach(btn => {
    btn.setAttribute('role', 'checkbox');
    btn.setAttribute('aria-checked', btn.classList.contains('done'));
    btn.addEventListener('click', () => {
      const isDone = btn.classList.toggle('done');
      btn.innerHTML = isDone ? '✓' : '';
      btn.setAttribute('aria-checked', isDone);
      const txt = btn.nextElementSibling;
      if (txt && txt.classList.contains('goal-txt')) {
        txt.classList.toggle('done', isDone);
      }
      if (isDone) {
        const xp = btn.parentElement.querySelector('.goal-xp');
        toast((xp ? xp.textContent + ' ' : '') + 'Concluído!', 'success');
      }
    });
  });
}

/* ── Toggle switches ───────────────────────────────────── */
function initToggles() {
  document.querySelectorAll('.tog').forEach(tog => {
    tog.setAttribute('role', 'switch');
    tog.setAttribute('tabindex', '0');
    tog.setAttribute('aria-checked', tog.classList.contains('on'));
    tog.addEventListener('click', () => {
      const isOn = tog.classList.toggle('on');
      tog.setAttribute('aria-checked', isOn);
    });
    tog.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tog.click();
      }
    });
  });
}

/* ── Form validation ───────────────────────────────────── */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function showFieldError(input, message) {
  clearFieldError(input);
  input.style.borderColor = 'var(--red)';
  const err = document.createElement('div');
  err.className = 'field-error';
  err.style.cssText = 'font-size:11px;color:var(--red);margin-top:4px;';
  err.textContent = message;
  input.parentElement.appendChild(err);
}

function clearFieldError(input) {
  input.style.borderColor = '';
  const existing = input.parentElement.querySelector('.field-error');
  if (existing) existing.remove();
}

/* ── Button loading state ──────────────────────────────── */
function setButtonLoading(btn, loading) {
  if (loading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Aguarde...';
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

/* ── Password visibility toggle ────────────────────────── */
function initPasswordToggles() {
  document.querySelectorAll('.eye-btn').forEach(btn => {
    btn.setAttribute('aria-label', 'Mostrar senha');
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.textContent = isPassword ? '' : '';
        btn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
      }
    });
  });
}

/* ── OTP input handling ────────────────────────────────── */
function initOtpInputs() {
  const inputs = document.querySelectorAll('.otp-inp');
  inputs.forEach((inp, i) => {
    inp.setAttribute('aria-label', `Dígito ${i + 1} de ${inputs.length}`);
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/[^0-9]/g, '').slice(0, 1);
      if (inp.value && i < inputs.length - 1) {
        inputs[i + 1].focus();
      }
      inp.classList.toggle('filled', inp.value !== '');
    });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !inp.value && i > 0) {
        inputs[i - 1].focus();
      }
    });
  });
}

/* ── Initialize all shared components ──────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initTabs();
  initAccordions();
  initGoals();
  initToggles();
  initPasswordToggles();
  initOtpInputs();
});
