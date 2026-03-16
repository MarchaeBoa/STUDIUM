/* ============================================================
   STUDIUM — Shared Components
   ============================================================ */

/**
 * Renders the sidebar navigation into the .sidebar element.
 * @param {string} activePage - The filename of the current page (e.g., 'dashboard.html')
 */
function renderSidebar(activePage) {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const navItems = [
    { section: 'Principal', items: [
      { href: 'dashboard.html', icon: '🏠', label: 'Dashboard' },
      { href: 'plano-estudos.html', icon: '📅', label: 'Cronograma' },
      { href: 'questoes.html', icon: '❓', label: 'Questões' },
      { href: 'simulados.html', icon: '📝', label: 'Simulados' },
    ]},
    { section: 'Módulos', items: [
      { href: 'concursos.html', icon: '🏆', label: 'Concursos' },
      { href: 'ia-tutora.html', icon: '🧠', label: 'IA Tutora' },
      { href: 'ingles.html', icon: '🇺🇸', label: 'Inglês' },
      { href: 'espanhol.html', icon: '🇪🇸', label: 'Espanhol' },
    ]},
    { section: 'Conta', items: [
      { href: 'suporte.html', icon: '💬', label: 'Suporte', badge: '1' },
      { href: 'perfil.html', icon: '👤', label: 'Perfil' },
      { href: 'configuracoes.html', icon: '⚙️', label: 'Configurações' },
      { href: 'planos.html', icon: '💳', label: 'Planos' },
    ]},
  ];

  let html = `
    <div class="sb-hdr">
      <a href="index.html" class="sb-logo" aria-label="Studium - Página inicial">
        <div class="logo-icon" aria-hidden="true">⚡</div>Studium
      </a>
    </div>`;

  navItems.forEach(section => {
    html += `<nav class="sb-sec" aria-label="${section.section}"><div class="sb-lbl">${section.section}</div>`;
    section.items.forEach(item => {
      const isActive = activePage === item.href ? ' active' : '';
      const ariaCurrent = activePage === item.href ? ' aria-current="page"' : '';
      const badge = item.badge ? `<span class="sb-badge" aria-label="${item.badge} notificação">${item.badge}</span>` : '';
      html += `<a href="${item.href}" class="sb-item${isActive}"${ariaCurrent}><span aria-hidden="true">${item.icon}</span> ${item.label}${badge}</a>`;
    });
    html += `</nav>`;
  });

  html += `
    <div class="sb-bottom">
      <a href="perfil.html" class="sb-user" aria-label="Perfil do usuário">
        <div class="av av-sm" aria-hidden="true">RO</div>
        <div><div class="sb-uname">Rafael Oliveira</div><div class="sb-uplan">Plano Premium</div></div>
      </a>
    </div>`;

  sidebar.innerHTML = html;
}

/**
 * Renders the topbar into the .topbar element.
 * @param {string} title - The page title to display
 */
function renderTopbar(title) {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  topbar.innerHTML = `
    <div class="tb-l">
      <button onclick="toggleSidebar()" class="btn btn-ghost" style="display:none;padding:6px 8px" id="sb-toggle" aria-label="Abrir menu lateral">☰</button>
      <h1 class="tb-title">${title}</h1>
    </div>
    <div class="tb-r">
      <div class="search-bar" role="search">
        <span aria-hidden="true">🔍</span>
        <label for="global-search" class="hidden">Buscar</label>
        <input type="search" id="global-search" placeholder="Buscar questões, concursos..." aria-label="Buscar questões, concursos">
      </div>
      <button class="notif-btn" onclick="toast('Você tem 2 notificações.')" aria-label="Notificações - 2 novas">
        🔔<span class="notif-dot" aria-hidden="true"></span>
      </button>
      <a href="perfil.html" aria-label="Perfil"><div class="av av-sm" aria-hidden="true">RO</div></a>
    </div>`;

  // Show hamburger on mobile
  const toggle = document.getElementById('sb-toggle');
  if (toggle && window.innerWidth <= 768) {
    toggle.style.display = 'block';
  }
  window.addEventListener('resize', () => {
    if (toggle) toggle.style.display = window.innerWidth <= 768 ? 'block' : 'none';
  });
}
