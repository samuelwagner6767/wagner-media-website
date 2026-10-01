
const header=document.querySelector('.site-header');
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
if(header) window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>40));
if(menu&&nav) menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const glow=document.querySelector('.cursor-glow');
if(glow) window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

document.querySelectorAll('[data-comparison]').forEach(box=>{
  const input=box.querySelector('input');
  const before=box.querySelector('.comparison-before');
  const line=box.querySelector('.comparison-line');
  input.addEventListener('input',()=>{before.style.width=input.value+'%';line.style.left=input.value+'%'});
});

document.querySelectorAll('[data-package]').forEach(link=>link.addEventListener('click',()=>{
  const select=document.querySelector('[name="service"]');
  if(link.dataset.package==='Basis'||link.dataset.package==='Content') select.value='Social Media Management';
  else if(link.dataset.package==='Gründungsaktion') select.value='Aktuelle Aktion';
  else select.value='Individuelle Medienlösung';
}));

const contactForm=document.querySelector('#contact-form');
if(contactForm) contactForm.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(e.target);
  const subject=encodeURIComponent('Website-Anfrage: '+d.get('service'));
  const body=encodeURIComponent(`Name: ${d.get('name')}\nE-Mail: ${d.get('email')}\nTelefon: ${d.get('phone')}\nLeistung: ${d.get('service')}\n\nNachricht:\n${d.get('message')}`);
  location.href=`mailto:info@wagnermediamng.com?subject=${subject}&body=${body}`;
});


/* Smooth inertial scrolling — scroll feel only. No layout/content changes. */
(()=>{
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=window.matchMedia('(pointer: fine)').matches;
  if(reduceMotion||!finePointer)return;

  const root=document.documentElement;
  root.classList.add('smooth-scroll-active');

  let currentY=window.scrollY;
  let targetY=currentY;
  let rafId=0;
  let animating=false;

  const clamp=(value,min,max)=>Math.min(Math.max(value,min),max);
  const maxScroll=()=>Math.max(0,document.documentElement.scrollHeight-window.innerHeight);

  const normalizeWheelDelta=(event)=>{
    let delta=event.deltaY;
    if(event.deltaMode===1)delta*=16;
    if(event.deltaMode===2)delta*=window.innerHeight;
    return delta;
  };

  const hasOwnScrollArea=(node)=>{
    let el=node instanceof Element?node:null;
    while(el&&el!==document.body){
      const style=getComputedStyle(el);
      const overflowY=style.overflowY;
      if((overflowY==='auto'||overflowY==='scroll')&&el.scrollHeight>el.clientHeight+1)return true;
      el=el.parentElement;
    }
    return false;
  };

  const render=()=>{
    const distance=targetY-currentY;
    currentY+=distance*.115;

    if(Math.abs(distance)<.35){
      currentY=targetY;
      animating=false;
      rafId=0;
      window.scrollTo(0,currentY);
      return;
    }

    window.scrollTo(0,currentY);
    rafId=requestAnimationFrame(render);
  };

  const startRender=()=>{
    if(rafId)return;
    animating=true;
    currentY=window.scrollY;
    rafId=requestAnimationFrame(render);
  };

  window.addEventListener('wheel',event=>{
    if(event.defaultPrevented||event.ctrlKey||hasOwnScrollArea(event.target))return;

    const delta=normalizeWheelDelta(event);
    if(!Number.isFinite(delta)||Math.abs(delta)<.01)return;

    event.preventDefault();
    targetY=clamp(targetY+delta*.92,0,maxScroll());
    startRender();
  },{passive:false});

  window.addEventListener('scroll',()=>{
    if(animating)return;
    currentY=window.scrollY;
    targetY=currentY;
  },{passive:true});

  window.addEventListener('resize',()=>{
    targetY=clamp(targetY,0,maxScroll());
    currentY=clamp(currentY,0,maxScroll());
  },{passive:true});

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',event=>{
      const href=link.getAttribute('href');
      if(!href||href==='#')return;

      let target;
      try{target=document.querySelector(href)}catch{return;}
      if(!target)return;

      event.preventDefault();
      const scrollMargin=parseFloat(getComputedStyle(target).scrollMarginTop)||0;
      targetY=clamp(target.getBoundingClientRect().top+window.scrollY-scrollMargin,0,maxScroll());
      startRender();

      if(location.hash!==href)history.pushState(null,'',href);
    });
  });
})();
