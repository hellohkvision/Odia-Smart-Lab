// Shared confirmations and accessible, short-lived in-app notices.
const confirmation=document.createElement('dialog');confirmation.className='app-confirm';confirmation.setAttribute('aria-labelledby','confirmTitle');confirmation.setAttribute('aria-describedby','confirmBody');
confirmation.innerHTML='<form method="dialog"><div class="notice-symbol" aria-hidden="true">!</div><h2 id="confirmTitle"></h2><p id="confirmBody"></p><div class="dialog-actions"><button value="cancel" autofocus></button><button value="continue" class="danger-action"></button></div></form>';document.body.append(confirmation);
let confirmationPending=false;
window.confirmBoard=(title,message,action)=>new Promise(resolve=>{
 if(confirmationPending){resolve(false);return}
 confirmationPending=true;const or=document.documentElement.lang==='or';
 confirmation.querySelector('h2').textContent=title;confirmation.querySelector('p').textContent=message;
 confirmation.querySelector('[value=cancel]').textContent=or?'ବାତିଲ କରନ୍ତୁ':'Cancel';
 confirmation.querySelector('[value=continue]').textContent=action;
 const focused=document.activeElement;
 confirmation.addEventListener('close',()=>{confirmationPending=false;resolve(confirmation.returnValue==='continue');focused?.focus()},{once:true});
 confirmation.returnValue='cancel';confirmation.showModal();
});
const notice=document.createElement('div');notice.className='app-notice hidden';notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');document.body.append(notice);
let noticeTimer;
window.boardNotice=(message,error=false)=>{
 if(!message)return;notice.textContent=message;notice.classList.toggle('error',error);notice.classList.remove('hidden');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.add('hidden'),error?6000:2600);
};
const statusNode=document.querySelector('#status');
new MutationObserver(()=>{const message=statusNode.textContent.trim();if(message)boardNotice(message,/could not|unavailable|failed/i.test(message))}).observe(statusNode,{childList:true,subtree:true,characterData:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.floating-panel,.extra-panel,.more-tools-panel').forEach(p=>p.classList.add('hidden'));document.querySelectorAll('[aria-expanded=true]').forEach(b=>b.setAttribute('aria-expanded','false'))}});
