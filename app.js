
import { savePokemon, saveTeam, listPokemon, listTeams } from './store.js';
import { speciesTypes, typeDamage } from './type-analysis-data.js';
import { typeMark, TYPE_DISPLAY_ORDER } from './type-icons.js';

(()=>{const D=window.APP_DATA,$=id=>document.getElementById(id),ids=v=>String(v||'').toLowerCase().replace(/♀/g,'f').replace(/♂/g,'m').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');let active=0,team=[];const clone=x=>JSON.parse(JSON.stringify(x)),group=()=>D.groups.find(g=>g.key===$('cup').value),name=id=>D.species[id]||`ID ${id}`,move=id=>D.moves[id]||D.moves[0];
function category(type){return[0,1,2,3,4,5,6,7,8,16].includes(type)?'Fisica':'Speciale'}function legalMoves(speciesId,current){const key=D.legal.byDex[String(speciesId)],set=new Set(D.legal.species[key]?.moves||[]);return D.moves.filter(m=>m.id===current||set.has(ids(m.name)))}
function statBonus(v){return Math.floor(Math.min(255,Math.ceil(Math.sqrt(Math.max(0,v))))/4)}function stat(base,dv,se,l,hp=false){return Math.min(999,Math.floor((((base+dv)*2+statBonus(se))*l)/100)+(hp?l+10:5))}
function statsFor(p){const key=D.legal.byDex[String(p.species)],b=D.legal.species[key]?.baseStats;if(!b)return{hp:0,atk:0,def:0,spe:0,spc:0};const hp=((p.ivs.atk&1)*8)+((p.ivs.def&1)*4)+((p.ivs.spe&1)*2)+(p.ivs.spc&1),l=p.level;return{hp:stat(b.hp,hp,p.statExp.hp,l,true),atk:stat(b.atk,p.ivs.atk,p.statExp.atk,l),def:stat(b.def,p.ivs.def,p.statExp.def,l),spe:stat(b.spe,p.ivs.spe,p.statExp.spe,l),spc:stat(b.spc,p.ivs.spc,p.statExp.spc,l)}}function calculate(){const p=team[active];p.stats=statsFor(p);for(const k of ['Hp','Atk','Def','Spe','Spc'])$(`st${k}`).value=p.stats[k.toLowerCase()]}
function pokemonTypes(p){return speciesTypes[p.species]||[]}
function multiplier(attackType,defenseTypes){return defenseTypes.reduce((value,type)=>value*(typeDamage[type]?.[attackType]??1),1)}
function multiplierLabel(value){return({0:'0×',0.25:'¼×',0.5:'½×',1:'1×',2:'2×',4:'4×',8:'8×'})[value]||`${value}×`}
function effectClass(value){return value===0?'effect-immune':value>1?'effect-weak':value<1?'effect-resist':'effect-neutral'}
function strongestAttack(p,targetType){return p.moves.map(id=>move(id)).filter(m=>m.power>0||/deals set damage/i.test(m.description||'')).map(m=>({move:m,type:D.types[m.type],value:typeDamage[targetType]?.[D.types[m.type]]??1,stab:pokemonTypes(p).includes(D.types[m.type])})).filter(entry=>entry.type).sort((a,b)=>b.value-a.value||Number(b.stab)-Number(a.stab))[0]||null}
function tallyGrid(mode){return TYPE_DISPLAY_ORDER.map(type=>{const marks=team.map((p,i)=>{if(mode==='defense'){const value=multiplier(type,pokemonTypes(p)),kind=value>1?'weak':value<1?'good':'neutral';return `<span class="tally-mark tally-${kind}" title="Slot ${i+1} · ${name(p.species)}: ${multiplierLabel(value)} contro ${type}" aria-label="Slot ${i+1}: ${multiplierLabel(value)}"></span>`}const attack=strongestAttack(p,type),kind=attack&&attack.value>1?'good':'neutral',label=attack?`${attack.move.name}${attack.stab?' · STAB':''}, ${multiplierLabel(attack.value)}`:'nessuna mossa danno';return `<span class="tally-mark tally-${kind}" title="Slot ${i+1} · ${name(p.species)}: ${label} contro ${type}" aria-label="Slot ${i+1}: ${label}"></span>`}).join('');return `<div class="type-tally" role="listitem"><div class="type-tally-head">${typeMark(type,false)}<span>${type}</span></div><div class="tally-bars" aria-label="Slot squadra da 1 a 6">${marks}</div></div>`}).join('')}
function renderAnalysis(){
  const headers=team.map((p,i)=>`<th scope="col"><span>${i+1}. ${name(p.species)}</span><small class="type-badges">${pokemonTypes(p).map(type=>typeMark(type,true)).join('')||'Tipo non disponibile'}</small></th>`).join('');
  const tableHead=label=>`<tr><th scope="col">${label}</th>${headers}<th scope="col">Riepilogo</th></tr>`;
  $('defenseHead').innerHTML=tableHead('Tipo d’attacco');$('offenseHead').innerHTML=tableHead('Tipo bersaglio');
  $('defenseGraphic').innerHTML=tallyGrid('defense');$('offenseGraphic').innerHTML=tallyGrid('offense');
  const defense=TYPE_DISPLAY_ORDER.map(attackType=>{
    const values=team.map(p=>multiplier(attackType,pokemonTypes(p)));
    const weak=values.filter(value=>value>1).length,resist=values.filter(value=>value>0&&value<1).length,immune=values.filter(value=>value===0).length;
    const cells=values.map((value,i)=>`<td><span class="effect-badge ${effectClass(value)}" aria-label="${name(team[i].species)}: ${multiplierLabel(value)}">${multiplierLabel(value)}</span></td>`).join('');
     return `<tr><th scope="row"><span class="table-type-label">${typeMark(attackType,true)}</span></th>${cells}<td class="team-balance"><span class="weak-count">${weak} deboli</span><span class="resist-count">${resist} resistono</span><span class="immune-count">${immune} immuni</span></td></tr>`;
  }).join('');
  $('defenseRows').innerHTML=defense;
  const threatRows=TYPE_DISPLAY_ORDER.map(attackType=>({type:attackType,count:team.filter(p=>multiplier(attackType,pokemonTypes(p))>1).length}));
  const sharedThreats=threatRows.filter(row=>row.count>1);
  $('defenseSummary').textContent=sharedThreats.length?`Debolezze condivise: ${sharedThreats.map(row=>`${row.type} (${row.count})`).join(' · ')}.`:'Nessun tipo d’attacco crea una debolezza condivisa.';
  const offense=TYPE_DISPLAY_ORDER.map(targetType=>{
    const attacks=team.map(p=>strongestAttack(p,targetType));
    const count=attacks.filter(entry=>entry&&entry.value>1).length;
    const cells=attacks.map((entry,i)=>entry?`<td><span class="offense-matchup"><span class="effect-badge ${effectClass(entry.value)}" aria-label="${name(team[i].species)}: ${multiplierLabel(entry.value)} contro ${targetType}">${multiplierLabel(entry.value)}</span><small>${entry.move.name}${entry.stab?' · STAB':''}</small></span></td>`:'<td><span class="no-matchup">—</span></td>').join('');
     return `<tr><th scope="row"><span class="table-type-label">${typeMark(targetType,true)}</span></th>${cells}<td class="team-balance"><span class="${count?'resist-count':'weak-count'}">${count}/6 Pokémon</span></td></tr>`;
  }).join('');
  $('offenseRows').innerHTML=offense;
  const covered=TYPE_DISPLAY_ORDER.filter(targetType=>team.some(p=>{const attack=strongestAttack(p,targetType);return attack&&attack.value>1;}));
  const uncovered=TYPE_DISPLAY_ORDER.filter(type=>!covered.includes(type));
  $('offenseSummary').textContent=`Mosse superefficaci contro ${covered.length} tipi su ${TYPE_DISPLAY_ORDER.length}.${uncovered.length?` Senza copertura superefficace: ${uncovered.join(', ')}.`:''}`;
}
function renderTeam(){ $('team').innerHTML=team.map((p,i)=>`<button class="slot${i===active?' active':''}" data-slot="${i}"><img src="${D.artwork[p.species]}" alt=""><span class="slot-info"><strong>${i+1}. ${name(p.species)}</strong><small>Lv. ${p.level}</small><span class="type-badges">${pokemonTypes(p).map(type=>typeMark(type,true)).join('')}</span><small>${p.moves.map(x=>move(x).name).join(' · ')}</small></span></button>`).join('');document.querySelectorAll('.slot').forEach(b=>b.onclick=()=>{active=+b.dataset.slot;render()});renderAnalysis()}
function option(id,label){return `<option value="${id}">${String(id+1).padStart(3,'0')} - ${label}</option>`}function render(){const p=team[active],g=group();$('editTitle').textContent=`Slot ${active+1} - ${name(p.species)}`;$('hero').src=D.artwork[p.species];$('hero').alt=name(p.species);$('editTypes').innerHTML=pokemonTypes(p).map(type=>typeMark(type,true)).join('');$('baseRental').innerHTML=g.rentals.map((r,i)=>option(i,name(r.species))).join('');$('baseRental').value=String(p.sourceIndex);$('speciesCombo').value=`${p.species} - ${name(p.species)}`;for(const [id,val] of Object.entries({level:p.level,experience:p.experience,ivAtk:p.ivs.atk,ivDef:p.ivs.def,ivSpe:p.ivs.spe,ivSpc:p.ivs.spc,seHp:p.statExp.hp,seAtk:p.statExp.atk,seDef:p.statExp.def,seSpe:p.statExp.spe,seSpc:p.statExp.spc}))$(id).value=val;$('moves').innerHTML=p.moves.map((mid,i)=>{const opts=legalMoves(p.species,mid).map(m=>`<option value="${m.id}"${m.id===mid?' selected':''}>${m.id} - ${m.name}</option>`).join(''),m=move(mid),acc=m.accuracy===255?100:Math.round(m.accuracy*100/255),type=D.types[m.type]||'Tipo '+m.type;return `<div class="move-card"><label>Mossa ${i+1}<select data-move="${i}">${opts}</select></label><div class="move-meta"><span class="move-type-line">${typeMark(type,true)}<span>${category(m.type)} · Pot. ${m.power||'-'} · Prec. ${acc}% · PP ${m.pp}</span></span><br>${m.description||'Nessuna descrizione effetto disponibile.'}</div></div>`}).join('');document.querySelectorAll('[data-move]').forEach(s=>s.onchange=()=>{const i=+s.dataset.move,id=+s.value,ups=Number(p.pp?.[i]?.ups);p.moves[i]=id;p.pp[i]={ups:Number.isFinite(ups)?ups:3,current:Math.min(63,Math.floor(move(id).pp*(5+(Number.isFinite(ups)?ups:3))/5))};render()});calculate();renderTeam()}
function resetCup(){team=group().rentals.slice(0,6).map(clone);active=0;render()}
$("toggleAnalysis").onclick=()=>{const visible=$("teamAnalysis").hidden;$("teamAnalysis").hidden=!visible;$("toggleAnalysis").setAttribute('aria-expanded',String(visible));$("toggleAnalysis").textContent=visible?'Nascondi analisi':'Mostra analisi';if(visible)renderAnalysis()};
function commitSpecies(){const m=$('speciesCombo').value.match(/^(\d{1,3})/),id=+(m?.[1]||0);if(id<1||id>151){$('speciesCombo').value=`${team[active].species} - ${name(team[active].species)}`;return}team[active].species=id;render()}
$('speciesList').innerHTML=D.species.slice(1).map((n,i)=>`<option value="${i+1} - ${n}"></option>`).join('');$('cup').innerHTML=D.groups.map(g=>`<option value="${g.key}">${g.label}</option>`).join('');$('cup').value='prime100';$('cup').onchange=resetCup;$('baseRental').onchange=()=>{team[active]=clone(group().rentals[+$('baseRental').value]);render()};$('speciesCombo').onchange=commitSpecies;
const binds={level:['level'],experience:['experience'],ivAtk:['ivs','atk'],ivDef:['ivs','def'],ivSpe:['ivs','spe'],ivSpc:['ivs','spc'],seHp:['statExp','hp'],seAtk:['statExp','atk'],seDef:['statExp','def'],seSpe:['statExp','spe'],seSpc:['statExp','spc']};for(const [id,path] of Object.entries(binds))$(id).oninput=()=>{let o=team[active];for(let i=0;i<path.length-1;i++)o=o[path[i]];o[path[path.length-1]]=Math.max(0,+$(id).value||0);calculate();renderTeam()};$('duplicate').onclick=()=>{if(active<5){team[active+1]=clone(team[active]);active++;render()}};
async function pngFor(speciesId){const img=new Image();img.src=D.artwork[speciesId];await img.decode();const c=document.createElement('canvas');c.width=180;c.height=180;const x=c.getContext('2d');x.clearRect(0,0,180,180);x.drawImage(img,10,10,160,160);return c.toDataURL('image/png')}
function enc(obj){const bytes=new TextEncoder().encode(JSON.stringify(obj));let s='';bytes.forEach(b=>s+=String.fromCharCode(b));return btoa(s)}
$('exportPdf').onclick=async()=>{try{$('status').textContent='Creazione PDF…';const {jsPDF}=window.jspdf,doc=new jsPDF({unit:'mm',format:'a4'}),title=$('teamName').value.trim()||'Team Cross Stadium',g=group();team.forEach(p=>p.stats=statsFor(p));const packet={schema:'cross-stadium-team-v1',createdAt:new Date().toISOString(),teamName:title,groupKey:g.key,groupLabel:g.label,romGroupIndex:g.romGroupIndex,pokemon:team};for(let i=0;i<6;i++){if(i>0)doc.addPage();const p=team[i],mv=p.moves.map(move);doc.setFillColor(15,28,46);doc.roundedRect(12,12,186,273,5,5,'F');doc.addImage(await pngFor(p.species),'PNG',18,20,45,45);doc.setTextColor(240,245,250);doc.setFontSize(20);doc.text(`${i+1}. ${name(p.species)}  Lv. ${p.level}`,70,30);doc.setFontSize(10);doc.setTextColor(160,177,199);doc.text(`Rental origine: ${p.sourceIndex+1} - ${g.label}`,70,39);doc.text(`Esperienza: ${p.experience}`,70,46);doc.setTextColor(56,189,248);doc.setFontSize(12);doc.text('Statistiche risultanti',18,76);doc.setTextColor(240,245,250);doc.setFontSize(11);doc.text(`PS ${p.stats.hp}   Attacco ${p.stats.atk}   Difesa ${p.stats.def}   Velocita ${p.stats.spe}   Speciale ${p.stats.spc}`,18,85);doc.setFontSize(9);doc.text(`IV: Att ${p.ivs.atk} - Dif ${p.ivs.def} - Vel ${p.ivs.spe} - Spc ${p.ivs.spc}`,18,94);doc.text(`Stat Exp: PS ${p.statExp.hp} - Att ${p.statExp.atk} - Dif ${p.statExp.def} - Vel ${p.statExp.spe} - Spc ${p.statExp.spc}`,18,101);doc.setTextColor(56,189,248);doc.setFontSize(12);doc.text('Mosse',18,113);mv.forEach((m,j)=>{const y=124+j*39,pp=p.pp[j]||{current:m.pp,ups:0},max=Math.min(63,Math.floor(m.pp*(5+pp.ups)/5)),acc=m.accuracy===255?100:Math.round(m.accuracy*100/255);doc.setTextColor(240,245,250);doc.setFontSize(11);doc.text(`${j+1}. ${m.name} - ${D.types[m.type]} - ${category(m.type)}`,18,y);doc.setTextColor(56,189,248);doc.setFontSize(9);doc.text(`Potenza ${m.power||'-'} - Precisione ${acc}% - PP ${pp.current}/${max} - PP Up ${pp.ups}`,18,y+7);doc.setTextColor(160,177,199);doc.setFontSize(9);const description=m.description||`Effetto interno 0x${Number(m.effect||0).toString(16).padStart(2,'0').toUpperCase()}`,lines=doc.splitTextToSize(description,172).slice(0,3);doc.text(lines,18,y+14)});doc.setTextColor(125,145,170);doc.setFontSize(8);doc.text(`${title} - ${i+1}/6`,170,278)}doc.setProperties({title,subject:'Cross Stadium Team',creator:'Cross Stadium Team Builder'});const pdf=new Uint8Array(doc.output('arraybuffer')),marker=new TextEncoder().encode(`\n%CROSS_STADIUM_TEAM_V1:${enc(packet)}\n`),blob=new Blob([pdf,marker],{type:'application/pdf'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=title.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);$('status').textContent='PDF creato: puoi condividerlo e reimportarlo nel Rental Editor.'}catch(e){$('status').textContent='Errore: '+e.message}}
const library = { pokemon: [], teams: [], tab: 'pokemon' };
const status = message => { $('status').textContent = message; };
const autoPokemonName = p => `${name(p.species)} · ${p.moves.slice(0,2).map(id => move(id).name).join(' / ')}`;
const authorIsValid = value => ['GZKPT', 'Maxter', 'Cato'].includes(value);

function openLibrary(tab = library.tab) {
  library.tab = tab;
  $('libraryDrawer').classList.add('open');
  $('libraryDrawer').setAttribute('aria-hidden', 'false');
  $('drawerBackdrop').hidden = false;
  refreshLibrary();
}
function closeLibrary() {
  $('libraryDrawer').classList.remove('open');
  $('libraryDrawer').setAttribute('aria-hidden', 'true');
  $('drawerBackdrop').hidden = true;
}
function selectLibraryTab(tab) {
  library.tab = tab;
  $('showPokemon').classList.toggle('selected', tab === 'pokemon');
  $('showTeams').classList.toggle('selected', tab === 'teams');
  refreshLibrary();
}
function itemButton(label, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.onclick = onClick;
  return button;
}
function addPokemon(saved, slot = active, advance = true) {
  if (!saved?.pokemon || slot < 0 || slot > 5) return;
  team[slot] = clone(saved.pokemon);
  active = advance && slot < 5 ? slot + 1 : slot;
  render();
  status(`${saved.name} aggiunto allo slot ${slot + 1}.`);
  if ($('libraryDrawer').classList.contains('open')) renderLibrary();
}
function loadTeam(saved) {
  if (!Array.isArray(saved?.pokemon) || saved.pokemon.length !== 6 || !D.groups.some(g => g.key === saved.groupKey)) return;
  $('cup').value = saved.groupKey;
  team = clone(saved.pokemon);
  $('teamName').value = saved.name;
  active = 0;
  render();
  closeLibrary();
  status(`Squadra “${saved.name}” caricata. Le modifiche non cambiano la copia online finché non la salvi di nuovo.`);
}
function renderLibrary() {
  const list = $('libraryList');
  list.replaceChildren();
  const records = library[library.tab];
  if (!records.length) {
    const empty = document.createElement('p');
    empty.className = 'library-empty';
    empty.textContent = library.tab === 'pokemon' ? 'Nessun Pokémon salvato. Configurane uno e usa “Salva questo Pokémon”.' : 'Nessuna squadra salvata. Usa “Salva squadra online”.';
    list.append(empty);
    return;
  }
  for (const record of records) {
    const card = document.createElement('article');
    card.className = 'library-item';
    const avatar = document.createElement('img');
    const detail = document.createElement('div');
    const title = document.createElement('h3');
    const meta = document.createElement('p');
    const actions = document.createElement('div');
    actions.className = 'item-actions';
    title.textContent = record.name || 'Senza nome';
    meta.textContent = `di ${record.author} · ${D.groups.find(g => g.key === record.groupKey)?.label || 'Competizione'}`;
    avatar.src = D.artwork[library.tab === 'pokemon' ? record.pokemon.species : record.pokemon[0].species];
    avatar.alt = '';
    detail.append(title, meta);
    if (library.tab === 'pokemon') {
      const typing = document.createElement('div');
      typing.className = 'type-badges library-types';
      typing.innerHTML = pokemonTypes(record.pokemon).map(type => typeMark(type, true)).join('');
      const moves = document.createElement('div');
      moves.className = 'saved-moves';
      for (const id of record.pokemon.moves) {
        const entry = move(id), label = document.createElement('span');
        label.className = 'saved-move';
        label.innerHTML = typeMark(D.types[entry.type], false);
        label.append(document.createTextNode(entry.name));
        moves.append(label);
      }
      detail.append(typing, moves);
      actions.append(itemButton(`Metti nello slot ${active + 1}`, () => addPokemon(record)));
      card.draggable = true;
      card.title = 'Trascina su uno slot della squadra';
      card.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', record.id);
        $('drawerBackdrop').classList.add('dragging');
      });
      card.addEventListener('dragend', () => $('drawerBackdrop').classList.remove('dragging'));
    } else {
      const roster = document.createElement('div');
      roster.className = 'saved-roster';
      for (const pokemon of record.pokemon) {
        const row = document.createElement('div'), label = document.createElement('span'), typing = document.createElement('span');
        row.className = 'saved-roster-item';
        label.className = 'saved-roster-name';
        label.textContent = name(pokemon.species);
        typing.className = 'type-badges';
        typing.innerHTML = pokemonTypes(pokemon).map(type => typeMark(type, false)).join('');
        row.append(label, typing);
        roster.append(row);
      }
      detail.append(roster);
      actions.append(itemButton('Carica squadra', () => loadTeam(record)));
    }
    detail.append(actions);
    card.append(avatar, detail);
    list.append(card);
  }
}
async function refreshLibrary() {
  $('libraryStatus').textContent = 'Caricamento…';
  $('showPokemon').classList.toggle('selected', library.tab === 'pokemon');
  $('showTeams').classList.toggle('selected', library.tab === 'teams');
  try {
    library[library.tab] = library.tab === 'pokemon' ? await listPokemon() : await listTeams();
    $('libraryStatus').textContent = `${library[library.tab].length} elementi`;
    renderLibrary();
  } catch (error) {
    $('libraryStatus').textContent = `Impossibile caricare la libreria: ${error.message}`;
  }
}

let saveKind = 'pokemon';
function openSave(kind) {
  saveKind = kind;
  $('saveDialogTitle').textContent = kind === 'pokemon' ? 'Salva Pokémon' : 'Salva squadra';
  $('saveDialogHelp').textContent = kind === 'pokemon' ? 'Il nome proposto riassume la specie e le prime due mosse. Puoi cambiarlo.' : 'Scegli un nome per riconoscere la squadra nella libreria online.';
  $('saveName').value = kind === 'pokemon' ? autoPokemonName(team[active]) : ($('teamName').value.trim() || `${group().label} · ${team.map(p => name(p.species)).slice(0,2).join(' / ')}`);
  $('saveAuthor').value = '';
  $('saveDialog').showModal();
  $('saveName').focus();
}
$('saveForm').addEventListener('submit', async event => {
  event.preventDefault();
  const title = $('saveName').value.trim();
  const author = $('saveAuthor').value;
  if (!title || !authorIsValid(author)) { $('saveForm').reportValidity(); return; }
  $('confirmSave').disabled = true;
  $('confirmSave').textContent = 'Salvataggio…';
  try {
    if (saveKind === 'pokemon') {
      await savePokemon({ name: title, author, groupKey: group().key, pokemon: clone(team[active]) });
      status(`Pokémon “${title}” salvato online.`);
    } else {
      $('teamName').value = title;
      await saveTeam({ name: title, author, groupKey: group().key, pokemon: clone(team) });
      status(`Squadra “${title}” salvata online.`);
    }
    $('saveDialog').close();
    openLibrary(saveKind);
  } catch (error) {
    status(`Salvataggio non riuscito: ${error.message}`);
  } finally {
    $('confirmSave').disabled = false;
    $('confirmSave').textContent = 'Salva online';
  }
});
$('cancelSave').onclick = () => $('saveDialog').close();
$('savePokemon').onclick = () => openSave('pokemon');
$('saveTeam').onclick = () => openSave('teams');
$('openLibrary').onclick = () => openLibrary();
$('closeLibrary').onclick = closeLibrary;
$('drawerBackdrop').onclick = closeLibrary;
$('showPokemon').onclick = () => selectLibraryTab('pokemon');
$('showTeams').onclick = () => selectLibraryTab('teams');
$('newTeam').onclick = () => { $('teamName').value = ''; resetCup(); status('Nuova squadra pronta: scegli uno slot o aggiungi Pokémon dalla libreria.'); };
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeLibrary(); });
$('team').addEventListener('dragover', event => {
  const slot = event.target.closest('[data-slot]');
  if (slot) { event.preventDefault(); slot.classList.add('drop-target'); }
});
$('team').addEventListener('dragleave', event => {
  const slot = event.target.closest('[data-slot]');
  if (slot && !slot.contains(event.relatedTarget)) slot.classList.remove('drop-target');
});
$('team').addEventListener('drop', event => {
  const slot = event.target.closest('[data-slot]');
  if (!slot) return;
  event.preventDefault();
  slot.classList.remove('drop-target');
  const record = library.pokemon.find(item => item.id === event.dataTransfer.getData('text/plain'));
  if (record) addPokemon(record, Number(slot.dataset.slot), false);
});
resetCup()})();

