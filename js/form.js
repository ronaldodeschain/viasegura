/* ═══════════════════════════════════════════════
   form.js — ViaSegura
   Máscaras de input, validação de CPF e
   controle de submit. Exporta initForm() para
   ser chamado pelo router após injetar a view.
   ═══════════════════════════════════════════════ */

import { salvarCadastro } from './storage.js';

function mascara(input, fn) {
  input.addEventListener('input', () => {
    // Bug 2: salvar posição antes e recalcular após formatação
    // evita cursor saltando para o final ao editar no meio do campo
    const antes  = input.value;
    const pos    = input.selectionStart;
    input.value  = fn(antes);
    // ajusta o deslocamento causado pelos caracteres de máscara inseridos
    const delta  = input.value.length - antes.length;
    const novaPos = Math.max(0, pos + delta);
    input.setSelectionRange(novaPos, novaPos);
  });
}

function mascaraCPF(v) {
  return v.replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mascaraTelefone(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '');
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '');
}

function mascaraCEP(v) {
  return v.replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

function cpfValido(cpf) {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  const calc = fator =>
    d.slice(0, fator - 1).split('').reduce((s, n, i) => s + +n * (fator - i), 0);
  const r1 = (calc(10) * 10) % 11;
  const r2 = (calc(11) * 10) % 11;
  return (r1 > 9 ? 0 : r1) === +d[9] && (r2 > 9 ? 0 : r2) === +d[10];
}

// ── Exportada: chamada pelo router após injetar a view /cadastro
export function initForm() {
  const cpfInput      = document.getElementById('cpf');
  const telefoneInput = document.getElementById('telefone');
  const cepInput      = document.getElementById('cep');
  const nascimento    = document.getElementById('nascimento');
  const form          = document.getElementById('form-cadastro');

  if (!form) return;

  if (cpfInput)      mascara(cpfInput, mascaraCPF);
  if (telefoneInput) mascara(telefoneInput, mascaraTelefone);
  if (cepInput)      mascara(cepInput, mascaraCEP);
  if (nascimento)    nascimento.max = new Date().toISOString().split('T')[0];

  function validarDisponibilidade() {
    const checks = document.querySelectorAll('input[name="disponibilidade"]');
    const marcado = [...checks].some(c => c.checked);
    checks.forEach(c => c.setCustomValidity(marcado ? '' : 'Selecione ao menos uma disponibilidade.'));
  }
  document.querySelectorAll('input[name="disponibilidade"]')
    .forEach(c => c.addEventListener('change', validarDisponibilidade));

  if (cpfInput) {
    cpfInput.addEventListener('blur', function () {
      this.setCustomValidity(cpfValido(this.value) ? '' : 'CPF inválido.');
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    validarDisponibilidade();
    if (!this.checkValidity()) { this.reportValidity(); return; }
    salvarCadastro(Object.fromEntries(new FormData(this)));
    showToast('success', '✅', 'Cadastro enviado!', 'Entraremos em contato em breve.');
    this.reset();
    // Bug 3: reset() nativo não limpa customValidity — limpa manualmente
    document.querySelectorAll('input[name="disponibilidade"]')
      .forEach(c => c.setCustomValidity(''));
  });
}

// ── Compatibilidade com páginas estáticas (não-SPA) ──────────
// Bug 1: DOMContentLoaded só dispara em páginas estáticas;
// na SPA o #form-cadastro não existe neste momento — o guard
// `if (!form) return` dentro de initForm() absorve a chamada
// sem efeito colateral, mantendo compatibilidade nos dois contextos.
document.addEventListener('DOMContentLoaded', () => initForm());
