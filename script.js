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

// Recuerdo que aparece al ampliar cada foto (mismo orden que las fotos; deja "" si no quieres uno)
const memories = [
  // CAMBIAR TEXTO AQUÍ (ej: "Ese día me reí tanto que...")
  "", "", "", ""
];

// Foto de la carta final
// CAMBIAR FOTO AQUÍ
const finalPhoto = "image.png";

// Canción
// CAMBIAR AUDIO AQUÍ
const audioFile = "cuenta conmigo.mp3";

// Canción que suena al abrir la carta final
// CAMBIAR AUDIO AQUÍ
const birthdayAudioFile = "cumple.mp3";

// Música de fondo (suena desde que abre la página, en loop y bajita)
// CAMBIAR AUDIO AQUÍ
const bgAudioFile = "fondo.mp3";
const bgVolume = 0.25;   // 0 = silencio, 1 = máximo

// Las seis frases de las flores
const messages = [
  "Eres un gran amigo", "Muy inteligente", "Gracias por cada risa",
  "¡Felices 20!", "Cada vez más viejitoo", "Te quiero muchoo"
];

/* ===================== NAVEGACIÓN ===================== */
const $ = s => document.querySelector(s);
/* Progreso del menú: secciones visitadas (solo en memoria; se reinicia al recargar la página) */
const SECTIONS = ['photos', 'music', 'flowers', 'cake'];
let seen = [];
function markSeen(id) { if (!seen.includes(id)) seen.push(id); }
function updateMenu() {
  document.querySelectorAll('.card').forEach(c => c.classList.toggle('seen', seen.includes(c.dataset.go)));
  const all = seen.length >= SECTIONS.length;
  $('#prog').textContent = seen.length + '/4 descubiertas';
  $('#menuMsg').textContent = all ? 'Creo que ya descubriste todo… ♡' : 'Toca una para continuar ✨';
  $('#more').hidden = !all;
}
function show(id) {
  if (id === 'letter' && seen.length < SECTIONS.length) id = 'menu';   // carta bloqueada hasta descubrir las 4
  // Audio: "Feliz cumpleaños" suena solo en la carta final (siempre desde el inicio, sin duplicarse)
  if (id === 'letter') {
    pause();                                    // cuenta conmigo se detiene (sin fade)
    bday.currentTime = 0; bday.play().catch(e => console.warn('No se pudo reproducir', birthdayAudioFile, e));
  } else if (!bday.paused) { bday.pause(); bday.currentTime = 0; }
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.id === id));
  const v = $('#' + id); if (v) v.scrollTop = 0;
  if (SECTIONS.includes(id)) markSeen(id);
  if (id === 'menu') updateMenu();
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-go]'); if (!t) return;
  show(t.dataset.go);
});

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
  const g = $('#gift'); if (g.classList.contains('open') || g.classList.contains('shake')) return;
  g.classList.add('shake');                                   // 1) la caja tiembla
  setTimeout(() => {
    g.classList.remove('shake'); g.classList.add('open');     // 2) se abre la tapa
    $('#glow').classList.add('on'); confetti(45);             // 3) luz suave + confeti
  }, 650);
  setTimeout(() => show('menu'), 2400);
}
$('#gift').onclick = $('#openBtn').onclick = openGift;

/* ===================== 3. FOTOS ===================== */
photos.forEach((src, i) => {
  const f = document.createElement('figure');
  f.className = 'polaroid';
  f.tabIndex = 0; f.onclick = () => openZoom(i);
  f.onkeydown = e => { if (e.key === 'Enter') openZoom(i); };
  f.style.transform = `rotate(${(Math.random() * 10 - 5).toFixed(1)}deg)`;
  f.innerHTML = `<img src="${src}" alt="Recuerdo ${i + 1}" loading="lazy"><figcaption>${captions[i] || ''}</figcaption>`;
  $('#board').appendChild(f);
});
$('#finalImg').src = finalPhoto;
function openZoom(i) {
  $('#zImg').src = photos[i]; $('#zCap').textContent = captions[i] || ''; $('#zMem').textContent = memories[i] || '';
  $('#zoom').classList.add('on');
}
$('#zoom').onclick = () => $('#zoom').classList.remove('on');

/* ===================== 4. MÚSICA ===================== */
const audio = $('#audio'), btn = $('#play'), bar = $('#bar');
audio.src = audioFile;
const bday = new Audio(birthdayAudioFile); bday.preload = 'auto';   // un solo objeto: nunca suena doble
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
    if (b.classList.contains('open')) return;
    b.classList.add('open'); li.classList.add('show'); li.textContent = '🌷 ' + m; sparkle(b);
    const n = $('#notes').querySelectorAll('.show').length;
    $('#fcount').textContent = n === messages.length ? '¡6/6 descubiertas! 💗' : n + '/' + messages.length + ' descubiertas';
    if (n === messages.length) confetti(25);
  };
  $('#bouquet').appendChild(b); $('#notes').appendChild(li);
});

function sparkle(el) { // destellos al abrir una flor
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('span'), a = i / 6 * Math.PI * 2;
    p.className = 'spark'; p.textContent = '✨';
    p.style.left = r.left + r.width / 2 + 'px'; p.style.top = r.top + 20 + 'px';
    p.style.setProperty('--dx', Math.cos(a) * 40 + 'px'); p.style.setProperty('--dy', Math.sin(a) * 40 - 10 + 'px');
    document.body.appendChild(p); setTimeout(() => p.remove(), 1000);
  }
}

/* ===================== 6. PASTEL ===================== */
function blowCandles() {
  const c = $('#cake'); if (c.classList.contains('out')) return;
  c.classList.add('out'); stopMic(); $('#blow').textContent = '¡Feliz cumpleaños! 💗';
  $('#micMsg').textContent = 'Ojalá se cumpla tu deseo ✨';
  $('.cakeSvg').classList.add('celebrate'); sparkle($('.cakeSvg')); confetti(70);   // la carta NO aparece aquí
}
$('#blow').onclick = blowCandles;

// Sobre → carta: solo desde el menú, cuando ya se descubrieron las 4 secciones
let envBusy = false;
function openLetterSequence() {
  if (envBusy || seen.length < SECTIONS.length) return; envBusy = true;
  pause();                                                        // 0) cuenta conmigo se detiene antes de la carta
  bday.muted = true; bday.play().then(() => { bday.pause(); bday.muted = false; bday.currentTime = 0; }).catch(() => { bday.muted = false; }); // permiso de audio en celulares (silencioso)
  const env = $('#env');
  env.classList.add('on');                                        // 1) aparece el sobre
  setTimeout(() => env.classList.add('open'), 1300);              // 2) se abre
  setTimeout(() => {                                              // 3) la carta se desdobla
    show('letter'); confetti(30, ['💗', '🤍']); stagger();
    const p = $('.paper'); p.classList.remove('unfold'); void p.offsetWidth; p.classList.add('unfold');
    env.classList.remove('on');
  }, 2500);
  setTimeout(() => { env.classList.remove('open'); envBusy = false; }, 3400);
}
$('#more').onclick = openLetterSequence;

// Soplido con micrófono: OPCIONAL (el botón "Soplar velas" siempre funciona)
let micStream = null, micCtx = null;
function stopMic() {
  if (micStream) { micStream.getTracks().forEach(t => t.stop()); micStream = null; }
  if (micCtx) { micCtx.close(); micCtx = null; }
}
$('#mic').onclick = async () => {
  const msg = $('#micMsg');
  if (micStream) { stopMic(); msg.textContent = ''; return; }
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: { autoGainControl: false } });
    micCtx = new (window.AudioContext || window.webkitAudioContext)();
    const an = micCtx.createAnalyser(); an.fftSize = 512;
    micCtx.createMediaStreamSource(micStream).connect(an);
    const buf = new Uint8Array(an.fftSize); let loud = 0;
    msg.textContent = 'Sopla hacia tu celular 🌬️';
    (function listen() {
      if (!micStream) return;
      an.getByteTimeDomainData(buf);
      let peak = 0; for (const v of buf) peak = Math.max(peak, Math.abs(v - 128));
      loud = peak > 75 ? loud + 1 : 0;                            // ruido fuerte ~0.4 s seguido
      if (loud > 25) { blowCandles(); return; }
      requestAnimationFrame(listen);
    })();
  } catch (e) { stopMic(); msg.textContent = 'No pude usar el micrófono, usa el botón de arriba 💙'; }
};

/* ===================== 7. CARTA (aparece párrafo a párrafo) ===================== */
function stagger() {
  document.querySelectorAll('#letterText p').forEach((p, i) => {
    p.style.animation = 'none'; void p.offsetWidth;
    p.style.animation = `in .8s ${0.5 + i * 0.35}s forwards`;
  });
}

/* ===================== MÚSICA DE FONDO ===================== */
// Suena sola salvo cuando suena "cuenta conmigo" o "cumple" (se pausa y luego se retoma).
// Si el navegador bloquea el autoplay con sonido, arranca en la primera interacción (toque, clic o tecla).
const bg = new Audio(bgAudioFile); bg.loop = true; bg.volume = bgVolume; bg.preload = 'auto';
const BG_EVENTS = ['pointerup', 'touchend', 'click', 'keydown'];
function syncBg() {
  const other = !audio.paused || (!bday.paused && !bday.muted);   // ¿suena otra canción?
  if (other) { bg.pause(); return; }
  bg.play().then(() => BG_EVENTS.forEach(e => document.removeEventListener(e, syncBg))).catch(() => { });
}
BG_EVENTS.forEach(e => document.addEventListener(e, syncBg));
[audio, bday].forEach(a => ['play', 'pause', 'ended'].forEach(e => a.addEventListener(e, syncBg)));
syncBg();                                                          // intenta autoplay al abrir la página

updateMenu();