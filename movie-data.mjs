// Free-only image requests omit most theatrical posters.
export function movieSearchURL(query) {
  const term=String(query).trim();
  if(term.length<2) throw Error('Enter at least two characters to search online.');
  const url=new URL('https://en.wikipedia.org/w/api.php');
  url.search=new URLSearchParams({action:'query',generator:'search',gsrsearch:term+' film -intitle:soundtrack -intitle:accolades',gsrnamespace:'0',gsrlimit:'24',prop:'pageimages|extracts|info',inprop:'url',piprop:'thumbnail|name',pilicense:'any',pithumbsize:'400',pilimit:'50',exintro:'1',explaintext:'1',exsentences:'3',exlimit:'20',format:'json',origin:'*'});
  return url;
}
export function safeMovieLink(value,title='') {
  try { const url=new URL(value); if(url.protocol==='https:'&&url.hostname==='en.wikipedia.org') return url.href; } catch {}
  return 'https://en.wikipedia.org/w/index.php?search='+encodeURIComponent(title+' film');
}
export function normalizeMoviePages(data) {
  if(data?.error) throw Error(data.error.info||'Online movie search is temporarily unavailable.');
  return Object.values(data?.query?.pages??{}).filter(page=>{
    if(!Number.isInteger(page.pageid)||page.pageid<1||!page.title||page.missing!==undefined) return false;
    if(/^(list of|category:)|soundtrack|film editor|languages|\(novel\)|\(disambiguation\)/i.test(page.title)) return false;
    if(/\bfilm\)/i.test(page.title)) return true;
    const intro=(page.extract??'').split(/[.!?]/)[0];
    if(/\b(?:company|companies|studio|studios|news|website|award|awards|society|association|registry|festival|fund|organization)\b/i.test(intro)) return false;
    return /\b(?:is|was) an? [^.!?]{0,160}\b(?:film|movie)\b/i.test(intro);
  }).sort((a,b)=>(a.index??0)-(b.index??0)).map(page=>{
    let artwork='';
    try { const url=new URL(page.thumbnail?.source); if(url.protocol==='https:'&&url.hostname==='upload.wikimedia.org') artwork=url.href; } catch {}
    const extract=page.extract||'Open the movie page for details.';
    return {id:'wiki-'+page.pageid,title:page.title,year:(extract.match(/\b(?:18|19|20)\d{2}\b/)??[''])[0],genre:'Film',director:'Wikipedia',description:extract,artwork,url:safeMovieLink(page.fullurl||'https://en.wikipedia.org/?curid='+page.pageid,page.title),imagePage:page.pageimage?'https://en.wikipedia.org/wiki/File:'+encodeURIComponent(page.pageimage):'',source:'Wikipedia · CC BY-SA 4.0'};
  });
}


