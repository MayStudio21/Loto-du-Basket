{
const KEY='loto-basket-v1';
const grid=document.getElementById('grid'),big=document.getElementById('big'),prev=document.getElementById('prev');
const count=document.getElementById('count'),left=document.getElementById('left'),modal=document.getElementById('modal');
let drawn=[];
const load=()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');if(Array.isArray(s.drawn))drawn=s.drawn.filter(n=>Number.isInteger(n)&&n>=1&&n<=100)}catch(e){}};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({drawn}))}catch(e){}};

/* boules déco : 3 couleurs, numéros aléatoires différents */
const pick=[];while(pick.length<3){const n=1+Math.floor(Math.random()*100);if(!pick.includes(n))pick.push(n)}
const cols=[['#ff8a3d','#c2410c'],['#5cb8ff','#1d5fa8'],['#ffd34d','#c98a00']];
document.getElementById('balls').innerHTML=pick.map((n,i)=>`<div class="bb b${i+1}"><svg viewBox="0 0 100 100"><defs><radialGradient id="g${i}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".25" stop-color="${cols[i][0]}"/><stop offset="1" stop-color="${cols[i][1]}"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="url(#g${i})"/><circle cx="50" cy="52" r="24" fill="#fbf6ef"/><text x="50" y="61" text-anchor="middle">${n}</text><ellipse cx="34" cy="24" rx="12" ry="6" fill="#fff" opacity=".45" transform="rotate(-30 34 24)"/></svg></div>`).join('');

grid.innerHTML=Array.from({length:100},(_,i)=>`<button class="c" type="button" data-n="${i+1}" aria-pressed="false" aria-label="Numéro ${i+1}"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" pathLength="100"/></svg><span>${i+1}</span></button>`).join('');
const cells=[...grid.children];
const render=(popN)=>{
  cells.forEach(c=>{const n=+c.dataset.n,on=drawn.includes(n);c.classList.toggle('on',on);c.classList.toggle('last',n===drawn[drawn.length-1]);c.setAttribute('aria-pressed',on)});
  const last=drawn[drawn.length-1];
  big.textContent=last??'--';big.classList.toggle('empty',!last);
  if(popN){big.classList.remove('pop');void big.offsetWidth;big.classList.add('pop')}
  prev.innerHTML=drawn.slice(-6,-1).reverse().map(n=>`<span>${n}</span>`).join('');
  count.textContent=drawn.length;left.textContent=100-drawn.length;
};
grid.addEventListener('click',e=>{
  const c=e.target.closest('.c');if(!c)return;const n=+c.dataset.n;
  if(drawn.includes(n)){drawn=drawn.filter(x=>x!==n);render()}
  else{drawn.push(n);c.classList.remove('bounce');void c.offsetWidth;c.classList.add('bounce');render(true)}
  save();
});
const undo=()=>{if(!drawn.length)return;drawn.pop();render(true);save()};
document.getElementById('undo').addEventListener('click',undo);
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();undo()}
  if(e.key==='Escape')modal.classList.remove('open');
});
document.getElementById('reset').addEventListener('click',()=>{
  document.getElementById('mp').textContent=drawn.length?`${drawn.length} numéro${drawn.length>1?'s':''} tiré${drawn.length>1?'s':''} seront effacés et toutes les cases redeviendront normales.`:'La grille est déjà vide.';
  modal.classList.add('open');document.getElementById('no').focus();
});
document.getElementById('no').addEventListener('click',()=>modal.classList.remove('open'));
modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
document.getElementById('yes').addEventListener('click',()=>{drawn=[];cells.forEach(c=>c.classList.remove('bounce'));render();save();modal.classList.remove('open')});
document.getElementById('fs').addEventListener('click',async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){}
});
load();render();
}
