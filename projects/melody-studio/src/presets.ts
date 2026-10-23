export interface Preset {id:string;name:string;style:string;bpm:number;swing:number;wave:OscillatorType;melody:number[];roots:number[];minor:boolean;kick:number[];snare:number[];hat:number[];}
const eighths=[0,2,4,6,8,10,12,14],four=[0,4,8,12];
export const presets:Preset[]=[
{id:'lofi',name:'Midnight Window',style:'Lo-fi',bpm:78,swing:.16,wave:'triangle',minor:true,roots:[57,53,48,55],melody:[72,0,76,0,79,0,76,74,72,0,69,0,67,0,69,0],kick:[0,7,10],snare:[4,12],hat:eighths},
{id:'boombap',name:'Sidewalk Stories',style:'Boom bap',bpm:92,swing:.12,wave:'triangle',minor:true,roots:[57,50,53,52],melody:[69,0,72,74,0,72,0,67,69,0,76,0,74,72,0,67],kick:[0,6,8,11],snare:[4,12],hat:eighths},
{id:'trap',name:'Neon After Dark',style:'Trap',bpm:140,swing:0,wave:'sine',minor:true,roots:[57,53,50,52],melody:[81,0,0,76,0,79,0,0,81,0,84,0,79,0,76,0],kick:[0,3,10,14],snare:[8],hat:[0,2,4,6,8,10,12,13,14,15]},
{id:'house',name:'Golden Hour Club',style:'House',bpm:124,swing:0,wave:'triangle',minor:false,roots:[48,55,57,53],melody:[0,72,0,76,0,79,0,76,0,74,0,77,0,81,79,0],kick:four,snare:[4,12],hat:[2,6,10,14]},
{id:'techno',name:'Concrete Pulse',style:'Techno',bpm:132,swing:0,wave:'sawtooth',minor:true,roots:[45,45,53,52],melody:[69,0,69,72,0,69,0,76,69,0,72,0,74,0,72,67],kick:four,snare:[4,12],hat:[0,2,3,6,8,10,11,14]},
{id:'synthpop',name:'Electric Postcard',style:'Synth-pop',bpm:112,swing:0,wave:'triangle',minor:false,roots:[48,55,57,53],melody:[72,0,76,79,0,76,74,0,72,0,74,77,0,76,0,72],kick:[0,6,8,14],snare:[4,12],hat:eighths},
{id:'afro',name:'Sunrise Courtyard',style:'Afrobeat',bpm:104,swing:.06,wave:'sine',minor:false,roots:[48,53,55,48],melody:[76,0,79,0,0,81,79,0,76,0,74,0,72,74,0,76],kick:[0,6,10],snare:[4,11,14],hat:[0,2,5,6,8,10,13,14]},
{id:'reggaeton',name:'Coastal Lights',style:'Reggaeton',bpm:96,swing:0,wave:'triangle',minor:true,roots:[57,53,48,55],melody:[76,0,0,74,72,0,0,69,72,0,74,0,76,0,72,0],kick:[0,8],snare:[3,6,11,14],hat:eighths},
{id:'dnb',name:'City in Motion',style:'Drum & bass',bpm:172,swing:0,wave:'sine',minor:true,roots:[57,53,50,55],melody:[81,0,0,79,0,76,0,0,74,0,76,0,79,0,76,0],kick:[0,6,10],snare:[4,12],hat:[0,2,3,6,8,10,11,14]},
{id:'funk',name:'Pocket Sunshine',style:'Funk',bpm:108,swing:.08,wave:'triangle',minor:false,roots:[48,53,48,55],melody:[0,76,0,79,0,76,74,0,72,0,0,74,76,0,79,0],kick:[0,3,7,10],snare:[4,12],hat:[0,2,4,6,7,8,10,12,14,15]},
{id:'disco',name:'Mirrorball Avenue',style:'Disco',bpm:118,swing:0,wave:'triangle',minor:false,roots:[48,57,53,55],melody:[76,0,79,0,81,0,79,76,74,0,77,0,79,0,76,0],kick:four,snare:[4,12],hat:eighths},
{id:'rnb',name:'Velvet Letters',style:'R&B',bpm:72,swing:.14,wave:'sine',minor:true,roots:[57,50,55,48],melody:[76,0,0,74,0,72,0,0,71,0,72,0,69,0,0,0],kick:[0,7,10],snare:[4,12],hat:[0,2,6,8,10,14]},
{id:'acoustic',name:'Sunday Balcony',style:'Acoustic pop',bpm:92,swing:0,wave:'triangle',minor:false,roots:[48,55,57,53],melody:[72,0,74,0,76,0,79,0,76,0,74,0,72,0,67,0],kick:[0,8],snare:[4,12],hat:[0,4,8,12]},
{id:'cinematic',name:'Beyond the Horizon',style:'Cinematic',bpm:68,swing:0,wave:'sine',minor:true,roots:[57,53,48,55],melody:[69,0,0,0,76,0,0,0,79,0,0,76,74,0,72,0],kick:[0,10],snare:[12],hat:[6,14]},
{id:'latin',name:'Terrace at Dusk',style:'Latin pop',bpm:106,swing:.04,wave:'triangle',minor:true,roots:[57,50,52,57],melody:[76,0,72,0,0,74,76,0,79,0,76,0,72,0,71,0],kick:[0,6,8],snare:[3,7,10,14],hat:[0,2,4,6,8,10,12,14]},
{id:'garage',name:'Last Train Home',style:'UK garage',bpm:130,swing:.18,wave:'sine',minor:true,roots:[57,53,55,52],melody:[0,76,0,72,0,0,79,0,0,74,0,71,72,0,0,69],kick:[0,7,10],snare:[4,12],hat:[0,2,5,6,8,10,13,14]}
];
export function stepEvents(p:Preset,step:number){
 const local=step%16,bar=Math.floor(step/16)%4,root=p.roots[bar];
 const note=p.melody[(local+(bar%2===1?4:0))%16];
 return {kick:p.kick.includes(local),snare:p.snare.includes(local),hat:p.hat.includes(local),melody:note+(note&&bar===3&&local===12?12:0),bass:local===0||local===6||local===10?root-12:0,chord:local===0?[root,root+([2,4,9].includes(root%12)?3:4),root+7,root+([0,5].includes(root%12)?11:10)]:[]};
}
export const midiFrequency=(note:number)=>440*2**((note-69)/12);
export const stepSeconds=(bpm:number,swing:number,step:number)=>60/bpm/4*(step%2===0?1+swing:1-swing);
