// Keep Select and More reachable without losing any writing-board tools.
(()=>{
 function start(){
  const bar=document.querySelector('.bottom-bar'),dock=bar?.querySelector('.tools');
  const more=document.getElementById('moreTools'),panel=document.getElementById('moreToolsPanel');
  const select=document.getElementById('selectTool'),left=document.querySelector('.left-actions'),pages=document.querySelector('.page-dock');
  if(!bar||!dock||!more||!panel||!select||!left||!pages)return;
  const overflow=document.createElement('div');overflow.className='toolbar-overflow-items';overflow.setAttribute('role','group');overflow.setAttribute('aria-label','Additional writing tools');panel.prepend(overflow);
  const ordered=[];let frame=0;
  function collect(){
   for(const child of dock.children){
    if(child.tagName!=='BUTTON'||child===more||ordered.includes(child))continue;
    // Preserve intentionally hidden controls, such as the old text shortcut.
    if(getComputedStyle(child).display==='none')continue;
    ordered.push(child);
   }
  }
  function setStyle(key,value){if(bar.style.getPropertyValue(key)!==value||bar.style.getPropertyPriority(key)!=='important')bar.style.setProperty(key,value,'important')}
  function directButtons(parent){return [...parent.children].filter(node=>node.tagName==='BUTTON'&&(node===more||ordered.includes(node)))}
  function place(parent,desired){
   const current=directButtons(parent);if(current.length===desired.length&&current.every((node,i)=>node===desired[i]))return;
   desired.forEach(node=>parent.append(node));
  }
  function balance(){
   frame=0;collect();
   const width=window.innerWidth,height=window.innerHeight;
   if(!width||!height)return;
   const large=width>=1200&&height>=600,target=large?52:48;
   const l=left.getBoundingClientRect(),p=pages.getBoundingClientRect();
   let start=Math.max(4,l.width?l.right+4:4),end=Math.min(width-4,p.width?p.left-4:width-4),bottom='env(safe-area-inset-bottom, 0px)';
   if(end-start<target*4+12){
    const top=Math.min(l.width?l.top:height,p.width?p.top:height);
    bottom=Math.max(0,height-top+4)+'px';start=4;end=width-4;
   }
   const available=Math.max(0,end-start);
   if(available<target*4)return;
   setStyle('left',Math.round(start)+'px');setStyle('right',Math.round(width-end)+'px');
   setStyle('width','auto');setStyle('max-width','none');setStyle('transform','none');setStyle('bottom',bottom);
   bar.style.setProperty('--live-tool-width',target+'px');
   const capacity=Math.max(4,Math.floor((available-12)/target));
   const essentials=[select,document.getElementById('pen'),document.getElementById('eraser'),document.getElementById('undo'),document.getElementById('redo'),document.getElementById('clear'),document.getElementById('save')].filter(node=>node&&ordered.includes(node));
   const priority=[...new Set([...essentials,...ordered])],visible=new Set(priority.slice(0,Math.max(0,capacity-1)));
   visible.add(select);
   const main=[select,...ordered.filter(node=>node!==select&&visible.has(node)),more];
   const extra=ordered.filter(node=>!visible.has(node));
   // Move the real controls, preserving their listeners, state, and IDs.
   place(overflow,extra);place(dock,main);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(balance)}
  new MutationObserver(schedule).observe(dock,{childList:true});
  new MutationObserver(schedule).observe(overflow,{childList:true});
  new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});
  if(window.ResizeObserver){const observer=new ResizeObserver(schedule);observer.observe(left);observer.observe(pages)}
  window.addEventListener('resize',schedule);window.addEventListener('orientationchange',schedule);
  // Popups opened from More must stay anchored after their source button is hidden.
  panel.addEventListener('click',event=>{
   const button=event.target.closest('button');if(!button||!overflow.contains(button))return;
   const popup=button.id==='settings'?document.querySelector('.board-settings'):
    button.id==='letterToggle'?document.querySelector('.practice-strip'):
    button.id==='insertTools'?document.getElementById('shapesPanel'):null;
   if(!popup)return;
   requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(popup.classList.contains('hidden')||(popup.classList.contains('practice-strip')&&!popup.classList.contains('open')))return;
    const anchor=more.getBoundingClientRect(),dockRect=bar.getBoundingClientRect(),rect=popup.getBoundingClientRect();
    popup.style.left=Math.max(8,Math.min(anchor.left+anchor.width/2-rect.width/2,innerWidth-rect.width-8))+'px';
    popup.style.right='auto';popup.style.top='auto';popup.style.bottom=Math.max(4,innerHeight-dockRect.top+4)+'px';popup.style.transform='none';
   }));
  },true);
  schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
