// Quick tools on an empty part of the board; object-specific holds take precedence.
(()=>{
 const style=document.createElement('style');style.textContent='.board-hold-menu{position:fixed;z-index:45;display:flex;gap:3px;padding:5px;border:1px solid #d8d8d8;border-radius:12px;background:#fff;box-shadow:0 6px 24px #0003;color:#222}.board-hold-menu[hidden]{display:none}.board-hold-menu button{width:48px;min-width:48px;height:48px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:0;border-radius:8px;background:transparent;color:#222}.board-hold-menu button:active{background:#ededed}.board-hold-menu button:disabled{opacity:.35}.board-hold-menu svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.board-hold-menu small{font:10px system-ui,sans-serif}';document.head.append(style);
 const menu=document.createElement('div');menu.className='board-hold-menu';menu.hidden=true;menu.setAttribute('role','toolbar');menu.setAttribute('aria-label','Quick board tools');
 const tools=[['Select','selectTool','M5 3l13 11-6 .6L9 20z'],['Pen','pen','M4 20l4-1 11-11-3-3L5 16z M14 6l3 3'],['Eraser','eraser','M3 15l9-9a2 2 0 013 0l5 5-8 9H8z M8 11l7 7 M13 20h8'],['Undo','undo','M9 7l-5 5 5 5 M4 12h10a5 5 0 010 10'],['Redo','redo','M15 7l5 5-5 5 M20 12H10a5 5 0 000 10'],['Board View','boardViewport','M3 8V4h4 M17 4h4v4 M21 16v4h-4 M7 20H3v-4 M8 12h8 M12 8v8']];
 for(const [label,id,path] of tools){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',label);b.title=label;b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+path+'"/></svg><small>'+label+'</small>';b.onclick=()=>{hide();if(id==='boardViewport'){window.openBoardViewport?.();return}const target=document.getElementById(id);if(id==='selectTool'&&target?.getAttribute('aria-pressed')==='true')return;target?.click()};menu.append(b)}
 document.body.append(menu);let pending=null,activePointers=new Set();
 function hide(){menu.hidden=true}
 function cancel(){if(pending)clearTimeout(pending.timer);pending=null}
 function nearContent(x,y,r){
  for(const s of strokes){if(!s||s.color==='#fffef9'||!Array.isArray(s.points)||!s.points.length)continue;const p=s.points;let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
   for(const q of p){left=Math.min(left,q[0]*r.width);top=Math.min(top,q[1]*r.height);right=Math.max(right,q[0]*r.width);bottom=Math.max(bottom,q[1]*r.height)}
   if(p.length===1&&s.text){ctx.save();ctx.font=(Number(s.size)||16)+'px sans-serif';const lines=String(s.text).split('\n');right=left+Math.max(...lines.map(line=>ctx.measureText(line).width));bottom=top+(Number(s.size)||16)*(1.2+(lines.length-1)*1.4);ctx.restore()}
   const pad=Math.max(12,Math.min(40,(Number(s.size)||2)/2+6));if(x>=left-pad&&x<=right+pad&&y>=top-pad&&y<=bottom+pad)return true;
  }return false;
 }
 function show(x,y){closePanels();closeMore();menu.hidden=false;const r=canvas.getBoundingClientRect(),box=menu.getBoundingClientRect(),bar=document.querySelector('.bottom-bar')?.getBoundingClientRect();const bottom=Math.min(r.bottom,bar?.top||r.bottom);menu.style.left=Math.max(r.left+4,Math.min(x-box.width/2,r.right-box.width-4))+'px';menu.style.top=Math.max(r.top+4,Math.min(y-box.height-10,bottom-box.height-4))+'px';menu.querySelectorAll('button').forEach((b,i)=>{const target=document.getElementById(tools[i][1]);b.disabled=!!target?.disabled});}
 canvas.addEventListener('pointerdown',e=>{
  activePointers.add(e.pointerId);hide();if(activePointers.size!==1||!e.isPrimary||e.button!==0||shapeMode||erase||window.boardZoneCount>1||document.body.classList.contains('activity-not-board')||document.querySelector('.laser-choice[aria-pressed="true"]')||document.getElementById('fillAreaTool')?.getAttribute('aria-pressed')==='true'||(window.wideTouchEraserEnabled!==false&&e.pointerType==='touch'&&e.width>=34&&e.height>=25)){cancel();return}
  const r=canvas.getBoundingClientRect();if(nearContent(e.clientX-r.left,e.clientY-r.top,r))return;
  const record={id:e.pointerId,x:e.clientX,y:e.clientY,timer:null};pending=record;record.timer=setTimeout(()=>{if(pending!==record||activePointers.size!==1)return;pending=null;
   if(document.getElementById('selectTool')?.getAttribute('aria-pressed')==='true')canvas.dispatchEvent(new PointerEvent('pointercancel',{pointerId:record.id,pointerType:e.pointerType,isPrimary:true,bubbles:true}));
   else{activeInk.delete(record.id);drawing=activeInk.size>0;if(inkFrame){cancelAnimationFrame(inkFrame);inkFrame=0}window.hideEraserContact?.();render()}
   show(record.x,record.y);
  },700);
 },true);
 canvas.addEventListener('pointermove',e=>{if(pending?.id===e.pointerId&&Math.hypot(e.clientX-pending.x,e.clientY-pending.y)>12)cancel()},true);
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{activePointers.delete(e.pointerId);if(pending?.id===e.pointerId)cancel()},true);
 canvas.addEventListener('contextmenu',e=>e.preventDefault());
 document.addEventListener('pointerdown',e=>{if(!menu.contains(e.target)&&e.target!==canvas)hide()},true);document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});window.addEventListener('resize',hide);window.addEventListener('blur',()=>{cancel();activePointers.clear();hide()});
})();
