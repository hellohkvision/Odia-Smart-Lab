// Classroom navigation uses the existing, implemented activity tabs.
const classroom=document.createElement('aside');classroom.className='classroom-sidebar';classroom.setAttribute('aria-label','Classroom navigation');classroom.innerHTML='<strong><img src="icon.svg" alt="" width="40" height="40" style="vertical-align:middle;border-radius:8px;margin-right:8px">ଓଡ଼ିଆ <span>Smart Lab</span></strong>';document.body.append(classroom);
const classroomToggle=document.createElement('button');classroomToggle.className='classroom-toggle';classroomToggle.textContent='☰';classroomToggle.setAttribute('aria-label','Toggle navigation');document.body.append(classroomToggle);
const classroomHeader=document.createElement('div');classroomHeader.className='classroom-header';classroomHeader.innerHTML='<span>ଶ୍ରେଣୀ 6 · Class 6</span><span>ଓଡ଼ିଆ · Odia</span><span class="connection"></span>';document.body.append(classroomHeader);
const connection=classroomHeader.querySelector('.connection');function updateConnection(){connection.textContent=navigator.onLine?'● Online':'● Offline'}window.addEventListener('online',updateConnection);window.addEventListener('offline',updateConnection);updateConnection();
const classroomItems=[['whiteboard','🏠','ମୁଖ୍ୟ ପୃଷ୍ଠା','Board'],['alphabet','🔤','ଓଡ଼ିଆ ବର୍ଣ୍ଣମାଳା','Alphabet'],['lessons','📚','ପାଠ','Lessons'],['quiz','🎮','ପ୍ରଶ୍ନୋତ୍ତର','Quiz']];
let classroomLanguage='or';
let selectedClass='6',selectedSubject='odia';
const subjectChoices=[['odia','ଓଡ଼ିଆ','Odia'],['english','ଇଂରାଜୀ','English'],['hindi','ହିନ୍ଦୀ','Hindi'],['math','ଗଣିତ','Mathematics'],['science','ବିଜ୍ଞାନ','Science'],['evs','ପରିବେଶ','Environmental studies']];
try{const saved=JSON.parse(localStorage.getItem('odia-classroom-selection')||'{}');if(/^(?:[1-9]|10|11|12)$/.test(String(saved.class)))selectedClass=String(saved.class);if(subjectChoices.some(s=>s[0]===saved.subject))selectedSubject=saved.subject;}catch{}
const classSelector=document.createElement('select');classSelector.id='classroomClass';classSelector.setAttribute('aria-label','Select class');
const subjectSelector=document.createElement('select');subjectSelector.id='classroomSubject';subjectSelector.setAttribute('aria-label','Select subject');subjectSelector.title='Classroom label only. Built-in lessons and quiz cover Odia.';
classroomHeader.children[0].replaceChildren(classSelector);classroomHeader.children[1].replaceChildren(subjectSelector);
function renderClassroomSelectors(){
 const odiaDigits=n=>String(n).replace(/\d/g,d=>'୦୧୨୩୪୫୬୭୮୯'[Number(d)]);
 classSelector.replaceChildren(...Array.from({length:12},(_,i)=>new Option(classroomLanguage==='or'?'ଶ୍ରେଣୀ '+odiaDigits(i+1):'Class '+(i+1),String(i+1))));
 subjectSelector.replaceChildren(...subjectChoices.map(([value,or,en])=>new Option(classroomLanguage==='or'?or:en,value)));
 classSelector.value=selectedClass;subjectSelector.value=selectedSubject;
}
function saveClassroomSelection(){
 selectedClass=classSelector.value;selectedSubject=subjectSelector.value;
 try{localStorage.setItem('odia-classroom-selection',JSON.stringify({class:selectedClass,subject:selectedSubject}));}catch{}
 document.querySelector('#status').textContent='Classroom label updated. Built-in lessons and quiz cover Odia.';
}
classSelector.onchange=saveClassroomSelection;subjectSelector.onchange=saveClassroomSelection;
const classroomNav=document.createElement('nav');classroomNav.className='classroom-nav';classroomNav.setAttribute('aria-label','Classroom activities');classroom.append(classroomNav);
classroomItems.forEach(([id,icon,or,en])=>{const b=document.createElement('button');b.dataset.destination=id;b.innerHTML='<span class="nav-icon" aria-hidden="true">'+icon+'</span><span class="nav-label"></span>';b.onclick=()=>{document.querySelector('[data-tab="'+id+'"]').click();if(innerWidth<=750)document.body.classList.add('classroom-collapsed')};classroomNav.append(b)});
const languageButton=document.createElement('button');languageButton.className='classroom-language';languageButton.onclick=()=>{classroomLanguage=classroomLanguage==='or'?'en':'or';renderClassroomLanguage()};classroom.append(languageButton);
function renderClassroomLanguage(){classroomItems.forEach(([id,icon,or,en])=>{classroomNav.querySelector('[data-destination="'+id+'"] .nav-label').textContent=classroomLanguage==='or'?or:en});languageButton.textContent=classroomLanguage==='or'?'🌐  English':'🌐  ଓଡ଼ିଆ';languageButton.setAttribute('aria-label',classroomLanguage==='or'?'Switch navigation to English':'Switch navigation to Odia');renderClassroomSelectors();updateConnection()}
function updateClassroom(){classroomNav.querySelectorAll('[data-destination]').forEach(b=>b.classList.toggle('active',document.querySelector('[data-tab="'+b.dataset.destination+'"]').classList.contains('active')))}document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',updateClassroom));classroomToggle.onclick=()=>document.body.classList.toggle('classroom-collapsed');document.body.classList.add('classroom-collapsed');renderClassroomLanguage();updateClassroom();

// Keep button, swipe gestures, focus, and accessibility state in sync.
classroom.id='classroomDrawer';
classroomToggle.setAttribute('aria-controls',classroom.id);
const drawerShade=document.createElement('button');
drawerShade.className='classroom-shade';
drawerShade.setAttribute('aria-label','Close navigation');
drawerShade.tabIndex=-1;
document.body.append(drawerShade);
function syncDrawer(){
 const open=!document.body.classList.contains('classroom-collapsed');
 classroomToggle.setAttribute('aria-expanded',String(open));
 classroomToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
 classroomToggle.textContent=open?'×':'☰';
 classroom.setAttribute('aria-hidden',String(!open));
 classroom.inert=!open;
 drawerShade.hidden=!open;
}
function setDrawer(open){
 if(!open&&classroom.contains(document.activeElement))classroomToggle.focus();
 document.body.classList.toggle('classroom-collapsed',!open);
 syncDrawer();
}
classroomToggle.onclick=()=>setDrawer(document.body.classList.contains('classroom-collapsed'));
drawerShade.onclick=()=>setDrawer(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.body.classList.contains('classroom-collapsed')){setDrawer(false);classroomToggle.focus();}});
new MutationObserver(syncDrawer).observe(document.body,{attributes:true,attributeFilter:['class']});
// Swipe the drawer left to close, or the top header right to open.
// Drawing on the board and vertical menu scrolling keep their existing behavior.
for(const surface of [classroom,classroomHeader]){
 let gesture=null;
 surface.addEventListener('pointerdown',e=>{if(e.target.closest('select,button,input'))return;if(e.isPrimary&&e.button===0)gesture={id:e.pointerId,x:e.clientX,y:e.clientY};});
 surface.addEventListener('pointerup',e=>{
  if(!gesture||gesture.id!==e.pointerId)return;
  const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;gesture=null;
  if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.5)return;
  setDrawer(dx>0);
 });
 surface.addEventListener('pointercancel',()=>{gesture=null;});
}
syncDrawer();
