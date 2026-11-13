/** Meowslim original layered vector illustration engine. No external artwork. */
export const palettes = {
  backgrounds: ['#F6E9DA', '#E1EFE8', '#E9E2F7', '#F8D9D6', '#DDEAF9', '#F9EDBF', '#D6E7D2', '#F1DCE6', '#F6F3EA', '#274F47'],
  skin: ['#F7DCC6', '#F0BD9D', '#D99A74', '#B87755', '#925B44', '#6C4336', '#4A2C27'],
  fabric: ['#276D5C', '#C96C63', '#765A9C', '#397DA0', '#D4A14F', '#34475D', '#B77A9A', '#82916A', '#EFE8D6', '#563D51', '#D47F44', '#1F3534'],
  outfits: ['#FFF2D9', '#D7ECE1', '#E9DFF5', '#F2CFCB', '#D3E7F1', '#F4DEA9', '#587B6B', '#EAD4C8'],
  hair: ['#28252B', '#50372E', '#684A38', '#9B7052', '#DDD0BE'],
  eyes: ['#27252C', '#5F493D', '#446B5F', '#597B91']
};
export const choices = {
  gender: ['female','male'],
  covering: ['hijab','khimar','niqab','burqa','kufi','turban','tagelmust','none'],
  hijabStyle: ['classic','layered','draped','sport','wrap','flowing'],
  turbanStyle: ['wrapped','tall','layered','flat'],
  kufiStyle: ['rounded','flat','patterned','tall'],
  face: ['round','oval','heart','square'],
  eyes: ['happy','gentle','open','wink','sleepy','sparkle','closed'],
  mouth: ['smile','grin','open','neutral','laugh','smirk'],
  brows: ['soft','arched','straight','raised'],
  beard: ['none','stubble','trimmed','full','long','goatee'],
  glasses: ['none','round','square','oval'],
  pattern: ['none','dots','stars','rings','grid','arch'],
  clothing: ['tunic','shirt','collar','hoodie'],
  format: ['svg','png']
};
export const presets = [
 {id:'classic',title:'Classic',description:'Warm, timeless and friendly',palette:[0,1,2,3,5]},
 {id:'pastel',title:'Pastel',description:'Soft and sweet',palette:[0,2,3,6,7]},
 {id:'bold',title:'Bold',description:'Bright with personality',palette:[1,3,4,5,9]},
 {id:'earth',title:'Earthy',description:'Grounded natural colors',palette:[0,1,5,6,8]},
 {id:'mono',title:'Minimal',description:'Calm and understated',palette:[8,1,6]}
];
const fillColors = new Set(Object.values(palettes).flat());
export function hashSeed(input){let h=2166136261; for(const ch of String(input)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)}return h>>>0;}
function pick(seed,key,arr){return arr[hashSeed(seed+'|'+key)%arr.length]}
function ensure(value,arr,fallback){return arr.includes(value)?value:fallback}
function color(value,fallback){return typeof value==='string'&&/^#[0-9a-fA-F]{6}$/.test(value)?value:fallback}
function esc(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const coveringByGender={female:['hijab','khimar','niqab','burqa','none'],male:['kufi','turban','tagelmust','none']};
export function generateOptions(seed='salaam',overrides={}){
  seed=String(seed).slice(0,128)||'salaam';
  const gender=ensure(overrides.gender,choices.gender,pick(seed,'gender',choices.gender));
  const preset=ensure(overrides.preset,presets.map(p=>p.id),'classic');
  const possible=coveringByGender[gender];
  const chosen=presets.find(p=>p.id===preset);
  const o={seed,preset,gender,
    covering:ensure(overrides.covering,possible,pick(seed,'covering',possible)),
    hijabStyle:ensure(overrides.hijabStyle,choices.hijabStyle,pick(seed,'hijabStyle',choices.hijabStyle)),
    turbanStyle:ensure(overrides.turbanStyle,choices.turbanStyle,pick(seed,'turbanStyle',choices.turbanStyle)),
    kufiStyle:ensure(overrides.kufiStyle,choices.kufiStyle,pick(seed,'kufiStyle',choices.kufiStyle)),
    face:ensure(overrides.face,choices.face,pick(seed,'face',choices.face)),
    eyes:ensure(overrides.eyes,choices.eyes,pick(seed,'eyes',choices.eyes)),
    mouth:ensure(overrides.mouth,choices.mouth,pick(seed,'mouth',choices.mouth)),
    brows:ensure(overrides.brows,choices.brows,pick(seed,'brows',choices.brows)),
    beard:gender==='male'?ensure(overrides.beard,choices.beard,pick(seed,'beard',choices.beard)):'none',
    glasses:ensure(overrides.glasses,choices.glasses,pick(seed,'glasses',choices.glasses)),
    pattern:ensure(overrides.pattern,choices.pattern,pick(seed,'pattern',choices.pattern)),
    clothing:ensure(overrides.clothing,choices.clothing,pick(seed,'clothing',choices.clothing)),
    skinColor:color(overrides.skinColor,pick(seed,'skin',palettes.skin)),
    fabricColor:color(overrides.fabricColor,pick(seed,'fabric',palettes.fabric)),
    backgroundColor:color(overrides.backgroundColor,palettes.backgrounds[pick(seed,'bg',chosen.palette)]),
    outfitColor:color(overrides.outfitColor,pick(seed,'outfit',palettes.outfits)),
    hairColor:color(overrides.hairColor,pick(seed,'hair',palettes.hair)),
    eyeColor:color(overrides.eyeColor,pick(seed,'eyeColor',palettes.eyes)),
    transparent:overrides.transparent===true||overrides.transparent==='true',
    flip:overrides.flip===true||overrides.flip==='true'
  };
  if(['niqab','burqa','tagelmust'].includes(o.covering))o.mouth='neutral';
  if(o.covering==='burqa')o.glasses='none';
  if(o.gender==='female')o.beard='none';
  return o;
}
function path(d,fill,stroke='',sw=1){return `<path d="${d}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`:''}/>`}
function bgPattern(type){if(type==='none')return ''; const ink='#FFFFFF';let shapes=''; if(type==='dots')for(let y=24;y<480;y+=78)for(let x=24;x<480;x+=78)shapes+=`<circle cx="${x}" cy="${y}" r="5"/>`;if(type==='stars')for(let y=52;y<500;y+=115)for(let x=45;x<500;x+=117)shapes+=`<path d="M${x} ${y-12}l5 8 10 3-10 3-5 8-4-8-10-3 10-3z"/>`;if(type==='rings')for(let y=70;y<520;y+=130)for(let x=60;x<520;x+=130)shapes+=`<circle cx="${x}" cy="${y}" r="31" fill="none" stroke="white" stroke-width="7"/>`;if(type==='grid')for(let x=0;x<=512;x+=64)shapes+=`<path d="M${x} 0v512 M0 ${x}h512" stroke="white" stroke-width="2"/>`;if(type==='arch')for(let x=-30;x<580;x+=120)for(let y=-20;y<600;y+=150)shapes+=`<path d="M${x} ${y+90}v-44a36 36 0 0172 0v44" fill="none" stroke="white" stroke-width="5"/>`;return `<g opacity=".24" fill="${ink}">${shapes}</g>`}
function eyesSvg(o,eyesY){const l=208,r=304,c=o.eyeColor,ink='#302B30';const p=(x)=>{
 switch(o.eyes){case 'happy':return `<path d="M${x-17} ${eyesY+5}q17-21 34 0" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>`;case 'gentle':return `<path d="M${x-15} ${eyesY+1}q15 12 30 0" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>`;case 'wink':return x===l?`<path d="M${x-15} ${eyesY+2}q15-11 30 0" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>`:`<ellipse cx="${x}" cy="${eyesY}" rx="9" ry="13" fill="${c}"/><circle cx="${x+3}" cy="${eyesY-5}" r="3" fill="#fff"/>`;case 'sleepy':return `<path d="M${x-16} ${eyesY}q16 12 32 0" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>`;case 'closed':return `<path d="M${x-17} ${eyesY+2}q17 8 34 0" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>`;case 'sparkle':return `<ellipse cx="${x}" cy="${eyesY}" rx="13" ry="16" fill="${c}"/><circle cx="${x+4}" cy="${eyesY-6}" r="5" fill="#fff"/><circle cx="${x-3}" cy="${eyesY+5}" r="2" fill="#fff"/>`;default:return `<ellipse cx="${x}" cy="${eyesY}" rx="9" ry="13" fill="${c}"/><circle cx="${x+3}" cy="${eyesY-5}" r="3" fill="#fff"/>`;}}
 const brow=(x)=>{const dy=o.brows==='raised'?-13:o.brows==='straight'?0:5;const arch=o.brows==='arched'?-12:o.brows==='soft'?-5:0;return `<path d="M${x-18} ${eyesY-30+dy}q18 ${arch} 36 0" fill="none" stroke="${o.hairColor}" stroke-width="5" stroke-linecap="round" opacity=".78"/>`};return brow(l)+brow(r)+p(l)+p(r);
}
function mouthSvg(o,cy){const ink='#874E50';switch(o.mouth){case 'open':return `<ellipse cx="256" cy="${cy}" rx="16" ry="20" fill="#743F48"/><path d="M245 ${cy+9}q11-5 22 0" fill="none" stroke="#EF9C99" stroke-width="5"/>`;case 'grin':return `<path d="M227 ${cy-9}q29 48 58 0z" fill="#783D45"/><path d="M234 ${cy-5}h44q-3 10-22 11-17 0-22-11" fill="#fff"/>`;case 'laugh':return `<path d="M229 ${cy-9}q27 55 54 0z" fill="#703D48"/><path d="M235 ${cy-6}h42v8h-42z" fill="#fff"/>`;case 'neutral':return `<path d="M242 ${cy}h28" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;case 'smirk':return `<path d="M239 ${cy}q21 14 36-5" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;default:return `<path d="M235 ${cy-3}q21 22 42 0" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;}}
function glassesSvg(o,cy){if(o.glasses==='none')return '';const square=o.glasses==='square';const rx=square?7:23;return `<g fill="none" stroke="#3E403E" stroke-width="6"><rect x="170" y="${cy-22}" width="70" height="51" rx="${rx}"/><rect x="272" y="${cy-22}" width="70" height="51" rx="${rx}"/><path d="M240 ${cy-2}q16-10 32 0M170 ${cy-5}l-15-8M342 ${cy-5}l15-8"/></g>`}
function clothesSvg(o){let top=path('M64 512V452c0-78 69-116 192-116s192 38 192 116v60z',o.outfitColor);top+=path('M188 355q68 69 136 0l-18-14h-100z','#F9E8D5');if(o.clothing==='hoodie')top+=`<path d="M182 358q-40 10-49 58l26 18 16-27M330 358q40 10 49 58l-26 18-16-27" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="13"/><path d="M239 390v50M272 390v50" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;if(o.clothing==='collar')top+=path('M182 350l74 65-58 10-43-62z','#FFF7EA')+path('M330 350l-74 65 58 10 43-62z','#FFF7EA');if(o.clothing==='shirt')top+=`<path d="M256 383v129" stroke="#fff" stroke-opacity=".7" stroke-width="5"/><circle cx="256" cy="430" r="5" fill="#fff"/><circle cx="256" cy="470" r="5" fill="#fff"/>`;if(o.clothing==='tunic')top+=`<path d="M256 391v121" stroke="#fff" stroke-opacity=".45" stroke-width="5"/>`;return top}
function faceShape(o){const map={round:'M256 103c-83 0-126 57-126 142 0 92 49 150 126 150s126-58 126-150c0-85-43-142-126-142z',oval:'M256 91c-83 0-119 65-119 156 0 91 45 163 119 163s119-72 119-163c0-91-36-156-119-156z',heart:'M256 106c-70-47-135 13-132 105 3 96 59 172 132 194 73-22 129-98 132-194 3-92-62-152-132-105z',square:'M157 117q99-35 198 0l35 133-28 107q-106 83-212 0l-28-107z'};return path(map[o.face],o.skinColor)}
function hairSvg(o){return path('M128 220C113 94 172 74 251 70c95-8 160 62 135 156-6-26-23-43-30-71-44 14-123 0-172-8-9 45-35 55-56 73z',o.hairColor)}
function beardSvg(o){if(o.beard==='none')return '';const c=o.hairColor;switch(o.beard){case 'stubble':return `<path d="M153 317q34 79 103 85 69-6 103-85" fill="none" stroke="${c}" stroke-width="12" opacity=".35" stroke-dasharray="3 12" stroke-linecap="round"/>`;case 'trimmed':return path('M145 305q31 80 111 96 80-16 111-96l-13 60q-42 69-98 70-56-1-98-70z',c);case 'full':return path('M142 301q8 72 40 127 35 46 74 48 39-2 74-48 32-55 40-127-26 46-54 51-27 33-60 31-33 2-60-31-28-5-54-51z',c);case 'long':return path('M140 307q10 85 39 125 31 47 47 77h60q16-30 47-77 29-40 39-125-32 45-58 51-25 29-58 27-33 2-58-27-26-6-58-51z',c);default:return path('M221 342q35 25 70 0l-16 47q-19 19-38 0z',c)}}
function scarfSvg(o){const c=o.fabricColor;const crown=path('M118 254C105 117 166 65 256 65c90 0 151 52 138 189-25-25-33-83-56-97-60 15-112-17-169 19-18 12-36 53-51 78z',c);const sides=path('M139 211q-25 48-9 119 5 47-48 115L52 512h164l-29-111q-26-46-19-102z',c)+path('M373 211q25 48 9 119-5 47 48 115l30 67H296l29-111q26-46 19-102z',c);const neck=path('M154 346q42 83 102 85 60-2 102-85l23 45-39 121H170l-39-121z',c);let decorative='';if(o.hijabStyle==='layered')decorative=`<path d="M133 245q16-82 120-98 92 11 126 97M148 372q109 69 216 0" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="13"/>`;if(o.hijabStyle==='draped'||o.hijabStyle==='flowing')decorative=path('M372 282q28 110 64 153l36 77H345l-24-90z',c)+`<path d="M390 354q15 54 36 78" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="8"/>`;if(o.hijabStyle==='sport')decorative=path('M151 343q105 79 210 0l-13 101H164z',c);if(o.hijabStyle==='wrap')decorative=`<path d="M131 220q103-90 250-6" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="16"/>`;if(o.covering==='khimar')return crown+sides+neck+path('M124 334q132 77 264 0l105 178H19z',c)+`<path d="M145 373q111 61 222 0" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="9"/>`;return crown+sides+neck+decorative}
function maskSvg(o){const c=o.fabricColor;if(o.covering==='burqa')return path('M114 220q-14-157 142-157t142 157l62 292H52z',c)+`<rect x="159" y="${222}" width="194" height="95" rx="20" fill="#26443F" opacity=".28"/><g stroke="#fff" stroke-width="3" opacity=".55">${Array.from({length:7},(_,i)=>`<path d="M${173+i*28} 226v87"/>`).join('')}${Array.from({length:4},(_,i)=>`<path d="M169 ${236+i*23}h178"/>`).join('')}</g>`;
 const cloth=path('M118 220q-14-157 138-157t138 157l65 292H53z',c);const eyeOpening=path('M151 220q105-34 210 0v69q-105 20-210 0z',o.skinColor);const eyeBand=path('M136 300q120 35 240 0l-10 212H146z',c);return cloth+eyeOpening+eyesSvg(o,254)+glassesSvg(o,254)+eyeBand+`<path d="M157 314q98 24 198 0" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="5"/>`}
function capSvg(o){const c=o.fabricColor;let d='M139 193q5-113 117-113t117 113q-117-25-234 0z';if(o.kufiStyle==='flat')d='M144 115h224l6 77q-118-25-236 0z';if(o.kufiStyle==='tall')d='M148 72q108-34 216 0l10 119q-118-22-236 0z';let cap=path(d,c);if(o.kufiStyle==='patterned')cap+=`<path d="M149 164q106-18 214 0" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="9" stroke-dasharray="17 7"/>`;else cap+=`<path d="M151 171q105-20 210 0" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="7"/>`;return cap}
function turbanSvg(o){const c=o.fabricColor;return path('M120 208q-38-132 77-160 136-36 195 111l-17 69q-118-53-255-20z',c)+`<g fill="none" stroke="#fff" stroke-opacity=".32" stroke-width="19" stroke-linecap="round"><path d="M121 171q132-103 255-26"/><path d="M128 202q128-80 253-27"/><path d="M174 63q5 71 73 125"/>${o.turbanStyle==='layered'?'<path d="M211 48q-25 69 105 137"/>':''}</g>`}
function tagelmustSvg(o){const c=o.fabricColor;return path('M118 210q-23-138 137-149 151-8 144 149l64 302H50z',c)+path('M155 218q104-34 206 0v69q-102 22-206 0z',o.skinColor)+eyesSvg(o,250)+path('M141 296q115 43 230 0l17 216H124z',c)+`<path d="M146 318q111 41 226 0" fill="none" stroke="#fff" stroke-opacity=".24" stroke-width="11"/>`}
export function renderAvatar(options={}){
 const o=generateOptions(options.seed,options),eyesY=254;
 const covered=['niqab','burqa','tagelmust'].includes(o.covering);
 const face=faceShape(o);
 const ear=`<ellipse cx="134" cy="275" rx="21" ry="35" fill="${o.skinColor}"/><ellipse cx="378" cy="275" rx="21" ry="35" fill="${o.skinColor}"/>`;
 const normalFace=ear+face+(o.gender==='male'||o.covering==='none'?hairSvg(o):'')+eyesSvg(o,eyesY)+`<path d="M254 274q-9 33 8 38" fill="none" stroke="#8F594C" stroke-opacity=".33" stroke-width="5" stroke-linecap="round"/>`+mouthSvg(o,334)+(o.gender==='male'?beardSvg(o):'');
 const head=o.covering==='niqab'||o.covering==='burqa'?maskSvg(o):o.covering==='tagelmust'?tagelmustSvg(o):normalFace+(o.covering==='hijab'||o.covering==='khimar'?scarfSvg(o):o.covering==='kufi'?capSvg(o):o.covering==='turban'?turbanSvg(o):'')+glassesSvg(o,eyesY);
 const background=o.transparent?'':`<rect width="512" height="512" fill="${o.backgroundColor}"/>${bgPattern(o.pattern)}`;
 const title=`Meowslim ${o.gender} avatar with ${o.covering}`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><defs><clipPath id="avatar-clip"><rect width="512" height="512" rx="0"/></clipPath></defs><g clip-path="url(#avatar-clip)">${background}<g${o.flip?' transform="translate(512 0) scale(-1 1)"':''}>${clothesSvg(o)}${head}</g></g></svg>`;
}
export function avatarUrl(options={},format='svg',origin=''){
 const p=new URLSearchParams();for(const [k,v] of Object.entries(options)){if(v!==undefined&&v!==null&&v!=='')p.set(k,String(v))}return `${origin}/api/avatar.${format}?${p}`;
}