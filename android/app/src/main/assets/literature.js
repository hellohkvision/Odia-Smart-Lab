/* Class 6 Sahitya Sudha. Original activities based on the user-supplied chapter.
 * No board state is changed. Open-ended work is teacher reviewed, never auto graded.
 */
(()=>{
 'use strict';
 const SOURCE='6th_Mil_P101.pdf';
 const KEY='odia-literature-class6-janmabhumi-v1';
 const icons={book:'M12 6C9 4 5 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1z M12 6v14',explore:'M3 19l6-14 4 8 3-5 5 11z M7 9l2 2 2-2',match:'M4 5h6v6H4z M14 13h6v6h-6z M14 7h5v3 M5 15v3h5',quiz:'M9 4h6l1 2h3v15H5V6h3z M8 11l2 2 5-5 M8 17h8',sentence:'M4 5h16v5H4z M4 14h7v5H4z M15 14h5v5h-5z',write:'M4 20l4-1L20 7l-3-3L5 16z M14 7l3 3 M3 21h18',reading:'M4 4h7v16H4z M14 4h7v16h-7z M7 8h1 M17 8h1'};
 const svg=name=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+icons[name]+'"/></svg>';
 const photos={
  himalaya:{src:'literature-images/himalaya.jpg',alt:'ଲଦାଖର ତୁଷାରଢାକା ହିମାଳୟ ପର୍ବତର ପ୍ରକୃତ ଫଟୋ',caption:'ହିମାଳୟ · ଲଦାଖ'},
  ganga:{src:'literature-images/ganga.jpg',alt:'ଋଷିକେଶ ପାଖରେ ପ୍ରବାହିତ ଗଙ୍ଗା ନଦୀର ପ୍ରକୃତ ଫଟୋ',caption:'ଗଙ୍ଗା ନଦୀ · ଋଷିକେଶ'},
  ocean:{src:'literature-images/ocean.jpg',alt:'ବିଶାଖାପାଟଣାର ବଙ୍ଗୋପସାଗର ଉପକୂଳର ପ୍ରକୃତ ଫଟୋ',caption:'ବଙ୍ଗୋପସାଗର · ବିଶାଖାପାଟଣା'},
  quizHimalaya:{src:'literature-images/quiz-himalaya.jpg',alt:'ହିମାଳୟର ନୀଳକଣ୍ଠ ପର୍ବତଶିଖରର ପ୍ରକୃତ ଫଟୋ',caption:'ହିମାଳୟର ପର୍ବତଶିଖର'},
  quizGanga:{src:'literature-images/quiz-ganga.jpg',alt:'ଗଙ୍ଗା ନଦୀ ଓ ଆକାଶର ପ୍ରକୃତ ଫଟୋ',caption:'ଗଙ୍ଗା ନଦୀ'}
 };
 function photoImage(key,className='lit-photo',decorative=false){const p=photos[key];return '<img class="'+className+'" src="'+p.src+'" alt="'+(decorative?'':p.alt)+'" width="960" height="640" decoding="async">';}
 const activities=[
  ['explore','ଚିତ୍ରରେ ଖୋଜିବା','ଫଟୋ ଖୋଜି କବିତାର ତିନୋଟି ସଙ୍କେତର ସମାଧାନ କର।','Visual explorer'],
  ['match','ଶବ୍ଦ ଯୋଡ଼ିବା','ଶବ୍ଦ ମେଳ କରି ତାହାର ଭାବକୁ ପ୍ରୟୋଗ କର।','Word matching'],
  ['quiz','ନିଜକୁ ପରଖିବା','ଛଅଟି ପ୍ରଶ୍ନ, ସହାୟତା ଓ ତୁରନ୍ତ ଉତ୍ତର।','Chapter quiz'],
  ['sentence','ବାକ୍ୟ ସଜାଇବା','ଶବ୍ଦ ବାଛି ଏକ ସଠିକ୍ ବାକ୍ୟ ଗଢ଼ିବା।','Sentence builder'],
  ['write','ମୋ ଗାଁ, ମୋ କଥା','ନିଜ ଅନୁଭୂତିରୁ ଲେଖିବା ଓ ଆଲୋଚନା କରିବା।','Creative writing'],
  ['reading','ଦୁଇ କବିତା, ଏକ ଭାବ','ପଠନ: ଏଇ ଦେଶ ଏଇ ମାଟି।','Compare the poems']
 ];
 const pairs=[['ହିମାଳୟ','ଭାରତର ଉତ୍ତରରେ ଥିବା ପର୍ବତମାଳା'],['ଜାହ୍ନବୀ','ଗଙ୍ଗା ନଦୀର ଅନ୍ୟ ନାମ'],['ମହୋଦଧି','ମହାସାଗର'],['ଜନନୀ','ମାଆ'],['ଦୁହିତା','ଝିଅ'],['ଚରଣ','ପାଦ']];
 const questions=[
  {q:'“ଜନ୍ମଭୂମି” କବିତାର କବି କିଏ?',options:['ମଧୁସୂଦନ ରାଓ','ସଚ୍ଚିଦାନନ୍ଦ ରାଉତରାୟ','ଜଗନ୍ନାଥ ଦାସ'],answer:0,hint:'PDFର କବି ପରିଚୟ ପୃଷ୍ଠାକୁ ମନେ ପକାଅ।',why:'ଏହି କବିତାର କବି ଭକ୍ତକବି ମଧୁସୂଦନ ରାଓ।'},
  {q:'କବିତାରେ ଭାରତର ମସ୍ତକରେ କେଉଁ ପର୍ବତମାଳା ରହିଛି?',options:['ପଶ୍ଚିମଘାଟ','ହିମାଳୟ','ପୂର୍ବଘାଟ'],answer:1,hint:'ଉତ୍ତରର ତୁଷାରଢାକା ପର୍ବତକୁ ମନେ ପକାଅ।',why:'କବି ହିମାଳୟକୁ ଭାରତମାତାଙ୍କ ମସ୍ତକରେ ଥିବା ପର୍ବତ ଭାବେ ବର୍ଣ୍ଣନା କରିଛନ୍ତି।'},
  {q:'“ଜାହ୍ନବୀ” କେଉଁ ନଦୀର ନାମ?',options:['ମହାନଦୀ','ଯମୁନା','ଗଙ୍ଗା'],answer:2,hint:'ଏହି ନାମଟି ଶବ୍ଦ ଯୋଡ଼ିବା ଖେଳରେ ଅଛି।',why:'ଜାହ୍ନବୀ ହେଉଛି ଗଙ୍ଗା ନଦୀର ଅନ୍ୟ ନାମ।'},
  {q:'“ଜନ୍ମଭୂମି” କବିତାର ମୁଖ୍ୟ ଭାବ କଣ?',options:['ଜନ୍ମଭୂମି ପ୍ରତି ଭଲପାଇବା ଓ ଶ୍ରଦ୍ଧା','ଏକ ଖେଳର ନିୟମ','ଏକ ବଜାରର ବର୍ଣ୍ଣନା'],answer:0,hint:'କବି ଦେଶକୁ ମାଆ ଭାବରେ ସମ୍ବୋଧନ କରିଛନ୍ତି।',why:'କବିତାରେ ଭାରତମାତାଙ୍କ ପ୍ରକୃତି ଓ ଗୌରବକୁ ଶ୍ରଦ୍ଧାରେ ବର୍ଣ୍ଣନା କରାଯାଇଛି।'},
  {q:'“ଏଇ ଦେଶ ଏଇ ମାଟି” କବିତାର କବି କିଏ?',options:['ରାମକୃଷ୍ଣ ନନ୍ଦ','ସଚ୍ଚିଦାନନ୍ଦ ରାଉତରାୟ','ମଧୁସୂଦନ ଦାସ'],answer:1,hint:'Uploaded PDFର ପଠନ ନିମନ୍ତେ ଦିଆଯାଇଥିବା ପୃଷ୍ଠା ଦେଖ।',why:'ଏହି ପଠନ କବିତାର କବି ସଚ୍ଚିଦାନନ୍ଦ ରାଉତରାୟ।'},
  {q:'ନିଜ ଜନ୍ମଭୂମି ପ୍ରତି ଯତ୍ନ କିପରି ଦେଖାଇବା?',options:['ନଦୀରେ ଅଳିଆ ପକାଇ','ଗଛ ନଷ୍ଟ କରି','ପରିବେଶକୁ ସଫା ରଖି ଓ ଗଛ ଲଗାଇ'],answer:2,hint:'ଏହା କବିତାର ଭାବକୁ ନିଜ ଜୀବନ ସହ ଯୋଡ଼ିବା ପ୍ରଶ୍ନ।',why:'ପରିବେଶକୁ ଯତ୍ନ କରିବା ଆମ ଅଞ୍ଚଳ ପ୍ରତି ଭଲପାଇବାର ଏକ ଉପାୟ। ଏହା ଏକ ନୂଆ ପ୍ରୟୋଗମୂଳକ ପ୍ରଶ୍ନ।'}
 ];
 const sentences=[['କବି','ଜନ୍ମଭୂମିକୁ','ମାଆ','ଭାବରେ','କଳ୍ପନା','କରିଛନ୍ତି।'],['କବିତାରେ','ହିମାଳୟକୁ','ଭାରତମାତାଙ୍କ','ମସ୍ତକ','ସହ','ତୁଳନା','କରାଯାଇଛି।'],['ଜନ୍ମଭୂମିର','ସେବା','ପାଇଁ','ଆମେ','ପରିବେଶକୁ','ସୁରକ୍ଷା','ଦେବା।']];
 let saved={completed:[],draft:''};
 try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw&&typeof raw==='object'){saved.completed=Array.isArray(raw.completed)?raw.completed.filter(id=>activities.some(a=>a[0]===id)):[];saved.draft=typeof raw.draft==='string'?raw.draft.slice(0,4000):'';if(Number.isInteger(raw.quizBest)&&raw.quizBest>=0&&raw.quizBest<=6)saved.quizBest=raw.quizBest;}}catch{}
 let storageOK=true;
 function save(){try{localStorage.setItem(KEY,JSON.stringify(saved));storageOK=true;}catch{storageOK=false;}return storageOK;}
 const hub=document.createElement('dialog');hub.id='literatureHub';hub.lang='or';hub.setAttribute('aria-labelledby','litTitle');
 hub.innerHTML='<div class="lit-shell"><div class="lit-top"><div><div class="lit-kicker">ସାଥୀ · CLASS 6 · ODIA LITERATURE</div><h1 id="litTitle">ସାହିତ୍ୟ ସୁଧା</h1></div><button id="litClose" aria-label="Close activities and return to previous screen">×</button></div><div class="lit-body" id="litBody"></div><div class="lit-footer"><button id="litBack">← ଅଧ୍ୟାୟକୁ ଫେରନ୍ତୁ</button><small id="litFooterStatus" role="status">ଅଗ୍ରଗତି ଏହି ଡିଭାଇସରେ ସେଭ୍ ହୁଏ।</small></div></div>';
 document.body.append(hub);
 const rootBody=hub.querySelector('#litBody'),back=hub.querySelector('#litBack'),title=hub.querySelector('#litTitle');
 let body=rootBody,screen='catalog',opener=null,workspaceMode='activity',fromBookSection=false,drawerOpen=false;
 const $=s=>hub.querySelector(s);
 function button(text,fn,parent=body,className=''){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=className;b.onclick=fn;parent.append(b);return b;}
 const chapterToggle=document.createElement('button');chapterToggle.id='litChapterToggle';chapterToggle.type='button';chapterToggle.hidden=true;chapterToggle.textContent='☰ ପାଠ';chapterToggle.setAttribute('aria-label','Show chapters · ପାଠ ତାଲିକା');chapterToggle.setAttribute('aria-controls','litChapterSidebar');chapterToggle.setAttribute('aria-expanded','false');
 hub.querySelector('.lit-top').prepend(back,chapterToggle);
 chapterToggle.onclick=()=>setChapterDrawer(!drawerOpen,true);
 function setChapterDrawer(open,returnFocus=false){
  const sidebar=$('#litChapterSidebar'),shade=$('.lit-drawer-shade'),content=$('#litContent');
  drawerOpen=!!open&&!!sidebar;
  hub.classList.toggle('lit-drawer-open',drawerOpen);
  chapterToggle.setAttribute('aria-expanded',String(drawerOpen));chapterToggle.textContent=drawerOpen?'× ପାଠ':'☰ ପାଠ';chapterToggle.setAttribute('aria-label',(drawerOpen?'Hide':'Show')+' chapters · ପାଠ ତାଲିକା');
  if(sidebar){sidebar.hidden=!drawerOpen;sidebar.inert=!drawerOpen;}
  if(shade)shade.hidden=!drawerOpen;
  if(content)content.inert=drawerOpen;
  if(drawerOpen)$('#litOpenChapter')?.focus();else if(returnFocus)chapterToggle.focus();
 }
 function mountWorkspace(){
  if(rootBody.classList.contains('lit-workspace'))return;
  rootBody.classList.add('lit-workspace');
  rootBody.innerHTML='<button type="button" class="lit-drawer-shade" aria-label="Close chapter list" hidden></button><aside id="litChapterSidebar" class="lit-chapter-sidebar" hidden aria-label="Chapter list"><span class="lit-kicker">ସାହିତ୍ୟ ସୁଧା</span><strong class="lit-sidebar-heading">ପାଠ ତାଲିକା</strong><div id="litChapterList"></div><p class="lit-source">ଏବେ ପାଠ ୧ ଉପଲବ୍ଧ।</p></aside><section id="litContent" class="lit-chapter-content" aria-label="Selected chapter content"></section>';
  const b=button('',()=>{b.setAttribute('aria-current','true');if(workspaceMode==='quiz')quiz();else chapter();},$('#litChapterList'),'lit-chapter-link');
  $('.lit-drawer-shade').onclick=()=>setChapterDrawer(false,true);b.id='litOpenChapter';b.setAttribute('aria-label','Chapter 1 · ଜନ୍ମଭୂମି');b.innerHTML='<small>ପାଠ ୧</small><strong>ଜନ୍ମଭୂମି</strong>';
 }
 function setScreen(name,heading){
  screen=name;title.textContent=heading;const workspace=name!=='catalog'&&name!=='book';hub.classList.toggle('lit-in-workspace',workspace);chapterToggle.hidden=!workspace;setChapterDrawer(false);
  if(name==='catalog'||name==='book'){rootBody.classList.remove('lit-workspace');body=rootBody;}else{mountWorkspace();body=$('#litContent');setChapterDrawer(false);}
  body.replaceChildren();body.scrollTop=0;
  const backLabels={catalog:'← ପୂର୍ବ ପରଦାକୁ ଫେରନ୍ତୁ',book:'← ପୁସ୍ତକ ବାଛନ୍ତୁ',chapters:'← ପୁସ୍ତକକୁ ଫେରନ୍ତୁ',chapter:'← ପାଠ ତାଲିକାକୁ ଫେରନ୍ତୁ'};
  const backLabel=backLabels[name]||(workspaceMode==='quiz'?'← ପାଠ ତାଲିକାକୁ ଫେରନ୍ତୁ':'← ଅଧ୍ୟାୟକୁ ଫେରନ୍ତୁ');back.textContent='←';back.setAttribute('aria-label',backLabel);back.title=backLabel;title.tabIndex=-1;title.focus();
 }

 function complete(id){if(!saved.completed.includes(id))saved.completed.push(id);save();footer();}
 function footer(){ hub.classList.toggle('lit-storage-warning',!storageOK);$('#litFooterStatus').classList.toggle('lit-save-error',!storageOK);$('#litFooterStatus').textContent=storageOK?'ଅଗ୍ରଗତି ଏହି ଡିଭାଇସରେ ସେଭ୍ ହୁଏ।':'ସେଭ୍ ହୋଇପାରିଲା ନାହିଁ। ଏହି ଅଧିବେଶନରେ କାମ କରିପାରିବେ।';}
 function catalog(){setScreen('catalog','ପୁସ୍ତକ ବାଛନ୍ତୁ');body.innerHTML='<div class="lit-filters"><label>ଶ୍ରେଣୀ<select aria-label="Class"><option>୬ · Class 6</option></select></label><label>ବିଷୟ<select aria-label="Subject"><option>ଓଡ଼ିଆ ସାହିତ୍ୟ · Odia literature</option></select></label></div><article class="lit-book"><div class="lit-cover">'+svg('book')+'<strong>ସାହିତ୍ୟ ସୁଧା</strong><span>ଷଷ୍ଠ ଶ୍ରେଣୀ · Class 6</span></div><div class="lit-chapter"><span class="lit-badge">ଓଡ଼ିଆ ସାହିତ୍ୟ</span><h2>ସାହିତ୍ୟ ସୁଧା</h2><p class="lit-muted">ପୁସ୍ତକ ବାଛି କାର୍ଯ୍ୟକଳାପ ଖୋଲନ୍ତୁ।</p><div id="litSelectBook"></div></div></article>';button('ପୁସ୍ତକ ବାଛନ୍ତୁ →',bookHome,$('#litSelectBook'),'lit-primary');}
 function bookHome(){setScreen('book','ସାହିତ୍ୟ ସୁଧା');body.innerHTML='<span class="lit-badge">Class 6 · ଓଡ଼ିଆ ସାହିତ୍ୟ</span><h2>କଣ କରିବାକୁ ଚାହୁଁଛନ୍ତି?</h2><div class="lit-grid" id="litBookActions"></div>';
  for(const [mode,id,icon,label,desc] of [['activity','litBookActivity','explore','Activity · କାର୍ଯ୍ୟକଳାପ','ପାଠ ବାଛି ତାହାର କାର୍ଯ୍ୟକଳାପ ଖୋଲନ୍ତୁ →'],['quiz','litBookQuiz','quiz','Quiz · ପ୍ରଶ୍ନୋତ୍ତର','ପାଠ ବାଛି ତାହାର କୁଇଜ୍ ଖୋଲନ୍ତୁ →']]){const b=button('',()=>chapters(mode),$('#litBookActions'),'lit-card');b.id=id;b.setAttribute('aria-label',label);b.innerHTML=svg(icon)+'<strong>'+label+'</strong><small>'+desc+'</small>';}
 }
 function chapters(mode=workspaceMode){
  workspaceMode=mode;rootBody.classList.remove('lit-workspace');
  setScreen('chapters',(mode==='quiz'?'Quiz':'Activity')+' · ପାଠ ବାଛନ୍ତୁ');
  body.innerHTML='<div class="lit-empty"><div class="lit-empty-icon">'+svg(mode==='quiz'?'quiz':'book')+'</div><h2>ପାଠ ବାଛନ୍ତୁ</h2><p class="lit-muted">ଉପରେ ଥିବା ☰ ପାଠ ବଟନ୍‌ରୁ ପାଠ ବାଛି ତାହାର '+(mode==='quiz'?'କୁଇଜ୍':'କାର୍ଯ୍ୟକଳାପ')+' ଖୋଲନ୍ତୁ।</p></div>';button('☰ ପାଠ ତାଲିକା ଖୋଲନ୍ତୁ',()=>setChapterDrawer(true),body,'lit-primary').id='litChooseChapter';
 }

 function chapter(){setScreen('chapter','ଜନ୍ମଭୂମି');body.innerHTML='<div class="lit-chapter-summary"><h2>କାର୍ଯ୍ୟକଳାପ</h2><p class="lit-progress">ଅଭ୍ୟାସ: '+saved.completed.length+' / ୬'+(saved.quizBest!==undefined?' · Quiz ଅଭ୍ୟାସ ✓':'')+'</p></div><div class="lit-grid"></div><details class="lit-teacher-notes"><summary>ଶିକ୍ଷକଙ୍କ ପାଇଁ ସୂଚନା</summary><p>କବି: ମଧୁସୂଦନ ରାଓ। ଏଗୁଡ଼ିକ ପାଠ ଆଧାରିତ ନୂଆ ଅଭ୍ୟାସ; ପୁସ୍ତକର ସମସ୍ତ ପ୍ରଶ୍ନର ଉତ୍ତରମାଳା ନୁହେଁ। ଲେଖା ଓ ଆଲୋଚନାକୁ ଶିକ୍ଷକ ସମୀକ୍ଷା କରିବେ।</p></details>';
  for(const [id,label,desc,en] of activities){const b=button('',()=>openActivity(id),$('.lit-grid'),'lit-card');b.setAttribute('aria-label',label+' · '+en);b.title=desc;b.innerHTML=svg(id)+'<strong>'+label+'</strong><small>'+desc+'</small>'+(saved.completed.includes(id)?'<small class="lit-complete">✓ ଅଭ୍ୟାସ କରାଯାଇଛି</small>':'');}
 }

 function intro(id){const a=activities.find(a=>a[0]===id);setScreen(id,a[1]);body.innerHTML='<span class="lit-badge">ଜନ୍ମଭୂମି · '+a[3]+'</span>';}
 function explore(){intro('explore');body.insertAdjacentHTML('beforeend','<h2>ପ୍ରକୃତ ଫଟୋରେ ପାଠକୁ ଦେଖିବା</h2><p class="lit-muted">ଫଟୋ ବାଛି କବିତାର ପ୍ରକୃତି ଚିତ୍ର ସହ ଯୋଡ଼ନ୍ତୁ।</p><div class="lit-scene"><figure class="lit-photo-stage">'+photoImage('himalaya')+'<figcaption>'+photos.himalaya.caption+'</figcaption></figure><div class="lit-hotspots"></div></div><div class="lit-detail" role="status" aria-live="polite">ତଳର ବଟନ୍‌ଗୁଡ଼ିକୁ ଛୁଇଁ ଫଟୋ ଓ ପାଠକୁ ଯୋଡ଼ନ୍ତୁ।</div><details class="lit-photo-credits"><summary>ଫଟୋ ଉତ୍ସ · Photo credits</summary><p>Wikimedia Commons · CC0</p><ul><li>Himalayas Ladakh — Satalah</li><li>Ganges above Rishikesh — Sarg rahul</li><li>Vizag beach — Prof Ranga Sai</li></ul></details>');
  const details=[['ହିମାଳୟ','କବି ହିମାଳୟକୁ ଭାରତମାତାଙ୍କ ମସ୍ତକରେ ଥିବା ପର୍ବତ ଭାବେ କଳ୍ପନା କରିଛନ୍ତି। କାହିଁକି ମସ୍ତକ ସହ ତୁଳନା କରିଥିବେ?'],['ନଦୀ','କବିତାରେ ଗଙ୍ଗା, ବ୍ରହ୍ମପୁତ୍ର ଓ ସିନ୍ଧୁ ଆଦି ନଦୀର ଉଲ୍ଲେଖ ଅଛି। ତୁମ ଅଞ୍ଚଳର ଏକ ନଦୀର ନାମ କହ।'],['ମହାସାଗର','ଭାରତମାତାଙ୍କ ଚରଣ ପାଖରେ ଥିବା ସାଗରର ଚିତ୍ର କବି ଆଙ୍କିଛନ୍ତି। “ମହୋଦଧି” ଶବ୍ଦର ଅର୍ଥ ମହାସାଗର।'],['କବିଙ୍କ ଭାବ','କବି ଜନ୍ମଭୂମିକୁ ମାଆ ଭାବେ ସମ୍ବୋଧନ କରିଛନ୍ତି। ତୁମେ ନିଜ ଜନ୍ମଭୂମି ପାଇଁ କେଉଁ ଭଲ କାମ କରିପାରିବ?']];
  const seen=new Set();for(const [i,[label,text]] of details.entries()){button(label,()=>{seen.add(i);const key=['himalaya','ganga','ocean',null][i];const stage=$('.lit-photo-stage');stage.hidden=!key;if(key)stage.innerHTML=photoImage(key)+'<figcaption>'+photos[key].caption+'</figcaption>';$('.lit-detail').textContent=text;$('.lit-hotspots').querySelectorAll('button').forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));if(seen.size===details.length&&!$('#litStartChallenge'))button('ସଙ୍କେତ ଚ୍ୟାଲେଞ୍ଜ ଖେଳିବା →',startChallenge,body,'lit-primary').id='litStartChallenge';},$('.lit-hotspots')).setAttribute('aria-pressed','false');}
 } function startChallenge(){
  const rounds=[
   {q:'କବିଙ୍କ କଳ୍ପନାରେ ଭାରତମାତାଙ୍କ ମସ୍ତକରେ ଅଛି। ମୁଁ କିଏ?',answer:'himalaya',hint:'ଭାରତର ଉତ୍ତର ପଟର ପର୍ବତମାଳାକୁ ଭାବ।'},
   {q:'ମୋର ଅନ୍ୟ ନାମ ଜାହ୍ନବୀ। ମୁଁ କିଏ?',answer:'ganga',hint:'ଜାହ୍ନବୀ ଏକ ନଦୀର ଅନ୍ୟ ନାମ।'},
   {q:'କବିତାରେ ଭାରତମାତାଙ୍କ ଚରଣ ପାଖରେ ବିସ୍ତାରିତ। ମୁଁ କିଏ?',answer:'ocean',hint:'ମହୋଦଧି ଶବ୍ଦର ଅର୍ଥ ମନେ ପକାଅ।'}
  ];let step=0;
  function round(){intro('explore');body.insertAdjacentHTML('beforeend','<p class="lit-progress">ସଙ୍କେତ ଚ୍ୟାଲେଞ୍ଜ '+(step+1)+' / '+rounds.length+'</p><h2></h2><div class="lit-options lit-challenge-options"></div><div class="lit-feedback" role="status" aria-live="polite"></div><div class="lit-challenge-reveal"></div><div class="lit-actions"></div>');$('h2').textContent=rounds[step].q;let done=false;
   for(const [key,label] of shuffle([['himalaya','ହିମାଳୟ'],['ganga','ଗଙ୍ଗା'],['ocean','ମହାସାଗର']])){const choice=button(label,()=>{if(done)return;if(key!==rounds[step].answer){choice.disabled=true;feedback('ଭଲ ଚେଷ୍ଟା! '+rounds[step].hint+' ଆଉ ଥରେ ଭାବ।');return;}done=true;$('.lit-options').querySelectorAll('button').forEach(b=>b.disabled=true);feedback('★ ସଙ୍କେତର ରହସ୍ୟ ଖୋଜିପାଇଲ!');$('.lit-challenge-reveal').innerHTML='<figure class="lit-question-photo">'+photoImage(key)+'<figcaption>'+photos[key].caption+'</figcaption></figure>';if(step===rounds.length-1){complete('explore');button('ତିନୋଟି ରହସ୍ୟ ସମାଧାନ! ଅନ୍ୟ ଅଭ୍ୟାସ →',chapter,$('.lit-actions'),'lit-primary');}else button('ପରବର୍ତ୍ତୀ ସଙ୍କେତ →',()=>{step++;round();},$('.lit-actions'),'lit-primary');},$('.lit-options'));}
  }round();
 }

 function shuffle(items){const out=items.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
 function feedback(text){$('.lit-feedback').textContent=text;}
 function match(){intro('match');body.insertAdjacentHTML('beforeend','<h2>ପ୍ରଥମେ ଶବ୍ଦ, ତାପରେ ତାହାର ଅର୍ଥ ବାଛନ୍ତୁ</h2><p class="lit-muted">Tap-to-match · ଆଙ୍ଗୁଠି, ମାଉସ୍ ବା କୀବୋର୍ଡରେ ଖେଳନ୍ତୁ।</p><div class="lit-feedback" role="status" aria-live="polite"></div><div class="lit-match"><div aria-label="Words"></div><div aria-label="Meanings"></div></div><div class="lit-actions"></div>');
  let selected=null,matched=0;const words=new Map();
  pairs.forEach(([word],i)=>{const b=button(word,()=>{selected=i;words.forEach((node,j)=>node.setAttribute('aria-pressed',String(i===j)));feedback('ଏବେ “'+word+'” ର ଅର୍ଥ ବାଛନ୍ତୁ।');},$('.lit-match>div:first-child'));b.setAttribute('aria-pressed','false');words.set(i,b);});
  shuffle(pairs.map((_,i)=>i)).forEach(i=>{const b=button(pairs[i][1],()=>{if(selected===null){feedback('ପ୍ରଥମେ ବାମ ପଟରୁ ଏକ ଶବ୍ଦ ବାଛନ୍ତୁ।');return;}if(selected!==i){feedback('ପୁଣି ଭାବନ୍ତୁ। ଅନ୍ୟ ଅର୍ଥଟି ବାଛି ଚେଷ୍ଟା କରନ୍ତୁ।');return;}const w=words.get(i);w.disabled=b.disabled=true;w.classList.add('lit-matched');b.classList.add('lit-matched');w.textContent='✓ '+pairs[i][0];b.textContent='✓ '+pairs[i][1];w.setAttribute('aria-pressed','false');selected=null;matched++;feedback('ସଠିକ୍! '+matched+' / '+pairs.length+' ଯୋଡ଼ି।');if(matched===pairs.length){feedback('★ ଶବ୍ଦ ମେଳ ହୋଇଗଲା! ଏବେ ଭାବର ରହସ୍ୟ ଖୋଜ।');meaningMission();}else [...words.values()].find(n=>!n.disabled)?.focus();},$('.lit-match>div:last-child'));});button('ପୁଣି ଖେଳନ୍ତୁ',match,$('.lit-actions'));
 } function meaningMission(){
  const mission=document.createElement('section');mission.className='lit-panel lit-meaning-mission';mission.innerHTML='<h3>ଭାବର ରହସ୍ୟ</h3><p>କବି ଜନ୍ମଭୂମିକୁ ମାଆ ସହ ତୁଳନା କରି କେଉଁ ଭାବ ପ୍ରକାଶ କରିଛନ୍ତି?</p><div class="lit-options"></div><p class="lit-mission-feedback" role="status" aria-live="polite"></p>';body.append(mission);
  const options=mission.querySelector('.lit-options'),status=mission.querySelector('.lit-mission-feedback');let done=false;
  for(const [label,right] of shuffle([['ଜନ୍ମଭୂମି ପ୍ରତି ମମତା ଓ ଶ୍ରଦ୍ଧା',true],['ଦେଶ ଏକ ଖେଳନା',false],['କେବଳ ଏକ ପର୍ବତର ଉଚ୍ଚତା',false]])){const b=button(label,()=>{if(done)return;if(!right){b.disabled=true;status.textContent='ଭଲ ଚେଷ୍ଟା! ମାଆଙ୍କ ପ୍ରତି ଆମ ଭାବନାକୁ ମନେ ପକାଇ ଆଉ ଥରେ ବାଛ।';return;}done=true;options.querySelectorAll('button').forEach(n=>n.disabled=true);complete('match');status.textContent='★ ଦାରୁଣ! ତୁମେ ଶବ୍ଦର ଅର୍ଥ ସହ କବିଙ୍କ ଭାବ ମଧ୍ୟ ବୁଝିପାରିଲ।';},options);}
 }

 function quiz(reviewOrder){
  intro('quiz');
  const order=Array.isArray(reviewOrder)&&reviewOrder.length?reviewOrder:questions.map((_,i)=>i);
  let index=0,score=0,attempted=false,solved=0;
  const practice=new Set(),answers=questions.map(q=>shuffle(q.options.map((text,i)=>({text,correct:i===q.answer}))));
  const praise=['ଦାରୁଣ! ତୁମେ ଭଲ ଭାବିଛ।','ବାହା! ତୁମେ ନୂଆ କଥା ଶିଖୁଛ।','ଚମତ୍କାର! ଏମିତି ଚେଷ୍ଟା ଜାରି ରଖ।'];
  function paint(){
   body.querySelectorAll(':scope > :not(.lit-badge)').forEach(n=>n.remove());
   const qid=order[index],q=questions[qid],imageKey={1:'quizHimalaya',2:'quizGanga'}[qid];
   const image=imageKey?'<figure class="lit-question-photo">'+photoImage(imageKey)+'<figcaption>ଛବିକୁ ଦେଖି ଭାବନ୍ତୁ।</figcaption></figure>':'';
   body.insertAdjacentHTML('beforeend','<div class="lit-quiz-progress"><span>ପ୍ରଶ୍ନ '+(index+1)+' / '+order.length+'</span><span id="litQuizStars" aria-live="polite">★ '+solved+' / '+order.length+'</span></div><progress class="lit-learning-progress" max="'+order.length+'" value="'+solved+'" aria-label="Questions learned"></progress><div class="lit-question-stem"><h2></h2>'+image+'</div><div class="lit-options"></div><div class="lit-feedback" role="status" aria-live="polite"></div><div class="lit-actions"></div>');
   $('h2').textContent=q.q;let done=false;attempted=false;
   for(const a of answers[qid]){const choice=button(a.text,()=>{
    if(done)return;
    if(!a.correct){attempted=true;practice.add(qid);choice.disabled=true;feedback('ଭଲ ଚେଷ୍ଟା! ଭୁଲ୍‌ରୁ ମଧ୍ୟ ଶିଖିବା। '+q.hint+' ଆଉ ଥରେ ବାଛ।');$('.lit-feedback').className='lit-feedback lit-try-again';return;}
    done=true;if(!attempted)score++;solved++;
    $('.lit-options').querySelectorAll('button').forEach(b=>b.disabled=true);hint.disabled=true;
    choice.classList.add('lit-answer-correct');choice.setAttribute('aria-label',a.text+' · ସଠିକ୍');
    feedback('★ '+(attempted?'ଚେଷ୍ଟା ଜାରି ରଖି ତୁମେ ଉତ୍ତର ଖୋଜିପାଇଲ!':praise[index%praise.length])+' '+q.why);
    $('.lit-feedback').className='lit-feedback lit-encouragement';
    $('#litQuizStars').textContent='★ '+solved+' / '+order.length;$('.lit-learning-progress').value=solved;
    const next=button(index===order.length-1?'ଫଳାଫଳ ଦେଖନ୍ତୁ →':'ପରବର୍ତ୍ତୀ ପ୍ରଶ୍ନ →',()=>{index++;if(index<order.length)paint();else results();},$('.lit-actions'),'lit-primary');next.focus();
   },$('.lit-options'));}
   const hint=button('ସହାୟତା',()=>{if(done)return;attempted=true;practice.add(qid);feedback('ସହାୟତା ନେବା ମଧ୍ୟ ଭଲ ଶିଖିବାର ଅଭ୍ୟାସ। '+q.hint);},$('.lit-actions'));
   body.scrollTop=0;
  }
  function results(){
   if(order.length===questions.length)saved.quizBest=Math.max(saved.quizBest||0,score);
   complete('quiz');
   body.innerHTML='<div class="lit-results lit-supportive-results"><div class="lit-earned-stars" aria-label="'+solved+' learning stars">★ × '+solved+'</div><h2>ଚେଷ୍ଟାରେ ତୁମେ ଆଗକୁ ବଢ଼ିଲ!</h2><p>ଶିଖି ସମାଧାନ କରିଛ: '+solved+' / '+order.length+'</p><p class="lit-muted">ପ୍ରତ୍ୟେକ ଚେଷ୍ଟା ତୁମକୁ ଆହୁରି ଶିଖାଏ। ସହାୟତା ଓ ପୁଣି ଚେଷ୍ଟା ପାଇଁ ତାରକା କମେନାହିଁ।</p><div class="lit-actions"></div><details class="lit-teacher-notes"><summary>ଅଭ୍ୟାସ ବିବରଣୀ</summary><p>ପ୍ରଥମ ଚେଷ୍ଟାରେ, ସହାୟତା ବିନା ସଠିକ୍: '+score+' / '+order.length+'</p></details></div>';
   if(practice.size)button('ଅଳ୍ପ ସହାୟତା ଲାଗିଥିବା ପ୍ରଶ୍ନ ପୁଣି ଖେଳିବା →',()=>quiz([...practice]),$('.lit-actions'),'lit-primary').id='litPracticeAgain';
   button('ସବୁ ପ୍ରଶ୍ନ ପୁଣି ଖେଳନ୍ତୁ',()=>quiz(),$('.lit-actions'));
   button('ଅନ୍ୟ ଅଭ୍ୟାସ',chapter,$('.lit-actions'));
  }
  paint();
 }

 function sentence(){intro('sentence');let index=0,chosen=[];
  function paint(){body.querySelectorAll(':scope > :not(.lit-badge)').forEach(n=>n.remove());const target=sentences[index];body.insertAdjacentHTML('beforeend','<p class="lit-progress">ବାକ୍ୟ '+(index+1)+' / '+sentences.length+' · ନୂଆ ଅଭ୍ୟାସ</p><h2>ଶବ୍ଦଗୁଡ଼ିକୁ ସଜାଇ ବାକ୍ୟ ଗଢ଼ନ୍ତୁ</h2><p class="lit-muted">ଶବ୍ଦକୁ ଛୁଇଁ ଯୋଡ଼ନ୍ତୁ। ଯୋଡ଼ା ଶବ୍ଦକୁ ଛୁଇଁ ଫେରାନ୍ତୁ।</p><div class="lit-sentence" aria-label="Your sentence"></div><div class="lit-chips" aria-label="Available words"></div><div class="lit-feedback" role="status" aria-live="polite"></div><div class="lit-actions"></div>');chosen=[];const order=shuffle(target.map((_,i)=>i));
   const pool=new Map();for(const i of order)pool.set(i,button(target[i],()=>{chosen.push(i);pool.get(i).disabled=true;draw();},$('.lit-chips')));
   function draw(){$('.lit-sentence').replaceChildren();chosen.forEach((i,pos)=>{button(target[i],()=>{chosen.splice(pos,1);pool.get(i).disabled=false;draw();},$('.lit-sentence'));});feedback('');}
   button('ଯାଞ୍ଚ କରନ୍ତୁ',()=>{if(chosen.length!==target.length){feedback('ସମସ୍ତ ଶବ୍ଦକୁ ବ୍ୟବହାର କରନ୍ତୁ।');return;}if(!chosen.every((n,i)=>n===i)){feedback('ଏହି ଅଭ୍ୟାସର ଲକ୍ଷ୍ୟ ବାକ୍ୟ ସହ ମେଳ ହୋଇନି। ପ୍ରଥମ ଶବ୍ଦ: '+target[0]);return;}feedback('★ ଦାରୁଣ! ତୁମେ ଭାବକୁ ବାକ୍ୟରେ ସଜାଇପାରିଲ। '+target.join(' '));$('.lit-actions').querySelectorAll('button').forEach(b=>b.disabled=true);if(index===sentences.length-1){complete('sentence');button('ଅଭ୍ୟାସକୁ ଫେରନ୍ତୁ',chapter,$('.lit-actions'),'lit-primary');}else button('ପରବର୍ତ୍ତୀ ବାକ୍ୟ →',()=>{index++;paint();},$('.lit-actions'),'lit-primary');},$('.lit-actions'),'lit-primary');button('ପୁଣି ସଜାନ୍ତୁ',paint,$('.lit-actions'));
  }paint();
 }
 function write(){intro('write');body.insertAdjacentHTML('beforeend','<div class="lit-panel"><h2>ମୋ ଜନ୍ମଭୂମିର ଏକ ସୁନ୍ଦର ଚିତ୍ର</h2><p>ନିଜ ଗାଁ ବା ସହର ବିଷୟରେ ୪–୫ଟି ବାକ୍ୟ ଲେଖନ୍ତୁ। ସେଠାର ପ୍ରକୃତି, ଲୋକ ଓ ତୁମ ପ୍ରିୟ ସ୍ଥାନକୁ ମନେ ପକାନ୍ତୁ।</p><p class="lit-muted">ସହାୟକ ଶବ୍ଦ: ନଦୀ · ଗଛ · ସବୁଜ · ଲୋକ · ପ୍ରିୟ</p></div><label for="litDraft">ମୋ ଲେଖା<textarea id="litDraft" maxlength="4000" placeholder="ମୋ ଗାଁ / ସହରର ନାମ…"></textarea></label><div class="lit-feedback" role="status" aria-live="polite"></div><div class="lit-actions"></div><p class="lit-source">ଏଠାରେ ଉତ୍ତର ସ୍ୱୟଂଚାଳିତ ଭାବେ ଯାଞ୍ଚ ହୁଏନାହିଁ। ଲେଖାଟି ଶିକ୍ଷକଙ୍କୁ ପଢ଼ି ଶୁଣାନ୍ତୁ। ଲେଖା କେବଳ ଏହି ଡିଭାଇସରେ ସେଭ୍ ହୁଏ।</p>');const draft=$('#litDraft');draft.value=saved.draft;draft.oninput=()=>{saved.draft=draft.value;feedback(save()?'ଲେଖା ଏହି ଡିଭାଇସରେ ସେଭ୍ ହେଲା।':'ଲେଖା ସେଭ୍ ହୋଇପାରିଲା ନାହିଁ।');footer();};button('ଶିକ୍ଷକଙ୍କ ସହ ଆଲୋଚନା କରିଛି ✓',()=>{if(!draft.value.trim()){feedback('ପ୍ରଥମେ ନିଜ କଥା କିଛି ଲେଖନ୍ତୁ।');draft.focus();return;}complete('write');feedback('✓ ଅଭ୍ୟାସ ଚିହ୍ନିତ ହେଲା। ଏହା ମୂଲ୍ୟାୟନ ବା ନମ୍ବର ନୁହେଁ।');},$('.lit-actions'),'lit-primary');}
 function reading(){intro('reading');body.insertAdjacentHTML('beforeend','<h2>ଦୁଇ କବିତାକୁ ଏକାଠି ଭାବିବା</h2><div class="lit-compare"><article><h3>ଜନ୍ମଭୂମି</h3><p>ମଧୁସୂଦନ ରାଓ</p><ul><li>ଦେଶକୁ ମାଆ ଭାବେ ସମ୍ବୋଧନ</li><li>ପର୍ବତ, ନଦୀ ଓ ସାଗରର ଚିତ୍ର</li><li>ଦେଶର ଗୌରବ ପ୍ରତି ଶ୍ରଦ୍ଧା</li></ul></article><article><h3>ଏଇ ଦେଶ ଏଇ ମାଟି</h3><p>ସଚ୍ଚିଦାନନ୍ଦ ରାଉତରାୟ</p><ul><li>ଦେଶ ଓ ମାଟି ପ୍ରତି ମମତା</li><li>ପ୍ରକୃତିର ସୌନ୍ଦର୍ଯ୍ୟର ଅନୁଭବ</li><li>ଦେଶର ସେବା ପାଇଁ ଅଙ୍ଗୀକାର</li></ul></article></div><div class="lit-panel"><h3>ସାଙ୍ଗଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ</h3><p>୧. ଦୁଇ କବିତାରେ କେଉଁ ଭାବ ସମାନ?</p><p>୨. କେଉଁ ପ୍ରକୃତି ଚିତ୍ର ତୁମକୁ ଭଲ ଲାଗିଲା? କାହିଁକି?</p><p>୩. ତୁମ ଅଞ୍ଚଳ ପାଇଁ ଏକ ଭଲ କାମର ଯୋଜନା କର।</p></div><div class="lit-feedback" role="status"></div><div class="lit-actions"></div><p class="lit-source">ପ୍ରଥମେ PDFର ଦୁଇଟି କବିତା ପଢ଼ନ୍ତୁ। ଏହା ଶିକ୍ଷକଙ୍କ ସହ ଆଲୋଚନା ପାଇଁ ଏକ ନୂଆ ଅଭ୍ୟାସ।</p>');button('ଆମେ ଆଲୋଚନା କରିଛୁ ✓',()=>{complete('reading');feedback('✓ ଆଲୋଚନା ଚିହ୍ନିତ ହେଲା।');},$('.lit-actions'),'lit-primary');}
 function openActivity(id){({explore,match,quiz,sentence,write,reading})[id]();}
 function close(){setChapterDrawer(false);hub.close();fromBookSection=false;opener?.focus();}
 $('#litClose').onclick=close;back.onclick=()=>{if(screen==='catalog')close();else if(screen==='book')catalog();else if(screen==='chapters'){if(fromBookSection)close();else bookHome();}else if(screen==='chapter'||workspaceMode==='quiz')chapters();else chapter();};
 hub.addEventListener('cancel',e=>{e.preventDefault();if(drawerOpen)setChapterDrawer(false,true);else close();});
 // Existing Pathasala book buttons open the same verified content directly.
 window.openLiteratureBookActivities=({mode='activity',returnFocus=null}={})=>{
  fromBookSection=true;opener=returnFocus||document.activeElement;
  chapters(mode==='quiz'?'quiz':'activity');
  if(!hub.open)hub.showModal();title.focus();
 };
 const entry=document.createElement('button');entry.id='literatureMenu';entry.type='button';entry.setAttribute('aria-label','ବିଷୟ ଅନୁସାରେ କାର୍ଯ୍ୟକଳାପ · Subject activities');entry.innerHTML=svg('book')+'<small>ବିଷୟ ଅନୁସାରେ କାର୍ଯ୍ୟକଳାପ</small>';
 const menu=document.querySelector('#saathiMenu');if(!menu)return;menu.append(entry);
 entry.onclick=()=>{fromBookSection=false;opener=document.querySelector('#activityMenu');menu.classList.remove('open');opener?.setAttribute('aria-expanded','false');if(typeof closePanels==='function')closePanels();catalog();hub.showModal();title.focus();};
})();
