/* ═══════════════════════════════════════════════
   views.js — ViaSegura SPA
   Cada rota é uma função que retorna HTML string.
   Cards repetitivos são gerados via templates.js.
   ═══════════════════════════════════════════════ */

import {
  renderCardsProjetos, renderCardsDoacoes
} from './templates.js';
import { projetos, doacoes, estatisticas } from './data.js';

export const views = {

  '/': () => `
    <section class="hero">
      <h1>Ruas mais seguras começam com você</h1>
      <p>A ViaSegura mobiliza comunidades para identificar e reportar buracos, fios caídos e riscos nas vias públicas.</p>
      <a href="/cadastro" class="btn spa-link">Quero ser voluntário</a>
    </section>
    <main>
      <section aria-labelledby="missao-titulo">
        <h2 class="section-title" id="missao-titulo">Nossa Missão</h2>
        <p>Atuamos como ponte entre cidadãos e o poder público, reduzindo o tempo de resposta para reparos urgentes nas vias.</p>
      </section>

      <section aria-labelledby="numeros-titulo" style="margin-top:40px">
        <h2 class="section-title" id="numeros-titulo">Impacto em números</h2>
        <div class="cards" id="stats-container">
          ${estatisticas.map(e => `
            <article class="card">
              <h3>${e.valor}</h3>
              <p>${e.desc}</p>
            </article>`).join('')}
        </div>
      </section>

      <section aria-labelledby="contato-titulo" style="margin-top:40px">
        <h2 class="section-title" id="contato-titulo">Contato</h2>
        <address>
          <ul class="contact-list">
            <li>📧 <a href="mailto:contato@viasegura.org.br">contato@viasegura.org.br</a></li>
            <li>📞 <a href="tel:+551140028922">(11) 4002-8922</a></li>
            <li>📍 Av. Paulista, 1000 — Bela Vista, São Paulo/SP</li>
          </ul>
        </address>
      </section>
    </main>`,

  '/projetos': () => {
    const ativos     = projetos.filter(p => p.badge === 'warning');
    const concluidos = projetos.filter(p => p.badge === 'success');
    return `
    <section class="hero">
      <h1>Projetos e Iniciativas</h1>
      <p>Conheça nossas frentes de atuação e veja como sua doação transforma ruas em espaços mais seguros.</p>
    </section>
    <main>
      <section aria-labelledby="ativos-titulo">
        <h2 class="section-title" id="ativos-titulo">Projetos em andamento</h2>
        <div class="cards">${renderCardsProjetos(ativos)}</div>
      </section>

      <section aria-labelledby="concluidos-titulo" style="margin-top:48px">
        <h2 class="section-title" id="concluidos-titulo">Projetos concluídos</h2>
        <div class="cards">${renderCardsProjetos(concluidos)}</div>
      </section>

      <section aria-labelledby="doacao-titulo" style="margin-top:48px">
        <h2 class="section-title" id="doacao-titulo">Campanhas de doação</h2>
        <div class="cards">${renderCardsDoacoes(doacoes)}</div>
        <div style="margin-top:32px">
          <canvas id="grafico-doacoes" role="img" aria-label="Gráfico de barras comparando meta e valor arrecadado por campanha"></canvas>
        </div>
      </section>

      <div style="margin-top:28px;text-align:center">
        <a href="/cadastro" class="btn spa-link">Faça seu cadastro</a>
      </div>
    </main>`;
  },

  '/cadastro': () => `
    <section class="hero">
      <h1>Seja um Voluntário</h1>
      <p>Preencha o formulário abaixo e faça parte da rede que torna as ruas mais seguras.</p>
    </section>
    <main>
      <div class="form-card">
        <form id="form-cadastro" novalidate>
          <fieldset>
            <legend>Dados Pessoais</legend>
            <div class="form-group">
              <label for="nome">Nome completo *</label>
              <input type="text" id="nome" name="nome" placeholder="Seu nome completo" required minlength="3" autocomplete="name">
            </div>
            <div class="form-group">
              <label for="email">E-mail *</label>
              <input type="email" id="email" name="email" placeholder="seu@email.com" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="cpf">CPF *</label>
              <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" required maxlength="14" inputmode="numeric" autocomplete="off" pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" title="CPF no formato 000.000.000-00">
              <span class="hint">Somente números — a máscara é aplicada automaticamente.</span>
            </div>
            <div class="form-group">
              <label for="telefone">Telefone *</label>
              <input type="text" id="telefone" name="telefone" placeholder="(00) 00000-0000" required maxlength="15" inputmode="numeric" autocomplete="tel" pattern="\\(\\d{2}\\) \\d{4,5}-\\d{4}" title="Telefone no formato (00) 00000-0000">
            </div>
            <div class="form-group">
              <label for="nascimento">Data de nascimento *</label>
              <input type="date" id="nascimento" name="nascimento" required>
            </div>
          </fieldset>
          <fieldset>
            <legend>Endereço</legend>
            <div class="form-group">
              <label for="cep">CEP *</label>
              <input type="text" id="cep" name="cep" placeholder="00000-000" required maxlength="9" inputmode="numeric" autocomplete="postal-code" pattern="\\d{5}-\\d{3}" title="CEP no formato 00000-000">
            </div>
            <div class="form-group">
              <label for="logradouro">Logradouro *</label>
              <input type="text" id="logradouro" name="logradouro" placeholder="Rua, Avenida..." required autocomplete="street-address">
            </div>
            <div class="form-group">
              <label for="cidade">Cidade *</label>
              <input type="text" id="cidade" name="cidade" placeholder="Sua cidade" required autocomplete="address-level2">
            </div>
          </fieldset>
          <fieldset>
            <legend>Engajamento</legend>
            <div class="form-group">
              <label for="projeto">Projeto de interesse *</label>
              <select id="projeto" name="projeto" required>
                <option value="">Selecione um projeto</option>
                <option value="mapa-vivo">Mapa Vivo</option>
                <option value="fio-no-chao">Fio no Chão, Perigo Real</option>
                <option value="olho-na-rua">Olho na Rua</option>
                <option value="prazo-cumprido">Prazo Cumprido</option>
                <option value="api-cidada">API Cidadã</option>
                <option value="adote-quadra">Adote uma Quadra</option>
              </select>
            </div>
            <div class="form-group">
              <label>Disponibilidade *</label>
              <div class="checkbox-group">
                <label><input type="checkbox" name="disponibilidade" value="manha"> Manhã</label>
                <label><input type="checkbox" name="disponibilidade" value="tarde"> Tarde</label>
                <label><input type="checkbox" name="disponibilidade" value="noite"> Noite</label>
                <label><input type="checkbox" name="disponibilidade" value="fins-de-semana"> Fins de semana</label>
              </div>
            </div>
            <div class="form-group">
              <label for="motivacao">Por que quer ser voluntário?</label>
              <textarea id="motivacao" name="motivacao" rows="4" placeholder="Conte um pouco sobre sua motivação..." maxlength="500"></textarea>
              <span class="hint">Máximo 500 caracteres.</span>
            </div>
          </fieldset>
          <div class="form-group">
            <label style="display:flex;align-items:center;gap:8px;font-weight:400;cursor:pointer;">
              <input type="checkbox" id="termos" name="termos" required>
              Li e aceito os <a href="#" style="color:#1a6b3c">termos de voluntariado</a> *
            </label>
          </div>
          <button type="submit" class="btn" style="width:100%;padding:14px">Enviar cadastro</button>
        </form>
      </div>
    </main>`,

  '404': () => `
    <main style="text-align:center;padding:var(--space-16) var(--space-6)">
      <h1 style="font-size:4rem;color:var(--color-primary)">404</h1>
      <p style="font-size:var(--font-size-md);margin:var(--space-4) 0">Página não encontrada.</p>
      <a href="/" class="btn spa-link">Voltar ao início</a>
    </main>`
};
