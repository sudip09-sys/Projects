import {installTextReveal} from './text-reveal.mjs?v=20261023h';
import {storage} from './shared.mjs?v=20261023h';
import {spherePoints,projectPoint,motionAllowed} from './motion-math.mjs?v=20261023h';
export function startExperience(){
  const canvas=document.createElement('canvas');canvas.id='ambient-code';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=storage.get('pause-motion',false),width=0,height=0,raf=0,last=0,time=0,px=0,py=0,points=[];
  const textReveal=installTextReveal(()=>paused||reduced.matches||document.hidden);
  const tokens=['const','{ }','=>','return','await','01','build()','</>','let','[ ]',';','map()'];
  const globalButton=document.createElement('button');globalButton.id='global-motion';globalButton.className='global-motion';document.body.append(globalButton);
  function sync(){const stopped=paused||reduced.matches;document.body.classList.toggle('motion-paused',stopped);document.querySelectorAll('#motion-toggle,#global-motion').forEach(b=>{b.setAttribute('aria-pressed',String(stopped));const label=stopped?'▶ Resume motion':'❚❚ Pause motion';if(b.textContent!==label)b.textContent=label;b.title=reduced.matches?'Your device prefers reduced motion. Disable that preference to enable animations.':label});}
  function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);points=spherePoints(width<600?150:280);draw();}
  function draw(){
    ctx.clearRect(0,0,width,height);
    const home=document.body.classList.contains('landing'),radius=Math.min(width*(home?.19:.13),height*.29);
    const cx=width*(width<700?.72:.79),cy=home?height*.44:Math.min(height*.27,240);
    ctx.font='10px monospace';
    for(let row=0;row<Math.ceil(height/36)+1;row++){const y=(row*36+time*12)% (height+36);ctx.fillStyle='rgba(164,142,195,.065)';ctx.fillText(('const tools = ideas.map(build);  return somethingUseful;  await explore();  ').repeat(6),-((time*8+row*27)%130),y);}
    const projected=points.map((p,i)=>({...projectPoint(p,time*.28,radius,cx,cy,px,py),i})).sort((a,b)=>a.depth-b.depth);
    for(const p of projected){ctx.font=(8+p.depth*5)+'px monospace';ctx.fillStyle=p.i%4===0?'rgba(125,217,226,'+(.12+p.depth*.66)+')':'rgba(198,160,247,'+(.12+p.depth*.7)+')';ctx.fillText(tokens[p.i%tokens.length],p.x,p.y);}
    ctx.strokeStyle='rgba(175,139,231,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(cx,cy,radius*1.4,radius*.4,time*.13,0,Math.PI*2);ctx.stroke();
  }
  function frame(now){if(!motionAllowed(paused,reduced.matches,document.hidden)){raf=0;return}if(!last||now-last>=33){time+=last?Math.min((now-last)/1000,.1):0;last=now;draw()}raf=requestAnimationFrame(frame)}
  function restart(){cancelAnimationFrame(raf);raf=0;last=0;sync();textReveal.finishAll();draw();if(motionAllowed(paused,reduced.matches,document.hidden))raf=requestAnimationFrame(frame)}
  document.addEventListener('pointermove',e=>{px=(e.clientX/innerWidth-.5)*2;py=(e.clientY/innerHeight-.5)*2;if(paused||reduced.matches)return;const card=e.target.closest('.project-card,.panel,.movie,.note,.repo');if(card){const r=card.getBoundingClientRect();card.style.setProperty('--pointer-x',(e.clientX-r.left)+'px');card.style.setProperty('--pointer-y',(e.clientY-r.top)+'px');}});
  document.addEventListener('click',e=>{const jump=e.target.closest('[data-home-scroll]');if(jump){const id=jump.dataset.homeScroll;if(!document.getElementById(id))location.hash='';requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:paused||reduced.matches?'instant':'smooth',block:'start'}));}if(e.target.closest('#motion-toggle,#global-motion')){paused=!paused;storage.set('pause-motion',paused);restart()}const button=e.target.closest('button,.primary,.open-project');if(button&&motionAllowed(paused,reduced.matches,false))button.animate([{transform:'scale(1)'},{transform:'scale(.96)'},{transform:'scale(1)'}],{duration:260,easing:'ease-out'});});
  const seen=new WeakSet();const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.08});
  function reveal(){sync();document.querySelectorAll('.project-card,.panel,.movie,.note,.repo,.forecast-day,.tool-heading').forEach((el,i)=>{if(seen.has(el))return;seen.add(el);el.style.setProperty('--entry-delay',(i%4)*65+'ms');el.classList.add('reveal-item');if(paused||reduced.matches)el.classList.add('in-view');else observer.observe(el)});}
  new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1)))reveal();}).observe(document.querySelector('main'),{childList:true,subtree:true});
  window.addEventListener('resize',resize);document.addEventListener('visibilitychange',restart);reduced.addEventListener('change',restart);window.addEventListener('hashchange',()=>{time=0;restart();reveal()});
  resize();restart();reveal();
}

