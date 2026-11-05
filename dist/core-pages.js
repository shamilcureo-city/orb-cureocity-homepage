/* Client-only help filtering. No question or personal information is submitted. */
(() => {
  const search=document.querySelector('[data-help-search]');
  if(!search)return;
  const items=[...document.querySelectorAll('[data-help-item]')];
  const groups=[...document.querySelectorAll('[data-help-group]')];
  const status=document.querySelector('[data-help-status]');
  const empty=document.querySelector('[data-help-empty]');
  const clear=document.querySelector('[data-help-clear]');
  const normalise=value=>value.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
  function filter(){
    const query=normalise(search.value.trim());
    let count=0;
    for(const item of items){const match=!query||normalise(item.textContent).includes(query);item.hidden=!match;if(match)count++;}
    for(const group of groups)group.hidden=![...group.querySelectorAll('[data-help-item]')].some(item=>!item.hidden);
    status.textContent=query?`${count} ${count===1?'answer':'answers'} found`:`${count} answers to explore`;
    empty.hidden=count>0;clear.hidden=!query;
  }
  search.addEventListener('input',filter);
  clear.addEventListener('click',()=>{search.value='';filter();search.focus();});
  // Topic navigation intentionally resets a filter that would hide its destination.
  document.querySelectorAll('.core-help-topics a').forEach(link=>link.addEventListener('click',()=>{search.value='';filter();}));
  filter();
})();
