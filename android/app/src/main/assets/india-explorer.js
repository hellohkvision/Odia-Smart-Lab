/* Menu entry for the planned India Explorer; no simulated feature is claimed. */
(()=>{
 'use strict';
 const menu=document.getElementById('saathiMenu');
 if(!menu)return;
 const icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></svg>';
 const entry=document.createElement('button');entry.id='indiaExplorerMenu';entry.type='button';entry.setAttribute('aria-label','India Explorer · ଭାରତ ଅନ୍ୱେଷଣ');entry.setAttribute('aria-haspopup','dialog');entry.setAttribute('aria-controls','indiaExplorerDialog');entry.innerHTML=icon+'<small>India Explorer · ଭାରତ ଅନ୍ୱେଷଣ</small>';menu.append(entry);
 const dialog=document.createElement('dialog');dialog.id='indiaExplorerDialog';dialog.setAttribute('aria-labelledby','indiaExplorerTitle');dialog.setAttribute('aria-describedby','indiaExplorerStatus');
 dialog.innerHTML='<div class="india-explorer-heading"><h2 id="indiaExplorerTitle">India Explorer</h2><button type="button" id="indiaExplorerClose" aria-label="Close India Explorer">×</button></div><div class="india-explorer-content"><span class="india-explorer-planned">Coming soon · ଶୀଘ୍ର ଆସୁଛି</span><h3 lang="or">ଭାରତ ଅନ୍ୱେଷଣ</h3><p id="indiaExplorerStatus">The 3D explorer is planned and is not available yet.</p><p lang="or">ଏଠାରେ ଭାରତକୁ ଛୁଇଁ ଓ ଘୁରାଇ ଶିଖିବାର ସୁବିଧା ଯୋଡ଼ାଯିବ।</p><p class="india-explorer-note">Planned: states, mountains, rivers and learning missions.</p></div>';
 document.body.append(dialog);
 function close(){dialog.close();document.getElementById('activityMenu')?.focus();}
 entry.onclick=()=>{menu.classList.remove('open');document.getElementById('activityMenu')?.setAttribute('aria-expanded','false');if(typeof closePanels==='function')closePanels();dialog.showModal();dialog.querySelector('#indiaExplorerClose').focus();};
 dialog.querySelector('#indiaExplorerClose').onclick=close;
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
})();
