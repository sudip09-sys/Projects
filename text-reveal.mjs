const glyphs='01{}[]<>/#$%+=ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function scrambleFrame(text,progress,phase=0){
  const chars=Array.from(text),p=Math.max(0,Math.min(1,progress));
  if(p===1)return text;
  const resolved=Math.floor(Math.max(0,(p-.16)/.84)*chars.length);
  return chars.map((char,i)=>/\s/.test(char)||i<resolved?char:glyphs[(i*17+phase*13)%glyphs.length]).join('');
}
export function installTextReveal(isPaused){
  const root=document.querySelector('main'),known=new WeakMap(),running=new Map();
  let raf=0;
  const selectors='.hero-copy h1,.tool-heading h1,#projects-title,.project-card h3,.panel>h2';
  function restore(record){record.segments.forEach(s=>s.span.textContent=s.text);record.element.dataset.decoding='false';}
  function frame(now){
    for(const [element,task] of running){
      if(!element.isConnected){running.delete(element);continue;}
      if(isPaused()){restore(task.record);running.delete(element);continue;}
      const progress=Math.min(1,(now-task.start)/task.duration);
      let offset=0;const full=scrambleFrame(task.record.text,progress,Math.floor((now-task.start)/65));
      const chars=Array.from(full);
      task.record.segments.forEach(segment=>{const count=Array.from(segment.text).length;segment.span.textContent=chars.slice(offset,offset+count).join('');offset+=count;});
      if(progress===1){restore(task.record);running.delete(element);}
    }
    raf=running.size?requestAnimationFrame(frame):0;
  }
  function play(record,duration=2400){
    if(isPaused()){restore(record);return;}
    running.set(record.element,{record,start:performance.now(),duration});
    record.element.dataset.decoding='true';
    record.segments.forEach(s=>s.span.textContent=scrambleFrame(s.text,0));
    if(!raf)raf=requestAnimationFrame(frame);
  }
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){const record=known.get(entry.target);if(record)play(record);observer.unobserve(entry.target);}
  }),{threshold:.4});
  function scan(){
    root.querySelectorAll(selectors).forEach(element=>{
      if(known.has(element)||element.closest('#quiz-panel'))return;
      const nodes=[];const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
      while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
      if(!nodes.length)return;
      const record={element,text:nodes.map(n=>n.textContent).join(''),segments:[]};
      known.set(element,record);
      element.setAttribute('aria-label',element.innerText.replace(/\s+/g,' ').trim());
      nodes.forEach(node=>{const span=document.createElement('span');span.className='decode-text';span.setAttribute('aria-hidden','true');span.textContent=node.textContent;record.segments.push({span,text:node.textContent});node.replaceWith(span);});
      element.dataset.decoding='false';
      element.addEventListener('pointerenter',()=>{if(!running.has(element))play(record,1500);});
      if(isPaused())restore(record);else observer.observe(element);
    });
    const host=root.querySelector('.hero-links')||root.querySelector('.tool-heading>div');
    if(host&&!host.querySelector('[data-replay-text]')){
      const button=document.createElement('button');button.type='button';button.className='text-replay';button.dataset.replayText='';button.textContent='↻ Replay text reveal';host.append(button);
    }
    root.querySelectorAll('[data-replay-text]').forEach(b=>{b.disabled=isPaused();b.title=isPaused()?'Resume motion to enable text reveal':'Watch code and numbers turn into words';});
  }
  document.addEventListener('click',event=>{if(event.target.closest('[data-replay-text]'))root.querySelectorAll('.hero-copy h1,.tool-heading h1').forEach(el=>{const record=known.get(el);if(record)play(record);});});
  new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1)))scan();}).observe(root,{childList:true,subtree:true});
  scan();
  return {finishAll(){cancelAnimationFrame(raf);raf=0;running.forEach(task=>restore(task.record));running.clear();scan();}};
}
