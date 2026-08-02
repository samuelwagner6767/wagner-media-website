
const header=document.querySelector('.site-header');
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>40));
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

document.querySelectorAll('[data-comparison]').forEach(box=>{
  const input=box.querySelector('input');
  const before=box.querySelector('.comparison-before');
  const line=box.querySelector('.comparison-line');
  input.addEventListener('input',()=>{before.style.width=input.value+'%';line.style.left=input.value+'%'});
});

document.querySelectorAll('[data-package]').forEach(link=>link.addEventListener('click',()=>{
  const select=document.querySelector('[name="service"]');
  if(link.dataset.package==='Basis'||link.dataset.package==='Content') select.value='Social Media Management';
  else select.value='Individuelle Medienlösung';
}));

document.querySelector('#contact-form').addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(e.target);
  const subject=encodeURIComponent('Website-Anfrage: '+d.get('service'));
  const body=encodeURIComponent(`Name: ${d.get('name')}\nE-Mail: ${d.get('email')}\nTelefon: ${d.get('phone')}\nLeistung: ${d.get('service')}\n\nNachricht:\n${d.get('message')}`);
  location.href=`mailto:info@wagnermediamng.com?subject=${subject}&body=${body}`;
});
