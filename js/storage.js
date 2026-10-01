/* ═══════════════════════════════════════════════
   storage.js — ViaSegura
   Camada de abstração sobre localStorage.
   Centraliza set/get/parse de todos os dados
   persistidos pela aplicação.
   ═══════════════════════════════════════════════ */

const KEYS = {
  CADASTROS:  'viasegura:cadastros',
  TEMA:       'viasegura:tema',
  HISTORICO:  'viasegura:historico',
  DOACOES:    'viasegura:doacoes',
};

// ── Primitivas de leitura e escrita ───────────────────────────

function salvar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function carregar(chave, padrao = null) {
  const raw = localStorage.getItem(chave);
  if (raw === null) return padrao;
  try {
    return JSON.parse(raw);
  } catch {
    return padrao;           // JSON corrompido → retorna padrão
  }
}

// ── 1. Cadastros de voluntários ───────────────────────────────
// Grava: array de objetos com os dados do formulário + timestamp.
// Recupera: array restaurado para popular a listagem de inscritos.

export function salvarCadastro(dados) {
  const lista = carregar(KEYS.CADASTROS, []);
  lista.push({ ...dados, id: Date.now(), data: new Date().toISOString() });
  salvar(KEYS.CADASTROS, lista);
}

export function carregarCadastros() {
  return carregar(KEYS.CADASTROS, []);
}

// ── 2. Preferência de tema (claro / escuro) ───────────────────
// Grava: string 'dark' ou 'light'.
// Recupera: aplicado ao <body> antes do primeiro paint para
// evitar flash de tema incorreto.

export function salvarTema(tema) {
  salvar(KEYS.TEMA, tema);
  aplicarTema(tema);
}

export function aplicarTema(tema) {
  document.body.dataset.tema = tema;
}

export function restaurarTema() {
  const tema = carregar(KEYS.TEMA, 'light');
  aplicarTema(tema);
  return tema;
}

// ── 3. Histórico de navegação ─────────────────────────────────
// Grava: array das últimas 10 rotas visitadas com timestamp.
// Recupera: exibido como trilha de auditoria na interface.

export function registrarRota(path) {
  const hist = carregar(KEYS.HISTORICO, []);
  hist.unshift({ path, ts: new Date().toISOString() });
  salvar(KEYS.HISTORICO, hist.slice(0, 10));   // mantém só as 10 últimas
}

export function carregarHistorico() {
  return carregar(KEYS.HISTORICO, []);
}

// ── 4. Doações simuladas ──────────────────────────────────────
// Grava: valor numérico acumulado por campanha.
// Recupera: restaura os valores nos <meter> ao recarregar.

export function salvarDoacao(campanha, valor) {
  const doacoes = carregar(KEYS.DOACOES, {});
  doacoes[campanha] = (doacoes[campanha] ?? 0) + Number(valor);
  salvar(KEYS.DOACOES, doacoes);
  return doacoes[campanha];
}

export function carregarDoacoes() {
  return carregar(KEYS.DOACOES, {});
}

export function restaurarMeters() {
  const doacoes = carregarDoacoes();
  document.querySelectorAll('meter[data-campanha]').forEach(meter => {
    const campanha = meter.dataset.campanha;
    if (doacoes[campanha] !== undefined) {
      meter.value = doacoes[campanha];
      const label = meter.previousElementSibling;
      if (label) {
        const meta = Number(meter.max);
        label.textContent =
          `Meta: R$ ${meta.toLocaleString('pt-BR')} — Arrecadado: R$ ${doacoes[campanha].toLocaleString('pt-BR')}`;
      }
    }
  });
}
