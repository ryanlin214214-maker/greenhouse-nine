// Hangar 0 display (v93): six ships on pads sized to them, nose to the mouth, the centre launch lane (x ±12) kept clear
const PAD93={swiftwing:[-26,1160],lancer:[26,1160],wisp:[-62,1140],arclight:[62,1140],halberd:[-58,1180],bastion:[58,1180]};
function hubMyShip(){const D=HUB.g&&HUB.g.children[1];if(!D)return;if(HUB.myShip)D.remove(HUB.myShip);const sh=shipModel(WAL.ship);sh.position.set(-50,(sh.userData.gy||2.05)+.065,1103);sh.rotation.y=Math.PI*.82;try{shuttleAnim(sh,0,0,0,99,1,true,10)}catch(_){}D.add(sh);HUB.myShip=sh}
// shipwright comparison: speed, agility, protection, firepower as bars, plus role, strengths and weaknesses
function shipRate(S2){const sp={mac:.6,torp:1,vent:.9,flak:.6,dash:.2,ew:.35}[S2.spec]||.5,dps=S2.prim==='ion'?22:S2.gunDmg/S2.gunCd;
  return[['SPEED',S2.boost/305],['AGILITY',Math.min(1,S2.turn/2.45*.6+(S2.acc||.75)/1.35*.4)],['PROTECTION',(S2.shield+(S2.hull||100))/460],['FIREPOWER',Math.min(1,dps/30*.55+(S2.msl||0)/10*.15+sp*.3)]]}
function shipCard(id,i){const S2=SHIPS[id],col=ROLEC[id]||'#dcebe4',st=WAL.ship===id?'use':WAL.ships.includes(id)?'own':'';
  const bars=shipRate(S2).map(([n,v])=>'<div style="display:flex;align-items:center;gap:6px;font-size:10px;letter-spacing:.08em"><span style="width:78px">'+n+'</span><span style="flex:1;height:5px;background:#ffffff1a"><i style="display:block;height:100%;width:'+Math.round(v*100)+'%;background:'+col+'"></i></span></div>').join('');
  const key={mac:'F · heavy cannon',torp:'F · arm and release a torpedo',vent:'Hold fire · charge the ion cannon · F vents heat',flak:'F · flak burst',dash:'F · dash',ew:'F · EW pulse · R · decoys'}[S2.spec];
  return'<div class="card" style="--rc:'+col+'"><b>'+S2.n+'</b><span style="color:'+col+';font-size:11px;letter-spacing:.12em">'+S2.role.toUpperCase()+'</span><br>'+S2.d+'<div style="margin:6px 0">'+bars+'</div>'+
    '<span style="font-size:11px">'+Math.round(S2.cruise*MPH)+' mph cruise · '+Math.round(S2.boost*MPH)+' boost · shield '+S2.shield+' · hull '+(S2.hull||100)+(S2.msl?' · '+S2.msl+' missiles':'')+(S2.torp?' · '+S2.torp+' torpedoes':'')+'<br>'+key+'</span>'+
    '<div style="font-size:11px;margin-top:4px">'+(S2.pro||[]).map(p=>'<span style="color:#9fe39a">+ '+p+'</span>').join('<br>')+'<br>'+(S2.con||[]).map(p=>'<span style="color:#ff9a8a">− '+p+'</span>').join('<br>')+'</div>'+
    '<button type="button" data-b="'+i+'">'+(st==='use'?'IN USE':st==='own'?'FLY THIS SHIP':'BUY · '+S2.price.toLocaleString()+' CR')+'</button></div>'}
