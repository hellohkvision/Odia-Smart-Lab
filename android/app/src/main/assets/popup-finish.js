// A shared, compact header for the existing board popups. Actions stay in their original modules.
(()=>{
 const panels=[
  {panel:document.getElementById('shapesPanel'),trigger:document.getElementById('insertTools'),title:'Shapes',icon:'M4 4h7v7H4z M15 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M16 3l5 7h-9z'},
  {panel:document.querySelector('.board-settings'),trigger:document.getElementById('settings'),title:'Board style',icon:'M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M10 15v6'},
  {panel:document.querySelector('.eraser-size-panel'),trigger:document.getElementById('eraser'),title:'Eraser',icon:'M3.7 15.3l9-9a2 2 0 0 1 2.8 0l4.2 4.2a2 2 0 0 1 0 2.8l-6.4 6.4H8.1z M8 11l7 7 M13.5 19.7H21'},
  {panel:document.getElementById('moreToolsPanel'),trigger:document.getElementById('moreTools'),title:'More tools',icon:'M5 12h.01 M12 12h.01 M19 12h.01'}
 ];
 for(const {panel,trigger,title,icon} of panels){
  if(!panel||!trigger||panel.querySelector(':scope > .board-popup-heading'))continue;
  const heading=document.createElement('div');heading.className='board-popup-heading';
  const label=document.createElement('span');label.className='board-popup-heading-label';label.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+icon+'"/></svg><strong></strong>';label.querySelector('strong').textContent=title;
  const close=document.createElement('button');close.type='button';close.className='board-popup-close';close.setAttribute('aria-label','Close '+title);close.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12 M18 6 6 18"/></svg>';
  close.onclick=()=>{panel.classList.add('hidden');trigger.setAttribute('aria-expanded','false');if(trigger.getClientRects().length)trigger.focus()};
  heading.append(label,close);panel.prepend(heading);
 }
 // A tap on the board dismisses temporary menus even when Select consumes the canvas event.
 document.addEventListener('pointerdown',event=>{
  if(event.target!==document.getElementById('canvas'))return;
  const pen=document.getElementById('penOptions');if(pen){pen.classList.add('hidden');document.getElementById('pen')?.setAttribute('aria-expanded','false')}
  for(const {panel,trigger} of panels){if(!panel||!trigger)continue;panel.classList.add('hidden');trigger.setAttribute('aria-expanded','false')}
 },true);
 // The page count stays next to Shapes even when its lower dots are scrolled.
 const shapes=document.getElementById('shapesPanel'),label=shapes?.querySelector('.board-popup-heading-label'),dots=shapes?.querySelector('.shape-page-dots');
 if(label&&dots){const count=document.createElement('span');count.className='shape-page-count';count.setAttribute('aria-live','polite');label.append(count);const update=()=>{const buttons=[...dots.querySelectorAll('button')],current=Math.max(0,buttons.findIndex(b=>b.classList.contains('active')));count.textContent=buttons.length?(current+1)+' / '+buttons.length:''};new MutationObserver(update).observe(dots,{subtree:true,attributes:true,attributeFilter:['class']});update()}
})();
