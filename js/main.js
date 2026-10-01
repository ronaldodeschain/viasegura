/* ═══════════════════════════════════════════════
   main.js — ViaSegura
   Lógicas compartilhadas: hambúrguer, dropdown,
   toast, modal e utilitários de formulário.
   ═══════════════════════════════════════════════ */

// ── Hambúrguer & dropdown ─────────────────────────────────────
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('#nav-principal');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const aberto = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!aberto));
    nav.classList.toggle('is-open', !aberto);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('header')) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.querySelectorAll('.nav-item > a').forEach(a => {
        a.setAttribute('aria-expanded', 'false');
        a.nextElementSibling?.classList.remove('is-open');
      });
    }
  });

  document.querySelectorAll('.nav-item > a').forEach(a => {
    a.addEventListener('click', e => {
      if (window.innerWidth < 768) {
        e.preventDefault();
        const aberto = a.getAttribute('aria-expanded') === 'true';
        a.setAttribute('aria-expanded', String(!aberto));
        a.nextElementSibling.classList.toggle('is-open', !aberto);
      }
    });
  });
})();

// ── Toast ─────────────────────────────────────────────────────
function showToast(type, icon, title, msg) {
  let region = document.getElementById('toast-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'toast-region';
    region.className = 'toast-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    document.body.appendChild(region);
  }
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icon}</span><div><strong>${title}</strong><br><span style="opacity:.85">${msg}</span></div><button class="toast-close" aria-label="Fechar">✕</button>`;
  t.querySelector('.toast-close').addEventListener('click', () => dismissToast(t));
  region.appendChild(t);
  setTimeout(() => dismissToast(t), 4000);
}

function dismissToast(t) {
  t.classList.add('hide');
  t.addEventListener('animationend', () => t.remove(), { once: true });
}

// ── Modal ─────────────────────────────────────────────────────
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('is-open');
  // Foca o primeiro elemento focável dentro do modal
  const focavel = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focavel.length) focavel[0].focus();

  // Trap de foco: Tab e Shift+Tab circulam dentro do modal
  modal._trapFoco = function (e) {
    if (e.key !== 'Tab') return;
    const itens = [...modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled);
    const primeiro = itens[0];
    const ultimo   = itens[itens.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault(); ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault(); primeiro.focus();
    }
  };
  modal.addEventListener('keydown', modal._trapFoco);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('is-open');
  if (modal._trapFoco) modal.removeEventListener('keydown', modal._trapFoco);
}

document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) backdrop.classList.remove('is-open');
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.is-open')
      .forEach(m => m.classList.remove('is-open'));
  }
});

// ── Toggle de tema ────────────────────────────────────────────
const temaBtn = document.getElementById('tema-toggle');
if (temaBtn) {
  temaBtn.addEventListener('click', () => {
    import('./storage.js').then(({ salvarTema }) => {
      const atual = document.body.dataset.tema || 'light';
      const novo  = atual === 'light' ? 'dark' : 'light';
      salvarTema(novo);
      temaBtn.textContent = novo === 'dark' ? '☀️' : '🌙';
    });
  });
}
