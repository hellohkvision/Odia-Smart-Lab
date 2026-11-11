// Keep the classroom activities available behind a compact menu.
const iconPaths={
 marker:'M4 19l3-5L17 4l4 4L11 18l-5 2z M3 22h10',
 pen:'M13.7 5.3l5 5M4 20l4.4-.8L20 7.6a2.1 2.1 0 000-3l-.6-.6a2.1 2.1 0 00-3 0L4.8 15.6 4 20z',
 eraser:'M3.7 15.3l9-9a2 2 0 012.8 0l4.2 4.2a2 2 0 010 2.8l-6.4 6.4H8.1l-4.4-4.4z M8 11l7 7 M13.5 19.7H21',
 undo:'M9 7L4 12l5 5 M4 12h10a5 5 0 010 10',
 redo:'M15 7l5 5-5 5 M20 12H10a5 5 0 000 10',
 clear:'M4 7h16 M9 7V4h6v3 M6 7l.8 12a2 2 0 002 1.8h6.4a2 2 0 002-1.8L18 7 M10 11v6 M14 11v6',
 save:'M5 3h12l4 4v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z M7 3v6h9V3 M7 21v-7h10v7',
 settings:'M4 6h16 M4 12h16 M4 18h16 M8 4v4 M16 10v4 M10 16v4',
 menu:'M2 9l10-5 10 5-10 5-10-5z M6 11v5c3 3 9 3 12 0v-5 M22 9v6',
 letters:'M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z M8 16l4-8 4 8 M9.5 13h5',
 previous:'M15 5l-7 7 7 7',
 next:'M9 5l7 7-7 7',
 add:'M12 5v14 M5 12h14'
};
function toolIcon(button,name,label){
 const assetIcons={pen:'pen-tool',marker:'marker',highlighter:'highlighter'};
 button.innerHTML=assetIcons[name]?'<img class="writing-icon" src="icon-'+assetIcons[name]+'.svg" alt="" aria-hidden="true">':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+iconPaths[name]+'"/></svg>';
 button.setAttribute('aria-label',label);button.title=label;
}
for(const [id,label] of [['pen','Pen & colors'],['eraser','Eraser'],['undo','Undo'],['redo','Redo'],['clear','Clear board'],['save','Save image']])toolIcon($('#'+id),id,label);
const dock=$('.tools');
const options=document.createElement('div');options.id='penOptions';options.className='floating-panel hidden';options.setAttribute('aria-label','Pen settings');
const colors=$('.colors');const sizeInput=$('#size');const paperControl=$('#paper').parentElement;
// Stroke presets control this hidden value; keep the old slider out of the toolbar.
sizeInput.parentElement.remove();sizeInput.type='hidden';options.append(sizeInput);
const typeRow=document.createElement('div');typeRow.className='pen-row type-row';typeRow.setAttribute('aria-label','Pen type');
const types=[['pen','Pen'],['marker','Marker'],['highlighter','Highlighter'],['brush','Brush']];
iconPaths.highlighter='M4 19l3-5L17 4l4 4L11 18l-5 2z M3 22h10';iconPaths.brush='M14 5l5-3 3 3-3 5-7 7-4-4z M8 13c-3 0-3 4-5 6 5 2 9 0 9-3';
const sizeRow=document.createElement('div');sizeRow.className='pen-row size-row';sizeRow.setAttribute('aria-label','Stroke size');
function selectType(type){penType=type;highlighter=type==='highlighter';erase=false;$('#eraser').classList.remove('active');$('#pen').classList.add('active');typeRow.querySelectorAll('button').forEach(b=>{const selected=b.dataset.type===type;b.classList.toggle('chosen',selected);b.setAttribute('aria-pressed',String(selected))})}
types.forEach(([type,label])=>{const b=document.createElement('button');b.dataset.type=type;toolIcon(b,type,label);b.onclick=()=>selectType(type);typeRow.append(b)});
[2,4,8,12].forEach(n=>{const b=document.createElement('button');b.setAttribute('aria-label','Stroke '+n);b.innerHTML='<span style="width:'+Math.max(4,n*1.5)+'px;height:'+Math.max(4,n*1.5)+'px"></span>';b.onclick=()=>{sizeInput.value=n;sizeRow.querySelectorAll('button').forEach(x=>{x.classList.toggle('chosen',x===b);x.setAttribute('aria-pressed',String(x===b))})};b.classList.toggle('chosen',n===4);b.setAttribute('aria-pressed',String(n===4));sizeRow.append(b)});
colors.classList.add('pen-row');const colorInput=document.createElement('input');colorInput.type='color';colorInput.value='#155c50';colorInput.setAttribute('aria-label','Custom color');colorInput.className='custom-color';colorInput.oninput=()=>{color=colorInput.value;colors.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));selectType(penType)};colors.append(colorInput);
options.append(typeRow,sizeRow,colors);document.body.append(options);selectType('pen');
const settings=document.createElement('button');settings.id='settings';toolIcon(settings,'settings','Board style');dock.insertBefore(settings,$('#clear'));const boardSettings=document.createElement('div');boardSettings.className='floating-panel hidden board-settings';boardSettings.append(paperControl);document.body.append(boardSettings);settings.onclick=()=>{const was=boardSettings.classList.contains('hidden');closePanels();boardSettings.classList.toggle('hidden',!was)};
const letterToggle=document.createElement('button');letterToggle.id='letterToggle';letterToggle.textContent='ଅ';letterToggle.setAttribute('aria-label','Odia letter practice');letterToggle.title='Odia letter practice';letterToggle.style.fontSize='25px';dock.insertBefore(letterToggle,$('#undo'));
function closePanels(){options.classList.add('hidden');boardSettings.classList.add('hidden');$('.practice-strip').classList.remove('open');settings.setAttribute('aria-expanded','false');letterToggle.setAttribute('aria-expanded','false');$('#pen').setAttribute('aria-expanded','false')}
function toggleOptions(){const open=options.classList.contains('hidden');closePanels();options.classList.toggle('hidden',!open);settings.setAttribute('aria-expanded',String(open));$('#pen').setAttribute('aria-expanded',String(open))}

const selectPen=$('#pen').onclick;
$('#pen').onclick=e=>{selectPen();selectType(penType);if(e.isTrusted)toggleOptions()};
const selectEraser=$('#eraser').onclick;$('#eraser').onclick=()=>{selectEraser();closePanels()};
letterToggle.onclick=()=>{const open=!$('.practice-strip').classList.contains('open');closePanels();$('.practice-strip').classList.toggle('open',open);letterToggle.setAttribute('aria-expanded',String(open))};
canvas.addEventListener('pointerdown',()=>{closePanels();$('nav').classList.remove('open');const trigger=$('#activityMenu');if(trigger)trigger.setAttribute('aria-expanded','false')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closePanels();$('nav').classList.remove('open');const trigger=$('#activityMenu');if(trigger)trigger.setAttribute('aria-expanded','false')}});
$('#paper').value='plain';canvas.dataset.paper='plain';
const menuTitle=document.createElement('strong');menuTitle.className='saathi-title';menuTitle.textContent='ସାଥୀ';$('nav').prepend(menuTitle);$('nav').id='saathiMenu';$('nav').setAttribute('aria-label','ସାଥୀ menu');
const lang=document.createElement('button');lang.textContent='ଓ / EN';lang.setAttribute('aria-label','Change language');lang.onclick=()=>$('#language').click();$('nav').append(lang);
const full=document.createElement('button');full.textContent='⛶ Full screen';full.onclick=()=>$('#fullscreen').click();$('nav').append(full);
// Icon-only Saathi tiles keep the same actions and accessible names.
const saathiIcons={whiteboard:'M4 4h16v12H4z M8 20l4-4 4 4 M8 11l2-2 3 3 3-3',alphabet:'M12 4c-4 0-6 3-6 5 0 1 1 2 2 2 2 0 2-2 4-2 3 0 4 2 4 4v6 M5 19h14',lessons:'M4 4h12a3 3 0 013 3v13H7a3 3 0 01-3-3z M7 17h12 M8 8h7 M8 11h7',quiz:'M9 4h6l1 2h3v15H5V6h3z M8 10l1 1 2-2 M13 10h3 M8 15l1 1 2-2 M13 15h3',language:'M12 3a9 9 0 100 18 9 9 0 000-18z M3 12h18 M12 3c4 4 4 14 0 18 M12 3c-4 4-4 14 0 18',fullscreen:'M4 9V4h5 M15 4h5v5 M20 15v5h-5 M9 20H4v-5'};
function renderSaathi(){const labels={whiteboard:'Whiteboard',alphabet:'Odia alphabet',lessons:'ପାଠଶାଳା',quiz:'Quiz'};document.querySelectorAll('#saathiMenu [data-tab]').forEach(b=>{const label=labels[b.dataset.tab];b.setAttribute('aria-label',label);b.title=label;b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+saathiIcons[b.dataset.tab]+'"/></svg><small>'+label+'</small>'});for(const [b,key,label] of [[lang,'language','Change language'],[full,'fullscreen','Full screen']]){b.setAttribute('aria-label',label);b.title=label;b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+saathiIcons[key]+'"/></svg><small>'+label+'</small>'}}
lang.onclick=()=>{$('#language').click();renderSaathi()};renderSaathi();
const brand=document.createElement('div');brand.className='board-brand';brand.textContent='ଓଡ଼ିଆ Smart Lab';document.body.append(brand);
const menu=document.createElement('button');menu.id='activityMenu';toolIcon(menu,'menu','ସାଥୀ — ଅଧିକ ବିକଳ୍ପ');menu.setAttribute('aria-controls','saathiMenu');menu.setAttribute('aria-haspopup','true');menu.setAttribute('aria-expanded','false');
menu.onclick=()=>{const open=$('nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));closePanels()};
document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>{$('nav').classList.remove('open');menu.setAttribute('aria-expanded','false');closePanels();dock.classList.toggle('hidden',button.dataset.tab!=='whiteboard');pageControls.classList.toggle('hidden',button.dataset.tab!=='whiteboard')}));
$('#quickLetters').addEventListener('click',closePanels);$('#freewrite').addEventListener('click',closePanels);

// Each page retains its drawing and undo/redo stack independently.
let pages, pageIndex=0, activeBoardUser=1;
try {
 const chosen=Number(localStorage.getItem('odia-active-board-user'));if(chosen>=1&&chosen<=4&&Number.isInteger(chosen))activeBoardUser=chosen;
 const raw=localStorage.getItem('odia-board-user-'+activeBoardUser)||(activeBoardUser===1?localStorage.getItem('odia-board-pages'):null);
 const data=JSON.parse(raw||'null');
 if(data && Array.isArray(data.pages) && data.pages.length){pages=data.pages;pageIndex=Math.max(0,Math.min(data.index||0,pages.length-1))}
} catch {}
if(!pages)pages=activeBoardUser===1?[{strokes,redo,guide}]:[{strokes:[],redo:[],guide:''}];
const originalTab=tab;tab=function(name){originalTab(name);dock.classList.toggle('hidden',name!=='whiteboard');pageControls.classList.toggle('hidden',name!=='whiteboard')};
function loadPage(){const p=pages[pageIndex];strokes=p.strokes||[];redo=p.redo||[];guide=p.guide||'';updateHistory();pageLabel.textContent=(pageIndex+1)+' / '+pages.length;prev.disabled=pageIndex===0;next.disabled=pageIndex===pages.length-1;render()}
persist=function(){
 pages[pageIndex]={strokes,redo,guide};
 updateHistory();
 try{localStorage.setItem('odia-board-user-'+activeBoardUser,JSON.stringify({pages,index:pageIndex}));}
 catch(e){$('#status').textContent='Could not save on device';}
};
const pageControls=document.createElement('div');pageControls.className='page-controls';pageControls.setAttribute('aria-label','Page controls');
function pageButton(label,text){const b=document.createElement('button');b.textContent=text;b.title=label;b.setAttribute('aria-label',label);pageControls.append(b);return b}
const prev=pageButton('Previous page','‹');toolIcon(prev,'previous','Previous page');const pageLabel=document.createElement('span');pageControls.append(pageLabel);const next=pageButton('Next page','›');toolIcon(next,'next','Next page');const add=pageButton('New page','+');toolIcon(add,'add','New page');const bottomBar=document.createElement('div');bottomBar.className='bottom-bar';document.body.append(bottomBar);bottomBar.append(menu,dock,pageControls);
function changePage(index){if(drawing)return;persist();pageIndex=index;loadPage();persist();closePanels()}
prev.onclick=()=>changePage(pageIndex-1);next.onclick=()=>changePage(pageIndex+1);
add.onclick=()=>{if(drawing)return;persist();pages.push({strokes:[],redo:[],guide:''});pageIndex=pages.length-1;loadPage();persist();closePanels()};
loadPage();

// Keep core writing tools visible on phones; move secondary controls into More.
const moreButton=document.createElement('button');moreButton.id='moreTools';toolIcon(moreButton,'add','More writing tools');moreButton.setAttribute('aria-expanded','false');moreButton.setAttribute('aria-controls','moreToolsPanel');
const morePanel=document.createElement('div');morePanel.id='moreToolsPanel';morePanel.className='more-tools-panel hidden';morePanel.setAttribute('aria-label','More writing tools');document.body.append(morePanel);
const secondary=[$('#letterToggle'),$('#settings'),$('#clear'),$('#save'),pageControls];
const placeholders=secondary.map(node=>{const marker=document.createComment('responsive toolbar position');node.before(marker);return marker});
const phoneLayout=window.matchMedia('(max-width: 650px), (max-height: 500px) and (pointer: coarse)');
function closeMore(){morePanel.classList.add('hidden');moreButton.setAttribute('aria-expanded','false')}
function applyToolbarLayout(){closeMore();secondary.forEach((node,i)=>placeholders[i].after(node));moreButton.remove()}
moreButton.onclick=()=>{const shouldOpen=morePanel.classList.contains('hidden');closePanels();$('nav').classList.remove('open');menu.setAttribute('aria-expanded','false');morePanel.classList.toggle('hidden',!shouldOpen);moreButton.setAttribute('aria-expanded',String(shouldOpen))};
morePanel.addEventListener('click',e=>{if(e.target.closest('button'))closeMore()});
canvas.addEventListener('pointerdown',closeMore);menu.addEventListener('click',closeMore);
phoneLayout.addEventListener?phoneLayout.addEventListener('change',applyToolbarLayout):phoneLayout.addListener(applyToolbarLayout);applyToolbarLayout();
