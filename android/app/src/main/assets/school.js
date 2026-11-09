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
 render=function(){originalRender();if(!selecting||!selected||!strokes.includes(selected)||!selected.points.length)return;const r=canvas.getBoundingClientRect(),xs=selected.points.map(p=>p[0]*r.width),ys=selected.points.map(p=>p[1]*r.height),left=Math.min(...xs),top=Math.min(...ys),w=Math.max(...xs)-left,h=Math.max(...ys)-top;ctx.save();ctx.strokeStyle='#176656';ctx.lineWidth=1.5;ctx.setLineDash([5,4]);ctx.strokeRect(left-8,top-8,Math.max(16,w+16),Math.max(16,h+16));ctx.restore();};
 function setMode(on){selecting=on;button.classList.toggle('active',on);button.setAttribute('aria-pressed',String(on));if(on){shapeMode=null;closePanels();extraPanel.classList.add('hidden');$('#pen').classList.remove('active');$('#eraser').classList.remove('active');insertButton.classList.remove('active');}else selected=null;render();}
 button.onclick=()=>setMode(!selecting);
 [$('#pen'),$('#eraser'),insertButton,textButton].forEach(el=>el.addEventListener('click',()=>setMode(false)));
 canvas.addEventListener('pointerdown',e=>{if(!selecting||!e.isPrimary||e.button!==0)return;e.stopImmediatePropagation();e.preventDefault();const p=point(e),r=canvas.getBoundingClientRect(),tx=16/r.width,ty=16/r.height;selected=[...strokes].reverse().find(s=>!s.text&&s.color!=='#fffef9'&&s.points?.length>1&&(()=>{const xs=s.points.map(v=>v[0]),ys=s.points.map(v=>v[1]);return p[0]>=Math.min(...xs)-tx&&p[0]<=Math.max(...xs)+tx&&p[1]>=Math.min(...ys)-ty&&p[1]<=Math.max(...ys)+ty})())||null;if(selected){drag={id:e.pointerId,start:p,points:copy(selected.points)};canvas.setPointerCapture(e.pointerId)}render();},true);
 canvas.addEventListener('pointermove',e=>{if(!selecting)return;e.stopImmediatePropagation();if(!drag||drag.id!==e.pointerId)return;const p=point(e),dx=p[0]-drag.start[0],dy=p[1]-drag.start[1];selected.points=drag.points.map(q=>[q[0]+dx,q[1]+dy]);render();},true);
 function end(e){if(!selecting)return;e.stopImmediatePropagation();if(!drag||drag.id!==e.pointerId)return;if(e.type==='pointercancel')selected.points=drag.points;else if(JSON.stringify(selected.points)!==JSON.stringify(drag.points))persist();drag=null;render();}
 canvas.addEventListener('pointerup',end,true);canvas.addEventListener('pointercancel',end,true);
 window.boardSelectionAction=(action)=>{
  if(!selecting||!selected||!strokes.includes(selected)){document.querySelector('#status').textContent='Select a drawing or shape first.';return false}
  if(action==='duplicate'){const clone=copy(selected);clone.points=clone.points.map(p=>[p[0]+0.03,p[1]+0.03]);strokes.push(clone);selected=clone}
  else if(action==='delete'){strokes.splice(strokes.indexOf(selected),1);selected=null}
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
 const choices=[['Black','#101715'],['White','#fffefb'],['Green','#174c3d'],['Cream','#fff8df'],['Blue','#eaf3fb']];
 const wrap=document.createElement('fieldset');wrap.className='board-background-options';const legend=document.createElement('legend');legend.textContent='Board color';wrap.append(legend);const row=document.createElement('div');row.className='board-background-row';wrap.append(row);boardSettings.append(wrap);
 let selected='#101715';try{const saved=localStorage.getItem('odia-board-background');if(/^#[0-9a-f]{6}$/i.test(saved||''))selected=saved}catch{}
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
 const cursor=document.createElement('div');cursor.className='eraser-contact hidden';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);window.showEraserContact=(e,size)=>{const d=Math.max(18,Math.min(120,size));cursor.style.width=d+'px';cursor.style.height=d+'px';cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.classList.remove('hidden')};window.hideEraserContact=()=>cursor.classList.add('hidden');
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
