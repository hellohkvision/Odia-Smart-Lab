/* Teacher workspace. Existing board data and activity implementations stay intact. */
(()=>{
 const home=document.createElement('section');home.id='teacherHome';home.className='view hidden';home.setAttribute('aria-label','Teacher home');
 home.innerHTML=`<div class="school-heading"><div><span class="school-eyebrow">YOUR TEACHING SPACE</span><h1>A little curiosity.<br>A world of learning.</h1><p>Write, explore, and learn together with ଓଡ଼ିଆ Smart Lab.</p></div><div class="school-date"></div></div>
 <div class="school-layout"><div><article class="school-hero"><span class="school-eyebrow">LET’S LEARN TOGETHER</span><h2>Big ideas begin<br>with a blank board.</h2><p>A spacious canvas for your next classroom discovery.</p><button class="school-primary" data-open="whiteboard">Open writing board <span aria-hidden="true">↗</span></button><div class="school-art" aria-hidden="true">ଅ<span>ଆ</span><small>ଇ</small></div></article>
 <div class="school-section-title"><h2>Choose an activity</h2><span>Made for classroom participation</span></div><div class="school-activities">
 <button data-open="alphabet"><span class="school-symbol">ଅ</span><strong>Letter studio</strong><small>Explore Odia vowels & trace letters</small><span aria-hidden="true">↗</span></button>
 <button data-open="lessons"><span class="school-symbol">▤</span><strong>Guided lessons</strong><small>Practice vowels and Odia numbers</small><span aria-hidden="true">↗</span></button>
 <button data-open="quiz"><span class="school-symbol">✦</span><strong>Classroom quiz</strong><small>Four questions to learn together</small><span aria-hidden="true">↗</span></button></div>
 <div class="school-note">✧ <span><strong>Small steps, lasting learning.</strong> Start with a letter, invite students to trace, then try a quiz together.</span></div></div>
 <aside class="school-planner"><span class="school-eyebrow">PREPARE & TEACH</span><h2>Today’s lesson</h2><label for="schoolTopic">Lesson focus</label><input id="schoolTopic" maxlength="100" placeholder="e.g. Meet the Odia vowels"><label for="schoolGoal">Learning goal</label><textarea id="schoolGoal" rows="3" maxlength="500" placeholder="What will your students learn today?"></textarea><div class="school-checks"><label><input type="checkbox" data-step="0"> Introduce & demonstrate</label><label><input type="checkbox" data-step="1"> Practice together</label><label><input type="checkbox" data-step="2"> Check understanding</label></div><p id="schoolSaved" role="status">Plan saved on this device only.</p><div class="school-timer"><div><h3>Activity timer</h3><label for="schoolMinutes">Minutes</label><input id="schoolMinutes" type="number" min="1" max="120" value="5"></div><output id="schoolTime" aria-label="Time remaining">05:00</output></div><div class="school-timer-actions"><button id="schoolStart">Start timer</button><button id="schoolReset">Reset</button></div><p id="schoolTimerStatus" role="status">Set a pace that works for your class.</p></aside></div>`;
 document.querySelector('main').append(home);
 home.querySelector('.school-date').textContent=new Intl.DateTimeFormat(undefined,{weekday:'long',day:'numeric',month:'long'}).format(new Date());
 const nav=document.querySelector('.classroom-nav');const homeButton=document.createElement('button');homeButton.innerHTML='<span class="nav-icon" aria-hidden="true">⌂</span><span class="nav-label">Teacher home</span>';nav.prepend(homeButton);
 function openActivity(id){document.body.classList.remove('teacher-home-open');home.classList.add('hidden');homeButton.classList.remove('active');document.querySelector('[data-tab="'+id+'"]').click();}
 home.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openActivity(b.dataset.open));
 homeButton.onclick=()=>{document.body.classList.add('teacher-home-open');document.querySelectorAll('.view').forEach(v=>v.classList.toggle('hidden',v!==home));document.querySelectorAll('[data-tab],.classroom-nav button').forEach(b=>b.classList.remove('active'));homeButton.classList.add('active');if(innerWidth<=750)document.body.classList.add('classroom-collapsed');};
 document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{homeButton.classList.remove('active');document.body.classList.remove('teacher-home-open');}));
 const topic=home.querySelector('#schoolTopic'),goal=home.querySelector('#schoolGoal'),checks=[...home.querySelectorAll('[data-step]')];
 try{const plan=JSON.parse(localStorage.getItem('odia-teacher-plan')||'{}');topic.value=typeof plan.topic==='string'?plan.topic:'';goal.value=typeof plan.goal==='string'?plan.goal:'';checks.forEach((c,i)=>c.checked=!!plan.steps?.[i]);}catch{}
 function savePlan(){try{localStorage.setItem('odia-teacher-plan',JSON.stringify({topic:topic.value,goal:goal.value,steps:checks.map(c=>c.checked)}));home.querySelector('#schoolSaved').textContent='Plan saved on this device only.';}catch{home.querySelector('#schoolSaved').textContent='Storage unavailable. Your plan cannot be saved.';}}
 [topic,goal,...checks].forEach(e=>e.addEventListener('input',savePlan));
 const minutes=home.querySelector('#schoolMinutes'),display=home.querySelector('#schoolTime'),start=home.querySelector('#schoolStart'),status=home.querySelector('#schoolTimerStatus');let remaining=300,deadline=0,ticker=null;
 function paint(){display.textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');}
 function stop(){clearInterval(ticker);ticker=null;minutes.disabled=false;start.textContent='Start timer';}
 function tick(){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));paint();if(!remaining){stop();status.textContent='Time is up. Pause and share what you learned.';}}
 start.onclick=()=>{if(ticker){tick();stop();status.textContent=remaining?'Timer paused.':'Time is up.';return;}if(!remaining){remaining=Number(minutes.value)*60;}deadline=Date.now()+remaining*1000;minutes.disabled=true;start.textContent='Pause timer';status.textContent='Activity in progress.';ticker=setInterval(tick,250);tick();};
 function reset(){stop();const value=Math.min(120,Math.max(1,Math.round(Number(minutes.value)||5)));minutes.value=value;remaining=value*60;paint();status.textContent='Set a pace that works for your class.';}
 minutes.onchange=reset;home.querySelector('#schoolReset').onclick=reset;
 // Keep saved boards immediately available; the home screen never clears a page.
 openActivity('whiteboard');
})();

// One icon language and explicit activity state throughout classroom navigation.
(()=>{
 const paths={home:'M3 10l9-7 9 7v10H3z M9 20v-7h6v7',whiteboard:'M3 4h18v13H3z M8 21l4-4 4 4 M7 8h10 M7 12h6',alphabet:'M4 4h16v16H4z M8 16l4-8 4 8 M9.5 13h5',lessons:'M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1z M12 6v14',quiz:'M8 8a4 4 0 118 0c0 3-4 3-4 6 M12 18v1',language:'M12 3a9 9 0 100 18 9 9 0 000-18 M3 12h18 M12 3c-4 5-4 13 0 18 M12 3c4 5 4 13 0 18',menu:'M4 6h16 M4 12h16 M4 18h16',close:'M6 6l12 12 M18 6L6 18'};
 function icon(name){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+paths[name]+'"/></svg>';}
 document.querySelectorAll('.classroom-nav button').forEach(b=>{const key=b.dataset.destination||'home';b.querySelector('.nav-icon').innerHTML=icon(key);});
 const language=document.querySelector('.classroom-language');
 function styleLanguage(){const text=classroomLanguage==='or'?'English':'ଓଡ଼ିଆ';language.innerHTML=icon('language')+'<span>'+text+'</span>';}
 language.addEventListener('click',styleLanguage);styleLanguage();
 const toggle=document.querySelector('.classroom-toggle');
 function navigationState(){
  const open=!document.body.classList.contains('classroom-collapsed');
  // syncDrawer updates text only on body changes; replace it after that observer.
  toggle.innerHTML=open?icon('close'):'<img class="figma-menu-icon" src="menu-lines-l.svg" alt="" width="24" height="24">';
  document.querySelectorAll('.classroom-nav button').forEach(b=>{if(b.classList.contains('active'))b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 }
 new MutationObserver(navigationState).observe(document.body,{attributes:true,attributeFilter:['class']});
 document.querySelectorAll('[data-tab],.classroom-nav button').forEach(b=>b.addEventListener('click',navigationState));navigationState();
 // Subject describes the free-writing session. Learning activities have their own content label.
 const subject=document.querySelector('#classroomSubject');subject.setAttribute('aria-label','Writing board subject');
 const classSelect=document.querySelector('#classroomClass');classSelect.setAttribute('aria-label','Class');
 const contentLabel=document.createElement('p');contentLabel.className='activity-content-label';contentLabel.textContent='Odia learning activities';
 document.querySelector('#lessons').prepend(contentLabel);
 const quizLabel=contentLabel.cloneNode(true);document.querySelector('#quiz').prepend(quizLabel);
 // Do not cover writing with a permanent selection toast.
 function sessionChanged(){document.querySelector('#status').textContent='';}
 classSelect.addEventListener('change',sessionChanged);subject.addEventListener('change',sessionChanged);
})();
// Insert controls follow the same compact toolbar layout as secondary tools.
(()=>{
 for(const node of [insertButton,textButton]){
  const marker=document.createComment('responsive insert tool position');
  node.before(marker);secondary.push(node);placeholders.push(marker);
 }
 applyToolbarLayout();
})();
(()=>{
 const credits=document.createElement('details');credits.className='icon-credits';
 credits.innerHTML='<summary>Icon credits</summary><p>menu-lines-l · Menu Icons FREE (Figma Community). Original asset, unchanged. Licensed under Creative Commons Attribution 4.0.</p><p>Source: figma.com/community — file gX3fqQKCTWW8RIbQ7zGXFh, node 6:84.</p>';
 document.querySelector('#teacherHome').append(credits);
})();
(()=>{
 const board=document.getElementById('whiteboard');
 function syncBoardDock(){document.body.classList.toggle('activity-not-board',board.classList.contains('hidden'));}
 new MutationObserver(syncBoardDock).observe(board,{attributes:true,attributeFilter:['class']});
 syncBoardDock();
})();
// Selection edits integrate with a snapshot history kept independently for each page.
(()=>{
 const button=document.createElement('button');iconPaths.select='M5 3l13 11-6 .6L9 20z';toolIcon(button,'select','Select and move');button.id='selectTool';button.setAttribute('aria-pressed','false');dock.insertBefore(button,$('#pen'));
 let selecting=false,selected=null,drag=null,history=Object.create(null),replaying=false;
 const copy=x=>JSON.parse(JSON.stringify(x));
 const snapshot=()=>({strokes:copy(strokes),guide});
 const key=()=>activeBoardUser+':'+pageIndex;
 function state(){if(!history[key()]){const initial=snapshot(),undo=[];for(let i=0;i<initial.strokes.length;i++)undo.push({strokes:copy(initial.strokes.slice(0,i)),guide:initial.guide});const future=[];let next=copy(initial.strokes);for(let i=redo.length-1;i>=0;i--){next=next.concat([copy(redo[i])]);future.unshift({strokes:copy(next),guide:initial.guide})}history[key()]={undo,redo:future,last:initial}}return history[key()];}
 const basePersist=persist;
 persist=function(){const h=state(),now=snapshot();if(!replaying&&JSON.stringify(now)!==JSON.stringify(h.last)){h.undo.push(h.last);if(h.undo.length>100)h.undo.shift();h.redo=[];h.last=copy(now)}basePersist();updateHistory();};
 const priorUpdate=updateHistory;
 updateHistory=function(){priorUpdate();const h=state();$('#undo').disabled=!h.undo.length;$('#redo').disabled=!h.redo.length;};
 function restore(direction){if(drawing||drag)return;const h=state(),source=h[direction],target=direction==='undo'?h.redo:h.undo;if(!source.length)return;target.push(snapshot());const next=source.pop();strokes=copy(next.strokes);guide=next.guide;redo=[];h.last=snapshot();selected=null;replaying=true;persist();replaying=false;render();}
 $('#undo').onclick=()=>restore('undo');$('#redo').onclick=()=>restore('redo');
 const oldLoad=loadPage;loadPage=function(){selected=null;oldLoad();state();updateHistory();};
 const originalRender=render;
 render=function(){originalRender();document.dispatchEvent(new Event('boardselectionchange'));if(!selecting||!selected||!strokes.includes(selected)||!selected.points.length)return;const r=canvas.getBoundingClientRect(),xs=selected.points.map(p=>p[0]*r.width),ys=selected.points.map(p=>p[1]*r.height),left=Math.min(...xs),top=Math.min(...ys),w=Math.max(...xs)-left,h=Math.max(...ys)-top;ctx.save();ctx.strokeStyle='#176656';ctx.lineWidth=1.5;ctx.setLineDash([5,4]);ctx.strokeRect(left-8,top-8,Math.max(16,w+16),Math.max(16,h+16));ctx.setLineDash([]);ctx.fillStyle='#fff';ctx.strokeStyle='#252525';ctx.lineWidth=2;ctx.beginPath();ctx.arc(left+w+8,top+h+8,6,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();};
 function setMode(on){selecting=on;button.classList.toggle('active',on);button.setAttribute('aria-pressed',String(on));if(on){shapeMode=null;closePanels();extraPanel.classList.add('hidden');$('#pen').classList.remove('active');$('#eraser').classList.remove('active');insertButton.classList.remove('active');}else selected=null;render();}
 button.onclick=()=>setMode(!selecting);
 [$('#pen'),$('#eraser'),insertButton,textButton].forEach(el=>el.addEventListener('click',()=>setMode(false)));
 canvas.addEventListener('pointerdown',e=>{if(!selecting||!e.isPrimary||e.button!==0)return;e.stopImmediatePropagation();e.preventDefault();const p=point(e),r=canvas.getBoundingClientRect(),tx=16/r.width,ty=16/r.height;if(selected&&strokes.includes(selected)){const xs=selected.points.map(q=>q[0]),ys=selected.points.map(q=>q[1]),right=Math.max(...xs)+8/r.width,bottom=Math.max(...ys)+8/r.height;if(Math.hypot((p[0]-right)*r.width,(p[1]-bottom)*r.height)<=24){const anchor=[Math.min(...xs),Math.min(...ys)],points=copy(selected.points);drag={id:e.pointerId,start:p,points,resize:true,anchor,dist:Math.max(1,Math.hypot((p[0]-anchor[0])*r.width,(p[1]-anchor[1])*r.height))};canvas.setPointerCapture(e.pointerId);render();return}}selected=[...strokes].reverse().find(s=>!s.text&&s.color!=='#fffef9'&&s.points?.length>1&&(()=>{const xs=s.points.map(v=>v[0]),ys=s.points.map(v=>v[1]);return p[0]>=Math.min(...xs)-tx&&p[0]<=Math.max(...xs)+tx&&p[1]>=Math.min(...ys)-ty&&p[1]<=Math.max(...ys)+ty})())||null;if(selected){drag={id:e.pointerId,start:p,points:copy(selected.points)};canvas.setPointerCapture(e.pointerId)}render();},true);
 canvas.addEventListener('pointermove',e=>{if(!selecting)return;e.stopImmediatePropagation();if(!drag||drag.id!==e.pointerId)return;const p=point(e),dx=p[0]-drag.start[0],dy=p[1]-drag.start[1];if(drag.resize){const r=canvas.getBoundingClientRect(),a=drag.anchor,factor=Math.max(.05,Math.min(20,Math.hypot((p[0]-a[0])*r.width,(p[1]-a[1])*r.height)/drag.dist));selected.points=drag.points.map(q=>[a[0]+(q[0]-a[0])*factor,a[1]+(q[1]-a[1])*factor])}else selected.points=drag.points.map(q=>[q[0]+dx,q[1]+dy]);render();},true);
 function end(e){if(!selecting)return;e.stopImmediatePropagation();if(!drag||drag.id!==e.pointerId)return;if(e.type==='pointercancel')selected.points=drag.points;else if(JSON.stringify(selected.points)!==JSON.stringify(drag.points))persist();drag=null;render();}
 canvas.addEventListener('pointerup',end,true);canvas.addEventListener('pointercancel',end,true);
 function selectedClosed(){if(!selected||!Array.isArray(selected.points)||selected.points.length<3)return false;const a=selected.points[0],b=selected.points[selected.points.length-1];return Math.hypot(a[0]-b[0],a[1]-b[1])<0.01}
 window.boardSelectionInfo=()=>selecting&&selected&&strokes.includes(selected)?{closed:selectedClosed(),fillColor:selected.fillColor||null,fillOpacity:Number.isFinite(selected.fillOpacity)?selected.fillOpacity:1,borderColor:selected.color}:null;
 window.boardSelectionAction=(action,value)=>{
  if(!selecting||!selected||!strokes.includes(selected)){document.querySelector('#status').textContent='Select a drawing or shape first.';return false}
  if(action==='duplicate'){const clone=copy(selected);clone.points=clone.points.map(p=>[p[0]+0.03,p[1]+0.03]);strokes.push(clone);selected=clone}
  else if(action==='delete'){strokes.splice(strokes.indexOf(selected),1);selected=null}
  else if(action==='resize'){const factor=Number(value);if(!Number.isFinite(factor)||factor<=0)return false;const xs=selected.points.map(p=>p[0]),ys=selected.points.map(p=>p[1]),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;const width=(Math.max(...xs)-Math.min(...xs))*factor,height=(Math.max(...ys)-Math.min(...ys))*factor;if(Math.max(width,height)<0.008||Math.max(width,height)>2)return false;selected.points=selected.points.map(p=>[cx+(p[0]-cx)*factor,cy+(p[1]-cy)*factor])}
  else if(action==='fill'){if(!selectedClosed()||(value!==null&&!/^#[0-9a-f]{6}$/i.test(value)))return false;selected.fillColor=value}
  else if(action==='border'){if(!/^#[0-9a-f]{6}$/i.test(value))return false;selected.color=value}
  else if(action==='opacity'){const opacity=Number(value);if(!selectedClosed()||!Number.isFinite(opacity))return false;selected.fillOpacity=Math.max(0,Math.min(1,opacity))}
  else return false;
  redo=[];persist();render();return true;
 };
 window.resetBoardHistory=()=>{history=Object.create(null);state();updateHistory()};
 const saveBoard=$('#save').onclick;$('#save').onclick=()=>{const active=selecting;selecting=false;render();try{saveBoard()}finally{selecting=active;render()}};
 state();updateHistory();
})();
// Keep each compact popup attached to its toolbar button and inside the viewport.
(()=>{
 const mappings=[[options,$('#pen')],[boardSettings,settings],[$('.practice-strip'),letterToggle],[document.querySelector('#saathiMenu'),menu],[extraPanel,insertButton]];
 function place(panel,trigger){
  if(panel.classList.contains('hidden')||(panel.id==='saathiMenu'&&!panel.classList.contains('open'))||(panel.classList.contains('practice-strip')&&!panel.classList.contains('open')))return;
  const bar=bottomBar.getBoundingClientRect(),anchor=trigger.getBoundingClientRect(),gap=4;
  panel.style.bottom=Math.max(4,innerHeight-bar.top+gap)+'px';
  panel.style.maxHeight=Math.max(48,Math.min(230,bar.top-56))+'px';
  const width=panel.getBoundingClientRect().width;
  panel.style.left=Math.max(8,Math.min(anchor.left+anchor.width/2-width/2,innerWidth-width-8))+'px';
  panel.style.transform='none';
 }
 let frame=0;function reposition(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>mappings.forEach(([p,t])=>place(p,t)))}
 mappings.forEach(([panel])=>new MutationObserver(reposition).observe(panel,{attributes:true,attributeFilter:['class']}));
 window.addEventListener('resize',reposition);bottomBar.addEventListener('scroll',reposition);
})();
// Complete Odia alphabet for classroom exploration and tracing.
(()=>{
 const groups=[['ସ୍ୱରବର୍ଣ୍ଣ · Vowels',['ଅ','ଆ','ଇ','ଈ','ଉ','ଊ','ଋ','ଏ','ଐ','ଓ','ଔ']],['ବ୍ୟଞ୍ଜନବର୍ଣ୍ଣ · Consonants',['କ','ଖ','ଗ','ଘ','ଙ','ଚ','ଛ','ଜ','ଝ','ଞ','ଟ','ଠ','ଡ','ଢ','ଣ','ତ','ଥ','ଦ','ଧ','ନ','ପ','ଫ','ବ','ଭ','ମ','ଯ','ର','ଲ','ଳ','ଶ','ଷ','ସ','ହ']],['ଅନ୍ୟାନ୍ୟ · Additional',['ଡ଼','ଢ଼','ୟ','ୱ','କ୍ଷ','ଜ୍ଞ','ଶ୍ର','ଂ','ଃ','ଁ']]];
 const area=document.querySelector('#alphabet .panel'),grid=document.getElementById('letters');area.querySelector('h2').textContent='ଓଡ଼ିଆ ବର୍ଣ୍ଣମାଳା · Odia alphabet';area.querySelector('p').textContent='Choose a letter to practice on the writing board.';
 const shelf=document.createElement('div');shelf.className='alphabet-shelf';grid.replaceWith(shelf);
 const existing=new Set([...document.querySelectorAll('#quickLetters button')].map(b=>b.textContent));
 for(const [title,letters] of groups){const section=document.createElement('section');section.className='alphabet-group';const heading=document.createElement('h3');heading.textContent=title;const cells=document.createElement('div');cells.className='alphabet-cells';for(const letter of letters){const b=document.createElement('button');b.textContent=letter;b.setAttribute('aria-label','Practice '+letter);b.onclick=()=>practice(letter);cells.append(b);if(!existing.has(letter)){const quick=document.createElement('button');quick.textContent=letter;quick.setAttribute('aria-label','Practice '+letter);quick.onclick=()=>practice(letter);document.querySelector('#quickLetters').append(quick);existing.add(letter)}}section.append(heading,cells);shelf.append(section)}
 if(document.fonts)document.fonts.ready.then(()=>render());
})();
// A toolbar action closes every other popup before its own handler runs.
(()=>{
 const panels=[{button:menu,panel:document.getElementById('saathiMenu'),open:'open'}, {button:$('#pen'),panel:options,open:null}, {button:settings,panel:boardSettings,open:null}, {button:letterToggle,panel:$('.practice-strip'),open:'open'}, {button:insertButton,panel:extraPanel,open:null}, {button:moreButton,panel:morePanel,open:null}];
 function close(entry){if(entry.open)entry.panel.classList.remove(entry.open);else entry.panel.classList.add('hidden');entry.button.setAttribute('aria-expanded','false');}
 bottomBar.addEventListener('click',event=>{
  const clicked=event.target.closest('button');if(!clicked||!bottomBar.contains(clicked))return;
  panels.forEach(entry=>{if(entry.button!==clicked)close(entry)});
 },true);
 settings.addEventListener('click',()=>settings.setAttribute('aria-expanded',String(!boardSettings.classList.contains('hidden'))));
 canvas.addEventListener('pointerdown',()=>panels.forEach(close),true);
 document.addEventListener('keydown',event=>{if(event.key==='Escape')panels.forEach(close)});
})();
// Writing surface colors are local display preferences, separate from pen ink.
(()=>{
 const choices=[['Black','#121212'],['White','#fffefb'],['Green','#174c3d'],['Cream','#fff8df'],['Blue','#eaf3fb']];
 const wrap=document.createElement('fieldset');wrap.className='board-background-options';const legend=document.createElement('legend');legend.textContent='Board color';wrap.append(legend);const row=document.createElement('div');row.className='board-background-row';wrap.append(row);boardSettings.append(wrap);
 let selected='#121212';
 function apply(value){selected=value;canvas.style.backgroundColor=value;row.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===value)));}
 for(const [label,value] of choices){const b=document.createElement('button');b.type='button';b.dataset.color=value;b.setAttribute('aria-label',label+' board background');b.title=label;b.style.setProperty('--swatch',value);b.onclick=()=>{apply(value);try{localStorage.setItem('odia-board-background',value)}catch{document.querySelector('#status').textContent='Could not save board color on this device.'}};row.append(b)}
 const custom=document.createElement('input');custom.type='color';custom.className='board-custom-color';custom.setAttribute('aria-label','Choose any board background color');custom.title='Choose any board color';row.append(custom);
 function syncCustom(){custom.value=selected;custom.classList.toggle('is-selected',!choices.some(([,value])=>value===selected));}
 custom.addEventListener('input',()=>{apply(custom.value);syncCustom();try{localStorage.setItem('odia-board-background',custom.value)}catch{document.querySelector('#status').textContent='Could not save board color on this device.'}});
 row.addEventListener('click',event=>{if(event.target.closest('button'))syncCustom()});
 apply(selected);syncCustom();
})();
// A multicolor pencil marks the custom picker in both palettes.
(()=>{
 for(const input of [document.querySelector('#penOptions .custom-color'),document.querySelector('.board-custom-color')]){
  if(!input)continue;
  const label=document.createElement('label');label.className='custom-palette-icon';input.before(label);label.append(input);
  const mark=document.createElement('span');mark.className='custom-palette-mark';mark.setAttribute('aria-hidden','true');mark.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l4-.8L19.5 7.7a2.1 2.1 0 0 0-3-3L5 16.2 4 20z M14.5 6.7l3 3"/></svg>';label.append(mark);
 }
})();
// More tools has its own button; the page-add control remains in page controls.
(()=>{
 const previousLayout=applyToolbarLayout;
 applyToolbarLayout=function(){previousLayout();dock.append(moreButton)};
 applyToolbarLayout();
 const laser=document.createElement('button');laser.type='button';laser.className='laser-choice';laser.setAttribute('aria-label','Laser pointer');laser.innerHTML='<span aria-hidden="true">✦</span><small>Laser</small>';morePanel.append(laser);
 const dot=document.createElement('div');dot.className='laser-pointer hidden';dot.setAttribute('aria-hidden','true');document.body.append(dot);let laserMode=false,pressed=false;
 function deactivate(){laserMode=false;pressed=false;dot.classList.add('hidden');laser.classList.remove('active');laser.setAttribute('aria-pressed','false')}
 laser.setAttribute('aria-pressed','false');laser.onclick=()=>{const next=!laserMode;deactivate();if(next){const select=document.querySelector('#selectTool');if(select?.getAttribute('aria-pressed')==='true')select.click();laserMode=true;laser.classList.add('active');laser.setAttribute('aria-pressed','true');$('#pen').classList.remove('active');$('#eraser').classList.remove('active');shapeMode=null;closePanels();}closeMore()};
 [$('#pen'),$('#eraser'),insertButton,textButton,document.querySelector('#selectTool')].filter(Boolean).forEach(b=>b.addEventListener('click',deactivate));
 function position(e){dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';}
 canvas.addEventListener('pointerdown',e=>{if(!laserMode||!e.isPrimary||e.button!==0)return;e.preventDefault();e.stopImmediatePropagation();pressed=true;canvas.setPointerCapture(e.pointerId);position(e);dot.classList.remove('hidden')},true);
 canvas.addEventListener('pointermove',e=>{if(!laserMode)return;e.stopImmediatePropagation();if(pressed)position(e)},true);
 function finish(e){if(!laserMode)return;e.stopImmediatePropagation();pressed=false;dot.classList.add('hidden')}
 canvas.addEventListener('pointerup',finish,true);canvas.addEventListener('pointercancel',finish,true);
 const previousMenu=moreButton.onclick;moreButton.onclick=()=>{extraPanel.classList.add('hidden');insertButton.setAttribute('aria-expanded','false');previousMenu();if(!morePanel.classList.contains('hidden')){const b=bottomBar.getBoundingClientRect(),a=moreButton.getBoundingClientRect();morePanel.style.bottom=Math.max(4,innerHeight-b.top+4)+'px';morePanel.style.left=Math.max(8,Math.min(a.left+24-morePanel.offsetWidth/2,innerWidth-morePanel.offsetWidth-8))+'px';morePanel.style.right='auto'}};
})();
// Quick board styles and movable straightedge in More tools.
(()=>{
 function item(icon,label,action){const b=document.createElement('button');b.type='button';b.innerHTML='<span aria-hidden="true">'+icon+'</span><small>'+label+'</small>';b.setAttribute('aria-label',label);b.onclick=()=>{action();closeMore()};morePanel.append(b);return b}
 for(const [value,label,icon] of [['plain','Plain','□'],['dots','Dots','⠿'],['ruled','Lines','☰']])item(icon,label,()=>{$('#paper').value=value;$('#paper').dispatchEvent(new Event('change',{bubbles:true}))});
 const ruler=document.createElement('div');ruler.className='board-straightedge hidden';ruler.setAttribute('role','group');ruler.setAttribute('aria-label','Movable straightedge');ruler.innerHTML='<span>STRAIGHTEDGE · drag to move</span><button type="button" aria-label="Close straightedge">×</button><div class="straightedge-line"></div>';document.body.append(ruler);
 ruler.querySelector('button').onclick=()=>ruler.classList.add('hidden');item('╱','Straightedge',()=>ruler.classList.toggle('hidden'));
 let movement=null;ruler.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;e.preventDefault();const r=ruler.getBoundingClientRect();movement={id:e.pointerId,x:e.clientX-r.left,y:e.clientY-r.top};ruler.setPointerCapture(e.pointerId)});
 ruler.addEventListener('pointermove',e=>{if(!movement||movement.id!==e.pointerId)return;const x=Math.max(0,Math.min(innerWidth-ruler.offsetWidth,e.clientX-movement.x)),y=Math.max(48,Math.min(innerHeight-ruler.offsetHeight,e.clientY-movement.y));ruler.style.left=x+'px';ruler.style.top=y+'px';ruler.style.transform='none'});
 for(const type of ['pointerup','pointercancel'])ruler.addEventListener(type,()=>movement=null);
})();
// Right-side shortcuts reuse the existing board actions and state.
(()=>{
 const bar=document.createElement('div');bar.className='right-tool-bar';bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','Quick board tools');
 const entries=[['selectTool','Select','M5 3l13 11-6 .6L9 20z'],['eraser','Eraser','M3.7 15.3l9-9a2 2 0 012.8 0l4.2 4.2a2 2 0 010 2.8l-6.4 6.4H8.1z M8 11l7 7 M13.5 19.7H21'],['undo','Undo','M9 7L4 12l5 5 M4 12h10a5 5 0 010 10'],['redo','Redo','M15 7l5 5-5 5 M20 12H10a5 5 0 000 10']];
 for(const [id,label,path] of entries){const target=document.getElementById(id);if(!target)continue;const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',label);b.title=label;b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+path+'"/></svg>';b.onclick=()=>target.click();bar.append(b);function sync(){b.disabled=target.disabled;b.classList.toggle('active',target.classList.contains('active'));b.setAttribute('aria-pressed',String(target.classList.contains('active')))}new MutationObserver(sync).observe(target,{attributes:true,attributeFilter:['class','disabled']});sync()}
 document.body.append(bar);
})();
// White ink is the starting pen on the dark default board.
(()=>{
 const white=document.createElement('button');white.type='button';white.style.background='#ffffff';white.setAttribute('aria-label','Use white ink');white.setAttribute('aria-pressed','true');
 white.onclick=()=>{color='#ffffff';document.querySelectorAll('#penOptions .colors button').forEach(b=>b.setAttribute('aria-pressed',String(b===white)));$('#pen').click()};
 colors.prepend(white);color='#ffffff';colorInput.value='#ffffff';colors.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===white)));
})();
// Keep default ink readable when a previously saved light background is restored.
(()=>{const rgb=getComputedStyle(canvas).backgroundColor.match(/\d+/g);if(!rgb||rgb.length<3)return;const luminance=(+rgb[0]*299 + +rgb[1]*587 + +rgb[2]*114)/1000;if(luminance>180){color='#242d3a';colorInput.value=color;colors.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.getAttribute('aria-label')==='Use color #242d3a')))}})();
// Remove the retired sidebar and its page from the running interface.
(()=>{
 document.querySelectorAll('.classroom-sidebar,.classroom-toggle,.classroom-header,.classroom-shade,#teacherHome').forEach(node=>node.remove());
 document.body.classList.add('classroom-collapsed');
})();
// Replace stroke presets with a continuous slider while retaining the same value used by drawing.
(()=>{
 sizeRow.replaceChildren();sizeInput.type='range';sizeInput.min='1';sizeInput.max='24';sizeInput.step='1';sizeInput.setAttribute('aria-label','Pen stroke size');
 const label=document.createElement('label');label.className='stroke-slider-label';label.htmlFor='size';label.textContent='Stroke size';
 const value=document.createElement('output');value.className='stroke-slider-value';value.htmlFor='size';
 const update=()=>{value.textContent=sizeInput.value;};sizeInput.addEventListener('input',update);update();sizeRow.append(label,value,sizeInput);
})();
// Divide the current shared board into equal vertical writing areas.
(()=>{
 const bar=document.querySelector('.right-tool-bar');const group=document.createElement('div');group.className='board-split-controls';group.setAttribute('role','group');group.setAttribute('aria-label','Number of writing areas');
 const lines=document.createElement('div');lines.className='board-split-lines';lines.setAttribute('aria-hidden','true');document.querySelector('#whiteboard .board').append(lines);
 let count=1;try{const saved=Number(localStorage.getItem('odia-board-split'));if(Number.isInteger(saved)&&saved>=1&&saved<=4)count=saved}catch{}
 const buttons=[];
 function update(){window.boardZoneCount=count;document.dispatchEvent(new Event('boardzoneschange'));lines.replaceChildren();for(let i=1;i<count;i++){const line=document.createElement('span');line.style.left=(i*100/count)+'%';lines.append(line)}buttons.forEach((b,i)=>{const selected=i+1===count;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});}
 function lineColor(){const rgb=getComputedStyle(canvas).backgroundColor.match(/\d+/g);const light=rgb&&(+rgb[0]*299 + +rgb[1]*587 + +rgb[2]*114)/1000>150;lines.classList.toggle('light-board',!!light)}
 for(let n=1;n<=4;n++){const b=document.createElement('button');b.type='button';b.textContent=String(n);b.setAttribute('aria-label',n+' equal writing '+(n===1?'area':'areas'));b.onclick=()=>{count=n;update();try{localStorage.setItem('odia-board-split',String(n))}catch{}};buttons.push(b);group.append(b)}
 const toggle=document.createElement('button');toggle.type='button';toggle.className='split-menu-toggle';toggle.setAttribute('aria-label','Divide board');toggle.setAttribute('aria-expanded','false');toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h18v16H3z M12 4v16"/></svg>';
 group.classList.add('hidden');group.id='boardSplitMenu';toggle.setAttribute('aria-controls',group.id);
 toggle.onclick=()=>{const open=group.classList.toggle('hidden')===false;if(open){const r=toggle.getBoundingClientRect();group.style.right=Math.max(8,innerWidth-r.left+6)+'px';group.style.top=Math.max(8,Math.min(r.top,innerHeight-group.offsetHeight-8))+'px'}toggle.setAttribute('aria-expanded',String(open))};
 group.addEventListener('click',event=>{if(event.target.closest('button')){group.classList.add('hidden');toggle.setAttribute('aria-expanded','false')}});
 canvas.addEventListener('pointerdown',()=>{group.classList.add('hidden');toggle.setAttribute('aria-expanded','false')});
 bar.append(toggle);document.body.append(group);new MutationObserver(lineColor).observe(canvas,{attributes:true,attributeFilter:['style']});lineColor();update();
})();
// Fill applies to newly drawn closed shapes; outline continues to use pen color.
(()=>{
 const controls=document.createElement('div');controls.className='shape-fill-controls';
 const label=document.createElement('label');const enabled=document.createElement('input');enabled.type='checkbox';enabled.setAttribute('aria-label','Fill closed shapes');label.append(enabled,document.createTextNode(' Fill'));
 const picker=document.createElement('input');picker.type='color';picker.value=shapeFillColor;picker.setAttribute('aria-label','Shape fill color');
 enabled.onchange=()=>{shapeFillEnabled=enabled.checked};picker.oninput=()=>{shapeFillColor=picker.value;shapeFillEnabled=true;enabled.checked=true};
 controls.append(label,picker);extraPanel.prepend(controls);
})();
// Screen shade covers part of the board and can be adjusted or dismissed.
(()=>{
 const layer=document.createElement('div');layer.className='screen-shade hidden';layer.setAttribute('aria-hidden','true');document.querySelector('#whiteboard .board').append(layer);
 const controls=document.createElement('div');controls.className='shade-controls hidden';controls.setAttribute('role','group');controls.setAttribute('aria-label','Screen shade');
 const label=document.createElement('label');label.textContent='Reveal';const slider=document.createElement('input');slider.type='range';slider.min='0';slider.max='100';slider.value='0';slider.setAttribute('aria-label','Reveal board');label.append(slider);
 const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Close screen shade');controls.append(label,close);document.body.append(controls);
 function hide(){layer.classList.add('hidden');controls.classList.add('hidden')}
 function update(){layer.style.height=(100-Number(slider.value))+'%'}
 slider.addEventListener('input',update);close.onclick=hide;
 const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Screen shade');b.innerHTML='<span aria-hidden="true">▤</span><small>Shade</small>';b.onclick=()=>{slider.value='0';update();layer.classList.remove('hidden');controls.classList.remove('hidden');closeMore()};morePanel.append(b);
 new MutationObserver(()=>{if(document.body.classList.contains('activity-not-board'))hide()}).observe(document.body,{attributes:true,attributeFilter:['class']});
})();
// Page actions operate on copies and preserve the current page history.
(()=>{
 function action(label,symbol,fn){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',label);b.innerHTML='<span aria-hidden="true">'+symbol+'</span><small>'+label+'</small>';b.onclick=fn;morePanel.append(b)}
 action('Duplicate page','▣',()=>{if(drawing)return;persist();const copy=JSON.parse(JSON.stringify(pages[pageIndex]));pages.splice(pageIndex+1,0,copy);pageIndex++;loadPage();window.resetBoardHistory();persist();closeMore()});
 action('Delete page','⌫',async()=>{if(drawing)return;closeMore();if(!await confirmBoard('Delete this page?','This permanently removes the current page from this board.','Delete page'))return;if(pages.length===1){pages=[{strokes:[],redo:[],guide:''}];pageIndex=0}else{pages.splice(pageIndex,1);pageIndex=Math.min(pageIndex,pages.length-1)}loadPage();window.resetBoardHistory();persist()});
})();
// Page overview displays snapshots without modifying the saved pages.
(()=>{
 const panel=document.createElement('div');panel.className='page-overview hidden';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Pages');
 const heading=document.createElement('div');heading.className='page-overview-heading';heading.textContent='Pages';const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Close pages');heading.append(close);const list=document.createElement('div');list.className='page-overview-list';panel.append(heading,list);document.body.append(panel);close.onclick=()=>panel.classList.add('hidden');
 function thumbnail(page){const c=document.createElement('canvas');c.width=144;c.height=90;const g=c.getContext('2d');g.fillStyle=getComputedStyle(canvas).backgroundColor;g.fillRect(0,0,c.width,c.height);for(const s of page.strokes||[]){if(!Array.isArray(s.points)||!s.points.length)continue;g.save();g.globalAlpha=s.alpha??1;g.globalCompositeOperation=s.color==='#fffef9'?'destination-out':'source-over';g.strokeStyle=s.color||'#fff';g.lineWidth=Math.max(1,(s.size||2)*.2);g.lineCap='round';g.lineJoin='round';if(s.text){g.fillStyle=s.color;g.font=Math.max(6,(s.size||16)*.2)+'px sans-serif';g.fillText(s.text,s.points[0][0]*c.width,s.points[0][1]*c.height)}else{g.beginPath();s.points.forEach((p,i)=>i?g.lineTo(p[0]*c.width,p[1]*c.height):g.moveTo(p[0]*c.width,p[1]*c.height));if(s.fillColor){g.fillStyle=s.fillColor;g.fill()}g.stroke()}g.restore()}return c}
 function open(){if(drawing)return;persist();list.replaceChildren();pages.forEach((page,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Open page '+(i+1));if(i===pageIndex)b.setAttribute('aria-current','page');b.append(thumbnail(page));const label=document.createElement('span');label.textContent=String(i+1);b.append(label);b.onclick=()=>{changePage(i);panel.classList.add('hidden')};list.append(b)});closeMore();panel.classList.remove('hidden')}
 const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Page overview');button.innerHTML='<span aria-hidden="true">▦</span><small>Pages</small>';button.onclick=open;morePanel.append(button);
 canvas.addEventListener('pointerdown',()=>panel.classList.add('hidden'));document.addEventListener('keydown',e=>{if(e.key==='Escape')panel.classList.add('hidden')});
 new MutationObserver(()=>{if(document.body.classList.contains('activity-not-board'))panel.classList.add('hidden')}).observe(document.body,{attributes:true,attributeFilter:['class']});
})();
// Classroom countdown timer uses wall-clock time so pauses and backgrounding stay accurate.
(()=>{
 const panel=document.createElement('div');panel.className='class-timer hidden';panel.setAttribute('role','group');panel.setAttribute('aria-label','Classroom timer');panel.innerHTML='<div class="class-timer-head"><strong>Timer</strong><button type="button" class="timer-close" aria-label="Close timer">×</button></div><div class="class-timer-time" role="timer" aria-live="off">05:00</div><label>Minutes <input type="number" min="1" max="120" value="5" aria-label="Timer minutes"></label><div class="class-timer-actions"><button type="button" class="timer-start">Start</button><button type="button" class="timer-reset">Reset</button></div><p role="status" class="timer-status"></p>';document.body.append(panel);
 const input=panel.querySelector('input'),output=panel.querySelector('.class-timer-time'),start=panel.querySelector('.timer-start'),status=panel.querySelector('.timer-status');let remaining=300,deadline=0,ticker=null;
 function paint(){output.textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0')}
 function stop(){if(ticker!==null)clearInterval(ticker);ticker=null;input.disabled=false;start.textContent='Start'}
 function tick(){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));paint();if(!remaining){stop();status.textContent='Time is up.'}}
 function reset(){stop();input.value=Math.max(1,Math.min(120,Math.round(Number(input.value)||5)));remaining=Number(input.value)*60;status.textContent='';paint()}
 start.onclick=()=>{if(ticker!==null){tick();stop();if(remaining)status.textContent='Paused.';return}if(!remaining)reset();deadline=Date.now()+remaining*1000;input.disabled=true;start.textContent='Pause';status.textContent='';ticker=setInterval(tick,250);tick()};input.onchange=reset;panel.querySelector('.timer-reset').onclick=reset;panel.querySelector('.timer-close').onclick=()=>{stop();panel.classList.add('hidden')};
 const trigger=document.createElement('button');trigger.type='button';trigger.setAttribute('aria-label','Classroom timer');trigger.innerHTML='<span aria-hidden="true">◷</span><small>Timer</small>';trigger.onclick=()=>{closeMore();panel.classList.toggle('hidden')};morePanel.append(trigger);new MutationObserver(()=>{if(document.body.classList.contains('activity-not-board')){stop();panel.classList.add('hidden')}}).observe(document.body,{attributes:true,attributeFilter:['class']});
})();
// Reorder the current page while keeping its contents and page-local data together.
(()=>{
 function move(delta){if(drawing)return;const target=pageIndex+delta;if(target<0||target>=pages.length)return;persist();const page=pages.splice(pageIndex,1)[0];pages.splice(target,0,page);pageIndex=target;loadPage();if(window.resetBoardHistory)window.resetBoardHistory();persist();closeMore()}
 for(const [label,symbol,delta] of [['Move page left','⇤',-1],['Move page right','⇥',1]]){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',label);b.innerHTML='<span aria-hidden="true">'+symbol+'</span><small>'+label+'</small>';b.onclick=()=>move(delta);morePanel.append(b)}
})();
// Actions apply only to the currently selected stroke or shape.
(()=>{
 for(const [action,label,symbol] of [['duplicate','Copy selected','⧉'],['delete','Delete selected','⌫']]){
  const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',label);b.innerHTML='<span aria-hidden="true">'+symbol+'</span><small>'+label+'</small>';b.onclick=()=>{window.boardSelectionAction(action);closeMore()};morePanel.append(b);
 }
})();
// Place existing More actions directly in the right toolbar.
(()=>{
 const bar=document.querySelector('.right-tool-bar');if(!bar)return;
 const extras=document.createElement('div');extras.className='right-tool-extras';extras.setAttribute('role','group');extras.setAttribute('aria-label','More board tools');
 while(morePanel.firstElementChild)extras.append(morePanel.firstElementChild);
 bar.append(extras);moreButton.remove();
})();
// Group right-hand actions by teaching task, keeping the main toolbar compact.
(()=>{
 const bar=document.querySelector('.right-tool-bar'),extras=bar?.querySelector('.right-tool-extras');if(!bar||!extras)return;
 const definitions=[{name:'Board',icon:'M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h5',match:/^(Laser pointer|Plain|Dots|Lines|Straightedge|Screen shade|Classroom timer)$/},{name:'Pages',icon:'M6 3h11l3 3v15H6z M15 3v4h5 M9 12h7 M9 16h7',match:/page/i},{name:'Objects',icon:'M4 4h8v8H4z M16 13a4 4 0 100 8 4 4 0 000-8',match:/selected/i}];
 const entries=[...extras.querySelectorAll('button')],panels=[];
 function closeAll(){panels.forEach(({panel,trigger})=>{panel.classList.add('hidden');trigger.setAttribute('aria-expanded','false')})}
 for(const def of definitions){
  const items=entries.filter(b=>def.match.test(b.getAttribute('aria-label')||''));if(!items.length)continue;
  const trigger=document.createElement('button');trigger.type='button';trigger.className='tool-group-trigger';trigger.setAttribute('aria-label',def.name+' tools');trigger.setAttribute('aria-expanded','false');trigger.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+def.icon+'"/></svg>';
  const panel=document.createElement('div');panel.className='right-group-popup hidden';panel.setAttribute('role','group');panel.setAttribute('aria-label',def.name+' tools');const heading=document.createElement('strong');heading.textContent=def.name;const grid=document.createElement('div');grid.className='right-group-grid';for(const item of items)grid.append(item);panel.append(heading,grid);document.body.append(panel);bar.append(trigger);panels.push({panel,trigger});
  trigger.onclick=()=>{const open=panel.classList.contains('hidden');closeAll();if(open){const r=trigger.getBoundingClientRect();panel.classList.remove('hidden');const h=panel.offsetHeight;panel.style.right=Math.max(8,innerWidth-r.left+6)+'px';panel.style.top=Math.max(8,Math.min(r.top,innerHeight-h-8))+'px';trigger.setAttribute('aria-expanded','true')}};
  grid.addEventListener('click',event=>{if(event.target.closest('button'))closeAll()});
 }
 // Keep any unclassified actions accessible under Board rather than losing them.
 const remaining=[...extras.querySelectorAll('button')];if(remaining.length&&panels.length)remaining.forEach(b=>panels[0].panel.querySelector('.right-group-grid').append(b));extras.remove();
 document.addEventListener('pointerdown',event=>{if(!event.target.closest('.right-group-popup,.tool-group-trigger'))closeAll()},true);document.addEventListener('keydown',event=>{if(event.key==='Escape')closeAll()});
 new MutationObserver(()=>{if(document.body.classList.contains('activity-not-board'))closeAll()}).observe(document.body,{attributes:true,attributeFilter:['class']});
})();
// Bottom dock already provides these actions; keep only unique right-side tools.
(()=>{const bar=document.querySelector('.right-tool-bar');if(!bar)return;for(const label of ['Select','Eraser','Undo','Redo'])bar.querySelector('button[aria-label="'+label+'"]')?.remove()})();
// Each divided area has its own color, pen type and stroke width.
(()=>{
 const defaults=['#ffffff','#ffe06c','#75c9ff','#ff9fb0'];window.boardZoneOptions=defaults.map(c=>({color:c,type:'pen',size:4}));
 const panel=document.createElement('div');panel.className='zone-tools hidden';panel.setAttribute('aria-label','Writing tools for each area');document.body.append(panel);
 function renderZones(){const n=window.boardZoneCount||1;panel.replaceChildren();panel.classList.toggle('hidden',n<=1);panel.style.gridTemplateColumns='repeat('+n+',minmax(0,1fr))';for(let i=0;i<n;i++){const opt=window.boardZoneOptions[i],group=document.createElement('div');group.className='zone-tool';group.setAttribute('role','group');group.setAttribute('aria-label','User '+(i+1)+' writing tools');const label=document.createElement('strong');label.textContent=String(i+1);const paint=document.createElement('input');paint.type='color';paint.value=opt.color;paint.setAttribute('aria-label','User '+(i+1)+' ink color');paint.oninput=()=>opt.color=paint.value;const type=document.createElement('select');type.setAttribute('aria-label','User '+(i+1)+' pen type');for(const [value,title] of [['pen','Pen'],['marker','Marker'],['highlighter','Highlight'],['brush','Brush']])type.add(new Option(title,value));type.value=opt.type;type.onchange=()=>opt.type=type.value;const width=document.createElement('input');width.type='range';width.min='1';width.max='24';width.value=opt.size;width.setAttribute('aria-label','User '+(i+1)+' stroke size');width.oninput=()=>opt.size=Number(width.value);group.append(label,paint,type,width);panel.append(group)}}
 document.addEventListener('boardzoneschange',renderZones);renderZones();
 const cursor=document.createElement('div');cursor.className='eraser-contact hidden';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);window.showEraserContact=(e,size)=>{const d=Math.max(5,Math.min(120,size));cursor.style.width=d+'px';cursor.style.height=d+'px';cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.classList.remove('hidden')};window.hideEraserContact=()=>cursor.classList.add('hidden');
})();
// In split mode retain only Save and Exit alongside each area's writing tools.
(()=>{
 const controls=document.createElement('div');controls.className='split-session-controls hidden';controls.setAttribute('role','group');controls.setAttribute('aria-label','Split mode controls');
 const save=document.createElement('button');save.type='button';save.textContent='Save';save.setAttribute('aria-label','Save board image');save.onclick=()=>document.querySelector('#save').click();
 const exit=document.createElement('button');exit.type='button';exit.textContent='Exit';exit.setAttribute('aria-label','Exit split mode');exit.onclick=()=>{const one=document.querySelector('.board-split-controls button[aria-label="1 equal writing area"]');if(one)one.click();};controls.append(save,exit);document.body.append(controls);
 function sync(){const active=(window.boardZoneCount||1)>1;document.body.classList.toggle('split-mode',active);controls.classList.toggle('hidden',!active)}
 document.addEventListener('boardzoneschange',sync);sync();
})();
// Give each split area a compact pen-type button instead of a native dropdown.
(()=>{
 const root=document.querySelector('.zone-tools');if(!root)return;
 const icons={pen:'<img src="icon-pen-tool.svg" alt="">',marker:'<img src="icon-marker.svg" alt="">',highlighter:'<img src="icon-highlighter.svg" alt="">',brush:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+iconPaths.brush+'"/></svg>'};
 function closeAll(except){root.querySelectorAll('.zone-pen-menu').forEach(menu=>{if(menu!==except){menu.classList.add('hidden');menu.previousElementSibling?.setAttribute('aria-expanded','false')}})}
 function decorate(){root.querySelectorAll('.zone-tool').forEach((group,index)=>{
  const select=group.querySelector('select');if(!select||select.dataset.enhanced)return;select.dataset.enhanced='true';select.classList.add('zone-native-select');
  const button=document.createElement('button');button.type='button';button.className='zone-pen-trigger';button.setAttribute('aria-label','User '+(index+1)+' pen type');button.setAttribute('aria-expanded','false');
  const menu=document.createElement('div');menu.className='zone-pen-menu hidden';menu.setAttribute('role','group');menu.setAttribute('aria-label','User '+(index+1)+' pen types');
  function update(){button.innerHTML=icons[select.value]||icons.pen;button.title=select.selectedOptions[0]?.textContent||'Pen';menu.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===select.value)))}
  for(const option of select.options){const item=document.createElement('button');item.type='button';item.dataset.value=option.value;item.innerHTML='<span aria-hidden="true">'+icons[option.value]+'</span><small></small>';item.querySelector('small').textContent=option.textContent;item.setAttribute('aria-label','User '+(index+1)+' '+option.textContent);item.onclick=()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));update();closeAll()};menu.append(item)}
  button.onclick=()=>{const open=menu.classList.contains('hidden');closeAll();menu.classList.toggle('hidden',!open);button.setAttribute('aria-expanded',String(open))};select.after(button,menu);update();
 })}
 new MutationObserver(decorate).observe(root,{childList:true});document.addEventListener('pointerdown',e=>{if(!e.target.closest('.zone-pen-trigger,.zone-pen-menu'))closeAll()},true);decorate();
})();
// Compact per-user palette; the system picker is opened only for a custom color.
(()=>{
 const root=document.querySelector('.zone-tools');if(!root)return;
 function closeAll(except){root.querySelectorAll('.zone-color-menu').forEach(m=>{if(m!==except){m.classList.add('hidden');m.previousElementSibling?.setAttribute('aria-expanded','false')}})}
 function decorate(){root.querySelectorAll('.zone-tool').forEach((group,index)=>{
  const input=group.querySelector('input[type=color]');if(!input||input.dataset.paletteReady)return;input.dataset.paletteReady='true';
  const trigger=document.createElement('button');trigger.type='button';trigger.className='zone-color-trigger';trigger.setAttribute('aria-label','User '+(index+1)+' ink colors');trigger.setAttribute('aria-expanded','false');
  const menu=document.createElement('div');menu.className='zone-color-menu hidden';menu.setAttribute('role','group');menu.setAttribute('aria-label','User '+(index+1)+' colors');
  function refresh(){trigger.style.setProperty('--zone-ink',input.value);menu.querySelectorAll('button[data-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color.toLowerCase()===input.value.toLowerCase())))}
  for(const [label,value] of [['White','#ffffff'],['Black','#242d3a'],['Red','#d25343'],['Yellow','#ffe06c'],['Blue','#75c9ff'],['Green','#155c50'],['Pink','#ff9fb0'],['Purple','#9665b1']]){const b=document.createElement('button');b.type='button';b.dataset.color=value;b.setAttribute('aria-label',label+' ink');b.style.setProperty('--swatch',value);b.onclick=()=>{input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));refresh();closeAll()};menu.append(b)}
  const custom=document.createElement('label');custom.className='zone-custom-color';custom.title='Choose custom color';const mark=document.createElement('span');mark.setAttribute('aria-hidden','true');mark.textContent='✎';input.before(trigger,menu);custom.append(input,mark);menu.append(custom);
  input.addEventListener('input',()=>{refresh();closeAll()});trigger.onclick=()=>{const open=menu.classList.contains('hidden');closeAll();menu.classList.toggle('hidden',!open);trigger.setAttribute('aria-expanded',String(open))};refresh();
 })}
 new MutationObserver(decorate).observe(root,{childList:true});document.addEventListener('pointerdown',e=>{if(!e.target.closest('.zone-color-trigger,.zone-color-menu'))closeAll()},true);decorate();
})();
// Toolbar shortcuts and an editable-size, 3-by-3 drawn table.
(()=>{
 iconPaths.table='M3 4h18v16H3z M3 10h18 M3 15h18 M9 4v16 M15 4v16';
 const table=document.createElement('button');table.id='tableTool';toolIcon(table,'table','Draw table');
 const originalShapePoints=shapePoints;shapePoints=function(a,b){if(shapeMode!=='Table')return originalShapePoints(a,b);const x0=a[0],y0=a[1],x1=b[0],y1=b[1],p=[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]];for(let i=1;i<3;i++){const y=y0+(y1-y0)*i/3;p.push([x0,y],[x1,y],[x0,y])}p.push([x0,y0]);for(let i=1;i<3;i++){const x=x0+(x1-x0)*i/3;p.push([x,y0],[x,y1],[x,y0])}return p};
 table.onclick=()=>{const select=document.querySelector('#selectTool');if(select?.getAttribute('aria-pressed')==='true')select.click();chooseShape('Table');insertButton.classList.remove('active');table.classList.add('active');table.setAttribute('aria-pressed','true')};
 table.setAttribute('aria-pressed','false');for(const el of [document.querySelector('#pen'),document.querySelector('#eraser'),insertButton,document.querySelector('#selectTool')])el?.addEventListener('click',()=>{table.classList.remove('active');table.setAttribute('aria-pressed','false')});
 canvas.addEventListener('pointerup',()=>{if(shapeMode===null){table.classList.remove('active');table.setAttribute('aria-pressed','false')}});
 function proxy(label,path,selector){const b=document.createElement('button');b.type='button';iconPaths[label]=path;toolIcon(b,label,label);b.onclick=()=>document.querySelector(selector)?.click();return b}
 const participation=proxy('Participation','M3 4h18v16H3z M12 4v16','.split-menu-toggle');
 const overview=proxy('Page preview','M3 4h8v7H3z M13 4h8v7h-8z M3 13h8v7H3z M13 13h8v7h-8z','button[aria-label="Page overview"]');
 const more=proxy('More tools','M5 12h14 M12 5v14','.tool-group-trigger[aria-label="Board tools"]');
 dock.append(table,participation,overview,more);
 function arrange(){for(const node of [document.querySelector('#selectTool'),$('#pen'),$('#eraser'),$('#undo'),$('#redo'),$('#clear'),insertButton,table,(window.toolbarDeduplicated?document.querySelector('.bottom-bar .split-menu-toggle'):participation),(window.toolbarDeduplicated?document.querySelector('.bottom-bar button[aria-label="Page overview"]'):overview),(window.toolbarDeduplicated?null:more),letterToggle,settings,textButton,$('#save')])if(node)dock.append(node)}
 arrange();if(phoneLayout.addEventListener)phoneLayout.addEventListener('change',arrange);else phoneLayout.addListener(arrange);
})();
// Compact visible names supplement accessible labels on the bottom toolbar.
(()=>{
 const labels={'activityMenu':'Saathi','selectTool':'Select','pen':'Pen','eraser':'Eraser','undo':'Undo','redo':'Redo','insertTools':'Shapes','tableTool':'Table','clear':'Clear','letterToggle':'Letters','settings':'Style','textInsertTool':'Text','save':'Save'};
 const byLabel={'Participation':'Users','Page preview':'Pages','More tools':'More','Previous page':'Prev','Next page':'Next','New page':'Add'};
 document.querySelectorAll('.bottom-bar button').forEach(button=>{const text=labels[button.id]||byLabel[button.getAttribute('aria-label')];if(!text)return;const label=document.createElement('span');label.className='dock-tool-name';label.setAttribute('aria-hidden','true');label.textContent=text;button.append(label)});
})();
// Small visible names for the right toolbar; accessible button labels stay intact.
(()=>{const bar=document.querySelector('.right-tool-bar');if(!bar)return;const labels={'Divide board':'Split','Board tools':'Board','Pages tools':'Pages','Objects tools':'Objects'};for(const button of bar.querySelectorAll(':scope > button')){const text=labels[button.getAttribute('aria-label')];if(!text)continue;const name=document.createElement('span');name.className='right-tool-name';name.setAttribute('aria-hidden','true');name.textContent=text;button.append(name)}})();
// Keep one visible entry for each action across bottom and right toolbars.
(()=>{
 const participation=document.querySelector('.bottom-bar button[aria-label="Participation"]');
 const split=document.querySelector('.right-tool-bar .split-menu-toggle');
 if(participation&&split){participation.replaceWith(split);const old=split.querySelector('.right-tool-name');if(old)old.remove();const name=document.createElement('span');name.className='dock-tool-name';name.setAttribute('aria-hidden','true');name.textContent='Users';split.append(name);split.onclick=()=>{const group=document.getElementById('boardSplitMenu');const open=group.classList.toggle('hidden')===false;if(open){const r=split.getBoundingClientRect();group.style.right=Math.max(8,innerWidth-r.right)+'px';group.style.top=Math.max(8,r.top-group.offsetHeight-4)+'px'}split.setAttribute('aria-expanded',String(open))}}
 const proxy=document.querySelector('.bottom-bar button[aria-label="Page preview"]');const actual=document.querySelector('.right-group-popup button[aria-label="Page overview"]');
 if(proxy&&actual){proxy.replaceWith(actual);iconPaths.pageOverview='M3 4h8v7H3z M13 4h8v7h-8z M3 13h8v7H3z M13 13h8v7h-8z';toolIcon(actual,'pageOverview','Page overview');const name=document.createElement('span');name.className='dock-tool-name';name.setAttribute('aria-hidden','true');name.textContent='Pages';actual.append(name)}
 document.querySelector('.bottom-bar button[aria-label="More tools"]')?.remove();
 for(const label of ['Plain','Dots','Lines'])document.querySelector('.right-group-popup button[aria-label="'+label+'"]')?.remove();window.toolbarDeduplicated=true;
})();
// Dedicated eraser size, independent of the writing stroke size.
(()=>{
 let saved=20;try{const n=Number(localStorage.getItem('odia-eraser-size'));if(n>=5&&n<=100)saved=n}catch{}window.eraserSize=saved;
 const trigger=document.getElementById('eraser'),panel=document.createElement('div');panel.className='eraser-size-panel hidden';panel.setAttribute('role','group');panel.setAttribute('aria-label','Eraser size');panel.innerHTML='<label for="eraser-size-control">Eraser size</label><output></output><input id="eraser-size-control" type="range" min="5" max="100" step="1" aria-label="Eraser size">';document.body.append(panel);const slider=panel.querySelector('input'),value=panel.querySelector('output');slider.value=String(saved);value.textContent=slider.value;
 slider.oninput=()=>{window.eraserSize=Number(slider.value);value.textContent=slider.value;try{localStorage.setItem('odia-eraser-size',slider.value)}catch{}};
 function close(){panel.classList.add('hidden');trigger.setAttribute('aria-expanded','false')}
 trigger.setAttribute('aria-expanded','false');trigger.addEventListener('click',()=>{const open=panel.classList.contains('hidden');if(open){panel.classList.remove('hidden');const b=bottomBar.getBoundingClientRect(),r=trigger.getBoundingClientRect();panel.style.bottom=Math.max(4,innerHeight-b.top+4)+'px';panel.style.left=Math.max(8,Math.min(r.left+r.width/2-panel.offsetWidth/2,innerWidth-panel.offsetWidth-8))+'px';trigger.setAttribute('aria-expanded','true')}else close()});
 document.addEventListener('pointerdown',e=>{if(!e.target.closest('#eraser,.eraser-size-panel'))close()},true);document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();
// Keep menu, exit and share together at the lower left.
(()=>{
 const group=document.createElement('div');group.className='left-actions';group.setAttribute('role','toolbar');group.setAttribute('aria-label','Menu exit and share');
 const oldName=menu.querySelector('.dock-tool-name');if(oldName)oldName.textContent='Menu';menu.setAttribute('aria-label','Menu');group.append(menu);
 iconPaths.exitApp='M10 4H5v16h5 M14 8l4 4-4 4 M8 12h10';iconPaths.shareBoard='M12 16V4 M8 8l4-4 4 4 M5 14v5h14v-5';
 function button(name,icon,label){const b=document.createElement('button');b.type='button';toolIcon(b,icon,label);const text=document.createElement('span');text.textContent=name;text.setAttribute('aria-hidden','true');b.append(text);return b}
 const exit=button('Exit','exitApp','Exit app');exit.onclick=()=>{persist();if(window.AndroidBoard?.closeApp)window.AndroidBoard.closeApp();else document.querySelector('#status').textContent='Close this browser tab to exit.'};
 const share=button('Share','shareBoard','Share board image');share.onclick=async()=>{const out=document.createElement('canvas');out.width=canvas.width;out.height=canvas.height;const context=out.getContext('2d');context.fillStyle=getComputedStyle(canvas).backgroundColor;context.fillRect(0,0,out.width,out.height);context.drawImage(canvas,0,0);if(window.AndroidBoard?.sharePng){window.AndroidBoard.sharePng(out.toDataURL('image/png'));return}document.querySelector('#status').textContent='Sharing is available in the Android app.'};
 group.append(exit,share);document.body.append(group);
})();
// Consolidate secondary actions into More and position page controls on the right edge.
(()=>{
 const groups=[...document.querySelectorAll('.right-group-popup')];
 morePanel.replaceChildren();
 for(const group of groups){const grid=group.querySelector('.right-group-grid');if(!grid)continue;while(grid.firstElementChild)morePanel.append(grid.firstElementChild);group.remove()}
 document.querySelector('.right-tool-bar')?.remove();
 if(!moreButton.querySelector('.dock-tool-name')){const name=document.createElement('span');name.className='dock-tool-name';name.setAttribute('aria-hidden','true');name.textContent='More';moreButton.append(name)}
 dock.append(moreButton);
 const pageDock=document.createElement('div');pageDock.className='page-dock';pageDock.setAttribute('role','group');pageDock.setAttribute('aria-label','Page controls');pageDock.append(pageControls);document.body.append(pageDock);
 // Reapply placement after existing responsive toolbar code runs.
 function place(){dock.append(moreButton);pageDock.append(pageControls)}
 if(phoneLayout.addEventListener)phoneLayout.addEventListener('change',place);else phoneLayout.addListener(place);
})();
// Live previews for pen, eraser, and each split-area stroke control.
(()=>{
 const preview=document.createElement('span');preview.className='stroke-live-preview';preview.setAttribute('aria-hidden','true');sizeRow.insertBefore(preview,sizeRow.querySelector('.stroke-slider-value'));
 function penPreview(){const factor=penType==='marker'?1.6:penType==='brush'?1.3:1;preview.style.setProperty('--preview-size',Math.max(1,Math.min(20,Math.round(Number(sizeInput.value)*factor*.8)))+'px');preview.style.setProperty('--preview-color',color);preview.style.setProperty('--preview-opacity',penType==='highlighter'?'.4':'1')}
 sizeInput.addEventListener('input',penPreview);colors.addEventListener('click',()=>queueMicrotask(penPreview));colors.addEventListener('input',()=>queueMicrotask(penPreview));typeRow.addEventListener('click',()=>queueMicrotask(penPreview));penPreview();
 const eraserPanel=document.querySelector('.eraser-size-panel');if(eraserPanel){const indicator=document.createElement('span');indicator.className='eraser-live-preview';indicator.setAttribute('aria-hidden','true');eraserPanel.insertBefore(indicator,eraserPanel.querySelector('output'));const range=eraserPanel.querySelector('input');function update(){const d=Math.max(4,Math.min(18,Number(range.value)*.18));indicator.style.setProperty('--eraser-preview-size',d+'px')}range.addEventListener('input',update);update()}
 const root=document.querySelector('.zone-tools');if(!root)return;
 function zones(){root.querySelectorAll('.zone-tool').forEach((group,index)=>{if(group.querySelector('.zone-stroke-preview'))return;const slider=group.querySelector('input[type=range]');if(!slider)return;const indicator=document.createElement('span');indicator.className='zone-stroke-preview';indicator.setAttribute('aria-hidden','true');slider.after(indicator);function update(){const data=window.boardZoneOptions?.[index];indicator.style.setProperty('--zone-preview-size',Math.max(2,Math.min(12,Number(slider.value)))+'px');indicator.style.setProperty('--zone-preview-color',data?.color||'#fff')}group.addEventListener('input',()=>queueMicrotask(update));group.addEventListener('change',()=>queueMicrotask(update));update()})}
 new MutationObserver(zones).observe(root,{childList:true});zones();
})();
// Contextual actions appear beside Select when an object is selected.
(()=>{
 const select=document.getElementById('selectTool');if(!select||!window.boardSelectionInfo)return;
 const panel=document.createElement('div');panel.className='selection-actions hidden';panel.setAttribute('role','group');panel.setAttribute('aria-label','Selected object actions');
 const palette=document.createElement('div');palette.className='selection-palette hidden';palette.setAttribute('role','group');palette.setAttribute('aria-label','Selected object colors');
 const row=document.createElement('div');row.className='selection-action-row';let colorMode='fill';
 function action(label,icon,handler){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',label);b.innerHTML='<span aria-hidden="true">'+icon+'</span><small>'+label+'</small>';b.onclick=handler;row.append(b);return b}
 function closePalette(){palette.classList.add('hidden');fill.setAttribute('aria-expanded','false');border.setAttribute('aria-expanded','false')}
 const fill=action('Fill','◒',()=>openColors('fill'));const border=action('Border','▣',()=>openColors('border'));action('Copy','⧉',()=>{closePalette();window.boardSelectionAction('duplicate')});action('Delete','⌫',()=>{closePalette();window.boardSelectionAction('delete')});fill.setAttribute('aria-expanded','false');border.setAttribute('aria-expanded','false');
 const colors=document.createElement('div');colors.className='selection-color-row';const none=document.createElement('button');none.type='button';none.textContent='∅';none.setAttribute('aria-label','No fill');none.onclick=()=>window.boardSelectionAction('fill',null);colors.append(none);
 for(const [label,value] of [['White','#ffffff'],['Black','#242d3a'],['Red','#d25343'],['Yellow','#d49d24'],['Blue','#4877c3'],['Green','#155c50']]){const b=document.createElement('button');b.type='button';b.className='selection-color';b.style.setProperty('--color',value);b.setAttribute('aria-label',label+' color');b.onclick=()=>window.boardSelectionAction(colorMode,value);colors.append(b)}
 const custom=document.createElement('input');custom.type='color';custom.setAttribute('aria-label','Custom selected object color');custom.oninput=()=>window.boardSelectionAction(colorMode,custom.value);colors.append(custom);
 const opacityLabel=document.createElement('label');opacityLabel.className='selection-opacity';opacityLabel.textContent='Opacity';const opacity=document.createElement('input');opacity.type='range';opacity.min='0';opacity.max='100';opacity.step='5';opacity.setAttribute('aria-label','Fill opacity');opacity.onchange=()=>window.boardSelectionAction('opacity',Number(opacity.value)/100);opacityLabel.append(opacity);palette.append(colors,opacityLabel);panel.append(palette,row);document.body.append(panel);
 function openColors(mode){const info=window.boardSelectionInfo();if(!info)return;if(mode==='fill'&&!info.closed)return;const same=!palette.classList.contains('hidden')&&colorMode===mode;colorMode=mode;palette.classList.toggle('hidden',same);none.hidden=mode!=='fill';opacityLabel.hidden=mode!=='fill';custom.value=(mode==='fill'?info.fillColor:info.borderColor)||'#ffffff';opacity.value=String(Math.round(info.fillOpacity*100));fill.setAttribute('aria-expanded',String(!same&&mode==='fill'));border.setAttribute('aria-expanded',String(!same&&mode==='border'));}
 function update(){const info=window.boardSelectionInfo(),visible=!!info&&!document.body.classList.contains('activity-not-board')&&!document.body.classList.contains('split-mode');panel.classList.toggle('hidden',!visible);fill.disabled=!info?.closed;if(!visible){closePalette();return}const bar=bottomBar.getBoundingClientRect(),anchor=select.getBoundingClientRect();panel.style.bottom=Math.max(4,innerHeight-bar.top+4)+'px';const width=panel.getBoundingClientRect().width;panel.style.left=Math.max(8,Math.min(anchor.left+anchor.width/2-width/2,innerWidth-width-8))+'px'}
 document.addEventListener('boardselectionchange',update);window.addEventListener('resize',update);new MutationObserver(update).observe(document.body,{attributes:true,attributeFilter:['class']});update();
})();
// Keep history and clear actions next to More, including after rotation.
(()=>{function place(){if(!moreButton.isConnected)return;moreButton.before(document.querySelector('#undo'),document.querySelector('#redo'),document.querySelector('#clear'))}place();if(phoneLayout.addEventListener)phoneLayout.addEventListener('change',place);else phoneLayout.addListener(place)})();
// Display the activity menu name in Odia.
(()=>{const b=document.querySelector('#activityMenu');if(!b)return;b.setAttribute('aria-label','ସାଥୀ');b.title='ସାଥୀ';const label=b.querySelector('.dock-tool-name');if(label)label.textContent='ସାଥୀ'})();

// Drag the timer by its header, keeping it within the visible screen.
(()=>{
 const panel=document.querySelector('.class-timer'),head=panel?.querySelector('.class-timer-head');if(!head)return;
 let drag=null;
 function place(x,y){const r=panel.getBoundingClientRect();panel.style.left=Math.max(0,Math.min(x,innerWidth-r.width))+'px';panel.style.top=Math.max(0,Math.min(y,innerHeight-r.height))+'px';panel.style.right='auto';panel.style.bottom='auto'}
 head.addEventListener('pointerdown',e=>{if(e.target.closest('button')||(e.pointerType==='mouse'&&e.button!==0))return;const r=panel.getBoundingClientRect();drag={id:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top};head.setPointerCapture(e.pointerId);e.preventDefault()});
 head.addEventListener('pointermove',e=>{if(drag&&drag.id===e.pointerId)place(e.clientX-drag.dx,e.clientY-drag.dy)});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])head.addEventListener(type,e=>{if(drag&&drag.id===e.pointerId)drag=null});
 window.addEventListener('resize',()=>{if(!panel.classList.contains('hidden')&&panel.style.left){const r=panel.getBoundingClientRect();place(r.left,r.top)}});
})();
// Clear, consistent icons for the compact More menu.
(()=>{
 const icons={
  'Laser pointer':'<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2m0-14-2 2M7 17l-2 2"/>',
  'Straightedge':'<path d="M3 16 16 3l5 5L8 21zM13 6l2 2m-5 1 2 2m-5 1 2 2"/>',
  'Screen shade':'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 11h18M8 15h8m-4-4v7"/>',
  'Classroom timer':'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6m-3 0v3m7 1 2 2"/>',
  'Duplicate page':'<rect x="7" y="3" width="12" height="15" rx="1"/><path d="M5 7H4v14h12v-1M13 7v7m-3.5-3.5h7"/>',
  'Delete page':'<path d="M5 3h10l4 4v5M5 3v18h8M15 3v4h4M16 16l5 5m0-5-5 5"/>',
  'Move page left':'<path d="M12 4h8v16h-8zM10 12H2m0 0 3-3m-3 3 3 3"/>',
  'Move page right':'<path d="M4 4h8v16H4zM14 12h8m0 0-3-3m3 3-3 3"/>',
  'Copy selected':'<rect x="8" y="8" width="11" height="11" rx="1"/><path d="M16 5V4H4v12h1M13.5 11v5m-2.5-2.5h5"/>',
  'Delete selected':'<path d="M5 7h14M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5"/>',
  'Plain':'<rect x="4" y="3" width="16" height="18" rx="2"/>',
  'Dots':'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01"/>',
  'Lines':'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h8"/>'
 };
 document.querySelectorAll('button[aria-label]').forEach(button=>{const label=button.getAttribute('aria-label'),icon=icons[label],span=button.querySelector(':scope > span[aria-hidden="true"]');if(!icon||!span||!button.querySelector(':scope > small'))return;span.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icon+'</svg>';button.title=label});
})();
// Distinct matching pen icons, while keeping the existing tool actions and labels.
(()=>{
 const paths={pen:'<path d="M12 3 4 11l3 8 5 2 5-2 3-8z"/><path d="M12 3v10m-5 6 3-3m7 3-3-3"/><circle cx="12" cy="15" r="2"/>',marker:'<path d="m5 16 10-10 3 3L8 19l-4 1zM14 7l2-2a2 2 0 0 1 3 3l-2 2"/>',highlighter:'<path d="m5 15 9-9 4 4-9 9H5zM13 7l2-2a2 2 0 0 1 3 0l1 1a2 2 0 0 1 0 3l-2 2M4 21h10"/>',brush:'<path d="M9 15 17 4a2 2 0 0 1 3 3L12 18z"/><path d="M9 15c-3 0-2 4-5 5 4 2 8 0 8-3"/>'};
 typeRow.querySelectorAll('button[data-type]').forEach(b=>{const shape=paths[b.dataset.type];if(shape)b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shape+'</svg>'});
})();
// More outline shapes share the existing drawing, selection and undo behavior.
(()=>{
 extraPanel.querySelector('.shape-fill-controls')?.remove();
 const shapes={
  Octagon:{icon:'M8 3h8l5 5v8l-5 5H8l-5-5V8z',points:[[.3,0],[.7,0],[1,.3],[1,.7],[.7,1],[.3,1],[0,.7],[0,.3]]},
  Heptagon:{icon:'M12 3l7 3 2 7-4 7H7l-4-7 2-7z',polygon:7},
  Decagon:{icon:'M9 3h6l5 4 1 6-3 6-6 2-6-2-3-6 1-6z',polygon:10},
  Plus:{icon:'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z',points:[[.35,0],[.65,0],[.65,.35],[1,.35],[1,.65],[.65,.65],[.65,1],[.35,1],[.35,.65],[0,.65],[0,.35],[.35,.35]]},
  RightArrow:{icon:'M3 9h10V5l8 7-8 7v-4H3z',points:[[0,.3],[.55,.3],[.55,0],[1,.5],[.55,1],[.55,.7],[0,.7]]},
  LeftArrow:{icon:'M21 9H11V5l-8 7 8 7v-4h10z',points:[[1,.3],[.45,.3],[.45,0],[0,.5],[.45,1],[.45,.7],[1,.7]]},
  Trapezoid:{icon:'M7 4h10l4 16H3z',points:[[.25,0],[.75,0],[1,1],[0,1]]},
  Parallelogram:{icon:'M8 4h13l-5 16H3z',points:[[.25,0],[1,0],[.75,1],[0,1]]},
  Kite:{icon:'M12 2 20 9l-8 13L4 9z',points:[[.5,0],[1,.36],[.5,1],[0,.36]]},
  Chevron:{icon:'M5 4h7l7 8-7 8H5l7-8z',points:[[0,0],[.45,0],[1,.5],[.45,1],[0,1],[.55,.5]]}
 };
 const previous=shapePoints;
 shapePoints=function(a,b){const def=shapes[shapeMode];if(!def)return previous(a,b);let pts=def.points;if(def.polygon)pts=Array.from({length:def.polygon},(_,i)=>{const t=-Math.PI/2+i*2*Math.PI/def.polygon;return[(1+Math.cos(t))/2,(1+Math.sin(t))/2]});const left=Math.min(a[0],b[0]),top=Math.min(a[1],b[1]),w=Math.abs(b[0]-a[0]),h=Math.abs(b[1]-a[1]);const result=pts.map(([x,y])=>[left+x*w,top+y*h]);return result.concat([result[0]])};
 for(const [name,def] of Object.entries(shapes)){iconPaths[name]=def.icon;const button=document.createElement('button');toolIcon(button,name,name);button.dataset.shape=name;button.setAttribute('aria-pressed','false');button.onclick=()=>{chooseShape(name);extraPanel.querySelectorAll('[data-shape]').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});insertButton.setAttribute('aria-expanded','false')};extraPanel.append(button)}
})();
// Remember writing preferences on this device between app sessions.
(()=>{
 const key='odia-board-writing-preferences';let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}
 if(/^#[0-9a-f]{6}$/i.test(saved.color||'')){color=saved.color;colorInput.value=color;let matched=false;colors.querySelectorAll('button').forEach(b=>{const hit=(b.getAttribute('aria-label')||'').toLowerCase().includes(color.toLowerCase())||(color.toLowerCase()==='#ffffff'&&(b.getAttribute('aria-label')||'').toLowerCase().includes('white'));b.setAttribute('aria-pressed',String(hit));matched=matched||hit});if(!matched)colors.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'))}
 if(Number(saved.size)>=1&&Number(saved.size)<=24){sizeInput.value=String(saved.size);sizeInput.dispatchEvent(new Event('input',{bubbles:true}))}
 if(['pen','marker','highlighter','brush'].includes(saved.type))selectType(saved.type); sizeInput.dispatchEvent(new Event('input',{bubbles:true}));
 const paper=$('#paper');if([...paper.options].some(o=>o.value===saved.paper)){paper.value=saved.paper;paper.dispatchEvent(new Event('change',{bubbles:true}))}
 function save(){try{localStorage.setItem(key,JSON.stringify({color,size:Number(sizeInput.value),type:penType,paper:paper.value}))}catch{}}
 sizeInput.addEventListener('input',save);paper.addEventListener('change',save);colors.addEventListener('click',()=>queueMicrotask(save));colors.addEventListener('input',()=>queueMicrotask(save));typeRow.addEventListener('click',()=>queueMicrotask(save));
})();
// Paginate shapes horizontally; dots show and navigate the current page.
(()=>{
 const buttons=[...extraPanel.querySelectorAll('button[data-shape]')];if(!buttons.length)return;
 const viewport=document.createElement('div');viewport.className='shape-pages';viewport.setAttribute('aria-label','Shape pages');
 const dots=document.createElement('div');dots.className='shape-page-dots';dots.setAttribute('role','group');dots.setAttribute('aria-label','Choose shape page');
 const pages=[];for(let i=0;i<buttons.length;i+=8){const page=document.createElement('div');page.className='shape-page';buttons.slice(i,i+8).forEach(b=>page.append(b));viewport.append(page);pages.push(page)}
 const indicators=pages.map((_,i)=>{const dot=document.createElement('button');dot.type='button';dot.className='shape-page-dot';dot.setAttribute('aria-label','Shape page '+(i+1)+' of '+pages.length);dot.onclick=()=>viewport.scrollTo({left:i*viewport.clientWidth,behavior:'smooth'});dots.append(dot);return dot});
 function update(){const index=viewport.clientWidth?Math.min(pages.length-1,Math.round(viewport.scrollLeft/viewport.clientWidth)):0;indicators.forEach((dot,i)=>{dot.classList.toggle('active',i===index);if(i===index)dot.setAttribute('aria-current','page');else dot.removeAttribute('aria-current')})}
 viewport.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);extraPanel.append(viewport,dots);update();
})();
// Saathi activities have their own Back and Home navigation.
(()=>{
 const nav=document.querySelector('#saathiMenu'),boardButton=nav?.querySelector('[data-tab="whiteboard"]');if(!nav||!boardButton)return;
 const controls=document.createElement('div');controls.className='saathi-activity-navigation hidden';controls.setAttribute('role','navigation');controls.setAttribute('aria-label','Activity navigation');
 function button(label,path){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',label);b.title=label;b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+path+'"/></svg><span>'+label+'</span>';controls.append(b);return b}
 const back=button('Back','M15 5 8 12l7 7M8 12h12'),home=button('Home','M3 11 12 4l9 7M5 10v10h14V10M9 20v-6h6v6');document.body.append(controls);
 let active=false,history=[],returning=false;const originalTab=tab;
 nav.addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b&&b.dataset.tab!=='whiteboard'){active=true;history=[]}},true);
 tab=function(name){const previous=document.querySelector('.view:not(.hidden)')?.id;if(active&&!returning&&previous&&previous!==name)history.push(previous);originalTab(name);if(name==='whiteboard'){active=false;history=[]}controls.classList.toggle('hidden',!active||name==='whiteboard')};
 function go(name){returning=true;try{const target=nav.querySelector('[data-tab="'+name+'"]');if(target)target.click();else tab(name)}finally{returning=false}}
 back.onclick=()=>{const section=document.getElementById('lessons');const subjectBack=!section.classList.contains('hidden')?section.querySelector('.pathasala-subject-back'):null;if(subjectBack){subjectBack.click();return}const previous=history.pop()||'whiteboard';go(previous);if(previous==='whiteboard'){nav.classList.add('open');menu.setAttribute('aria-expanded','true')}};
 home.onclick=()=>go('whiteboard');
})();
// Pathasala starts empty until its custom content is added.
(()=>{const section=document.getElementById('lessons');if(!section)return;section.querySelector('#lessonCards')?.replaceChildren();const label=section.querySelector('.activity-content-label');if(label)label.textContent='ପାଠଶାଳା';})();
// Class-wise Pathasala: a centered class selector and subject entry points.
(()=>{
 const section=document.getElementById('lessons');if(!section)return;section.replaceChildren();
 const header=document.createElement('div');header.className='pathasala-header';const select=document.createElement('select');select.setAttribute('aria-label','Select class');for(let n=1;n<=12;n++){const option=document.createElement('option');option.value=String(n);option.textContent='ଶ୍ରେଣୀ '+String(n).replace(/\d/g,d=>'୦୧୨୩୪୫୬୭୮୯'[Number(d)]);select.append(option)}header.append(select);
 const content=document.createElement('div');content.className='pathasala-content';section.append(header,content);
 let selectedClass='1';try{const n=localStorage.getItem('pathasala-class');if(Number(n)>=1&&Number(n)<=12)selectedClass=n}catch{}select.value=selectedClass;
 const subjects=[['ଓଡ଼ିଆ','Odia','book'],['ଇଂରାଜୀ','English','book'],['ହିନ୍ଦୀ','Hindi','book'],['ସଂସ୍କୃତ','Sanskrit','book'],['ଗଣିତ','Mathematics','math'],['ପରିବେଶ','Environment','leaf'],['ବିଜ୍ଞାନ','Science','science'],['ସାମାଜିକ ବିଜ୍ଞାନ','Social Science','globe'],['ଇତିହାସ','History','book'],['ଭୂଗୋଳ','Geography','globe'],['ପଦାର୍ଥ ବିଜ୍ଞାନ','Physics','science'],['ରସାୟନ ବିଜ୍ଞାନ','Chemistry','science'],['ଜୀବ ବିଜ୍ଞାନ','Biology','leaf'],['କମ୍ପ୍ୟୁଟର','Computer','computer'],['କଳା','Art','art'],['ସ୍ୱାସ୍ଥ୍ୟ ଓ ଶାରୀରିକ ଶିକ୍ଷା','Health & Physical Education','health']];
 const icons={science:'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8',globe:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c4 4 4 14 0 18M12 3c-4 4-4 14 0 18',computer:'M3 4h18v12H3zM8 20h8M12 16v4',art:'M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 1-4c-1-1 0-2 1-2h2a3 3 0 0 0 3-3 9 9 0 0 0-9-9zM7 10h.01M10 7h.01M15 7h.01',health:'M12 21s-8-5-8-11a4 4 0 0 1 8-2 4 4 0 0 1 8 2c0 6-8 11-8 11zM8 12h2l1-2 2 4 1-2h2',book:'M4 5c3-1 6-.5 8 1.5C14 4.5 17 4 20 5v14c-3-1-6-.5-8 1.5C10 18.5 7 18 4 19z M12 7v13',math:'M5 7h6M8 4v6M15 7h4M5 16h6M8 13v6M15 14l4 4m0-4-4 4',leaf:'M20 4C10 4 5 8 5 14a5 5 0 0 0 5 5c6 0 10-5 10-15zM4 21c3-5 6-8 12-11'};
 function showSubjects(){
  content.replaceChildren();const carousel=document.createElement('div');carousel.className='pathasala-carousel';const viewport=document.createElement('div');viewport.className='pathasala-subject-pages';const dots=document.createElement('div');dots.className='pathasala-subject-dots';dots.setAttribute('aria-label','Subject pages');
  const pages=[];for(let i=0;i<subjects.length;i+=4){const page=document.createElement('div');page.className='pathasala-subject-page';for(const [odia,english,icon] of subjects.slice(i,i+4)){const b=document.createElement('button');b.type='button';b.className='pathasala-subject';b.setAttribute('aria-label',odia+' '+english);b.innerHTML='<span class="pathasala-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+icons[icon]+'"/></svg></span><strong>'+odia+'</strong><small>'+english+'</small>';b.onclick=()=>showSubject(odia,english);page.append(b)}viewport.append(page);pages.push(page)}
  const indicators=pages.map((_,i)=>{const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label','Subject page '+(i+1)+' of '+pages.length);dot.onclick=()=>viewport.scrollTo({left:i*viewport.clientWidth,behavior:'smooth'});dots.append(dot);return dot});function update(){const n=viewport.clientWidth?Math.min(pages.length-1,Math.round(viewport.scrollLeft/viewport.clientWidth)):0;indicators.forEach((dot,i)=>{dot.classList.toggle('active',i===n);if(i===n)dot.setAttribute('aria-current','page');else dot.removeAttribute('aria-current')})}viewport.addEventListener('scroll',update,{passive:true});carousel.append(viewport,dots);content.append(carousel);update();
 }
 function showSubject(odia,english){content.replaceChildren();const screen=document.createElement('div');screen.className='pathasala-detail';const back=document.createElement('button');back.type='button';back.className='pathasala-subject-back';back.textContent='← Subjects';back.onclick=showSubjects;const title=document.createElement('h2');title.textContent=odia+' · '+english;const empty=document.createElement('p');empty.textContent='Lessons will appear here.';screen.append(back,title,empty);content.append(screen)}
 select.addEventListener('change',()=>{try{localStorage.setItem('pathasala-class',select.value)}catch{}showSubjects()});showSubjects();
})();
// Custom class picker avoids the platform-native select dialog.
(()=>{
 const header=document.querySelector('#lessons .pathasala-header'),select=header?.querySelector('select');if(!select)return;select.hidden=true;select.tabIndex=-1;
 const wrap=document.createElement('div');wrap.className='pathasala-picker';const trigger=document.createElement('button');trigger.type='button';trigger.className='pathasala-picker-trigger';trigger.setAttribute('aria-haspopup','true');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','pathasala-class-menu');
 const label=document.createElement('span');const arrow=document.createElement('span');arrow.className='pathasala-picker-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='⌄';trigger.append(label,arrow);
 const menu=document.createElement('div');menu.id='pathasala-class-menu';menu.className='pathasala-class-menu hidden';menu.setAttribute('role','group');menu.setAttribute('aria-label','Choose class');
 const buttons=[...select.options].map(option=>{const b=document.createElement('button');b.type='button';b.className='pathasala-class-option';b.textContent=option.textContent;b.onclick=()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));update();close();trigger.focus()};menu.append(b);return b});
 function update(){label.textContent=select.selectedOptions[0]?.textContent||'ଶ୍ରେଣୀ';buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(select.options[i].value===select.value)))}
 function close(){menu.classList.add('hidden');trigger.setAttribute('aria-expanded','false')}
 trigger.onclick=()=>{const open=menu.classList.toggle('hidden')===false;trigger.setAttribute('aria-expanded',String(open))};document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target))close()},true);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.classList.contains('hidden')){close();trigger.focus()}});select.addEventListener('change',update);wrap.append(trigger,menu);header.append(wrap);update();
})();