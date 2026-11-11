// Alphabet exploration. Words and pictograms work without a network.
(()=>{
 const words={
  'ଅ':[['ଅଜଗର','🐍'],['ଅଗ୍ନି','🔥']], 'ଆ':[['ଆମ୍ବ','🥭'],['ଆଳୁ','🥔']],
  'ଇ':[['ଇଟା','🧱'],['ଇଞ୍ଜିନ','🚂']], 'ଊ':[['ଊନ','🧶'],['ଊଷା','🌅']], 'ଋ':[['ଋଷି','🧘'],['ଋତୁ','🌤️']],
  'ଉ':[['ଉଡ଼ାଜାହାଜ','✈️'],['ଉଦବିଲାଉ','🦦']], 'ଏ':[['ଏରୋପ୍ଲେନ୍','✈️']],
  'ଐ':[['ଐରାବତ','🐘']], 'ଓ':[['ଓଟ','🐪']], 'ଔ':[['ଔଷଧ','💊']],
  'କ':[['କଦଳୀ','🍌'],['କମଳ','🪷']], 'ଖ':[['ଖରଗୋଶ','🐇'],['ଖାତା','📒']],
  'ଗ':[['ଗାଈ','🐄'],['ଗଛ','🌳']], 'ଘ':[['ଘର','🏠'],['ଘଡ଼ି','⏰']],
  'ଚ':[['ଚନ୍ଦ୍ର','🌙'],['ଚଷମା','👓']], 'ଛ':[['ଛତା','☂️'],['ଛେଳି','🐐']],
  'ଜ':[['ଜାହାଜ','🚢'],['ଜଳ','💧']], 'ଝ':[['ଝାଡ଼ୁ','🧹'],['ଝିଟିପିଟି','🦎']],
  'ଟ':[['ଟମାଟୋ','🍅'],['ଟୋପି','🧢']], 'ଠ':[['ଠେକୁଆ','🐇']],
  'ଡ':[['ଡଙ୍ଗା','⛵'],['ଡାଳ','🌿']], 'ଢ':[['ଢୋଲ','🥁'],['ଢାଲ','🛡️']],
  'ତ':[['ତରଭୁଜ','🍉'],['ତାରା','⭐']], 'ଥ':[['ଥାଳି','🍽️'],['ଥର୍ମୋମିଟର','🌡️']],
  'ଦ':[['ଦୀପ','🪔'],['ଦାନ୍ତ','🦷']], 'ଧ':[['ଧନୁ','🏹'],['ଧାନ','🌾']],
  'ନ':[['ନଡ଼ିଆ','🥥'],['ନାକ','👃']], 'ପ':[['ପଦ୍ମ','🪷'],['ପତ୍ର','🍃']],
  'ଫ':[['ଫୁଲ','🌸'],['ଫଳ','🍎']], 'ବ':[['ବାଘ','🐅'],['ବହି','📕']],
  'ଭ':[['ଭାଲୁ','🐻'],['ଭୂତ','👻']], 'ମ':[['ମାଛ','🐟'],['ମୟୂର','🦚']],
  'ଯ':[['ଯନ୍ତ୍ର','⚙️']], 'ର':[['ରାଜା','👑'],['ରସି','🪢']],
  'ଲ':[['ଲେମ୍ବୁ','🍋'],['ଲଙ୍କା','🌶️']], 'ଶ':[['ଶଙ୍ଖ','🐚'],['ଶାଗ','🥬']],
  'ସ':[['ସୂର୍ଯ୍ୟ','☀️'],['ସିଂହ','🦁']], 'ହ':[['ହାତୀ','🐘'],['ହାତ','✋']]
 };
 const englishWords={
  A:[['Apple','🍎'],['Ant','🐜']], B:[['Ball','⚽'],['Book','📘']],
  C:[['Cat','🐈'],['Car','🚗']], D:[['Dog','🐕'],['Drum','🥁']],
  E:[['Elephant','🐘'],['Egg','🥚']], F:[['Fish','🐟'],['Flower','🌸']],
  G:[['Goat','🐐'],['Grapes','🍇']], H:[['Hat','🎩'],['House','🏠']],
  I:[['Ice','🧊'],['Insect','🐛']], J:[['Juice','🧃'],['Jeans','👖']],
  K:[['Kite','🪁'],['Key','🔑']], L:[['Lion','🦁'],['Lemon','🍋']],
  M:[['Mango','🥭'],['Moon','🌙']], N:[['Nose','👃'],['Noodles','🍜']],
  O:[['Owl','🦉'],['Orange','🍊']], P:[['Parrot','🦜'],['Pencil','✏️']],
  Q:[['Queen','👑'],['Question','❓']], R:[['Rabbit','🐇'],['Rose','🌹']],
  S:[['Sun','☀️'],['Star','⭐']], T:[['Tiger','🐅'],['Tree','🌳']],
  U:[['Umbrella','☂️'],['Unicorn','🦄']], V:[['Violin','🎻'],['Van','🚐']],
  W:[['Watch','⌚'],['Watermelon','🍉']], X:[['X-ray','🩻'],['Xmas','🎄']],
  Y:[['Yacht','🛥️'],['Yarn','🧶']], Z:[['Zebra','🦓'],['Zero','0️⃣']]
 };
 // Additional age-appropriate examples, stored offline with their pictures.
 const extraEnglish={
 A:[['Aeroplane','✈️'],['Arrow','🏹'],['Animal','🐾']],B:[['Bird','🐦'],['Banana','🍌'],['Bus','🚌']],C:[['Cow','🐄'],['Cup','🥤'],['Cake','🎂']],D:[['Duck','🦆'],['Door','🚪'],['Dolphin','🐬']],E:[['Engine','🚂'],['Eagle','🦅'],['Earth','🌍']],F:[['Frog','🐸'],['Fan','🪭'],['Fox','🦊']],G:[['Girl','👧'],['Gift','🎁'],['Guitar','🎸']],H:[['Horse','🐎'],['Hand','✋'],['Hen','🐔']],I:[['Ink','🖋️'],['Island','🏝️'],['Igloo','🏠']],J:[['Jam','🍓'],['Jellyfish','🪼'],['Jacket','🧥']],K:[['King','🤴'],['Kangaroo','🦘'],['Kiwi','🥝']],L:[['Leaf','🍃'],['Lamp','💡'],['Lock','🔒']],M:[['Monkey','🐒'],['Milk','🥛'],['Mouse','🐁']],N:[['Nest','🪺'],['Nail','🔩'],['Night','🌙']],O:[['Octopus','🐙'],['Ox','🐂'],['Onion','🧅']],P:[['Panda','🐼'],['Pumpkin','🎃'],['Pizza','🍕']],Q:[['Quilt','🛏️'],['Quill','🪶'],['Quarter','🪙']],R:[['Rainbow','🌈'],['Robot','🤖'],['Rocket','🚀']],S:[['Snake','🐍'],['School','🏫'],['Ship','🚢']],T:[['Train','🚂'],['Table','🪑'],['Tomato','🍅']],U:[['Uniform','👕'],['Unicycle','🚲'],['Ukulele','🎸']],V:[['Vase','🏺'],['Vegetables','🥕'],['Volcano','🌋']],W:[['Whale','🐋'],['Window','🪟'],['Water','💧']],X:[['Xylophone','🎼'],['Xenon','💡'],['Xerox','📄']],Y:[['Yak','🐂'],['Yo-yo','🪀'],['Yogurt','🥣']],Z:[['Zoo','🦁'],['Zip','🤐'],['Zigzag','〰️']]
 };
 const extraOdia={
 'ଅ':[['ଅଦା','🫚'],['ଅଖା','🧺'],['ଅଟା','🌾']], 'ଆ':[['ଆଖି','👁️'],['ଆଖୁ','🎋'],['ଆକାଶ','🌌']], 'ଇ':[['ଇନ୍ଦ୍ରଧନୁ','🌈'],['ଇଲିଶି','🐟'],['ଇସ୍ତ୍ରୀ','♨️']],
 'ଉ':[['ଉଠ','🐪'],['ଉପହାର','🎁'],['ଉଦ୍ୟାନ','🌷']], 'କ':[['କଲମ','🖊️'],['କଇଁଛ','🐢'],['କପୋତ','🕊️']], 'ଖ':[['ଖିର','🥛'],['ଖେଳ','⚽'],['ଖବରକାଗଜ','📰']],
 'ଗ':[['ଗୋଲାପ','🌹'],['ଗାଡ଼ି','🚗'],['ଗଣେଶ','🐘']], 'ଘ':[['ଘୋଡ଼ା','🐎'],['ଘାସ','🌱'],['ଘଣ୍ଟି','🔔']], 'ଚ':[['ଚଢ଼େଇ','🐦'],['ଚକ','🛞'],['ଚାବି','🔑']],
 'ଛ':[['ଛୁରି','🔪'],['ଛବି','🖼️'],['ଛାତ୍ର','🧑‍🎓']], 'ଜ':[['ଜଙ୍ଗଲ','🌳'],['ଜୋତା','👞'],['ଜହ୍ନ','🌙']], 'ଝ':[['ଝରଣା','💧'],['ଝୁଲା','🛝'],['ଝୁଡ଼ି','🧺']],
 'ଟ':[['ଟ୍ରେନ୍','🚆'],['ଟଙ୍କା','💰'],['ଟେବୁଲ','🪑']], 'ଡ':[['ଡାକ୍ତର','🩺'],['ଡାକବାକ୍ସ','📮'],['ଡାଳିମ୍ବ','🍎']], 'ଢ':[['ଢେଉ','🌊'],['ଢିଙ୍କି','🌾'],['ଢାଙ୍କୁଣି','🍲']],
 'ତ':[['ତକିଆ','🛏️'],['ତାଲା','🔒'],['ତେନ୍ତୁଳି','🌳']], 'ଦ':[['ଦହି','🥣'],['ଦରଜା','🚪'],['ଦଉଡ଼ି','🪢']], 'ଧ':[['ଧନିଆ','🌿'],['ଧଳା','⚪'],['ଧୂପ','🪔']],
 'ନ':[['ନଈ','🏞️'],['ନଖ','💅'],['ନୌକା','⛵']], 'ପ':[['ପକ୍ଷୀ','🐦'],['ପାଣି','💧'],['ପେନ୍ସିଲ','✏️']], 'ଫ':[['ଫୁଟବଲ','⚽'],['ଫିତା','🎀'],['ଫ୍ରିଜ୍','🧊']],
 'ବ':[['ବଲ','⚽'],['ବର୍ଷା','🌧️'],['ବସ୍','🚌']], 'ଭ':[['ଭାତ','🍚'],['ଭେଣ୍ଡି','🥬'],['ଭାଇ','👦']], 'ମ':[['ମାଟି','🟤'],['ମହୁ','🍯'],['ମୂଷା','🐁']],
 'ର':[['ରଥ','🛕'],['ରୁଟି','🫓'],['ରଙ୍ଗ','🎨']], 'ଲ':[['ଲଡ଼ୁ','🍬'],['ଲୁଣ','🧂'],['ଲହଡ଼ି','🌊']], 'ଶ':[['ଶିଶୁ','👶'],['ଶିକ୍ଷକ','🧑‍🏫'],['ଶୀତ','❄️']],
 'ସ':[['ସାପ','🐍'],['ସେଓ','🍎'],['ସାଇକେଲ','🚲']], 'ହ':[['ହଂସ','🦢'],['ହଳଦୀ','🟡'],['ହସ','😊']]
 };
 // Letters that rarely begin a word and vowel signs use examples containing them.
 const remainingOdia={
  'ଈ':[['ଈଗଲ','🦅'],['ଈଶ୍ୱର','🙏'],['ଈଖୁ','🎋']],
  'ଏ':[['ଏକ','1️⃣'],['ଏଗାର','1️⃣'],['ଏକତା','🤝']],
  'ଐ':[['ଐତିହ୍ୟ','🏛️'],['ଐକ୍ୟ','🤝'],['ଐଶ୍ୱର୍ଯ୍ୟ','💎']],
  'ଓ':[['ଓଠ','👄'],['ଓଜନ','⚖️'],['ଓଦା','💧']],
  'ଔ':[['ଔଷଧାଳୟ','🏥'],['ଔଜାର','🔧'],['ଔଷଧୀୟ','🌿']],
  'ଙ':[['ଅଙ୍ଗୁର','🍇'],['ରଙ୍ଗ','🎨'],['ମଙ୍ଗଳ','🪐'],['ଗଙ୍ଗା','🏞️'],['ଅଙ୍ଗ','🧍']],
  'ଞ':[['ପଞ୍ଜା','🐾'],['ଅଞ୍ଚଳ','🗺️'],['ପଞ୍ଚ','5️⃣'],['ବ୍ୟଞ୍ଜନ','🔤'],['ଅଞ୍ଜଳି','🙏']],
  'ଣ':[['ଗଣିତ','🔢'],['ପାଣି','💧'],['ବୀଣା','🎵'],['ରାଣୀ','👑'],['ହରିଣ','🦌']],
  'ଳ':[['ଫଳ','🍎'],['କମଳ','🪷'],['ଜଳ','💧'],['ବଳଦ','🐂'],['ମୂଳା','🥬']],
  'ଷ':[['ଷଡ଼ଭୁଜ','⬡'],['ଷଟ୍କୋଣ','⬡'],['ବର୍ଷା','🌧️'],['ଚଷମା','👓'],['କୃଷକ','🧑‍🌾']],
  'ଡ଼':[['ଘଡ଼ି','⏰'],['ଚଢ଼େଇ','🐦'],['ଗାଡ଼ି','🚗'],['ଓଡ଼ିଆ','📖'],['ପାହାଡ଼','⛰️']],
  'ଢ଼':[['ପଢ଼ା','📖'],['ବଢ଼େଇ','🔨'],['ଚଢ଼େଇ','🐦'],['ଗଢ଼ା','🏺'],['ପଢ଼ିବା','📚']],
  'ୟ':[['ସୂର୍ଯ୍ୟ','☀️'],['ବିଦ୍ୟା','📖'],['ମୟୂର','🦚'],['କାର୍ଯ୍ୟ','📝'],['ବାୟୁ','💨']],
  'ୱ':[['ୱେବ୍','🌐'],['ୱାଇଫାଇ','📶'],['ୱାଶିଂ ମେସିନ୍','🧺']],
  'କ୍ଷ':[['କ୍ଷୀର','🥛'],['କ୍ଷେତ','🌾'],['ପକ୍ଷୀ','🐦'],['ଅକ୍ଷର','🔤'],['ବୃକ୍ଷ','🌳']],
  'ଜ୍ଞ':[['ଜ୍ଞାନ','📖'],['ବିଜ୍ଞାନ','🔬'],['ବିଜ୍ଞାନୀ','🧑‍🔬'],['ଜ୍ଞାନୀ','🧠'],['ଯଜ୍ଞ','🔥']],
  'ଶ୍ର':[['ଶ୍ରେଣୀ','🏫'],['ଶ୍ରମ','🛠️'],['ଶ୍ରଦ୍ଧା','🙏'],['ଆଶ୍ରମ','🏠'],['ଶ୍ରବଣ','👂']],
  'ଂ':[['ହଂସ','🦢'],['ସିଂହ','🦁'],['ଅଂଶ','🧩'],['ଶଂଖ','🐚'],['ସଂଖ୍ୟା','🔢']],
  'ଃ':[['ଦୁଃଖ','😔'],['ପୁନଃ','🔄'],['ନିଃଶବ୍ଦ','🤫']],
  'ଁ':[['ଗାଁ','🏘️'],['ମାଁ','👩'],['ହଁ','✅'],['କାଁ','🐦']]
 };
 for(const [letter,entries] of Object.entries(remainingOdia)){if(!words[letter])words[letter]=[];words[letter].push(...entries)}
 for(const [letter,entries] of Object.entries(extraEnglish))englishWords[letter].push(...entries);
 for(const [letter,entries] of Object.entries(extraOdia))words[letter].push(...entries);
 window.getOdiaAlphabetExamples=letter=>(words[letter]||[]).map(entry=>entry.slice());
 const notice=message=>{if(window.boardNotice)window.boardNotice(message);else document.querySelector('#status').textContent=message};
 let pending=null;
 function cancel(){if(pending){clearTimeout(pending.timer);pending=null}}
 function boardArea(){
  const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return null;
  const bar=bottomBar.getBoundingClientRect(), visibleBottom=bar.top-r.top-12;
  return {r,width:r.width,height:visibleBottom>=60?Math.min(r.height,visibleBottom):r.height};
 }
 function bounds(item,area){
  if(!item?.points?.length)return null;
  let left=Infinity,right=-Infinity,top=Infinity,bottom=-Infinity;
  for(const p of item.points){left=Math.min(left,p[0]*area.width);right=Math.max(right,p[0]*area.width);top=Math.min(top,p[1]*area.r.height);bottom=Math.max(bottom,p[1]*area.r.height)}
  if(item.points.length===1){
   if(item.text){ctx.save();ctx.font=(Number(item.size)||24)+'px sans-serif';right=left+ctx.measureText(String(item.text)).width;ctx.restore();bottom=top+(Number(item.size)||24)*1.4}
   else{const radius=Math.max(4,(Number(item.size)||4)/2);left-=radius;right+=radius;top-=radius;bottom+=radius}
  }
  return {left,right,top,bottom};
 }
 function overlaps(a,b){return a.left<b.right+6&&a.right>b.left-6&&a.top<b.bottom+6&&a.bottom>b.top-6}
 function place(anchor,width,height,preferred,area){
  const rect=bounds(anchor,area);if(!rect)return null;
  const existing=strokes.filter(s=>s.color!=='#fffef9').map(s=>bounds(s,area)).filter(Boolean);
  const sides=preferred==='left'?['left','right']:['right','left'];
  const yValues=[rect.top,rect.top-height-12,rect.bottom+12,rect.top+height+12,rect.top-2*height-24];
  const test=(x,y)=>{
   const box={left:x,top:y,right:x+width,bottom:y+height};
   return x>=8&&y>=8&&box.right<=area.width-8&&box.bottom<=area.height-8&&!existing.some(other=>overlaps(box,other))?box:null;
  };
  for(const side of sides){
   const x=side==='left'?rect.left-width-18:rect.right+18;
   for(const y of yValues){const found=test(x,y);if(found)return found}
  }
  for(let y=8;y+height<=area.height-8;y+=height+12)
   for(let x=8;x+width<=area.width-8;x+=width+12){const found=test(x,y);if(found)return found}
  return null;
 }
 // Scan aligned columns and rows in reading order, respecting existing board items.
 function orderedWordBox(anchor,width,height,area){
  const rect=bounds(anchor,area);if(!rect)return null;const gap=12,stepX=width+gap,stepY=height+gap;
  const obstacles=strokes.filter(s=>s.color!=='#fffef9').map(s=>bounds(s,area)).filter(Boolean);
  const columns=[];for(let x=8;x+width<=area.width-8;x+=stepX)columns.push(x);
  const rightFirst=(rect.left+rect.right)/2<area.width/2;columns.sort((a,b)=>rightFirst?b-a:a-b);
  for(const x of columns)for(let y=8;y+height<=area.height-8;y+=stepY){const box={left:x,top:y,right:x+width,bottom:y+height};if(!obstacles.some(other=>overlaps(box,other)))return box}
  return null;
 }
 function pointBox(box,area){return [[box.left/area.width,box.top/area.r.height],[box.right/area.width,box.bottom/area.r.height]]}
 function sidesFor(item,area){
  const rect=bounds(item,area),center=(rect.left+rect.right)/2/area.width;
  return center<.35?['right','right']:center>.65?['left','left']:['left','right'];
 }
 function addWords(letter){
  const isEnglish=/^[A-Za-z]$/.test(letter.text);
  const englishEntries=isEnglish?englishWords[letter.text.toUpperCase()]:null;
  const entries=isEnglish?(englishEntries||[]).map(([text,picture])=>[letter.text===letter.text.toLowerCase()?text.toLowerCase():text,picture]):words[letter.text];
  const area=boardArea();
  if(!entries?.length){notice('ଏହି ଅକ୍ଷର ପାଇଁ ଶବ୍ଦ ଏପର୍ଯ୍ୟନ୍ତ ଯୋଡ଼ା ଯାଇନାହିଁ।');return}
  if(!area)return;
  const source=letter.vocabSourceId||('letter-'+Date.now()+'-'+Math.random().toString(36).slice(2));
  const already=new Set(strokes.filter(s=>s.kind==='vocabWord'&&s.vocabSourceId===source).map(s=>s.text));
  let added=0;
  const fontSize=Math.max(22,Math.min(32,area.r.height*.08));
  for(let i=0;i<entries.length;i++){
   const [text,picture]=entries[i];if(already.has(text))continue;
   ctx.save();ctx.font=fontSize+'px "Noto Sans Odia", sans-serif';const width=Math.max(80,Math.min(area.width*.38,ctx.measureText(text).width+24));ctx.restore();
   const height=Math.max(48,fontSize*1.5),box=orderedWordBox(letter,Math.max(80,Math.min(area.width*.38,160)),height,area);if(!box)continue;
   letter.vocabSourceId=source;
   strokes.push({kind:'vocabWord',text,picture,vocabSourceId:source,points:pointBox(box,area),color:letter.color,size:fontSize,alpha:1});added++;
  }
  if(added){redo=[];persist();render()}
  else notice(already.size?'ଶବ୍ଦଗୁଡ଼ିକ ବୋର୍ଡରେ ଅଛି।':'ଖାଲି ଜାଗା ନାହିଁ। ବୋର୍ଡରେ ଜାଗା କରନ୍ତୁ।');
 }
 function addPicture(word){
  const area=boardArea();if(!area||!word.picture)return;
  const pictureSize=Math.max(52,Math.min(104,area.r.height*.2));
  const rect=bounds(word,area),preferred=(rect.left+rect.right)/2<area.width/2?'right':'left';
  const box=place(word,pictureSize,pictureSize,preferred,area);
  if(!box){notice('ଚିତ୍ର ପାଇଁ ବୋର୍ଡରେ ଜାଗା କରନ୍ତୁ।');return}
  strokes.push({kind:'vocabPicture',text:word.picture,points:pointBox(box,area),color:word.color,size:pictureSize*.8,alpha:1});
  redo=[];persist();render();
 }
 function start(e,item,fromPen){
  cancel();if(!item||!['letter','vocabWord'].includes(item.kind))return;
  const record={id:e.pointerId,x:e.clientX,y:e.clientY,item,fromPen,held:false,timer:null};pending=record;
  if(item.kind==='letter')record.timer=setTimeout(()=>{
   if(pending!==record||!strokes.includes(item))return;
   record.held=true;
   if(fromPen){activeInk.delete(record.id);drawing=activeInk.size>0;if(inkFrame){cancelAnimationFrame(inkFrame);inkFrame=0}render()}
   addWords(item);
  },650);
 }
 function move(e){if(pending&&pending.id===e.pointerId&&Math.hypot(e.clientX-pending.x,e.clientY-pending.y)>12)cancel()}
 function end(e){
  if(!pending||pending.id!==e.pointerId)return;
  const record=pending;cancel();
  if(e.type==='pointerup'&&!record.held&&record.item.kind==='vocabWord'&&strokes.includes(record.item)){
   if(record.fromPen){activeInk.delete(record.id);drawing=activeInk.size>0;if(inkFrame){cancelAnimationFrame(inkFrame);inkFrame=0}render()}
   addPicture(record.item);
  }
 }
 window.odiaVocabStart=(e,item)=>start(e,item,false);
 window.odiaVocabMove=move;window.odiaVocabEnd=end;
 // The selection tool is normally activated when a letter is inserted. When the
 // pen is active, preserve normal writing unless the pointer is held on a letter.
 canvas.addEventListener('pointerdown',e=>{
  if(!e.isPrimary||e.button!==0||shapeMode||erase||(e.pointerType==='touch'&&e.width>=34&&e.height>=25)||document.querySelector('#selectTool')?.getAttribute('aria-pressed')==='true')return;
  const area=boardArea();if(!area)return;const x=e.clientX-area.r.left,y=e.clientY-area.r.top;
  const item=[...strokes].reverse().find(s=>['letter','vocabWord'].includes(s.kind)&&(()=>{const b=bounds(s,area);return b&&x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom})());
  if(item)start(e,item,true);
 },true);
 canvas.addEventListener('pointermove',move,true);
 canvas.addEventListener('pointerup',end,true);
 canvas.addEventListener('pointercancel',end,true);
 canvas.addEventListener('lostpointercapture',cancel,true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel()});
})();
