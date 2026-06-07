/* =============================================
   EGITO: O BERÇO DAS CIVILIZAÇÕES
   script.js — Interatividade e Animações
   ============================================= */

/* -----------------------------------------------
   BARRA DE NAVEGAÇÃO — Comportamento ao rolar
   ----------------------------------------------- */
const navbar   = document.getElementById('navbar');
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* -----------------------------------------------
   MENU HAMBÚRGUER — Abertura e fecho
   ----------------------------------------------- */
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = burger.querySelectorAll('span');

  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

/**
 * Fecha o menu de navegação móvel.
 * Chamado pelos links de âncora dentro do menu.
 */
function closeMenu() {
  navLinks.classList.remove('open');
  burger.querySelectorAll('span').forEach(s => {
    s.style.transform = '';
    s.style.opacity   = '';
  });
}

/* -----------------------------------------------
   HERO — Partículas de areia animadas
   ----------------------------------------------- */
const particleContainer = document.getElementById('particles');
const PARTICLE_COUNT    = 28;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left              = Math.random() * 100 + '%';
  p.style.bottom            = '-10px';
  p.style.width             = (Math.random() * 3 + 1) + 'px';
  p.style.height            = p.style.width;
  p.style.animationDuration = (Math.random() * 12 + 8) + 's';
  p.style.animationDelay    = (Math.random() * 10) + 's';
  p.style.opacity           = String(Math.random() * 0.5);
  particleContainer.appendChild(p);
}

/* -----------------------------------------------
   ANIMAÇÃO DE REVELAÇÃO AO ROLAR
   ----------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    /* Escalonamento por posição entre irmãos */
    const irmaos = [...entry.target.parentElement.querySelectorAll('.reveal')];
    const indice = irmaos.indexOf(entry.target);

    setTimeout(() => {
      entry.target.classList.add('visible');
    }, indice * 80);

    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* -----------------------------------------------
   NAVEGAÇÃO — Destaque do link ativo ao rolar
   ----------------------------------------------- */
const secoes       = document.querySelectorAll('section[id]');
const navAncorados = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let atual = '';
  secoes.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) atual = s.id;
  });
  navAncorados.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + atual
      ? 'var(--gold)'
      : '';
  });
}, { passive: true });

/* -----------------------------------------------
   ESTATÍSTICAS — Animação de contador
   ----------------------------------------------- */

/**
 * Anima o número de uma estatística geográfica do zero ao valor final.
 * @param {HTMLElement} el - O elemento .geo-stat a animar
 */
function animarContador(el) {
  const texto = el.querySelector('.geo-stat-num');
  if (!texto || texto.dataset.animado) return;
  texto.dataset.animado = '1';

  const correspondencia = texto.textContent.match(/[\d\s,]+/);
  if (!correspondencia) return;

  const objetivo = parseInt(correspondencia[0].replace(/\s/g, ''));
  const sufixo   = texto.innerHTML.replace(correspondencia[0], '');
  let   inicio   = 0;
  const duracao  = 1600;

  const passo = timestamp => {
    if (!inicio) inicio = timestamp;
    const progresso = Math.min((timestamp - inicio) / duracao, 1);
    const valor     = Math.floor(progresso * objetivo);
    texto.innerHTML = valor.toLocaleString('pt-PT') + sufixo;
    if (progresso < 1) requestAnimationFrame(passo);
  };

  requestAnimationFrame(passo);
}

const contadorObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) animarContador(e.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.geo-stat').forEach(s => contadorObserver.observe(s));
