const roles={archer:{name:'弓箭手',en:'ARCHER',builds:[['连射过牌','凝神 → 探路箭 → 射击。手里已经有远程牌时先减费，还缺关键牌时可以先抽。'],['哨箭爆发','按下一张牌整体翻倍的读法，哨箭接射击为 16 点，接二连射为两段各 14 点。多段与暴击的叠加口径待核对。'],['看意图出手','敌人准备施加状态时打趁隙一箭，准备攻击时可以格挡。进阶的压制射击让攻击意图也能转化为收益。'],['进阶搭配候选','轻装上阵弃掉奇怪医疗箱，把弃牌变成资源。荆棘陷阱与多刃箭矢则能连续叠加重伤。']]},sword:{name:'剑士',en:'SWORDSMAN',builds:[['挂火与引燃','鬼火给前排挂 3 层燃烧。引燃最多消耗 3 层，每层换 2 点额外伤害。选择立即兑现，还是留给持续伤害。'],['蓄力与贯穿','旧案让贯穿对后一个目标暴击。蓄力是否先加伤、再乘暴击倍率，会直接决定这套组合的价值。'],['守转攻','反击架势先给护甲，再强化下一张攻击。余烬架势则要求完全挡住攻击，才能给攻击者挂火。']]}};
const grades=['全部','普通','进阶','史诗','传奇','待定'];
const colors={'普通':'#75958c','进阶':'#577d9c','史诗':'#9477a5','传奇':'#af7936','待定':'#9c9588'};
const keywords={虚弱:'造成的伤害减少 25%，向下取整。',脆弱:'获得的护甲减少 50%，向下取整。',重伤:'回合结束时失去等同于层数的生命，然后减少 1 层。',暴露:'受到的近战和远程攻击必定暴击。',昏迷:'无法行动，状态照常结算。',保留:'回合结束时留在手中。',移除:'使用后从本场战斗移除。',消耗:'使用后从卡组永久移除。'};
const $=id=>document.getElementById(id);
function el(tag,txt,cls){const node=document.createElement(tag);node.textContent=txt;if(cls)node.className=cls;return node}
function loc(){const p=new URLSearchParams(location.hash.slice(1));const role=Object.hasOwn(roles,p.get('role'))?p.get('role'):'archer';const all=CARDS.filter(c=>c.role===role);const fallback=role==='archer'?'普通':'全部';const grade=grades.includes(p.get('grade'))&&(p.get('grade')==='全部'||all.some(c=>c.tier===p.get('grade')))?p.get('grade'):fallback;const list=all.filter(c=>grade==='全部'||grade===c.tier);const pages=Math.ceil(list.length/6);const page=Math.max(1,Math.min(pages,Number.parseInt(p.get('page'),10)||1));return {role,grade,page,list,all,pages}}
function go(role,grade,page){location.hash=new URLSearchParams({role,grade,page}).toString()}
function showCard(c){$('cardStudio').href='card-library.html#'+new URLSearchParams({card:c.id});$('dgrade').textContent=roles[c.role].name+' / '+c.tier+' / '+c.tag;$('dname').textContent=c.name;$('alias').textContent=c.old?'暂拟名 · 原名「'+c.old+'」':'';$('deffect').textContent=c.effect;$('dnote').textContent=c.note;$('source').textContent='来源 · '+c.source+(c.copies?'　旧稿份数 ×'+c.copies:'');$('detail').showModal()}
function render(){const {role,grade,page,list,all,pages}=loc();const info=roles[role];document.title=info.name+' · '+grade+' · 卡牌核对册';$('role').textContent=info.name;$('en').textContent=info.en;$('art').src=role+'.webp';document.querySelectorAll('[data-role]').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.role===role);b.onclick=()=>go(b.dataset.role,b.dataset.role==='archer'?'普通':'全部',1)});
if($('builds').dataset.role!==role){$('builds').dataset.role=role;$('builds').replaceChildren(...info.builds.map(([name,body])=>{const d=el('details','');d.append(el('summary',name),el('p',body));return d}))}
$('tiers').replaceChildren(...grades.filter(g=>g==='全部'||all.some(c=>c.tier===g)).map(g=>{const b=el('button',g);b.setAttribute('aria-pressed',g===grade);b.append(el('small',g==='全部'?all.length:all.filter(c=>c.tier===g).length));b.onclick=()=>go(role,g,1);return b}));
$('cards').replaceChildren(...list.slice((page-1)*6,page*6).map(c=>{const b=el('button','','tile');b.style.setProperty('--tier',colors[c.tier]);b.append(el('span',c.tier,'grade'),el('b',c.name),el('span',c.effect,'rule'));const f=el('span','','foot');f.append(el('span',c.tag),el('span','详阅 ↗'));b.append(f);b.onclick=()=>showCard(c);return b}));
$('num').textContent=page+' / '+pages;$('count').textContent='第 '+((page-1)*6+1)+'–'+Math.min(page*6,list.length)+' 张，共 '+list.length+' 张';$('prev').disabled=page===1;$('next').disabled=page===pages;$('prev').onclick=()=>go(role,grade,page-1);$('next').onclick=()=>go(role,grade,page+1)}
for(const [term,desc] of Object.entries(keywords))$('terms').append(el('dt',term),el('dd',desc));
$('detail').addEventListener('click',e=>{if(e.target===$('detail')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
$('share').onclick=async()=>{const {role,grade,page}=loc();const url=new URL(location.href);url.hash=new URLSearchParams({role,grade,page}).toString();try{await navigator.clipboard.writeText(url.href);$('toast').textContent='已复制当前角色、品阶和页码的链接';setTimeout(()=>$('toast').textContent='',2300)}catch{window.prompt('复制此页链接',url.href)}};
function followLocation(){
 const params=new URLSearchParams(location.hash.slice(1));
 const card=CARDS.find(c=>c.id===params.get('card'));
 if($('detail').open)$('detail').close();
 if(card){
  const subset=CARDS.filter(c=>c.role===card.role&&c.tier===card.tier);
  const page=Math.floor(subset.indexOf(card)/6)+1;
  const target=new URLSearchParams({role:card.role,grade:card.tier,page,card:card.id});
  history.replaceState(null,'','#'+target);
 }
 render();
 if(card)showCard(card);
}
$('detail').addEventListener('close',()=>{
 const p=new URLSearchParams(location.hash.slice(1));
 if(!$('detail').open&&p.has('card')){p.delete('card');history.replaceState(null,'','#'+p)}
});
window.addEventListener('hashchange',followLocation);followLocation();
