/* ============================================================
   STUDIUM — Shared Components
   ============================================================ */

/* SVG icon helper — returns inline SVG strings */
const icons = {
  dashboard: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  calendar: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  questions: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  simulados: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>',
  concursos: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>',
  ia: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
  english: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  spanish: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  support: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  profile: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  settings: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  plans: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  search: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  bell: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
};

/**
 * Renders the sidebar navigation into the .sidebar element.
 * @param {string} activePage - The filename of the current page (e.g., 'dashboard.html')
 */
function renderSidebar(activePage) {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const navItems = [
    { section: 'Principal', items: [
      { href: 'dashboard.html', icon: icons.dashboard, label: 'Dashboard' },
      { href: 'plano-estudos.html', icon: icons.calendar, label: 'Cronograma' },
      { href: 'questoes.html', icon: icons.questions, label: 'Questões' },
      { href: 'simulados.html', icon: icons.simulados, label: 'Simulados' },
    ]},
    { section: 'Módulos', items: [
      { href: 'concursos.html', icon: icons.concursos, label: 'Concursos' },
      { href: 'ia-tutora.html', icon: icons.ia, label: 'IA Tutora' },
      { href: 'ingles.html', icon: icons.english, label: 'Inglês' },
      { href: 'espanhol.html', icon: icons.spanish, label: 'Espanhol' },
    ]},
    { section: 'Conta', items: [
      { href: 'suporte.html', icon: icons.support, label: 'Suporte', badge: '1' },
      { href: 'perfil.html', icon: icons.profile, label: 'Perfil' },
      { href: 'configuracoes.html', icon: icons.settings, label: 'Configurações' },
      { href: 'planos.html', icon: icons.plans, label: 'Planos' },
    ]},
  ];

  let html = `
    <div class="sb-hdr">
      <a href="index.html" class="sb-logo" aria-label="Studium - Página inicial">
        <div class="logo-icon" aria-hidden="true">S</div>Studium
      </a>
    </div>`;

  navItems.forEach(section => {
    html += `<nav class="sb-sec" aria-label="${section.section}"><div class="sb-lbl">${section.section}</div>`;
    section.items.forEach(item => {
      const isActive = activePage === item.href ? ' active' : '';
      const ariaCurrent = activePage === item.href ? ' aria-current="page"' : '';
      const badge = item.badge ? `<span class="sb-badge" aria-label="${item.badge} notificação">${item.badge}</span>` : '';
      html += `<a href="${item.href}" class="sb-item${isActive}"${ariaCurrent}><span class="sb-icon" aria-hidden="true">${item.icon}</span>${item.label}${badge}</a>`;
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
        <span aria-hidden="true">${icons.search}</span>
        <label for="global-search" class="hidden">Buscar</label>
        <input type="search" id="global-search" placeholder="Buscar questões, concursos..." aria-label="Buscar questões, concursos">
      </div>
      <button class="notif-btn" onclick="toast('Você tem 2 notificações.')" aria-label="Notificações - 2 novas">
        ${icons.bell}<span class="notif-dot" aria-hidden="true"></span>
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
