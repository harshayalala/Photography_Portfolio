'use strict';

const PHOTOS = [
  { src: 'https://i.imgur.com/rKpVeNc.jpeg '},
  { src: 'https://i.imgur.com/VInoRAG.jpeg' },
  { src: 'https://i.imgur.com/JI07NhM.jpeg'  },
  { src: 'https://i.imgur.com/3vDaGhW.jpeg'},
  { src: 'https://i.imgur.com/KruyjBE.jpeg' },
  { src: 'https://i.imgur.com/KrCqFIV.png' },
  { src: 'https://i.imgur.com/iElRLrF.jpeg' },
  { src: 'https://i.imgur.com/xCStw5f.jpeg' },
  { src:'https://i.imgur.com/HVBIIy3.jpeg' },
  { src:'https://i.imgur.com/qMJnqkD.jpeg' },
  { src:'https://i.imgur.com/s4i0zmI.jpeg' },
  { src:'https://i.imgur.com/SkfUf8Y.jpeg' },
  { src:'https://i.imgur.com/forCSOD.jpeg' },
  { src:'https://i.imgur.com/9nGAK7D.jpeg' },
  { src:'https://i.imgur.com/IUfOffU.jpeg' },
  { src:'https://i.imgur.com/KWtPqRg.jpeg' },
  { src:'https://i.imgur.com/nEi9r2z.jpeg' },
  { src:'https://i.imgur.com/3lnWeCg.jpeg' },
  { src:'https://i.imgur.com/uhwrlVO.jpeg' },
  { src:'https://i.imgur.com/F3YvV1y.jpeg' },
  { src:'https://i.imgur.com/10Na2Es.jpeg' },
  { src:'https://i.imgur.com/YWFcL8T.jpeg' },
  { src:'https://i.imgur.com/zKcBDil.jpeg' },
  { src:'https://i.imgur.com/XLdv5iY.jpeg' },
  { src:'https://i.imgur.com/c4rhzN7.jpeg' },
  { src:'https://i.imgur.com/3EYiNHT.jpeg' },
  { src:'https://i.imgur.com/N6r79NT.jpeg' },
  { src:'https://i.imgur.com/pP3xIxa.jpeg' },
  { src:'https://i.imgur.com/pUhK4EE.jpeg' },
  { src:'https://i.imgur.com/hteGmof.jpeg' },
  { src:'https://i.imgur.com/cA87MH5.jpeg' },
  { src:'https://i.imgur.com/pTk7WpX.jpeg' },
  { src:'https://i.imgur.com/y3rd2TI.jpeg' },
  { src:'https://i.imgur.com/1jHyoaZ.jpeg' },
];

let lbIndex = 0;
let touchStartX = 0;

/* ── PRELOADER ── */
(function () {
  const loader = document.getElementById('preloader');
  const bar    = document.getElementById('preBar');
  const count  = document.getElementById('preCount');
  let n = 0;
  const iv = setInterval(() => {
    n = Math.min(n + Math.random() * 6 + 1, 100);
    bar.style.width = n.toFixed(0) + '%';
    count.textContent = n.toFixed(0);
    if (n >= 100) {
      clearInterval(iv);
      setTimeout(() => { loader.classList.add('done'); setTimeout(() => loader.remove(), 900); }, 400);
    }
  }, 40);

  const prog = document.createElement('div');
  prog.id = 'scroll-progress';
  document.body.prepend(prog);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    prog.style.width = pct.toFixed(2) + '%';
  }, { passive: true });
})();

/* ── CURSOR ── */
(function () {
  const main  = document.getElementById('cursor-main');
  const trail = document.getElementById('cursor-trail');
  const dot   = document.getElementById('cursor-dot');
  let mx=-200,my=-200,t1x=-200,t1y=-200,t2x=-200,t2y=-200;

  document.addEventListener('mousemove', e => {
    mx=e.clientX; my=e.clientY;
    main.style.left=mx+'px'; main.style.top=my+'px';
    dot.style.left=mx+'px';  dot.style.top=my+'px';
  });
  (function loop(){
    t1x+=(mx-t1x)*.12; t1y+=(my-t1y)*.12;
    t2x+=(t1x-t2x)*.08; t2y+=(t1y-t2y)*.08;
    trail.style.left=t2x+'px'; trail.style.top=t2y+'px';
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mouseleave',()=>{ main.style.opacity='0'; trail.style.opacity='0'; dot.style.opacity='0'; });
  document.addEventListener('mouseenter',()=>{ main.style.opacity='1'; trail.style.opacity='1'; dot.style.opacity='1'; });

  const hoverSel='a,button,.gallery-card,#lbClose,#lbPrev,#lbNext,.contact-link';
  document.addEventListener('mouseover', e=>{ if(e.target.closest(hoverSel)) document.body.classList.add('hovering'); });
  document.addEventListener('mouseout',  e=>{ if(e.target.closest(hoverSel)) document.body.classList.remove('hovering'); });
  document.addEventListener('mouseover', e=>{ if(e.target.closest('.gallery-card')) document.body.classList.add('cursor-view'); });
  document.addEventListener('mouseout',  e=>{ if(e.target.closest('.gallery-card')) document.body.classList.remove('cursor-view'); });

  document.addEventListener('click', e => {
    const b=document.createElement('div');
    b.style.cssText=`position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(201,169,110,.5);transform:translate(-50%,-50%) scale(0);pointer-events:none;z-index:9999;transition:transform .6s cubic-bezier(.16,1,.3,1),opacity .6s;`;
    document.body.appendChild(b);
    requestAnimationFrame(()=>{ b.style.transform='translate(-50%,-50%) scale(2.5)'; b.style.opacity='0'; });
    setTimeout(()=>b.remove(),700);
  });
})();

/* ── PARTICLES ── */
(function () {
  const canvas=document.getElementById('particle-canvas');
  const ctx=canvas.getContext('2d');
  let W,H;
  function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
  resize(); window.addEventListener('resize',resize);

  class Particle {
    constructor(type){ this.type=type; this.reset(true); }
    reset(init=false){
      this.x=Math.random()*W; this.y=init?Math.random()*H:H+20;
      this.size=this.type==='large'?Math.random()*1.8+0.8:Math.random()*0.8+0.2;
      this.speedY=-(Math.random()*.35+.07); this.speedX=(Math.random()-.5)*.2;
      this.life=0; this.maxLife=Math.random()*500+250;
      this.maxAlpha=this.type==='large'?Math.random()*.35+.08:Math.random()*.15+.03;
      this.alpha=0; this.wobble=Math.random()*Math.PI*2; this.wobbleSpeed=Math.random()*.02+.005;
    }
    update(){
      this.wobble+=this.wobbleSpeed; this.x+=this.speedX+Math.sin(this.wobble)*.15; this.y+=this.speedY; this.life++;
      const f=80;
      if(this.life<f) this.alpha=(this.life/f)*this.maxAlpha;
      else if(this.life>this.maxLife-f) this.alpha=((this.maxLife-this.life)/f)*this.maxAlpha;
      else this.alpha=this.maxAlpha;
      if(this.life>this.maxLife||this.y<-20) this.reset();
    }
    draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fillStyle=`rgba(201,169,110,${this.alpha})`; ctx.fill(); }
  }

  const particles=[
    ...Array.from({length:60},()=>new Particle('large')),
    ...Array.from({length:80},()=>new Particle('small')),
  ];
  (function loop(){ ctx.clearRect(0,0,W,H); particles.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(loop); })();
})();

/* ── NAV ── */
(function () {
  const nav=document.getElementById('navbar');
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>50),{passive:true});
  window.toggleMenu=function(){
    const m=document.getElementById('mobileMenu'),h=document.getElementById('hamburger');
    const o=m.classList.toggle('open'); h.classList.toggle('open',o); document.body.style.overflow=o?'hidden':'';
  };
  window.closeMenu=function(){
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
    document.body.style.overflow='';
  };
})();

/* ── HERO COUNTER ── */
(function () {
  const el=document.getElementById('heroCounter'); if(!el) return;
  let n=0; const total=PHOTOS.length;
  const iv=setInterval(()=>{ el.textContent=String(++n).padStart(2,'0'); if(n>=total) clearInterval(iv); },65);
})();

/* ── GALLERY cards ── */
(function () {
  const cards=Array.from(document.querySelectorAll('.gallery-card'));

  cards.forEach(card=>{
    const idx=parseInt(card.dataset.idx);
    card.addEventListener('click',()=>openLightbox(idx));
  });

  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('visible'),(parseInt(e.target.dataset.idx)%4)*90);
        obs.unobserve(e.target);
      }
    });
  },{threshold:.04,rootMargin:'0px 0px -20px 0px'});
  cards.forEach(c=>obs.observe(c));

  if(!window.matchMedia('(hover:none)').matches){
    cards.forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
        const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
        card.style.transform=`perspective(1000px) scale(1.03) rotateY(${dx*7}deg) rotateX(${-dy*5}deg)`;
        card.style.transition='transform .1s ease';
        const shine=card.querySelector('.card-shine');
        if(shine) shine.style.background=`linear-gradient(${125+dx*30}deg,rgba(255,255,255,.08) 0%,transparent 50%)`;
      });
      card.addEventListener('mouseleave',()=>{
        card.style.transform='perspective(1000px) scale(1) rotateY(0) rotateX(0)';
        card.style.transition='transform .8s cubic-bezier(.34,1.56,.64,1),opacity .8s ease';
      });
    });
  }
})();

/* ── LIGHTBOX ── */
function openLightbox(idx){
  lbIndex=idx; renderLb();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
  setTimeout(()=>{ const i=document.getElementById('lbImg'); if(i) i.src=''; },600);
}
function navigateLb(dir){
  lbIndex=(lbIndex+dir+PHOTOS.length)%PHOTOS.length;
  const img=document.getElementById('lbImg'),wrap=document.getElementById('lbImgWrap');
  img.style.opacity='0'; img.style.transform=`translateX(${dir*30}px) scale(.97)`;
  wrap.style.transition='transform .2s ease'; wrap.style.transform=`scale(.98) translateX(${dir*20}px)`;
  setTimeout(()=>{
    renderLb();
    img.style.transition='opacity .3s,transform .5s cubic-bezier(.34,1.56,.64,1)';
    img.style.opacity='1'; img.style.transform='translateX(0) scale(1)';
    wrap.style.transform='';
  },220);
}
function renderLb(){
  const photo=PHOTOS[lbIndex];
  const img=document.getElementById('lbImg'),meta=document.getElementById('lbMeta'),prog=document.getElementById('lbProgressBar');
  img.src=photo.src; img.alt='Photo';
  if(meta) meta.textContent=String(lbIndex+1).padStart(2,'0')+' / '+String(PHOTOS.length).padStart(2,'0');
  if(prog) prog.style.width=((lbIndex+1)/PHOTOS.length*100)+'%';
}

document.getElementById('lbClose').addEventListener('click',closeLightbox);
document.getElementById('lbPrev').addEventListener('click',()=>navigateLb(-1));
document.getElementById('lbNext').addEventListener('click',()=>navigateLb(1));
document.getElementById('lightbox').addEventListener('click',e=>{ if(e.target===document.getElementById('lightbox')||e.target===document.getElementById('lbBg')) closeLightbox(); });
document.addEventListener('keydown',e=>{
  if(!document.getElementById('lightbox').classList.contains('open')) return;
  if(e.key==='Escape') closeLightbox();
  if(e.key==='ArrowLeft') navigateLb(-1);
  if(e.key==='ArrowRight') navigateLb(1);
});
document.getElementById('lightbox').addEventListener('touchstart',e=>{ touchStartX=e.touches[0].clientX; },{passive:true});
document.getElementById('lightbox').addEventListener('touchend',e=>{ const dx=e.changedTouches[0].clientX-touchStartX; if(Math.abs(dx)>45) navigateLb(dx<0?1:-1); });

/* ── SCROLL REVEAL ── */
(function(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);} });
  },{threshold:.07});
  document.querySelectorAll('.reveal,.reveal-left').forEach(el=>io.observe(el));
})();

/* ── STAT COUNTERS ── */
(function(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target.querySelector('.stat-number'); if(!el) return;
      const target=parseInt(el.dataset.target); let startTime;
      const dur=1000,easeOut=t=>1-Math.pow(1-t,3);
      function step(ts){ if(!startTime) startTime=ts; const p=Math.min((ts-startTime)/dur,1); el.textContent=Math.round(easeOut(p)*target); if(p<1) requestAnimationFrame(step); }
      requestAnimationFrame(step); io.unobserve(e.target);
    });
  },{threshold:.5});
  document.querySelectorAll('.stat-card').forEach(el=>io.observe(el));
})();

/* ── SMOOTH ANCHOR ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{ const t=document.querySelector(a.getAttribute('href')); if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});} });
});

/* ── PARALLAX ── */
(function(){
  const hero=document.getElementById('hero'); if(!hero) return;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    if(y<window.innerHeight){ const c=hero.querySelector('.hero-content'); if(c) c.style.transform=`translateY(${y*.15}px)`; }
  },{passive:true});
})();

/* ── VISIBILITY ── */
document.addEventListener('visibilitychange',()=>{
  const s=document.hidden?'paused':'running';
  document.querySelectorAll('.orb,.scan-line,.hero-bg-grid').forEach(el=>el.style.animationPlayState=s);
});