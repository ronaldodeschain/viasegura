/* ═══════════════════════════════════════════════
   charts.js — ViaSegura
   Integração com Chart.js (CDN UMD).
   Responsabilidade única: criar e destruir
   instâncias de gráficos no DOM.
   Não importa nada de templates, form ou storage.
   ═══════════════════════════════════════════════ */

/**
 * Renderiza um gráfico de barras agrupadas (meta × arrecadado)
 * no <canvas id="grafico-doacoes">.
 *
 * Passos de inicialização do Chart.js:
 *  1. Obtém a referência ao <canvas> pelo id
 *  2. Destrói instância anterior via Chart.getChart() para evitar
 *     o erro "Canvas already in use" ao re-visitar a rota no SPA
 *  3. Instancia new Chart(canvas, config) com type, data e options
 *  4. Lê document.body.dataset.tema para adaptar as cores ao tema
 *
 * @param {Array<{titulo: string, meta: number, arrecadado: number}>} lista
 */
export function renderGrafico(lista) {
  const canvas = document.getElementById('grafico-doacoes');
  if (!canvas || !window.Chart) return;

  const anterior = Chart.getChart(canvas);
  if (anterior) anterior.destroy();

  const isDark   = document.body.dataset.tema === 'dark';
  const corTexto = isDark ? '#e2e8f0' : '#1e293b';

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: lista.map(d => d.titulo.replace(/^\S+\s/, '')),
      datasets: [
        {
          label: 'Meta (R$)',
          data: lista.map(d => d.meta),
          backgroundColor: 'rgba(100,116,139,0.5)',
          borderColor: 'rgba(100,116,139,1)',
          borderWidth: 1,
        },
        {
          label: 'Arrecadado (R$)',
          data: lista.map(d => d.arrecadado),
          backgroundColor: 'rgba(26,107,60,0.7)',
          borderColor: 'rgba(26,107,60,1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: corTexto } },
        tooltip: {
          callbacks: {
            label: ctx => ` R$ ${ctx.parsed.y.toLocaleString('pt-BR')}`,
          },
        },
      },
      scales: {
        x: { ticks: { color: corTexto }, grid: { display: false } },
        y: {
          ticks: {
            color: corTexto,
            callback: v => `R$ ${v.toLocaleString('pt-BR')}`,
          },
        },
      },
    },
  });
}
