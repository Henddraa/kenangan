const core = document.getElementById('cur-core');

// — Smooth cursor —
let mx=0, my=0, cx=0, cy=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
(function loop(){
  cx += (mx-cx) * 0.18;
  cy += (my-cy) * 0.18;
  core.style.left = cx+'px';
  core.style.top  = cy+'px';
  requestAnimationFrame(loop);
})();

// — Helpers —
const PINKS = [
  ['#ff4da6','#ffb3ec'], ['#f72585','#ff9de2'],
  ['#ff69c0','#ffe0f5'], ['#ff1493','#ffc8eb'], ['#ff8dcb','#fff0fa'],
];
function rand(a,b){ return a+Math.random()*(b-a); }
function uid(){ return Math.random().toString(36).slice(2,7); }
function pick(){ return PINKS[Math.floor(Math.random()*PINKS.length)]; }

// — SVG shapes trail —
function mkStar(s,c1,c2,id){
  return `<svg width="${s}" height="${s}" viewBox="0 0 20 20"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><polygon points="10,1 11.8,8.2 19,10 11.8,11.8 10,19 8.2,11.8 1,10 8.2,8.2" fill="url(#${id})"/></svg>`;
}
function mkCross(s,c1,c2,id){
  return `<svg width="${s}" height="${s}" viewBox="0 0 20 20"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect x="8.5" y="1" width="3" height="18" rx="1.5" fill="url(#${id})"/><rect x="1" y="8.5" width="18" height="3" rx="1.5" fill="url(#${id})"/></svg>`;
}
function mkDiamond(s,c1,c2,id){
  return `<svg width="${s}" height="${s}" viewBox="0 0 20 20"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><polygon points="10,1 19,10 10,19 1,10" fill="url(#${id})"/></svg>`;
}
const SHAPES = [mkStar, mkCross, mkDiamond];

// — Spawn trail —
let lastT=0;
document.addEventListener('mousemove', e => {
  const now = performance.now();
  if(now-lastT < 36) return;
  lastT = now;

  const sz  = rand(8,17);
  const life= rand(0.5,0.85)+'s';
  const r0  = rand(-30,30)+'deg';
  const r1  = rand(180,540)+'deg';
  const [c1,c2] = pick();
  const id  = uid();
  const fn  = SHAPES[Math.floor(Math.random()*SHAPES.length)];

  const el = document.createElement('div');
  el.className = 'sparkle';
  el.style.cssText = `left:${e.clientX+rand(-5,5)}px;top:${e.clientY+rand(-5,5)}px;--life:${life};--r0:${r0};--r1:${r1};width:${sz}px;height:${sz}px;`;
  el.innerHTML = fn(sz,c1,c2,id);
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), parseFloat(life)*1000+60);
});

// — Heart SVG —
function mkHeart(s,c1,c2,id){
  return `<svg width="${s}" height="${s}" viewBox="0 0 32 29"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><path d="M16 27C8 20 2 15 2 9.5A6.5 6.5 0 0 1 16 6.3 6.5 6.5 0 0 1 30 9.5C30 15 24 20 16 27Z" fill="url(#${id})"/></svg>`;
}

// — Love burst on click —
document.addEventListener('click', e => {
  const x=e.clientX, y=e.clientY;
  const [c1,c2] = pick();

  // Hati besar — ubah angka 46 untuk ganti ukuran
  const center = document.createElement('div');
  center.className = 'love-center';
  center.style.cssText = `left:${x}px;top:${y}px;`;
  center.innerHTML = mkHeart(46, c1, c2, uid());
  document.body.appendChild(center);
  setTimeout(()=>center.remove(), 750);

  // Partikel hati — ubah rand(10,22) untuk ganti ukuran partikel
  for(let i=0; i<10; i++){
    const angle = (360/10)*i + rand(-20,20);
    const dist  = rand(48,105);
    const tx    = Math.cos(angle*Math.PI/180)*dist;
    const ty    = Math.sin(angle*Math.PI/180)*dist;
    const sz    = rand(10,22);
    const dur   = rand(0.5,0.88)+'s';
    const delay = rand(0,0.07)+'s';
    const [pc1,pc2] = pick();

    const p = document.createElement('div');
    p.className = 'love-particle';
    p.style.cssText = `left:${x}px;top:${y}px;--tx:${tx}px;--ty:${ty}px;--dur:${dur};--delay:${delay};width:${sz}px;height:${sz}px;`;
    p.innerHTML = mkHeart(sz,pc1,pc2,uid());
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),(parseFloat(dur)+parseFloat(delay))*1000+120);
  }

  // Glow pulse
  core.style.boxShadow='0 0 24px 10px #ff4da6,0 0 60px 20px rgba(255,77,166,.55)';
  core.style.transform='translate(-50%,-50%) scale(2.2)';
  setTimeout(()=>{ core.style.boxShadow=''; core.style.transform=''; },280);
});

document.addEventListener('mouseleave',()=>{ core.style.opacity='0'; });
document.addEventListener('mouseenter',()=>{ core.style.opacity='1'; });
