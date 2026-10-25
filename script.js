const $ = id => document.getElementById(id);
const scenes = ['intro','countdownScene','birthday','cakeScene','photosScene','letterScene','finaleScene'];
const music = $('music');
let musicPlaying = false;
let memoryIndex = 0;
let sequenceToken = 0;
const wait = ms => new Promise(resolve => setTimeout(resolve,ms));

// Customize each caption here. Image filenames must be photo1.jpg ... photo24.jpg.
const captions = [
  'The beginning of some wonderful memories ✨',
  'A day worth remembering',
  'Our favorite kind of chaos ♡',
  'The little things matter most',
  'A moment frozen in time',
  'The smiles say everything',
  'Some days just feel different',
  'One for the memory book',
  'More laughter, always',
  'A story behind every picture',
  'This one still makes me smile',
  'Just being ourselves',
  'Another unforgettable chapter',
  'One of those perfect moments',
  'Good times, great company',
  'A memory I will keep',
  'Little adventures, big memories',
  'A picture full of happiness',
  'The kind of day we needed',
  'One more reason to smile',
  'A moment that stayed with us',
  "Here's to our friendship",
  'So many memories, still counting',
  'And the best is yet to come ✨'
];

function showScene(id){
  sequenceToken++;
  scenes.forEach(scene => { const el=$(scene); if(el) el.hidden=scene!==id; });
  window.scrollTo({top:0,behavior:'instant'});
}
async function playMusic(){
  try { await music.play(); musicPlaying=true; }
  catch(e){musicPlaying=false; console.warn('Could not play music: check assets/music.mp3',e);}
  $('musicToggle').textContent=musicPlaying?'♫ Music: On':'♫ Music: Off';
}
$('beginBtn').addEventListener('click',()=>{
  $('musicToggle').hidden=false;
  playMusic();
  startCountdown();
});
$('musicToggle').addEventListener('click',async()=>{
  if(musicPlaying){music.pause();musicPlaying=false;$('musicToggle').textContent='♫ Music: Off';}
  else await playMusic();
});
async function startCountdown(){
  showScene('countdownScene');
  const token=sequenceToken;
  const number=$('countdownNumber');
  const typed=$('typewriter');
  typed.textContent='';
  for(const digit of ['3','2','1']){
    if(token!==sequenceToken)return;
    number.textContent=digit;
    number.style.animation='none';void number.offsetWidth;number.style.animation='countPop .8s ease both';
    await wait(950);
  }
  number.textContent='✦';
  const message='Some people make every ordinary day extraordinary...';
  for(const char of message){
    if(token!==sequenceToken)return;
    typed.textContent+=char;
    await wait(43);
  }
  await wait(850);
  if(token!==sequenceToken)return;
  showScene('birthday');
  burstConfetti(95);
}
$('toCakeBtn').addEventListener('click',()=>showScene('cakeScene'));
$('wishBtn').addEventListener('click',()=>{
  $('cakeScene').querySelector('.cake').classList.add('blown');
  $('wishBtn').hidden=true;
  $('wishMessage').textContent='May all your beautiful wishes come true ✨';
  $('toPhotosBtn').hidden=false;
  burstConfetti(130);
});
$('toPhotosBtn').addEventListener('click',()=>{showScene('photosScene');showMemory(0);});
function showMemory(index){
  memoryIndex=Math.max(0,Math.min(23,index));
  const img=$('memoryImage');
  img.onerror=()=>{img.onerror=null;img.alt='Missing photo '+(memoryIndex+1)+' — add assets/photo'+(memoryIndex+1)+'.jpg';};
  img.src='assets/photo'+(memoryIndex+1)+'.jpg';
  img.alt='Memory '+(memoryIndex+1);
  $('memoryCaption').textContent=captions[memoryIndex];
  $('memoryCounter').textContent=String(memoryIndex+1).padStart(2,'0')+' / 24';
  $('memoryProgress').style.width=((memoryIndex+1)/24*100)+'%';
  $('prevMemoryBtn').disabled=memoryIndex===0;
  $('nextMemoryBtn').textContent=memoryIndex===23?'See the letter ↓':'Next memory →';
  const wrap=$('memoryPhotoWrap');
  wrap.classList.remove('switching');void wrap.offsetWidth;wrap.classList.add('switching');
}
$('prevMemoryBtn').addEventListener('click',()=>showMemory(memoryIndex-1));
$('nextMemoryBtn').addEventListener('click',()=>{
  if(memoryIndex===23)showScene('letterScene');else showMemory(memoryIndex+1);
});
$('toLetterBtn').addEventListener('click',()=>showScene('letterScene'));
$('envelopeBtn').addEventListener('click',async()=>{
  const envelope=$('envelopeBtn');
  envelope.disabled=true;
  envelope.classList.add('opening');
  await wait(700);
  envelope.hidden=true;
  $('envelopeHint').hidden=true;
  const letter=$('letter');letter.hidden=false;letter.classList.add('revealed');
  $('toFinaleBtn').hidden=false;
  letter.focus({preventScroll:true});
});
$('toFinaleBtn').addEventListener('click',()=>{showScene('finaleScene');burstConfetti(260);});
$('restartBtn').addEventListener('click',()=>{
  $('cakeScene').querySelector('.cake').classList.remove('blown');
  $('wishBtn').hidden=false;$('wishMessage').textContent='';$('toPhotosBtn').hidden=true;
  $('envelopeBtn').hidden=false;$('envelopeBtn').disabled=false;$('envelopeBtn').classList.remove('opening');
  $('envelopeHint').hidden=false;$('letter').hidden=true;$('letter').classList.remove('revealed');
  $('toFinaleBtn').hidden=true;
  showScene('intro');
});
function burstConfetti(count){
  const container=$('confetti');
  const colors=['#f5d794','#ffffff','#df9da9','#c9a4ed'];
  for(let i=0;i<count;i++){
    const piece=document.createElement('span');piece.className='confetti-piece';
    piece.style.left=Math.random()*100+'%';piece.style.backgroundColor=colors[i%colors.length];
    piece.style.animationDelay=Math.random()*.8+'s';piece.style.animationDuration=2.3+Math.random()*2+'s';
    piece.style.setProperty('--drift',(Math.random()*250-125)+'px');
    container.appendChild(piece);
    piece.addEventListener('animationend',()=>piece.remove(),{once:true});
  }
}
