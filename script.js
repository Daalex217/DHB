/* ===================== CONFIGURACIÓN ===================== */

// Fotos de la galería (mínimo 1, puedes agregar o quitar)
const photos = [
  // CAMBIAR FOTO AQUÍ
  "camion.png",
  // CAMBIAR FOTO AQUÍ
  "hakathon.png",
  // CAMBIAR FOTO AQUÍ
  "familia.png",
  // CAMBIAR FOTO AQUÍ
  "amigos.png"
];

// Frases debajo de cada foto (en el mismo orden)
const captions = [
  // CAMBIAR TEXTO AQUÍ
  "Cuando casi nos matan JAJAJ", "Cuando supiste que no me debias de dar mucho cafe (hakathon)", "Cuando conocieron a mi familia (no cualquiera los conoce)", "Pero sobre todo, siempre has estado presente cuando te necesito y eso lo valoro mucho"
];

// Foto de la carta final
// CAMBIAR FOTO AQUÍ
const finalPhoto = "diego.png";

// Canción
// CAMBIAR AUDIO AQUÍ
const audioFile = "cuenta conmigo.mp3";

// Las seis frases de las flores
const messages = [
  "Eres un gran amigo", "Muy inteligente", "Gracias por cada risa",
  "¡Felices 20!", "Cada vez más viejitoo", "Te quiero muchoo"
];

/* ===================== NAVEGACIÓN ===================== */
const $ = s => document.querySelector(s);
function show(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.id === id));
  if (id !== 'music') pause();
  const v = $('#' + id); if (v) v.scrollTop = 0;
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-go]'); if (!t) return;
  // Si la carta ya se desbloqueó, "Tu cumpleaños" abre directamente la misma carta
  if (t.dataset.go === 'cake' && isLetterSaved()) { show('letter'); stagger(); return; }
  show(t.dataset.go);
});

/* ===================== CARTA GUARDADA (persistencia) ===================== */
// Se guarda en el navegador (localStorage) que la carta ya fue desbloqueada.
// La carta es el mismo contenido fijo del HTML, así que siempre se muestra igual.
const LETTER_KEY = 'dhb_letter_unlocked';
function isLetterSaved() { try { return localStorage.getItem(LETTER_KEY) === '1'; } catch (e) { return false; } }
function saveLetter() { try { localStorage.setItem(LETTER_KEY, '1'); } catch (e) { /* sin almacenamiento: sigue funcionando en esta sesión */ } }

/* ===================== CONFETI / CORAZONES ===================== */
function confetti(n = 50, set = ['🎉', '💗', '✨', '🤍', '💙', '🌸']) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'fx';
    s.textContent = set[i % set.length];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.fontSize = 14 + Math.random() * 16 + 'px';
    s.style.animationDuration = 2.5 + Math.random() * 2.5 + 's';
    s.style.animationDelay = Math.random() * .8 + 's';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 6500);
  }
}
for (let i = 0; i < 8; i++) { // corazones suaves de fondo
  const h = document.createElement('span');
  h.className = 'h'; h.textContent = i % 2 ? '💙' : '🤍';
  h.style.left = Math.random() * 100 + '%';
  h.style.fontSize = 14 + Math.random() * 12 + 'px';
  h.style.animationDuration = 14 + Math.random() * 12 + 's';
  h.style.animationDelay = -Math.random() * 20 + 's';
  $('#hearts').appendChild(h);
}

/* ===================== 1. REGALO ===================== */
function openGift() {
  const g = $('#gift'); if (g.classList.contains('open')) return;
  g.classList.add('open'); confetti(45);
  setTimeout(() => show('menu'), 1400);
}
$('#gift').onclick = $('#openBtn').onclick = openGift;

/* ===================== 3. FOTOS ===================== */
photos.forEach((src, i) => {
  const f = document.createElement('figure');
  f.className = 'polaroid';
  f.style.transform = `rotate(${(Math.random() * 10 - 5).toFixed(1)}deg)`;
  f.innerHTML = `<img src="${src}" alt="Recuerdo ${i + 1}" loading="lazy"><figcaption>${captions[i] || ''}</figcaption>`;
  $('#board').appendChild(f);
});
$('#finalImg').src = finalPhoto;

/* ===================== 4. MÚSICA ===================== */
const audio = $('#audio'), btn = $('#play'), bar = $('#bar');
audio.src = audioFile;
const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';
function pause() { audio.pause(); btn.textContent = '▶'; $('#vinyl').classList.remove('spin'); }
btn.onclick = () => {
  if (audio.paused) {
    audio.play().then(() => { btn.textContent = '❚❚'; $('#vinyl').classList.add('spin'); })
      .catch(() => alert('Agrega tu audio en assets/music/cancion.mp3'));
  } else pause();
};
audio.onloadedmetadata = () => $('#dur').textContent = fmt(audio.duration);
audio.ontimeupdate = () => { bar.value = audio.duration ? audio.currentTime / audio.duration * 100 : 0; $('#cur').textContent = fmt(audio.currentTime); };
audio.onended = pause;
bar.oninput = () => { if (audio.duration) audio.currentTime = bar.value / 100 * audio.duration; };

/* ===================== 5. FLORES ===================== */
const colors = ['#6f95cf', '#8fb2de', '#e9b8cc', '#5a82c0', '#a9c4e8', '#f0c8d8'];
messages.forEach((m, i) => {
  const r = (i - 2.5) * 7;
  const b = document.createElement('button');
  b.className = 'flower'; b.style.setProperty('--r', r + 'deg'); b.style.transform = `rotate(${r}deg)`;
  b.setAttribute('aria-label', 'Flor ' + (i + 1));
  b.innerHTML = `<svg viewBox="0 0 60 130"><path d="M30 50V128" stroke="#6a9a78" stroke-width="4"/><path d="M30 100q-18-4-20-20q16 2 20 20z" fill="#8bb99a"/>
    <g class="bloom"><path d="M14 20q0 30 16 32q16-2 16-32q-8 8-16 0q-8 8-16 0z" fill="${colors[i]}" stroke="#3f66a8" stroke-width="2.5"/></g></svg>`;
  const li = document.createElement('li'); li.textContent = '🌷 ?';
  b.onclick = () => {
    b.classList.add('open'); li.classList.add('show'); li.textContent = '🌷 ' + m;
    if ($('#notes').querySelectorAll('.show').length === messages.length) confetti(25);
  };
  $('#bouquet').appendChild(b); $('#notes').appendChild(li);
});

/* ===================== 6. PASTEL ===================== */
$('#blow').onclick = () => {
  const c = $('#cake'); if (c.classList.contains('out')) return;
  c.classList.add('out'); saveLetter(); $('#blow').textContent = '¡Feliz cumpleaños! 💗';
  confetti(70);
  setTimeout(() => { show('letter'); confetti(30, ['💗', '🤍']); stagger(); }, 3200);
};

/* ===================== 7. CARTA (aparece párrafo a párrafo) ===================== */
function stagger() {
  document.querySelectorAll('#letterText p').forEach((p, i) => {
    p.style.animation = 'none'; void p.offsetWidth;
    p.style.animation = `in .8s ${0.5 + i * 0.35}s forwards`;
  });
}