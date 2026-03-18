/* ============================================================
   STUDIUM — Chat Widget de Suporte com IA
   Componente reutilizável e independente

   PERSONALIZAÇÃO:
   - chatWidgetConfig.title        → Título no cabeçalho
   - chatWidgetConfig.subtitle     → Subtítulo (ex: "Online · 24h")
   - chatWidgetConfig.welcomeMessage → Mensagem inicial da IA
   - chatWidgetConfig.quickReplies → Botões de resposta rápida
   - chatWidgetConfig.apiEndpoint  → URL da API de IA
   - chatWidgetConfig.autoOpen     → Abrir automaticamente (true/false)
   - chatWidgetConfig.storageKey   → Chave do localStorage
   ============================================================ */

// ── Configuração ────────────────────────────────────
const chatWidgetConfig = {
  title: 'Envie-nos uma mensagem',
  subtitle: 'Online · resposta em segundos',
  welcomeMessage: 'Olá! 👋 Tem alguma dúvida? Envie suas perguntas aqui!',
  quickReplies: [
    'Como funciona?',
    'Preciso de ajuda',
    'Quero dar uma sugestão',
  ],
  apiEndpoint: '/api/chat',  // Endpoint fictício — altere para seu backend
  autoOpen: false,
  storageKey: 'studium_chat_widget',
  maxTokens: 500,
  systemPrompt: `Você é o assistente de suporte da plataforma Studium, uma plataforma educacional para preparação de concursos públicos, ENEM e vestibulares.

Seu papel:
- Responder dúvidas sobre a plataforma (funcionalidades, planos, navegação)
- Orientar em problemas comuns (login, pagamento, acesso a conteúdo)
- Sugerir soluções para dificuldades técnicas
- Dar dicas de uso da plataforma
- Receber feedback e sugestões dos usuários

Tom: educado, claro, objetivo e útil.
Idioma: sempre em português brasileiro.
Formato: respostas curtas (máximo 2-3 parágrafos).
Se não souber a resposta, oriente o usuário a procurar atendimento humano em suporte@studium.com.br.`,
};

// ── Estado do widget ────────────────────────────────
const chatWidgetState = {
  isOpen: false,
  messages: [],
  isLoading: false,
};

// ── Inicialização ───────────────────────────────────
(function initChatWidget() {
  // Carregar histórico do localStorage
  loadChatHistory();

  // Renderizar HTML do widget
  renderChatWidget();

  // Vincular eventos
  bindChatEvents();

  // Mensagem de boas-vindas (se não há histórico)
  if (chatWidgetState.messages.length === 0) {
    addMessage('ai', chatWidgetConfig.welcomeMessage);
  }

  // Auto-abrir se configurado
  if (chatWidgetConfig.autoOpen) {
    setTimeout(() => toggleChatWidget(true), 1000);
  }
})();

/* ── Renderizar o HTML do widget ─────────────────── */
function renderChatWidget() {
  // Remover widget antigo do suporte básico (sup-widget) se existir
  const oldWidget = document.querySelector('.sup-widget');
  if (oldWidget) oldWidget.remove();

  const container = document.createElement('div');
  container.className = 'chat-widget';
  container.id = 'chat-widget';
  container.setAttribute('role', 'complementary');
  container.setAttribute('aria-label', 'Chat de suporte');

  container.innerHTML = `
    <!-- Painel do chat -->
    <div class="cw-panel" role="dialog" aria-label="Chat de suporte" aria-modal="false">
      <!-- Cabeçalho -->
      <div class="cw-header">
        <div class="cw-header-info">
          <div class="cw-header-avatar" aria-hidden="true">🤖</div>
          <div class="cw-header-text">
            <h4>${escapeHTML(chatWidgetConfig.title)}</h4>
            <p><span class="cw-header-status"><span class="cw-status-dot"></span> ${escapeHTML(chatWidgetConfig.subtitle)}</span></p>
          </div>
        </div>
        <div class="cw-header-actions">
          <button class="cw-header-btn" id="cw-clear-btn" title="Limpar conversa" aria-label="Limpar conversa">🗑️</button>
          <button class="cw-header-btn" id="cw-minimize-btn" title="Minimizar" aria-label="Minimizar chat">─</button>
        </div>
      </div>

      <!-- Respostas rápidas -->
      <div class="cw-quick-replies" id="cw-quick-replies">
        ${chatWidgetConfig.quickReplies.map(text =>
          `<button class="cw-quick-btn" data-msg="${escapeHTML(text)}">${escapeHTML(text)}</button>`
        ).join('')}
      </div>

      <!-- Área de mensagens -->
      <div class="cw-messages" id="cw-messages" role="log" aria-live="polite" aria-label="Mensagens do chat"></div>

      <!-- Input -->
      <form class="cw-input-area" id="cw-form" autocomplete="off">
        <textarea class="cw-input" id="cw-input" placeholder="Digite aqui" rows="1"
                  aria-label="Mensagem" maxlength="1000"></textarea>
        <button type="submit" class="cw-send-btn" id="cw-send-btn" aria-label="Enviar mensagem" disabled>
          ➤
        </button>
      </form>

      <!-- Rodapé -->
      <div class="cw-footer">Powered by Studium IA</div>
    </div>

    <!-- Botão flutuante -->
    <button class="cw-fab" id="cw-fab" aria-label="Abrir chat de suporte" aria-expanded="false">
      <span class="cw-fab-icon cw-fab-icon--chat">💬</span>
      <span class="cw-fab-icon cw-fab-icon--close">✕</span>
      <span class="cw-fab-badge" id="cw-fab-badge" style="display:none">1</span>
    </button>
  `;

  document.body.appendChild(container);

  // Renderizar mensagens do histórico
  renderAllMessages();
}

/* ── Vincular eventos ────────────────────────────── */
function bindChatEvents() {
  const widget = document.getElementById('chat-widget');
  const fab = document.getElementById('cw-fab');
  const minimizeBtn = document.getElementById('cw-minimize-btn');
  const clearBtn = document.getElementById('cw-clear-btn');
  const form = document.getElementById('cw-form');
  const input = document.getElementById('cw-input');
  const sendBtn = document.getElementById('cw-send-btn');

  // Abrir/fechar com o FAB
  fab.addEventListener('click', () => toggleChatWidget());

  // Minimizar
  minimizeBtn.addEventListener('click', () => toggleChatWidget(false));

  // Limpar conversa
  clearBtn.addEventListener('click', clearChat);

  // Enviar mensagem
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendUserMessage();
  });

  // Habilitar/desabilitar botão de enviar
  input.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim();
    autoResizeInput(input);
  });

  // Enviar com Enter (Shift+Enter para nova linha)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendUserMessage();
    }
  });

  // Respostas rápidas
  document.getElementById('cw-quick-replies').addEventListener('click', (e) => {
    const btn = e.target.closest('.cw-quick-btn');
    if (!btn) return;
    const msg = btn.dataset.msg;
    input.value = msg;
    sendBtn.disabled = false;
    sendUserMessage();
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWidgetState.isOpen) {
      toggleChatWidget(false);
    }
  });
}

/* ── Abrir/fechar widget ─────────────────────────── */
function toggleChatWidget(forceState) {
  const widget = document.getElementById('chat-widget');
  const fab = document.getElementById('cw-fab');
  const input = document.getElementById('cw-input');
  const badge = document.getElementById('cw-fab-badge');

  chatWidgetState.isOpen = forceState !== undefined ? forceState : !chatWidgetState.isOpen;

  widget.classList.toggle('cw-open', chatWidgetState.isOpen);
  fab.setAttribute('aria-expanded', String(chatWidgetState.isOpen));
  fab.setAttribute('aria-label', chatWidgetState.isOpen ? 'Fechar chat' : 'Abrir chat de suporte');

  if (chatWidgetState.isOpen) {
    // Foco acessível no input
    setTimeout(() => input.focus(), 300);
    // Esconder badge
    badge.style.display = 'none';
    // Scroll para o final
    scrollToBottom();
  }
}

/* ── Enviar mensagem do usuário ──────────────────── */
function sendUserMessage() {
  const input = document.getElementById('cw-input');
  const sendBtn = document.getElementById('cw-send-btn');
  const text = input.value.trim();
  if (!text || chatWidgetState.isLoading) return;

  // Adicionar mensagem do usuário
  addMessage('user', text);

  // Limpar input
  input.value = '';
  sendBtn.disabled = true;
  autoResizeInput(input);

  // Esconder respostas rápidas após primeiro envio
  const quickReplies = document.getElementById('cw-quick-replies');
  if (quickReplies) quickReplies.style.display = 'none';

  // Enviar para a API
  sendToAPI(text);
}

/* ── Adicionar mensagem ao estado e DOM ──────────── */
function addMessage(sender, text) {
  const msg = {
    id: Date.now() + Math.random(),
    sender: sender,  // 'user' ou 'ai'
    text: text,
    time: new Date().toISOString(),
  };

  chatWidgetState.messages.push(msg);
  renderMessage(msg);
  saveChatHistory();
  scrollToBottom();

  return msg;
}

/* ── Renderizar uma mensagem no DOM ──────────────── */
function renderMessage(msg) {
  const container = document.getElementById('cw-messages');
  const el = document.createElement('div');
  el.className = `cw-msg cw-msg--${msg.sender}`;
  el.dataset.id = msg.id;

  const timeStr = formatTime(msg.time);

  el.innerHTML = `
    <div class="cw-msg-bubble">${msg.sender === 'ai' ? formatAIResponse(msg.text) : escapeHTML(msg.text)}</div>
    <span class="cw-msg-time">${timeStr}</span>
  `;

  container.appendChild(el);
}

/* ── Renderizar todas as mensagens (ao carregar) ─── */
function renderAllMessages() {
  const container = document.getElementById('cw-messages');
  container.innerHTML = '';
  chatWidgetState.messages.forEach(msg => renderMessage(msg));
  scrollToBottom();
}

/* ── Indicador de digitação ──────────────────────── */
function showTypingIndicator() {
  const container = document.getElementById('cw-messages');
  const el = document.createElement('div');
  el.className = 'cw-typing';
  el.id = 'cw-typing';
  el.setAttribute('aria-label', 'Assistente está digitando');
  el.innerHTML = `
    <span class="cw-typing-dot"></span>
    <span class="cw-typing-dot"></span>
    <span class="cw-typing-dot"></span>
  `;
  container.appendChild(el);
  scrollToBottom();
}

function hideTypingIndicator() {
  const el = document.getElementById('cw-typing');
  if (el) el.remove();
}

/* ── Integração com API ──────────────────────────── */
async function sendToAPI(userMessage) {
  chatWidgetState.isLoading = true;
  showTypingIndicator();

  try {
    const response = await fetchAIResponse(userMessage);
    hideTypingIndicator();
    addMessage('ai', response);
  } catch (error) {
    hideTypingIndicator();
    addMessage('ai', 'Desculpe, houve um erro ao processar sua mensagem. Por favor, tente novamente ou entre em contato pelo e-mail suporte@studium.com.br.');
    console.error('[ChatWidget] Erro na API:', error);
  } finally {
    chatWidgetState.isLoading = false;
  }
}

/**
 * Função de integração com backend/API.
 *
 * COMO CONECTAR A SUA API:
 * 1. Altere chatWidgetConfig.apiEndpoint para a URL do seu backend
 * 2. Ajuste os headers (ex: adicione Authorization)
 * 3. Ajuste o corpo da requisição conforme seu backend espera
 * 4. Ajuste o parsing da resposta conforme seu backend retorna
 *
 * O exemplo abaixo usa dados mockados para funcionar sem backend.
 * Para conectar a um backend real, descomente o bloco de fetch.
 */
async function fetchAIResponse(userMessage) {
  // ──────────────────────────────────────────────────
  // OPÇÃO 1: Dados mockados para teste (ativo)
  // ──────────────────────────────────────────────────
  return mockAIResponse(userMessage);

  // ──────────────────────────────────────────────────
  // OPÇÃO 2: Chamada real ao backend (descomente para usar)
  // ──────────────────────────────────────────────────
  /*
  const conversationHistory = chatWidgetState.messages
    .filter(m => m.sender !== 'system')
    .map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

  const res = await fetch(chatWidgetConfig.apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer SEU_TOKEN_AQUI',
    },
    body: JSON.stringify({
      messages: conversationHistory,
      system: chatWidgetConfig.systemPrompt,
      max_tokens: chatWidgetConfig.maxTokens,
    }),
  });

  if (!res.ok) throw new Error(`API respondeu com status ${res.status}`);

  const data = await res.json();
  return data.reply || data.content?.[0]?.text || 'Desculpe, não entendi.';
  */
}

/* ── Respostas mockadas para teste ───────────────── */
function mockAIResponse(userMessage) {
  return new Promise((resolve) => {
    const msg = userMessage.toLowerCase();
    let reply;

    if (msg.includes('funciona') || msg.includes('como usar')) {
      reply = 'O Studium é sua plataforma completa para preparação de concursos! Aqui você encontra:\n\n**Questões comentadas** de bancas como CESPE, FCC e FGV, organizadas por matéria e dificuldade.\n\n**Simulados** cronometrados que simulam o dia da prova.\n\n**IA Tutora** que explica conteúdos, cria resumos e analisa seu desempenho.\n\nPara começar, acesse o **Dashboard** e veja suas metas de hoje!';
    } else if (msg.includes('ajuda') || msg.includes('problema') || msg.includes('erro')) {
      reply = 'Estou aqui para ajudar! Pode me contar mais sobre o que está acontecendo?\n\nProblemas comuns que posso resolver:\n- Dificuldade para acessar conteúdos\n- Dúvidas sobre seu plano\n- Problemas com questões ou simulados\n- Configurações da conta\n\nSe for algo mais específico, descreva o problema que farei o possível para orientar.';
    } else if (msg.includes('sugestão') || msg.includes('sugestao') || msg.includes('feedback')) {
      reply = 'Adoramos receber feedback! Sua sugestão é muito importante para melhorarmos a plataforma.\n\nPor favor, compartilhe sua ideia aqui mesmo e vou registrá-la para nossa equipe de produto avaliar. Obrigado por contribuir com o Studium!';
    } else if (msg.includes('plano') || msg.includes('preço') || msg.includes('preco') || msg.includes('assinatura')) {
      reply = 'Temos planos para todos os perfis de estudo:\n\n- **Gratuito**: Acesso básico a questões e conteúdos\n- **Essencial** (R$ 19,90/mês): Simulados e IA Tutora\n- **Premium** (R$ 29,90/mês): Tudo incluído + acompanhamento personalizado\n\nVocê pode ver todos os detalhes na página de **Planos**. Quer saber mais sobre algum específico?';
    } else if (msg.includes('cancelar') || msg.includes('cancelamento')) {
      reply = 'Para cancelar sua assinatura, acesse **Configurações > Plano e Pagamento > Cancelar assinatura**.\n\nO cancelamento é imediato, mas você mantém acesso até o fim do período já pago. Se mudar de ideia, pode reativar a qualquer momento.\n\nPosso ajudar com mais alguma coisa?';
    } else if (msg.includes('login') || msg.includes('senha') || msg.includes('entrar')) {
      reply = 'Se está com dificuldade para acessar sua conta:\n\n1. Verifique se o e-mail está correto\n2. Use a opção **"Esqueci minha senha"** na tela de login\n3. Verifique sua caixa de spam para o e-mail de recuperação\n\nSe o problema persistir, entre em contato pelo e-mail **suporte@studium.com.br** informando o e-mail cadastrado.';
    } else if (msg.includes('obrigad') || msg.includes('valeu') || msg.includes('thanks')) {
      reply = 'Por nada! Fico feliz em ajudar. Se tiver mais alguma dúvida, é só perguntar aqui. Bons estudos! 📚';
    } else {
      reply = 'Entendi sua dúvida! Vou fazer o possível para ajudar.\n\nSe precisar de um atendimento mais detalhado, você pode:\n- Acessar nossa **Central de Ajuda** na página de Suporte\n- Enviar um e-mail para **suporte@studium.com.br**\n- Consultar as **perguntas frequentes**\n\nEstou aqui para o que precisar!';
    }

    // Simula delay de resposta (800ms a 1500ms)
    const delay = 800 + Math.random() * 700;
    setTimeout(() => resolve(reply), delay);
  });
}

/* ── Limpar conversa ─────────────────────────────── */
function clearChat() {
  chatWidgetState.messages = [];
  renderAllMessages();
  saveChatHistory();

  // Mostrar respostas rápidas novamente
  const quickReplies = document.getElementById('cw-quick-replies');
  if (quickReplies) quickReplies.style.display = '';

  // Mensagem de boas-vindas
  addMessage('ai', chatWidgetConfig.welcomeMessage);
}

/* ── Persistência no localStorage ────────────────── */
function saveChatHistory() {
  try {
    const data = {
      messages: chatWidgetState.messages,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(chatWidgetConfig.storageKey, JSON.stringify(data));
  } catch (e) {
    console.warn('[ChatWidget] Erro ao salvar no localStorage:', e);
  }
}

function loadChatHistory() {
  try {
    const raw = localStorage.getItem(chatWidgetConfig.storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.messages && Array.isArray(data.messages)) {
      chatWidgetState.messages = data.messages;
    }
  } catch (e) {
    console.warn('[ChatWidget] Erro ao carregar do localStorage:', e);
  }
}

/* ── Utilitários ─────────────────────────────────── */
function escapeHTML(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

function formatAIResponse(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
  const container = document.getElementById('cw-messages');
  if (container) {
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }
}

function autoResizeInput(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
}
