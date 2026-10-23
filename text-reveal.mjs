const glyphs='01{}[]<>/#$%+=ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function scrambleFrame(text,progress,phase=0){
  const chars=Array.from(text),p=Math.max(0,Math.min(1,progress));
  if(p===1)return text;
  const resolved=Math.floor(Math.max(0,(p-.16)/.84)*chars.length);
  return chars.map((char,i)=>/\s/.test(char)||i<resolved?char:glyphs[(i*17+phase*13)%glyphs.length]).join('');
}
export function installTextReveal(isPaused){
  const root=document.querySelector('main'),known=new WeakMap(),running=new Map();
  const selectors='.hero-copy h1,#projects-title,.new-heading h2';
  let raf=0;
  function restore(record){record.segments.forEach(s=>s.span.textContent=s.text);record.element.dataset.decoding='false';}
  function frame(now){
    for(const [element,task] of running){
      if(!element.isConnected){running.delete(element);continue;}
      if(isPaused()){restore(task.record);running.delete(element);continue;}
      const progress=Math.min(1,(now-task.start)/task.duration);
      const chars=Array.from(scrambleFrame(task.record.text,progress,Math.floor((now-task.start)/75)));
      let offset=0;
      task.record.segments.forEach(segment=>{const count=Array.from(segment.text).length;segment.span.textContent=chars.slice(offset,offset+count).join('');offset+=count;});
      if(progress===1){restore(task.record);running.delete(element);}
    }
    raf=running.size?requestAnimationFrame(frame):0;
  }
  function play(record,duration=record.hero?1800:780){
    if(isPaused()){restore(record);return;}
    record.played=true;record.lastPlayed=performance.now();
    running.set(record.element,{record,start:record.lastPlayed,duration});
    record.element.dataset.decoding='true';
    record.segments.forEach(s=>s.span.textContent=scrambleFrame(s.text,0));
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
      nodes.forEach(node=>{const span=document.createElement('span');span.className='decode-text';span.setAttribute('aria-hidden','true');span.textContent=node.textContent;record.segments.push({span,text:node.textContent});node.replaceWith(span);});
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
