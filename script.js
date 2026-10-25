const $ = (id) => document.getElementById(id);
const scenes = ['intro', 'birthday', 'cakeScene', 'photosScene', 'letterScene'];
const music = $('music');
let musicPlaying = false;
function showScene(id) {
  scenes.forEach(scene => { $(scene).hidden = scene !== id; });
  window.scrollTo({ top: 0, behavior: 'instant' });
}
async function playMusic() {
  try { await music.play(); musicPlaying = true; } catch (error) { musicPlaying = false; console.info('Music not available yet. Add assets/music.mp3.', error); }
  $('musicToggle').textContent = musicPlaying ? '♫ Music: On' : '♫ Music: Off';
}
$('beginBtn').addEventListener('click', () => {
  $('musicToggle').hidden = false;
  playMusic();
  showScene('birthday');
  burstConfetti(90);
});
$('musicToggle').addEventListener('click', async () => {
  if (musicPlaying) { music.pause(); musicPlaying = false; $('musicToggle').textContent = '♫ Music: Off'; }
  else await playMusic();
});
$('toCakeBtn').addEventListener('click', () => showScene('cakeScene'));
$('wishBtn').addEventListener('click', () => {
  $('cakeScene').querySelector('.cake').classList.add('blown');
  $('wishBtn').hidden = true;
  $('wishMessage').textContent = 'May all your beautiful wishes come true ✨';
  $('toPhotosBtn').hidden = false;
  burstConfetti(120);
});
$('toPhotosBtn').addEventListener('click', () => showScene('photosScene'));
$('toLetterBtn').addEventListener('click', () => showScene('letterScene'));
$('envelopeBtn').addEventListener('click', () => {
  $('envelopeBtn').hidden = true;
  $('envelopeHint').hidden = true;
  $('letter').hidden = false;
  $('restartBtn').hidden = false;
  $('letter').focus({ preventScroll: true });
});
$('restartBtn').addEventListener('click', () => {
  $('cakeScene').querySelector('.cake').classList.remove('blown');
  $('wishBtn').hidden = false;
  $('wishMessage').textContent = '';
  $('toPhotosBtn').hidden = true;
  $('envelopeBtn').hidden = false;
  $('envelopeHint').hidden = false;
  $('letter').hidden = true;
  $('restartBtn').hidden = true;
  showScene('intro');
});
function burstConfetti(count) {
  const container = $('confetti');
  const colors = ['#f5d794', '#ffffff', '#df9da9', '#c9a4ed'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.animationDelay = Math.random() * .8 + 's';
    piece.style.animationDuration = 2.3 + Math.random() * 2 + 's';
    piece.style.setProperty('--drift', (Math.random() * 250 - 125) + 'px');
    container.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove(), { once: true });
  }
}
