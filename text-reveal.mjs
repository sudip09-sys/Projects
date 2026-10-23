const glyphs='01{}[]<>/#$%+=ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function scrambleGlyphs(text,progress,phase=0){
  const chars=Array.from(text),p=Math.max(0,Math.min(1,progress)),resolved=Math.floor(Math.max(0,(p-.16)/.84)*chars.length);
  return chars.map((char,i)=>{const settled=p===1||/\s/.test(char)||i<resolved;return {char:settled?char:glyphs[(i*17+phase*13)%glyphs.length],tint:settled?'':['cyan','violet','pink'][Math.min(2,Math.floor(i/Math.max(1,chars.length)*3))]};});
}
export function scrambleFrame(text,progress,phase=0){
  return scrambleGlyphs(text,progress,phase).map(g=>g.char).join('');
}
export function installTextReveal(isPaused){
  const root=document.querySelector('main'),known=new WeakMap(),running=new Map();
  const selectors='.hero-copy h1,#projects-title,.new-heading h2';
  let raf=0;
  function paint(record,progress,phase=0){
    const cells=scrambleGlyphs(record.text,progress,phase);let i=0;
    record.segments.forEach(s=>s.glyphs.forEach(g=>{const cell=cells[i++];g.textContent=cell.char;if(cell.tint)g.dataset.tint=cell.tint;else delete g.dataset.tint;}));
  }
  function restore(record){paint(record,1);record.element.dataset.decoding='false';}
  function frame(now){
    for(const [element,task] of running){
      if(!element.isConnected){running.delete(element);continue;}
      if(isPaused()){restore(task.record);running.delete(element);continue;}
      const progress=Math.min(1,(now-task.start)/task.duration);
      paint(task.record,progress,Math.floor((now-task.start)/75));
      if(progress===1){restore(task.record);running.delete(element);}
    }
    raf=running.size?requestAnimationFrame(frame):0;
  }
  function play(record,duration=record.hero?1800:780){
    if(isPaused()){restore(record);return;}
    record.played=true;record.lastPlayed=performance.now();
    running.set(record.element,{record,start:record.lastPlayed,duration});
    record.element.dataset.decoding='true';
    paint(record,0);
    if(!raf)raf=requestAnimationFrame(frame);
  }
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){const record=known.get(entry.target);if(record)play(record);observer.unobserve(entry.target);}
  }),{threshold:.4});
  function scan(){
    root.querySelectorAll(selectors).forEach(element=>{
      const existing=known.get(element);
      if(existing){if(!existing.played&&!isPaused())observer.observe(element);return;}
      if(element.closest('form,button,a,[contenteditable],#tool'))return;
      const nodes=[],walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
      while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
      if(!nodes.length)return;
      const record={element,text:nodes.map(n=>n.textContent).join(''),segments:[],hero:element.matches('.hero-copy h1'),played:false,lastPlayed:0};
      known.set(element,record);
      element.setAttribute('aria-label',element.innerText.replace(/\s+/g,' ').trim());
      nodes.forEach(node=>{const span=document.createElement('span');span.className='decode-text';span.setAttribute('aria-hidden','true');const glyphs=Array.from(node.textContent,c=>{const g=document.createElement('span');g.className='decode-glyph';g.textContent=c;span.append(g);return g;});record.segments.push({span,text:node.textContent,glyphs});node.replaceWith(span);});
      element.dataset.decoding='false';
      if(record.hero)element.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&!running.has(element)&&performance.now()-record.lastPlayed>4000)play(record,1400);});
      if(!isPaused())observer.observe(element);
    });
    root.querySelectorAll('[data-replay-text]').forEach(b=>{b.disabled=isPaused();b.title=isPaused()?'Resume motion to enable text reveal':'Watch code turn into words';});
  }
  document.addEventListener('click',event=>{if(event.target.closest('[data-replay-text]'))root.querySelectorAll('.hero-copy h1').forEach(el=>{const record=known.get(el);if(record&&!running.has(el))play(record);});});
  new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1)))scan();}).observe(root,{childList:true,subtree:true});
  scan();
  return {finishAll(){cancelAnimationFrame(raf);raf=0;running.forEach(task=>restore(task.record));running.clear();scan();}};
}
