let shapeFillEnabled=false,shapeFillColor='#4f9d77';
// Anchor the pen popup to its trigger and keep it inside the viewport.
function positionPenPopup(){
 if(options.classList.contains('hidden'))return;
 const trigger=$('#pen').getBoundingClientRect();
 const bottom=window.innerHeight-trigger.top+8;
 options.style.bottom=bottom+'px';
 options.style.maxHeight=Math.max(48,window.innerHeight-bottom-8)+'px';
 const width=options.getBoundingClientRect().width;
 options.style.left=Math.max(8,Math.min(trigger.left+trigger.width/2-width/2,window.innerWidth-width-8))+'px';
}
new MutationObserver(positionPenPopup).observe(options,{attributes:true,attributeFilter:['class']});
window.addEventListener('resize',positionPenPopup);
bottomBar.addEventListener('scroll',positionPenPopup);
// Shapes are saved as editable stroke data, sharing the page history.
const extraPanel=document.createElement('div');extraPanel.className='extra-panel hidden';extraPanel.setAttribute('aria-label','Insert tools');document.body.append(extraPanel);
const insertButton=document.createElement('button');toolIcon(insertButton,'add','Insert shapes and text');insertButton.id='insertTools';dock.append(insertButton);
iconPaths.shapes='M3 3h8v8H3z M16 13a4 4 0 100 8 4 4 0 000-8 M15 3l6 7H10z';toolIcon(insertButton,'shapes','Shapes');insertButton.setAttribute('aria-expanded','false');extraPanel.id='shapesPanel';insertButton.setAttribute('aria-controls','shapesPanel');dock.insertBefore(insertButton,$('#settings'));
const shapeIcons={Line:'M5 19L19 5',Arrow:'M5 19L19 5 M9 5h10v10',Circle:'M12 3a9 9 0 100 18 9 9 0 000-18',Rectangle:'M4 5h16v14H4z',Triangle:'M12 4l9 16H3z'};
let shapeMode=null,startPoint=null,shapePointer=null;
function chooseShape(mode){erase=false;highlighter=false;penType='pen';$('#eraser').classList.remove('active');$('#pen').classList.remove('active');shapeMode=mode;extraPanel.classList.add('hidden');insertButton.classList.add('active');$('#status').textContent='Drag on the board: '+mode}
for(const mode of ['Line','Arrow','Circle','Rectangle','Triangle']){const b=document.createElement('button');iconPaths[mode]=shapeIcons[mode];toolIcon(b,mode,mode);b.dataset.shape=mode;b.onclick=()=>{chooseShape(mode);extraPanel.querySelectorAll('[data-shape]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});insertButton.setAttribute('aria-expanded','false')};extraPanel.append(b)}
const textButton=document.createElement('button');textButton.id='textInsertTool';iconPaths.text='M4 5h16 M12 5v15 M8 20h8';toolIcon(textButton,'text','Text · ଲେଖା');dock.insertBefore(textButton,$('#settings'));
const editor=document.createElement('dialog');editor.className='text-editor';editor.innerHTML='<form method="dialog"><label>Odia / English text<textarea required rows="3" maxlength="1000"></textarea></label><label>Text size<input type="number" min="12" max="120" value="32" required></label><div><button value="cancel" formnovalidate>Cancel</button><button value="insert">Insert</button></div></form>';document.body.append(editor);
textButton.onclick=()=>{extraPanel.classList.add('hidden');editor.showModal()};
editor.addEventListener('close',()=>{if(editor.returnValue!=='insert')return;const text=editor.querySelector('textarea').value.trim();if(!text)return;strokes.push({text,points:[[.15,.2]],color,size:Math.max(12,Math.min(120,+editor.querySelector('input').value))});redo=[];persist();render()});
insertButton.onclick=()=>{closePanels();closeMore();const open=extraPanel.classList.contains('hidden');extraPanel.classList.toggle('hidden',!open);insertButton.setAttribute('aria-expanded',String(open))};
function shapePoints(a,b){const r=canvas.getBoundingClientRect();if(shapeMode==='Triangle')return[[(a[0]+b[0])/2,a[1]],b,[a[0],b[1]],[(a[0]+b[0])/2,a[1]]];if(shapeMode==='Rectangle')return[a,[b[0],a[1]],b,[a[0],b[1]],a];if(shapeMode==='Circle'){const cx=(a[0]+b[0])/2,cy=(a[1]+b[1])/2;return Array.from({length:65},(_,i)=>[cx+Math.abs(b[0]-a[0])/2*Math.cos(i*Math.PI/32),cy+Math.abs(b[1]-a[1])/2*Math.sin(i*Math.PI/32)])}if(shapeMode==='Arrow'){const angle=Math.atan2((b[1]-a[1])*r.height,(b[0]-a[0])*r.width);return[a,b,[b[0]-18*Math.cos(angle-.5)/r.width,b[1]-18*Math.sin(angle-.5)/r.height],b,[b[0]-18*Math.cos(angle+.5)/r.width,b[1]-18*Math.sin(angle+.5)/r.height]]}return[a,b]}
canvas.addEventListener('pointerdown',e=>{extraPanel.classList.add('hidden');if(!shapeMode||!e.isPrimary||e.button!==0)return;e.stopImmediatePropagation();e.preventDefault();shapePointer=e.pointerId;startPoint=point(e);canvas.setPointerCapture(e.pointerId)},true);
canvas.addEventListener('pointermove',e=>{if(startPoint&&e.pointerId===shapePointer){e.stopImmediatePropagation();current=shapePoints(startPoint,point(e));render()}},true);
function endShape(e){if(!startPoint||e.pointerId!==shapePointer)return;e.stopImmediatePropagation();if(e.type!=='pointercancel'){strokes.push({points:shapePoints(startPoint,point(e)),color,size:+$('#size').value,alpha:1,fillColor:!['Line','Arrow','DoubleArrow'].includes(shapeMode)&&shapeFillEnabled?shapeFillColor:null});redo=[];persist()}current=[];startPoint=null;shapePointer=null;shapeMode=null;insertButton.classList.remove('active');dock.querySelectorAll('[data-shape]').forEach(b=>b.classList.remove('active'));render()}
canvas.addEventListener('pointerup',endShape,true);canvas.addEventListener('pointercancel',endShape,true);
for(const id of ['pen','eraser'])$('#'+id).addEventListener('click',()=>{shapeMode=null;insertButton.classList.remove('active');dock.querySelectorAll('[data-shape]').forEach(b=>b.classList.remove('active'));extraPanel.classList.add('hidden')});
// Additional outlined shapes use the same stroke, history and local storage as existing shapes.
(()=>{
 const icons={Diamond:'M12 3L21 12 12 21 3 12z',Star:'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z',Pentagon:'M12 3l9 6.5-3.4 10.5H6.4L3 9.5z',Hexagon:'M7 3h10l5 9-5 9H7l-5-9z',Heart:'M12 21S3 15 3 9a5 5 0 019-3 5 5 0 019 3c0 6-9 12-9 12z',DoubleArrow:'M3 12h18 M7 8l-4 4 4 4 M17 8l4 4-4 4'};
 for(const [mode,path] of Object.entries(icons)){
  iconPaths[mode]=path;const b=document.createElement('button');toolIcon(b,mode,mode);b.dataset.shape=mode;b.setAttribute('aria-pressed','false');
  b.onclick=()=>{chooseShape(mode);extraPanel.querySelectorAll('[data-shape]').forEach(x=>{const selected=x===b;x.classList.toggle('active',selected);x.setAttribute('aria-pressed',String(selected))});insertButton.setAttribute('aria-expanded','false')};extraPanel.append(b);
 }
 const original=shapePoints;
 shapePoints=function(a,b){
  const cx=(a[0]+b[0])/2,cy=(a[1]+b[1])/2,rx=Math.abs(b[0]-a[0])/2,ry=Math.abs(b[1]-a[1])/2;
  function poly(n,rotation,alternating){const pts=Array.from({length:n},(_,i)=>{const angle=rotation+i*2*Math.PI/n;const factor=alternating&&i%2?.42:1;return[cx+rx*factor*Math.cos(angle),cy+ry*factor*Math.sin(angle)]});return pts.concat([pts[0]])}
  if(shapeMode==='Diamond')return [[cx,cy-ry],[cx+rx,cy],[cx,cy+ry],[cx-rx,cy],[cx,cy-ry]];
  if(shapeMode==='Star')return poly(10,-Math.PI/2,true);
  if(shapeMode==='Pentagon')return poly(5,-Math.PI/2,false);
  if(shapeMode==='Hexagon')return poly(6,0,false);
  if(shapeMode==='Heart'){const pts=Array.from({length:81},(_,i)=>{const t=i*2*Math.PI/80;return[cx+rx*Math.pow(Math.sin(t),3),cy-ry*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/17]});return pts}
  if(shapeMode==='DoubleArrow'){const r=canvas.getBoundingClientRect(),angle=Math.atan2((b[1]-a[1])*r.height,(b[0]-a[0])*r.width);const tip=(p,ang)=>[p[0]-18*Math.cos(ang)/r.width,p[1]-18*Math.sin(ang)/r.height];return[tip(a,angle+Math.PI-.5),a,tip(a,angle+Math.PI+.5),a,b,tip(b,angle-.5),b,tip(b,angle+.5)]}
  return original(a,b);
 };
})();
