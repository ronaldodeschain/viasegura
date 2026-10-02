# ═══════════════════════════════════════════════════════════
# github-setup.ps1 — ViaSegura
# Cria milestones, issues e pull requests via GitHub API.
# USO: defina seu token antes de executar:
#   $TOKEN = "ghp_SEU_TOKEN_AQUI"
#   .\github-setup.ps1
# ═══════════════════════════════════════════════════════════

$REPO  = "ronaldodeschain/viasegura"
$BASE  = "https://api.github.com/repos/$REPO"
$HEAD  = @{ Authorization = "Bearer $TOKEN"; Accept = "application/vnd.github+json" }

function api($method, $path, $body) {
  Invoke-RestMethod -Method $method -Uri "$BASE$path" -Headers $HEAD `
    -ContentType "application/json" -Body ($body | ConvertTo-Json -Depth 5)
}

# ── MILESTONES ───────────────────────────────────────────────
$m1 = api POST /milestones @{ title="v0.1–v0.2: Base visual e páginas";     due_on="2025-02-28T00:00:00Z"; description="Design system, HTML estático, navegação e componentes de feedback." }
$m2 = api POST /milestones @{ title="v0.3–v0.4: SPA, formulário e storage"; due_on="2025-03-31T00:00:00Z"; description="Roteador History API, templates, validação CPF e localStorage." }
$m3 = api POST /milestones @{ title="v0.5–v1.0: Biblioteca, módulos e release"; due_on="2025-04-30T00:00:00Z"; description="Chart.js, modularização ES6, hotfix e release estável." }

# ── ISSUES ───────────────────────────────────────────────────
api POST /issues @{ title="[feature] Implementar design system CSS";             body="Criar variáveis :root, reset, grid 12 colunas, Flexbox utilities e 5 breakpoints responsivos.";                                          milestone=$m1.number; labels=@("enhancement") }
api POST /issues @{ title="[feature] Criar páginas HTML estáticas";              body="Desenvolver index.html, projetos.html, cadastro.html e feedback.html com header, main e footer semânticos.";                              milestone=$m1.number; labels=@("enhancement") }
api POST /issues @{ title="[feature] Menu hambúrguer e dropdown responsivo";     body="Implementar nav-toggle com aria-expanded, dropdown hover/focus-within no desktop e .is-open via JS no mobile.";                          milestone=$m1.number; labels=@("enhancement") }
api POST /issues @{ title="[feature] Componentes de feedback visual";            body="Badges (5 variantes), alertas com botão fechar, toasts com auto-dismiss 4s e modal com backdrop e Escape.";                              milestone=$m1.number; labels=@("enhancement") }
api POST /issues @{ title="[feature] SPA com History API";                       body="Criar shell app.html com #app, roteador router.js usando pushState/popstate e views em views.js.";                                        milestone=$m2.number; labels=@("enhancement") }
api POST /issues @{ title="[feature] Sistema de templates";                      body="Template literals para cards, <template> HTML5 + importNode para estatísticas e data.js como fonte de dados.";                            milestone=$m2.number; labels=@("enhancement") }
api POST /issues @{ title="[feature] Validação de formulário em 3 camadas";      body="Atributos HTML5, CSS :invalid:not(:placeholder-shown) e JS com setCustomValidity e dígitos verificadores CPF.";                          milestone=$m2.number; labels=@("enhancement") }
api POST /issues @{ title="[feature] Persistência com localStorage";             body="storage.js com 4 categorias: cadastros, tema claro/escuro, histórico de navegação (10 entradas) e doações simuladas.";                   milestone=$m2.number; labels=@("enhancement") }
api POST /issues @{ title="[feature] Integração Chart.js via CDN";               body="Adicionar gráfico de barras em charts.js isolado. Usar window.Chart UMD. Destruir instância anterior com Chart.getChart() no re-render."; milestone=$m3.number; labels=@("enhancement") }
api POST /issues @{ title="[refactor] Modularização ES6 — 8 arquivos";           body="Separar em data.js, storage.js, templates.js, charts.js, views.js, form.js, router.js e main.js com responsabilidade única.";           milestone=$m3.number; labels=@("enhancement") }
api POST /issues @{ title="[bug] Cursor salta para o final nas máscaras";        body="setSelectionRange usa posição anterior sem compensar delta de caracteres inseridos pela máscara (pontos e traço do CPF/telefone).";       milestone=$m3.number; labels=@("bug") }
api POST /issues @{ title="[bug] customValidity persiste após form.reset()";     body="reset() nativo não chama setCustomValidity('') nos checkboxes de disponibilidade, mantendo estado de erro após envio bem-sucedido.";      milestone=$m3.number; labels=@("bug") }
api POST /issues @{ title="[bug] popstate ignora URL acessada diretamente";      body="e.state é null ao acessar rota via URL direta. Fallback e.state?.path ?? '/' renderiza sempre '/' em vez da rota correta.";             milestone=$m3.number; labels=@("bug") }
api POST /issues @{ title="[bug] DOMContentLoaded registra listener morto na SPA"; body="#form-cadastro não existe no DOM quando o módulo carrega na SPA. Guard if(!form)return absorve sem erro mas o listener é desnecessário."; milestone=$m3.number; labels=@("bug") }

# ── PULL REQUESTS ────────────────────────────────────────────
api POST /pulls @{ title="feat: design system e páginas estáticas";         head="feature/design-system";      base="develop"; body="Adiciona variáveis CSS, grid, breakpoints e as 4 páginas HTML base. Fecha #1 e #2." }
api POST /pulls @{ title="feat: navegação hambúrguer e feedback components"; head="feature/nav-hamburguer";     base="develop"; body="Menu mobile com aria-expanded e componentes toast/modal/badge. Fecha #3 e #4." }
api POST /pulls @{ title="feat: SPA router e sistema de templates";         head="feature/spa-router";         base="develop"; body="Shell app.html, History API, views.js e templates com duas abordagens. Fecha #5 e #6." }
api POST /pulls @{ title="feat: validação de formulário e localStorage";    head="feature/form-validation";    base="develop"; body="Máscaras, CPF com dígitos verificadores e storage.js com 4 categorias. Fecha #7 e #8." }
api POST /pulls @{ title="feat: Chart.js e modularização ES6";              head="feature/chartjs";            base="develop"; body="Gráfico de barras isolado em charts.js e refatoração em 8 módulos. Fecha #9 e #10." }
api POST /pulls @{ title="hotfix: correção de 4 bugs de interação DOM";     head="hotfix/form-bugs";           base="main";    body="Corrige cursor de máscara (#11), customValidity (#12), popstate (#13) e listener morto (#14)." }

Write-Host "Concluido. Acesse: https://github.com/$REPO/issues"
