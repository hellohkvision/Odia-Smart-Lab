const $=s=>document.querySelector(s);const canvas=$('#canvas');let ctx=canvas.getContext('2d');let color='#155c50',erase=false,drawing=false,current=[],strokes=[],redo=[],guide='',odia=false,activePointer=null,highlighter=false,penType='pen';const activeInk=new Map();
try{const saved=JSON.parse(localStorage.getItem('odia-board')||'{}');strokes=saved.strokes||[];guide=saved.guide||''}catch{}
function persist(){updateHistory();try{localStorage.setItem('odia-board',JSON.stringify({strokes,guide}));$('#boardnote').textContent='Your board is saved on this device.'}catch{$('#boardnote').textContent='Storage unavailable. Save an image to keep your work.'}}
// Keep a raster cache of completed strokes; only active ink is redrawn during pointer moves.
let committedInk=null, workingInk=null, inkCacheValid=false, inkFrame=0;
function ensureInkSurfaces(width,height){
 if(!committedInk){committedInk=document.createElement('canvas');workingInk=document.createElement('canvas')}
 if(committedInk.width!==width||committedInk.height!==height){
  committedInk.width=width;committedInk.height=height;workingInk.width=width;workingInk.height=height;inkCacheValid=false;
 }
}
function drawBoardStroke(g,s,width,height){
 const p=s.points;if(!Array.isArray(p)||!p.length)return;
 if(s.kind==='svg'){window.drawImportedSvg?.(g,s,width,height);return}
 if(s.kind==='regionFill'){window.drawRegionFill?.(g,s,width,height);return}
 g.save();
 if(Number.isInteger(s.zoneIndex)&&Number.isInteger(s.zoneCount)&&s.zoneCount>1&&s.zoneIndex>=0&&s.zoneIndex<s.zoneCount){
  g.beginPath();g.rect(s.zoneIndex*width/s.zoneCount,0,width/s.zoneCount,height);g.clip();
 }
 g.globalAlpha=s.alpha??1;g.globalCompositeOperation=s.color==='#fffef9'?'destination-out':'source-over';
 g.lineCap='round';g.lineJoin='round';g.strokeStyle=s.color;g.lineWidth=s.size;
 if(s.kind==='letter'&&s.text&&p.length>=2){
  const x=Math.min(p[0][0],p[1][0])*width,y=Math.min(p[0][1],p[1][1])*height;
  const w=Math.abs(p[1][0]-p[0][0])*width,h=Math.abs(p[1][1]-p[0][1])*height;
  g.fillStyle=s.color;g.font=Math.max(1,h*.78)+'px "Noto Sans Odia", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(s.text,x+w/2,y+h/2,Math.max(1,w));g.restore();return;
 }
 if(s.text){
  g.fillStyle=s.color;g.font=s.size+(s.kind==='vocabWord'?'px "Noto Sans Odia", sans-serif':'px sans-serif');g.textAlign='left';g.textBaseline='top';
  const lines=s.text.split('\n');let x=p[0][0]*width,y=p[0][1]*height;
  if(p.length>=2){
   const naturalWidth=Math.max(1,...lines.map(line=>g.measureText(line).width)),naturalHeight=Math.max(1,s.size*(1.2+(lines.length-1)*1.4));
   const boxWidth=Math.max(1,Math.abs(p[1][0]-p[0][0])*width),boxHeight=Math.max(1,Math.abs(p[1][1]-p[0][1])*height);
   x=Math.min(p[0][0],p[1][0])*width;y=Math.min(p[0][1],p[1][1])*height;
   g.translate(x,y);g.scale(boxWidth/naturalWidth,boxHeight/naturalHeight);x=0;y=0;
  }
  lines.forEach((line,i)=>g.fillText(line,x,y+i*s.size*1.4));g.restore();return;
 }
 g.beginPath();g.moveTo(p[0][0]*width,p[0][1]*height);
 if(p.length===1)g.lineTo(p[0][0]*width+.1,p[0][1]*height);
 else if(s.smooth&&p.length>2){
  for(let i=1;i<p.length-1;i++){const a=p[i],b=p[i+1];g.quadraticCurveTo(a[0]*width,a[1]*height,(a[0]+b[0])*width/2,(a[1]+b[1])*height/2)}
  const last=p[p.length-1];g.lineTo(last[0]*width,last[1]*height);
 } else for(const q of p.slice(1))g.lineTo(q[0]*width,q[1]*height);
 if(s.fillColor){g.fillStyle=s.fillColor;const alpha=g.globalAlpha;g.globalAlpha=alpha*(Number.isFinite(s.fillOpacity)?Math.max(0,Math.min(1,s.fillOpacity)):1);g.fill();g.globalAlpha=alpha}
 g.stroke();g.restore();
}
function paintBoard(){
 const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;if(!r.width||!r.height)return;
 const w=Math.round(r.width*d),h=Math.round(r.height*d);
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;inkCacheValid=false}
 ensureInkSurfaces(w,h);
 if(!inkCacheValid){
  const baseInk=committedInk.getContext('2d');baseInk.setTransform(1,0,0,1,0,0);baseInk.clearRect(0,0,w,h);baseInk.setTransform(d,0,0,d,0,0);
  for(const stroke of strokes)if(stroke.kind!=='letter')drawBoardStroke(baseInk,stroke,r.width,r.height);
  inkCacheValid=true;
 }
 const work=workingInk.getContext('2d');work.setTransform(1,0,0,1,0,0);work.clearRect(0,0,w,h);work.drawImage(committedInk,0,0);work.setTransform(d,0,0,d,0,0);
 for(const stroke of activeInk.values())drawBoardStroke(work,stroke,r.width,r.height);
 if(current.length)drawBoardStroke(work,{points:current,color:color,size:+$('#size').value,alpha:1},r.width,r.height);
 ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,r.width,r.height);
 if(guide){ctx.fillStyle='#dfe8da';ctx.font=`${Math.min(r.height*.6,r.width*.5)}px "Noto Sans Odia", sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(guide,r.width/2,r.height/2)}
 for(const stroke of strokes)if(stroke.kind==='letter')drawBoardStroke(ctx,stroke,r.width,r.height);
 ctx.drawImage(workingInk,0,0,r.width,r.height);
}
function render(){inkCacheValid=false;paintBoard()}
function scheduleInkRender(){if(!inkFrame)inkFrame=requestAnimationFrame(()=>{inkFrame=0;paintBoard()})}
function appendInkSamples(stroke,e){
 const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
 const samples=typeof e.getCoalescedEvents==='function'?e.getCoalescedEvents():[];
 const events=samples.length?[...samples,e]:[e];
 for(const sample of events){
  if(!Number.isFinite(sample.clientX)||!Number.isFinite(sample.clientY))continue;
  const p=[(sample.clientX-r.left)/r.width,(sample.clientY-r.top)/r.height];
  if(stroke.zoneCount>1)p[0]=Math.max(stroke.zoneIndex/stroke.zoneCount,Math.min((stroke.zoneIndex+1)/stroke.zoneCount,p[0]));
  const last=stroke.points[stroke.points.length-1];
  if(!last||Math.hypot((p[0]-last[0])*r.width,(p[1]-last[1])*r.height)>=.1)stroke.points.push(p);
 }
}
function point(e){const r=canvas.getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]}
canvas.onpointerdown=e=>{if(e.button!==0||activeInk.has(e.pointerId)||shapeMode||document.querySelector('#selectTool')?.getAttribute('aria-pressed')==='true')return;e.preventDefault();const p=point(e),zones=window.boardZoneOptions||[],count=window.boardZoneCount||1,zoneIndex=Math.min(count-1,Math.max(0,Math.floor(p[0]*count))),zone=zones[zoneIndex],broad=e.pointerType==='touch'&&e.width>=34&&e.height>=25,tool=count>1&&zone?zone.type:penType,ink=count>1&&zone?zone.color:color,width=count>1&&zone?zone.size:+$('#size').value,erasing=erase||broad;canvas.setPointerCapture(e.pointerId);activeInk.set(e.pointerId,{points:[p],smooth:true,zoneIndex:count>1?zoneIndex:null,zoneCount:count,color:erasing?'#fffef9':ink,size:erasing?(window.eraserSize||20):width*(tool==='marker'?1.6:tool==='brush'?1.3:1),alpha:!erasing&&tool==='highlighter'?.3:1});drawing=true;if(erasing&&window.showEraserContact)window.showEraserContact(e,window.eraserSize||20);scheduleInkRender()};
canvas.onpointermove=e=>{const stroke=activeInk.get(e.pointerId);if(!stroke)return;appendInkSamples(stroke,e);if(stroke.color==='#fffef9'&&window.showEraserContact)window.showEraserContact(e,stroke.size);scheduleInkRender()};
function finish(e){const stroke=activeInk.get(e.pointerId);if(!stroke)return;if(e.type==='pointerup')appendInkSamples(stroke,e);activeInk.delete(e.pointerId);if(inkFrame){cancelAnimationFrame(inkFrame);inkFrame=0}if(e.type!=='pointercancel'){strokes.push(stroke);redo=[];persist()}drawing=activeInk.size>0;if(window.hideEraserContact)window.hideEraserContact();render()}
canvas.onpointerup=finish;canvas.onpointercancel=finish;canvas.onlostpointercapture=finish;new ResizeObserver(render).observe(canvas);
for(const c of ['#155c50','#242d3a','#d25343','#d49d24','#4877c3','#9665b1']){const b=document.createElement('button');b.style.background=c;b.setAttribute('aria-label','Use color '+c);b.setAttribute('aria-pressed',String(c===color));b.onclick=()=>{color=c;document.querySelectorAll('.colors button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#pen').click()};$('.colors').append(b)}
$('#pen').onclick=()=>{erase=false;highlighter=penType==='highlighter';$('#pen').classList.add('active');$('#eraser').classList.remove('active')};$('#eraser').onclick=()=>{erase=true;highlighter=false;$('#eraser').classList.add('active');$('#pen').classList.remove('active')};function updateHistory(){$('#undo').disabled=!strokes.length;$('#redo').disabled=!redo.length}$('#undo').onclick=()=>{if(drawing||!strokes.length)return;redo.push(strokes.pop());persist();render()};$('#redo').onclick=()=>{if(drawing||!redo.length)return;strokes.push(redo.pop());persist();render()};updateHistory();$('#paper').onchange=()=>{canvas.dataset.paper=$('#paper').value};$('#freewrite').onclick=()=>{guide='';$('#boardtitle').textContent='ଲେଖନ୍ତୁ · Write and practice';persist();render()};$('#clear').onclick=()=>{if(strokes.length||guide){strokes=[];redo=[];guide='';$('#boardtitle').textContent='ଲେଖନ୍ତୁ · Write and practice';persist();render()}};
$('#save').onclick=()=>{const out=document.createElement('canvas');out.width=canvas.width;out.height=canvas.height;const c=out.getContext('2d');c.fillStyle=getComputedStyle(canvas).backgroundColor;c.fillRect(0,0,out.width,out.height);c.drawImage(canvas,0,0);if(window.AndroidBoard){AndroidBoard.savePng(out.toDataURL('image/png'))}else{const a=document.createElement('a');a.download='odia-smart-lab-board.png';a.href=out.toDataURL();a.click()}};
function tab(name){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('hidden',v.id!==name));document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));if(name==='whiteboard')render()}document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
const vowels=['ଅ','ଆ','ଇ','ଈ','ଉ','ଊ','ଋ','ଏ','ଐ','ଓ','ଔ'];const sounds=['a','aa','i','ee','u','oo','ru','e','ai','o','au'];async function practice(letter){
 if(drawing)return;
 tab('whiteboard');
 const r=canvas.getBoundingClientRect(),w=r.width||innerWidth,h=r.height||innerHeight;
 const glyphHeight=Math.max(30,Math.min(h*.38,w*.3)),glyphWidth=glyphHeight*1.1,left=.4,top=.24;
 const item={kind:'letter',text:letter,points:[[left,top],[left+glyphWidth/w,top+glyphHeight/h]],color:color,size:glyphHeight*.78,alpha:1};
 strokes.push(item);redo=[];persist();$('#boardtitle').textContent='Trace the letter: '+letter;
 if(typeof window.selectBoardItem==='function')window.selectBoardItem(item);else render();
}vowels.forEach((v,i)=>{const b=document.createElement('button');b.innerHTML=v+'<small>'+sounds[i]+'</small>';b.onclick=()=>practice(v);$('#letters').append(b)});
vowels.concat(['କ','ଖ','ଗ','ଘ','ଙ','ଚ','ଛ','ଜ','ଝ','ଞ','ଟ','ଠ','ଡ','ଢ','ଣ','ତ','ଥ','ଦ','ଧ','ନ','ପ','ଫ','ବ','ଭ','ମ','ଯ','ର','ଲ','ଳ','ଶ','ଷ','ସ','ହ']).forEach(letter=>{const b=document.createElement('button');b.textContent=letter;b.setAttribute('aria-label','Practice '+letter);b.onclick=()=>practice(letter);$('#quickLetters').append(b)});if(guide)$('#boardtitle').textContent='Trace the letter: '+guide;
const lessons=[['01 · LANGUAGE','Odia vowels','ଅ ଆ ଇ','Explore the first three vowels and practice their shapes.','Practice ଅ',()=>practice('ଅ')],['02 · NUMBERS','Count with Odia','୧ ୨ ୩','Learn the digits from one to five: ୧ ୨ ୩ ୪ ୫.','Practice ୧',()=>practice('୧')],['03 · CLASS ACTIVITY','Test your knowledge','✦','Identify Odia letters and numbers in a short classroom quiz.','Start quiz',()=>{restart();tab('quiz')}]];for(const [tag,title,glyph,desc,label,action]of lessons){const c=document.createElement('article');c.className='card';c.innerHTML=`<span class="tag">${tag}</span><h2>${title}</h2><div class="glyph">${glyph}</div><p>${desc}</p><button>${label} →</button>`;c.querySelector('button').onclick=action;$('#lessonCards').append(c)}
const questions=[['Which letter makes the “aa” sound?',['ଅ','ଆ','ଇ','ଉ'],1],['Which Odia digit means three?',['୧','୫','୩','୨'],2],['Which letter makes the “i” sound?',['ଓ','ଏ','ଉ','ଇ'],3],['Which Odia digit means five?',['୫','୪','୨','୧'],0]];let qi=0,score=0;function showQ(){$('#progress').textContent=`Question ${qi+1} of ${questions.length} · Score ${score}`;$('#question').textContent=questions[qi][0];$('#feedback').textContent='';$('#next').classList.add('hidden');$('#answers').replaceChildren();questions[qi][1].forEach((a,i)=>{const b=document.createElement('button');b.textContent=a;b.onclick=()=>{const correct=i===questions[qi][2];if(correct)score++;$('#feedback').textContent=correct?'Correct! Well done.':'The correct answer is '+questions[qi][1][questions[qi][2]]+'. Keep learning!';$('#answers').querySelectorAll('button').forEach(x=>x.disabled=true);$('#next').classList.remove('hidden')};$('#answers').append(b)})}function restart(){qi=0;score=0;showQ()}$('#restart').onclick=restart;$('#next').onclick=()=>{qi++;if(qi<questions.length)showQ();else{$('#progress').textContent='Quiz complete';$('#question').textContent=`You scored ${score} out of ${questions.length}!`;$('#answers').replaceChildren();$('#feedback').textContent='Practice makes progress. Try again whenever you’re ready.';$('#next').classList.add('hidden')}};restart();
$('#language').onclick=()=>{odia=!odia;document.documentElement.lang=odia?'or':'en';$('#heading').textContent=odia?'ଆସନ୍ତୁ ଏକାଠି ଶିଖିବା।':'ଓଡ଼ିଆ ଲେଖା ଅଭ୍ୟାସ · Writing Board';$('#subtitle').textContent=odia?'ଲେଖନ୍ତୁ, ଶିଖନ୍ତୁ ଏବଂ ଅଭ୍ୟାସ କରନ୍ତୁ।':'Write with your finger or stylus. Choose a letter to trace and learn.';['ହ୍ୱାଇଟବୋର୍ଡ','ଓଡ଼ିଆ ବର୍ଣ୍ଣମାଳା','ପାଠ','ପ୍ରଶ୍ନୋତ୍ତର'].forEach((t,i)=>document.querySelectorAll('[data-tab]')[i].textContent=odia?t:['✎ Whiteboard','ଅ Odia alphabet','▤ Lessons','✦ Quick quiz'][i]);$('#status').textContent=odia?'ଓଡ଼ିଆ ନାଭିଗେସନ୍ · Lesson instructions are in English.':''};$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{$('#status').textContent='Full screen is unavailable in this browser.'}};if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
