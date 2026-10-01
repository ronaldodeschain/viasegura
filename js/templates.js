/* ═══════════════════════════════════════════════
   templates.js — ViaSegura
   Funções puras de renderização HTML.
   Recebe dados como parâmetro ou importa de
   data.js — nunca acessa DOM, storage ou libs.

   Abordagens implementadas:
   1. Template Literals  → cards de projetos/doações
   2. <template> HTML5   → cards de estatísticas
   ═══════════════════════════════════════════════ */

export { projetos, doacoes, estatisticas } from './data.js';

// ── ABORDAGEM 1: Template Literal ─────────────────────────────
// Recebe um array e retorna string HTML via .map().join('').
// Função pura: mesmo input sempre produz mesmo output.

export function renderCardsProjetos(lista) {
  return lista.map(p => `
    <article class="card">
      <span class="badge badge-${p.badge}">${p.label}</span>
      <h3>${p.titulo}</h3>
      <p>${p.desc}</p>
    </article>`
  ).join('');
}

export function renderCardsDoacoes(lista) {
  return lista.map(d => {
    const pct = Math.round((d.arrecadado / d.meta) * 100);
    return `
    <article class="card">
      <h3>${d.titulo}</h3>
      <strong style="display:block;margin-top:10px;color:#1a6b3c">
        Meta: R$ ${d.meta.toLocaleString('pt-BR')} — Arrecadado: R$ ${d.arrecadado.toLocaleString('pt-BR')}
      </strong>
      <meter min="0" max="${d.meta}" value="${d.arrecadado}"
             style="width:100%;margin-top:8px"
             title="${pct}% da meta atingida"></meter>
    </article>`;
  }).join('');
}

// ── ABORDAGEM 2: <template> HTML5 + clonagem ──────────────────
// Lê <template id="tpl-stat"> do DOM, clona com importNode(),
// preenche slots via data-slot e anexa ao container.

export function renderEstatisticas(lista, container) {
  const tpl = document.getElementById('tpl-stat');
  if (!tpl) return;

  container.innerHTML = '';

  lista.forEach(item => {
    const clone = document.importNode(tpl.content, true);
    clone.querySelector('[data-slot="valor"]').textContent = item.valor;
    clone.querySelector('[data-slot="desc"]').textContent  = item.desc;
    container.appendChild(clone);
  });
}
