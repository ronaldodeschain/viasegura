/* ═══════════════════════════════════════════════
   data.js — ViaSegura
   Fonte única de verdade para os dados estáticos
   da aplicação. Nenhuma lógica de renderização
   ou persistência reside aqui — apenas estruturas
   de dados exportadas para consumo pelos demais
   módulos.
   ═══════════════════════════════════════════════ */

export const projetos = [
  { badge: 'warning', label: '⏳ Em andamento', titulo: 'Mapa Vivo',                desc: 'Voluntários percorrem bairros registrando buracos com geolocalização e foto.' },
  { badge: 'warning', label: '⏳ Em andamento', titulo: 'Fio no Chão, Perigo Real', desc: 'Reporte emergencial de fios elétricos caídos em vias públicas.' },
  { badge: 'warning', label: '⏳ Em andamento', titulo: 'Olho na Rua',               desc: 'Oficinas em escolas ensinando cidadãos a identificar riscos urbanos.' },
  { badge: 'warning', label: '⏳ Em andamento', titulo: 'Prazo Cumprido',            desc: 'Monitoramento dos prazos legais de reparo após abertura de chamados.' },
  { badge: 'warning', label: '⏳ Em andamento', titulo: 'API Cidadã',                desc: 'Integração entre nosso banco de dados e os sistemas de ouvidoria das prefeituras.' },
  { badge: 'warning', label: '⏳ Em andamento', titulo: 'Adote uma Quadra',          desc: 'Moradores monitoram e reportam problemas em uma quadra específica mensalmente.' },
  { badge: 'success', label: '✔ Concluído',     titulo: 'Operação Asfalto 2023',     desc: '87 ordens de serviço abertas e 61 reparos concluídos em 6 meses.' },
  { badge: 'success', label: '✔ Concluído',     titulo: 'Rede de Vigias',            desc: '120 voluntários sentinelas em 8 bairros para cobertura contínua.' },
];

export const doacoes = [
  { titulo: '📱 Kit do voluntário',      meta: 8000,  arrecadado: 5340  },
  { titulo: '🖥️ Servidor da API Cidadã', meta: 12000, arrecadado: 12000 },
  { titulo: '🏫 Oficinas nas escolas',   meta: 6000,  arrecadado: 1800  },
];

export const estatisticas = [
  { valor: '+1.200',     desc: 'Ocorrências mapeadas em 2024'        },
  { valor: '340',        desc: 'Reparos concluídos após denúncias'   },
  { valor: '18 bairros', desc: 'Cobertos pela rede de voluntários'   },
];
