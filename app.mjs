import {buildProjects,previewMarkup} from './project-collection.mjs?v=20261024sessions';
import {startExperience} from './experience.mjs?v=20261024sessions';
import {projects} from './data.mjs?v=20261024sessions';
import {$,$$,esc,storage,toast,empty} from './shared.mjs?v=20261024sessions';
import {mountTool} from './tools.mjs?v=20261024sessions';
const categories=['All',...new Set(projects.map(p=>p.category))];
const main=$('#main');
let cleanup=()=>{},category='All',query='';
let favorites=storage.get('favorites',[]);
if(!Array.isArray(favorites))favorites=[];
function syncFavorites(){$('#favorite-count').textContent=favorites.length;}
function artwork(project){
 if(project.preview)return previewMarkup(project.preview);
 const previews={
 tasks:'<div class="art-task"><i>✓</i><span>Make something useful</span><small>Today</small></div><div class="art-task"><i></i><span>A little room to focus</span></div><div class="art-task"><i></i><span>One thing at a time</span></div>',
 notes:'<div class="art-note"><small>THE NEXT IDEA</small><b>What if we<br>made it simpler?</b><i></i><i></i></div><div class="art-note-back"></div>',
 countdown:'<span class="art-count">12<span>:</span>48<span>:</span>06</span><small class="art-count-label">SOMETHING TO LOOK FORWARD TO</small>',
 colors:'<div class="art-swatches"><i></i><i></i><i></i><i></i><i></i></div>',
 password:'<div class="art-password"><small>GENERATE SOMETHING STRONG</small><code>a9 / K7 / x3 / M8</code><span>Browser cryptography ↗</span></div>',
 text:'<div class="art-text"><span>A thoughtful interface</span><i></i><i></i><i></i><i></i><small>WORDS FOR YOUR NEXT IDEA</small></div>',
 gallery:'<div class="art-landscape"><i class="art-sun"></i><i class="art-mountain"></i><i class="art-mountain front"></i></div>',
 quiz:'<div class="art-quiz"><small>A LITTLE CHALLENGE</small><b>What happens next?</b><i>◯ &nbsp; Make a guess.</i><i>◉ &nbsp; Follow your curiosity.</i></div>',
 github:'<div class="art-repo"><span>⌘ &nbsp; sudip09-sys</span><i><b>Projects</b><small>JavaScript</small></i><i><b>Build. Learn. Repeat.</b><small>Explore code ↗</small></i></div>',
 movies:'<div class="art-film"><i><b>AFTER<br>HOURS</b></i><i><b>WIDE<br>OPEN</b></i><i><b>THE<br>OTHER<br>SIDE</b></i></div>',
 weather:'<div class="art-weather"><span>☀</span><b>Make room<br>for the outdoors.</b><small>YOUR WINDOW TO THE WEATHER</small></div>'
 };
 return '<div class="project-artwork art-'+project.id+'">'+(previews[project.id]||'')+'</div>';
}
function card(project){return `<article class="project-card"><div class="card-art ${project.color} ${project.preview?'preview-art':''}"><span class="card-number">${project.number} / ${esc(project.category)}</span><span class="art-stage" aria-hidden="true">${artwork(project)}</span><button class="favorite" data-favorite="${project.id}" aria-label="${favorites.includes(project.id)?'Remove':'Add'} ${project.name} ${favorites.includes(project.id)?'from':'to'} favorites" aria-pressed="${favorites.includes(project.id)}">${favorites.includes(project.id)?'♥':'♡'}</button></div><div class="card-body"><span class="category">${project.category}</span><h3>${project.name}</h3><p>${project.description}</p><div class="feature-row">${project.features.map(feature=>`<span class="badge">${feature}</span>`).join('')}</div><a class="open-project" href="#tool/${project.id}">Open ${project.name} <span aria-hidden="true">↗</span></a></div></article>`;}
function recentTools(){const saved=storage.get('recent',[]);const list=(Array.isArray(saved)?saved:[]).map(id=>projects.find(p=>p.id===id)).filter(Boolean).slice(0,4);return list.length?'<section class="recent-tools" aria-label="Recently opened"><h2>Right where you left off.</h2><div class="recent-links">'+list.map(p=>'<a href="#tool/'+p.id+'"><span class="'+p.color+'" aria-hidden="true">'+p.icon+'</span>'+p.name+'<small>↗</small></a>').join('')+'</div></section>':'';}
function newCollection(){return '<section class="new-collection" id="new-projects" aria-label="New projects"><div class="new-heading"><span>01 / RECENT EXPERIMENTS</span><h2>Memory, melody,<br>and a message.</h2><p>Three different ways to make something respond.</p></div><div class="new-links">'+buildProjects.map(p=>'<a href="#tool/'+p.id+'"><span class="new-symbol" aria-hidden="true">'+p.icon+'</span><span><strong>'+p.name+'</strong><small>'+p.tagline+'</small></span><b aria-hidden="true">↗</b></a>').join('')+'</div></section>';}
function dashboard(onlyFavorites=false){
 let selected='All';
 if(location.hash.startsWith('#category/')){try{selected=decodeURIComponent(location.hash.slice(10));}catch{}}
 category=categories.includes(selected)?selected:'All';query='';
 main.innerHTML=`<section class="hero code-hero"><figure class="hero-emblem" aria-hidden="true"><img src="assets/sudip-code-face.svg" width="480" height="520" alt=""><figcaption>&lt; sudip /&gt;<span>ALWAYS BUILDING.</span></figcaption></figure><div class="hero-copy"><div class="eyebrow">SUDIP SAH <span>/</span> A PERSONAL PROJECT LAB</div><h1>Made to be<br><em>played with.</em></h1><p>Useful little tools. Playful experiments.<br>One place to explore what I’m building.</p><div class="hero-links"><button class="hero-cta" data-home-scroll="projects-title">Explore ${projects.length} projects <span aria-hidden="true">↗</span></button><a href="#category/Build%20%26%20play">Meet the latest three <span aria-hidden="true">→</span></a><button class="text-replay" data-replay-text>Replay scramble ↻</button></div><div class="maker-lockup"><span class="maker-avatar" aria-hidden="true"><img src="assets/sudip-mark.svg" width="28" height="28" alt=""></span><span><strong>Sudip Sah</strong><small>A curious builder.</small></span></div></div><button id="motion-toggle" class="motion-toggle" aria-pressed="false">❚❚ Pause motion</button><span class="hero-scroll-note">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></span></section><div class="mini-stats"><div><strong>${projects.length}</strong><span>working projects</span></div><div><strong>Built for</strong><span>your browser</span></div><div><strong>Made to</strong><span>be explored</span></div></div>${onlyFavorites?'':newCollection()+recentTools()}<section aria-labelledby="projects-title"><div class="section-title"><div><div class="collection-label">02 / THE COLLECTION</div><h2 id="projects-title">${onlyFavorites?'Keep the good ones.':'A little less ordinary.'}</h2><p>${onlyFavorites?'Your personal shortlist, saved in this browser.':'Find a tool. Follow a thought. Make it your own.'}</p></div><label class="search"><span class="hidden">Search projects</span><input id="search" type="search" placeholder="Find something useful…" aria-label="Search projects"></label></div><div class="filters" aria-label="Project categories">${categories.map(c=>`<button class="filter ${category===c?'active':''}" data-category="${esc(c)}" aria-pressed="${category===c}">${c==='All'?'All projects':esc(c)}</button>`).join('')}<span class="result-count" id="result-count"></span></div><div class="grid" id="project-grid"></div></section><section class="studio-footer"><span class="collection-label">03 / OPEN BY DESIGN</span><h2>Take a look.<br><em>Make it yours.</em></h2><p>Every project comes with the code behind it.</p><div class="hero-links"><a class="primary" href="https://github.com/sudip09-sys/Projects/archive/refs/heads/main.zip">Download the complete code <span aria-hidden="true">↓</span></a><a href="https://github.com/sudip09-sys/Projects" target="_blank" rel="noopener">Explore on GitHub ↗</a></div></section>`;
 const draw=()=>{
  const found=projects.filter(p=>(!onlyFavorites||favorites.includes(p.id))&&(category==='All'||p.category===category)&&[p.name,p.description,p.category].join(' ').toLowerCase().includes(query.toLowerCase()));
  $('#project-grid').innerHTML=found.map(card).join('')||empty(onlyFavorites?'No favorites yet. Tap a heart on any project to save it.':'No projects match. Try a different search or category.');
  $('#result-count').textContent=found.length+' projects';
  $$('[data-favorite]').forEach(button=>button.onclick=()=>{const id=button.dataset.favorite;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];storage.set('favorites',favorites);syncFavorites();draw();});
 };
 const wall=$('.code-wall');
 if(wall)wall.textContent=('const ideas = curiosity.map(build);  function create() { return somethingUseful; }  export { imagination, persistence };  await explore();  ').repeat(70);
 $('#search').oninput=event=>{query=event.target.value;draw();};
 $$('[data-category]').forEach(button=>button.onclick=()=>{category=button.dataset.category;$$('[data-category]').forEach(x=>{x.classList.toggle('active',x===button);x.setAttribute('aria-pressed',String(x===button));});draw();});
 draw();$('#breadcrumb').innerHTML='Workspace <span>/</span> '+esc(onlyFavorites?'Favorites':category==='All'?'All projects':category);
}
function route(){
 document.body.classList.toggle('landing',!location.hash.startsWith('#tool/'));
 cleanup();cleanup=()=>{};const hash=location.hash;
 $$('[data-nav]').forEach(x=>x.classList.toggle('active',hash==='#favorites'?x.dataset.nav==='favorites':hash.startsWith('#category/')?hash.endsWith(encodeURIComponent(x.dataset.nav)):!hash.startsWith('#tool/')&&x.dataset.nav==='all'));
 syncFavorites();
 if(hash.startsWith('#tool/')){
  const project=projects.find(x=>x.id===hash.split('/')[1]);if(!project){location.hash='';return;}
  const recent=storage.get('recent',[]);storage.set('recent',[project.id,...(Array.isArray(recent)?recent:[]).filter(id=>id!==project.id)].slice(0,5));
  main.innerHTML=`<a class="back" href="#">← The collection</a><div class="tool-heading"><div><div class="eyebrow">${project.category} / PROJECT ${project.number}</div><h1>${project.name}</h1><p>${project.tagline}</p></div><div class="tool-mark ${project.color}" aria-hidden="true">${project.icon}</div></div><div id="tool"></div>`;
  $('#breadcrumb').innerHTML='Workspace <span>/</span> '+esc(project.name);cleanup=mountTool(project.id,$('#tool'))||(()=>{});
 }else dashboard(hash==='#favorites');
 window.scrollTo(0,0);
 document.title=hash.startsWith('#tool/')?projects.find(x=>x.id===hash.split('/')[1]).name+' · Sudip Lab':'Sudip Lab — Made to be played with.';
}
const theme=storage.get('theme','light');document.body.classList.toggle('dark',theme==='dark');
$('#theme').onclick=()=>{document.body.classList.toggle('dark');storage.set('theme',document.body.classList.contains('dark')?'dark':'light');toast(document.body.classList.contains('dark')?'Dark theme on':'Light theme on');};
window.addEventListener('hashchange',route);startExperience();route();
