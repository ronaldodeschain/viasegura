# 🛣️ ViaSegura

ONG fictícia de segurança urbana que mobiliza comunidades para identificar e reportar buracos, fios caídos e riscos em vias públicas.

> Projeto acadêmico desenvolvido como exercício prático de desenvolvimento web front-end com Vanilla JavaScript.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Arquitetura JavaScript](#arquitetura-javascript)
- [Funcionalidades](#funcionalidades)
- [Versionamento](#versionamento)
- [Autor](#autor)

---

## Visão Geral

A ViaSegura é uma aplicação web composta por **4 páginas estáticas** (`index`, `projetos`, `cadastro`, `feedback`) e um **shell SPA** (`app.html`) que reutiliza o mesmo conteúdo via roteamento client-side com a History API.

A interface inclui tema claro/escuro persistido, formulário com validação em 3 camadas, gráfico de doações interativo e componentes de feedback (toasts, modais, badges e alertas).

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Marcação | HTML5 semântico (`<section>`, `<article>`, `<details>`, `<meter>`, `<template>`) |
| Estilo | CSS3 puro — variáveis `:root`, Flexbox, Grid 12 colunas, 5 breakpoints |
| Comportamento | Vanilla JavaScript ES6+ — módulos, `async/await`, History API |
| Persistência | `localStorage` via camada de abstração `storage.js` |
| Gráficos | [Chart.js 4.4.3](https://www.chartjs.org/) via CDN (UMD) |
| Controle de versão | Git + GitHub com GitFlow |

---

## Estrutura do Projeto

```
ex1/
├── css/
│   └── style.css          # Design system completo
├── html/
│   ├── index.html          # Página inicial
│   ├── projetos.html       # Projetos e doações
│   ├── cadastro.html       # Formulário de voluntariado
│   ├── feedback.html       # Demonstração de componentes
│   └── app.html            # Shell SPA
├── js/
│   ├── data.js             # Dados estáticos (fonte única)
│   ├── storage.js          # Abstração localStorage
│   ├── templates.js        # Funções de renderização HTML
│   ├── charts.js           # Integração Chart.js
│   ├── views.js            # Composição de views por rota
│   ├── form.js             # Máscaras, validação e submit
│   ├── router.js           # Roteador SPA (History API)
│   └── main.js             # UI global (hambúrguer, toast, modal)
├── img/                    # Assets de imagem
├── prints/                 # Capturas de tela
└── README.md
```

---

## Pré-requisitos

- Navegador moderno com suporte a ES Modules (Chrome 61+, Firefox 60+, Edge 79+)
- Servidor HTTP local — ES Modules não funcionam via protocolo `file://`

Nenhuma dependência de Node.js, npm ou build tool é necessária.

---

## Instalação e Execução

**1. Clone o repositório**

```bash
git clone https://github.com/ronaldodeschain/viasegura.git
cd viasegura
```

**2. Inicie um servidor HTTP local**

Com Python (disponível na maioria dos sistemas):

```bash
# Python 3
python -m http.server 5500

# Python 2
python -m SimpleHTTPServer 5500
```

Ou com a extensão **Live Server** do VS Code: clique com o botão direito em `html/app.html` → *Open with Live Server*.

**3. Acesse no navegador**

```
http://localhost:5500/html/app.html   ← SPA
http://localhost:5500/html/index.html ← Página estática
```

---

## Arquitetura JavaScript

O projeto adota **ES6 Modules** com separação por responsabilidade única. O grafo de dependências flui em sentido único — módulos de baixo nível nunca importam módulos de cima:

```
data.js  ←──────────────────────────────┐
storage.js  ←───────────────────────────┤
charts.js   ←───────────────────────────┤
templates.js  ←  data.js                ├── router.js (orquestrador)
form.js       ←  storage.js             │
views.js      ←  templates.js, data.js  │
main.js       →  storage.js (dinâmico)  ┘
```

`main.js` é carregado como script clássico (sem `type="module"`) para expor `showToast`, `openModal` e `closeModal` globalmente, necessários nas páginas estáticas.

---

## Funcionalidades

- **Navegação SPA** — History API com `pushState`/`popstate`, links `.spa-link` e fallback 404
- **Tema claro/escuro** — alternado por botão, persistido no `localStorage`, restaurado sem FOUC
- **Formulário de voluntariado** — máscaras CPF/telefone/CEP, validação de dígitos verificadores, `checkValidity` + `reportValidity`
- **Componentes de feedback** — toasts com auto-dismiss (4s), modal com Escape, badges e alertas
- **Gráfico de doações** — Chart.js com barras agrupadas (meta × arrecadado), responsivo e adaptado ao tema
- **Persistência** — cadastros, tema, histórico de navegação (10 entradas) e doações simuladas

---

## Versionamento

O projeto segue **Semantic Versioning** e **Conventional Commits**, com branches gerenciadas pelo modelo **GitFlow**:

| Tag | Descrição |
|---|---|
| `v0.1.0` | Design system e estrutura base |
| `v0.2.0` | Páginas estáticas, navegação e componentes de feedback |
| `v0.3.0` | SPA com History API e sistema de templates |
| `v0.4.0` | Validação de formulário e persistência localStorage |
| `v0.5.0` | Chart.js e modularização ES6 completa |
| `v1.0.0` | Release estável com hotfix aplicado |

Branches permanentes: `main` (produção) e `develop` (integração).
Branches de suporte: `feature/*` (funcionalidades) e `hotfix/*` (correções urgentes).

---

## Autor

Desenvolvido por **ronaldodeschain** como projeto acadêmico de desenvolvimento web front-end.

🔗 [github.com/ronaldodeschain/viasegura](https://github.com/ronaldodeschain/viasegura)
