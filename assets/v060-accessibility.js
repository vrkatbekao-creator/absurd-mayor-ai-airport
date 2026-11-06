/* Focus restoration and visible-only dialog containment. No saved data changes. */
function languageName521(){return ({zh:'介面語言',en:'Interface language',fr:'Langue de l’interface',nl:'Interfacetaal'})[lang]}
function dialogFocusable521(el){
 if(el.disabled||el.tabIndex<0||el.closest('[hidden],[inert]')||!el.getClientRects().length||getComputedStyle(el).visibility==='hidden')return false;
 for(let parent=el.parentElement;parent;parent=parent.parentElement){
  if(parent.tagName==='DETAILS'&&!parent.open){const summary=parent.querySelector(':scope > summary');if(!summary||!summary.contains(el))return false}
  if(parent.getAttribute('role')==='dialog')break;
 }return true;
}
