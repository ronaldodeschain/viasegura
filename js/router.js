/* ═══════════════════════════════════════════════
   router.js — ViaSegura SPA
   Roteador client-side: intercepta cliques,
   usa History API e injeta views no #app.
   ═══════════════════════════════════════════════ */

import { views } from './views.js';
import { initForm } from './form.js';
import { registrarRota, restaurarTema, restaurarMeters } from './storage.js';
import { renderGrafico } from './charts.js';
import { doacoes } from './data.js';

const app = document.getElementById('app');
const BASE = '/viasegura';

// ── Resolve redirect do 404.html (/viasegura/?/projetos) ─────
(function handleRedirect() {
  const q = location.search;
  if (!q) return;
  const redirected = q.slice(1).replace(/&/, '?');
  if (redirected.startsWith('/')) {
    history.replaceState({ path: redirected }, '', BASE + redirected);
  }
})();

// ── Normaliza pathname removendo o base path ─────────────────
function stripBase(pathname) {
  const p = pathname.replace(BASE, '') || '/';
  return p.startsWith('/') ? p : '/' + p;
}

// ── Renderiza a view correspondente à rota ────────────────────
function render(path) {
  const view = views[path] ?? views['404'];
  app.innerHTML = view();
  window.scrollTo(0, 0);
  updateNavLinks(path);
  registrarRota(path);
  if (path === '/cadastro') initForm();
  if (path === '/projetos') { restaurarMeters(); renderGrafico(doacoes); }
}

// ── Navega para uma rota sem recarregar a página ──────────────
function navigate(path) {
  history.pushState({ path }, '', BASE + path);
  render(path);
}

// ── Marca o link ativo no nav ─────────────────────────────────
function updateNavLinks(path) {
  document.querySelectorAll('.spa-link').forEach(a => {
    const match = stripBase(a.getAttribute('href')) === path;
    a.toggleAttribute('aria-current', match);
    if (match) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// ── Intercepta todos os cliques em links internos ────────────
document.addEventListener('click', e => {
  const link = e.target.closest('a.spa-link');
  if (!link) return;
  e.preventDefault();
  const path = link.getAttribute('href');
  const route = path.replace(BASE, '') || '/';
  if (route !== stripBase(location.pathname)) navigate(route);
});

// ── Trata navegação pelo botão Voltar/Avançar do browser ──────
// Bug 4: estado inicial é null ao acessar rota diretamente via URL;
// usa location.pathname como fallback antes de cair em '/'.
window.addEventListener('popstate', e => {
  render(e.state?.path ?? stripBase(location.pathname));
});

// ── Rota inicial ao carregar o shell ─────────────────────────
restaurarTema();
render(stripBase(location.pathname));
