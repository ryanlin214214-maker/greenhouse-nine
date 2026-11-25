// v93 cutscenes: every shot's actors are built and their shaders compiled when the sequence starts (behind the title card),
// so nothing is created mid-shot; actors are shown and hidden per shot. Walkers plant their feet (walkerRig `plant`) and
// stride at a rate matched to how fast they move, so feet neither sink nor skate.
function introActor(type,x,y,z,list){const m=model(type);m.g.position.set(x,y,z);scene.add(m.g);m.g.visible=false;const gl=glow(0xff3030,type>=5?1.3:1.8,.01);gl.position.y=type>=5?1.55:0;m.g.add(gl);
  m.g.scale.setScalar(type>=5?1.15:2.2);(list||INTRO.actors).push({type,pos:m.g.position,g:m.g,rig:m.rig,parts:m.parts,wings:m.wings,gl,ph:Math.random()*6,mv:1,kick:0,ch:0,lunge:0,vy:0,dying:0,flash:0,burst:0,bt:0,ft:0,cd:1,spd:3,side:1,hp:1,aim:m.rig&&m.rig.aim,x0:x,y0:y,z0:z,r:type>=5?y:undefined})}
function introBuild(q){const L=[];
  if(q.act==='board'||q.act==='launch'){const g=shuttleModel();g.position.set(0,2.2,205);g.rotation.set(0,Math.PI,0);scene.add(g);g.visible=false;L.push({g,pos:g.position,shuttle:true})}
  if(q.act==='board'){const g=new T.Group(),rg=humanize(walkerRig(g,8),{key:'r',panel:std({color:0x3f9a58,roughness:.5,metalness:.15}),helm:2,visor:0x46d6a0,leaf:true,cy:[2,0]});if(rg.segs.gun)rg.segs.gun.visible=false;g.position.set(-5.5,.95,193);scene.add(g);g.visible=false;L.push({g,pos:g.position,rig:rg,mv:1,vy:0,kick:0,ph:0,crouch:0,jet:0,burst:0,ch:0,ft:0,rowan:true,r:.95})}
  if(q.act==='drones')for(const[ty,x,y,z]of[[0,26.7,13.1,6.3],[0,22.9,11.1,10.1],[1,22.2,12.4,6.6],[0,21.7,13.8,2.6],[1,17.3,10.3,8.3],[0,16.9,12.5,3.7],[0,26.9,11.6,3.1],[0,14.1,11.9,5.2],[0,27,12.6,12]])introActor(ty,x,y,z,L);
  if(q.act==='march')for(const[ty,x,z]of[[5,-1.1,-68.9],[5,1.2,-71.4],[6,0,-75],[7,-2.4,-78],[10,2.4,-80],[5,-1.1,-83],[5,1.4,-86]])introActor(ty,x,ER[ty]*1.15+groundAt(x,z,2),z,L);
  return L}
function introPre(){introDrop();INTRO.pre=INTRO.shots.map(introBuild);
  // compile every material the sequence will draw now, while the title card is up, instead of on first sight mid-shot
  try{for(const L of INTRO.pre)for(const a of L)a.g.visible=true;renderer.compile(scene,cam);for(const L of INTRO.pre)for(const a of L)a.g.visible=false}catch(e){}}
function introDrop(){if(INTRO.pre)for(const L of INTRO.pre)for(const a of L)scene.remove(a.g);INTRO.pre=null;INTRO.actors=[]}
function introClear(){for(const a of INTRO.actors)a.g.visible=false;INTRO.actors=[]}
function introEnd(){if(!INTRO.on)return;INTRO.on=false;voiceStop();introClear();introDrop();introShow(false);if(INTRO.after){const f=INTRO.after;INTRO.after=null;f()}else for(const[k,t]of STORY.intro)comm(k,t)}
function introTick(dt){const S=INTRO.shots;INTRO.grace-=dt;if(!INTRO.pre)introPre();
  {let t0=INTRO.t,i0=0;while(i0<S.length&&t0>=S[i0].d){t0-=S[i0].d;i0++}if(!(i0<S.length&&S[i0].text&&VOICE.on&&VOICE.busy&&i0===INTRO.i&&S[i0].d-t0<.72))INTRO.t+=Math.min(dt,1/20)}
  let t=INTRO.t,i=0;while(i<S.length&&t>=S[i].d){t-=S[i].d;i++}if(i>=S.length){introEnd();return}
  const q=S[i],u=t/q.d,e=u*u*(3-2*u),L=(a,b)=>a+(b-a)*e;if(i!==INTRO.i){INTRO.i=i;$('cineText').textContent=q.text;introClear();if(q.text)speak(q.text,q.k||'N');else voiceStop();
    INTRO.actors=INTRO.pre[i]||[];for(const a of INTRO.actors)a.g.visible=true}
