import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()

def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

# 1) HUD: the objective gets its own band between the stats block (left) and the minimap (right), may wrap to two lines,
#    and the boss / progress bar sits under it. On narrow screens the band drops below the stats block.
rep(".obj{position:absolute;left:50%;top:10px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:4px;pointer-events:none;",
    ".obj{position:absolute;left:350px;right:104px;top:10px;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none;text-align:center;")
rep("font-family:var(--display);font-weight:700;font-size:13px;letter-spacing:.14em;text-shadow:0 1px 0 #000;white-space:nowrap}",
    "font-family:var(--display);font-weight:700;font-size:12px;line-height:1.35;letter-spacing:.12em;text-shadow:0 1px 0 #000;white-space:normal}\n"
    ".obj #objT{display:block;max-width:100%;padding:3px 10px;background:rgba(6,14,18,.55);border-radius:3px;overflow-wrap:anywhere}\n"
    "@media (max-width:1000px){.obj{left:10px;right:96px;top:118px}}\n"
    "#wp{position:absolute;left:0;top:0;pointer-events:none;z-index:6;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:3px}\n"
    "#wp .wpm{width:18px;height:18px;border:2px solid #7dffb0;transform:rotate(45deg);box-shadow:0 0 8px #7dffb0aa;background:rgba(125,255,176,.12)}\n"
    "#wp.edge .wpm{width:0;height:0;border:0;border-left:11px solid transparent;border-right:11px solid transparent;border-bottom:20px solid #7dffb0;background:none;box-shadow:none;filter:drop-shadow(0 0 4px #7dffb0)}\n"
    "#wp .wpl{font:700 11px var(--display);letter-spacing:.12em;color:#7dffb0;text-shadow:0 1px 0 #000;white-space:nowrap;background:rgba(6,14,18,.55);padding:1px 6px;border-radius:3px}")
rep('<div class="obj" id="obj" hidden><span id="objT"></span><div class="meter" id="objBar"><i></i></div></div>',
    '<div class="obj" id="obj" hidden><span id="objT"></span><div class="meter" id="objBar"><i></i></div></div>\n  <div id="wp" hidden><div class="wpm"></div><div class="wpl"></div></div>')
rep(".obj .meter{width:clamp(150px,30vw,300px);height:7px}", ".obj .meter{width:min(420px,100%);height:8px}")

# 2) waypoints: one marker for foot and flight; on foot it follows the walkable route and lights the doors on it
WP = r"""
// ---- waypoint: a diamond on the target when it is on screen, an arrow on the screen edge pointing the way when it is not.
// On foot the target is the next bend of the walkable route (breadth-first search over the nav grid from the objective),
// and the doors on that route get lit frames with an arrow over them.
const WP={on:false,P:new T.Vector3(),lab:'',d:0,el:null},_wv=new T.Vector3();
function wpSet(P,lab,d){WP.on=true;WP.P.copy(P);WP.lab=lab;WP.d=d}
function wpDraw(){const el=WP.el||(WP.el=$('wp'));if(!el)return;const show=WP.on&&state==='playing'&&!(INTRO&&INTRO.on)&&!(FC&&FC.on);el.hidden=!show;WP.on=false;if(!show)return;
  const W=stage.clientWidth,H=stage.clientHeight;_wv.copy(WP.P).project(cam);let x=_wv.x,y=_wv.y;const behind=_wv.z>1;if(behind){x=-x;y=-y;if(Math.abs(x)+Math.abs(y)<1e-3)y=-1}
  const inside=!behind&&Math.abs(x)<.9&&Math.abs(y)<.84;el.classList.toggle('edge',!inside);
  if(!inside){const m=Math.max(Math.abs(x)/.9,Math.abs(y)/.84,1e-3);x/=m;y/=m;el.firstChild.style.transform='rotate('+(Math.atan2(x,y))+'rad)'}else el.firstChild.style.transform='';
  el.style.left=Math.max(80,Math.min(W-80,(x*.5+.5)*W))+'px';el.style.top=Math.max(60,Math.min(H-120,(-y*.5+.5)*H))+'px';el.lastChild.textContent=WP.lab+' · '+Math.round(WP.d)+' M'}
const WPR={key:-2,D:null,T:0,P:new T.Vector3(),d:0,doors:[]};let DMK=null;
function wpRoute(tx,tz,lab){if(!NAV)navBuild();let c=navCell(tx,tz);if(c<0)return;
  if(WPR.key!==c){WPR.key=c;const D=WPR.D||(WPR.D=new Int32Array(NX*NZ));D.fill(-1);if(!NAV[c]){const i0=c%NX,j0=(c/NX)|0;let f=-1;for(let r=1;r<5&&f<0;r++)for(let a=-r;a<=r&&f<0;a++)for(let b=-r;b<=r;b++){const i=i0+a,j=j0+b;if(i>=0&&j>=0&&i<NX&&j<NZ&&NAV[j*NX+i]){f=j*NX+i;break}}if(f<0)return;c=f}
    const Q=new Int32Array(NX*NZ);let h=0,t=0;Q[t++]=c;D[c]=0;while(h<t){const k=Q[h++],i=k%NX,d=D[k]+1;
      if(i>0&&NAV[k-1]&&D[k-1]<0){D[k-1]=d;Q[t++]=k-1}if(i<NX-1&&NAV[k+1]&&D[k+1]<0){D[k+1]=d;Q[t++]=k+1}if(k>=NX&&NAV[k-NX]&&D[k-NX]<0){D[k-NX]=d;Q[t++]=k-NX}if(k<NX*(NZ-1)&&NAV[k+NX]&&D[k+NX]<0){D[k+NX]=d;Q[t++]=k+NX}}WPR.T=0}
  WPR.T-=1/30;if(WPR.T<=0){WPR.T=.25;const D=WPR.D;let k=navCell(pos.x,pos.z);
    if(k>=0&&D[k]>=0){const path=[k];for(let n=0;n<60&&D[k]>0;n++){const i=k%NX,j=(k/NX)|0;let best=D[k],nk=-1;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(!a&&!b)continue;const ii=i+a,jj=j+b;if(ii<0||jj<0||ii>=NX||jj>=NZ)continue;const q=jj*NX+ii;if(D[q]<0)continue;if(a&&b&&(!NAV[j*NX+ii]||!NAV[jj*NX+i]))continue;const dd=D[q]+(a&&b?.4:0);if(dd<best){best=dd;nk=q}}if(nk<0)break;k=nk;path.push(k)}
      const cx=q=>-AX+((q%NX)+.5)*NC,cz=q=>-AZ+(((q/NX)|0)+.5)*NC,clear=(q)=>{const x1=cx(q),z1=cz(q),L=Math.hypot(x1-pos.x,z1-pos.z),n=Math.ceil(L/1.2);for(let s2=1;s2<n;s2++){const c2=navCell(pos.x+(x1-pos.x)*s2/n,pos.z+(z1-pos.z)*s2/n);if(c2<0||!NAV[c2])return false}return true};
      let far=path[Math.min(2,path.length-1)];for(let n=path.length-1;n>2;n--){if(clear(path[n])){far=path[n];break}}
      WPR.P.set(cx(far),pos.y+1.4,cz(far));if(D[path[path.length-1]]===0&&clear(path[path.length-1]))WPR.P.set(tx,pos.y+1.4,tz);WPR.d=D[navCell(pos.x,pos.z)]*NC;
      const doors=[];for(const q of path){const x=cx(q),z=cz(q);for(const Dd of DOORV){const dx=Dd.ax==='x'?Dd.c:Dd.dc,dz=Dd.ax==='x'?Dd.dc:Dd.c;if(Math.hypot(dx-x,dz-z)<2.4&&!doors.includes(Dd))doors.push(Dd)}if(doors.length>=3)break}WPR.doors=doors}
    else{WPR.P.set(tx,pos.y+1.4,tz);WPR.d=Math.hypot(tx-pos.x,tz-pos.z);WPR.doors=[]}}
  wpSet(WPR.P,lab,WPR.d);doorMarks(WPR.doors)}
function doorMarks(list){if(!DMK){DMK=[];const m=bas({color:0x7dffb0,transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false,fog:false});
    const ct=paint(64,(g,S)=>{g.clearRect(0,0,S,S);g.fillStyle='#7dffb0';g.beginPath();g.moveTo(S*.2,S*.25);g.lineTo(S*.5,S*.6);g.lineTo(S*.8,S*.25);g.lineTo(S*.8,S*.42);g.lineTo(S*.5,S*.78);g.lineTo(S*.2,S*.42);g.closePath();g.fill()});
    for(let i=0;i<3;i++){const g=new T.Group();for(let k=0;k<6;k++)g.add(new T.Mesh(GEO.box,m));const sp=new T.Sprite(new T.SpriteMaterial({map:ct,transparent:true,depthWrite:false,fog:false,blending:T.AdditiveBlending}));g.add(sp);g.visible=false;scene.add(g);DMK.push(g)}}
  for(let i=0;i<3;i++){const g=DMK[i],Dd=list[i];g.visible=!!Dd;if(!Dd)continue;const w=Dd.dw,h=Dd.dh,x=Dd.ax==='x'?Dd.c:Dd.dc,z=Dd.ax==='x'?Dd.dc:Dd.c,al=Dd.ax==='x';g.position.set(x,0,z);g.rotation.y=al?Math.PI/2:0;
    const C=g.children,sp=C[6];for(let f=0;f<2;f++){const z=f?-.8:.8,[l,r,t]=[C[f*3],C[f*3+1],C[f*3+2]];l.scale.set(.14,h-.3,.14);l.position.set(-w/2+.3,(h-.3)/2,z);r.scale.set(.14,h-.3,.14);r.position.set(w/2-.3,(h-.3)/2,z);t.scale.set(w-.6,.14,.14);t.position.set(0,h-.3,z)}sp.scale.set(1.1,1.1,1);sp.position.set(0,h+.9+Math.sin(time*4+i)*.15,0);
    for(const c of g.children)if(c.material)c.material.opacity=.55+.3*Math.sin(time*5-i)}}
"""
a = s.index("function frame(now){")
s = s[:a] + WP.lstrip('\n') + s[a:]
rep("FAR.position.copy(cam.position);if(composer&&bloomOn){try{composer.render()", "try{wpDraw();if(DMK&&!WPR.live)for(const g of DMK)g.visible=false;WPR.live=false}catch(e){}FAR.position.copy(cam.position);if(composer&&bloomOn){try{composer.render()")
# on foot: route to the campaign target while the objective says GO TO
rep("  beacon.visible=!!go;if(go)beacon.position.set(C.at[0],0,C.at[1]);",
    "  beacon.visible=!!go;if(go){beacon.position.set(C.at[0],0,C.at[1]);try{wpRoute(C.at[0],C.at[1],C.area);WPR.live=true}catch(e){}}")
# flight: the old marker hid itself off screen; the waypoint shows an edge arrow instead
rep("if(S.navP){fv1.copy(S.navP).project(cam);const on=fv1.z<1&&Math.abs(fv1.x)<1.1&&Math.abs(fv1.y)<1.1;nv.hidden=!on;if(on){nv.style.left=((fv1.x*.5+.5)*W)+'px';nv.style.top=((-fv1.y*.5+.5)*H)+'px';nv.firstChild.textContent=S.navL+' '+Math.round(S.navP.distanceTo(S.pos))+' M'}}else nv.hidden=true}",
    "nv.hidden=true;if(S.navP)wpSet(S.navP,S.navL,S.navP.distanceTo(S.pos))}")
# Meridian sortie: point back to Hangar 0 while flying free
rep("  setObj('MERIDIAN · FREE FLIGHT · FLY BACK INTO HANGAR 0 UNDER 70 TO LAND')}",
    "  S.navP=S.navP||new T.Vector3();S.navP.set(O.x,22,O.z+1195);S.navL='HANGAR 0';setObj('MERIDIAN · FREE FLIGHT · FLY BACK INTO HANGAR 0 UNDER 70 TO LAND')}")

# 3) docking: a chain of pulsing green approach gates out from the collar, a bright entrance glow and beam
rep("const ring=new T.Mesh(new T.TorusGeometry(10,.25,6,40),bas({color:0x5ccf6a,transparent:true,opacity:.7,fog:false}));ring.position.set(12,0,34);ring.visible=false;g.add(ring);",
    "const ring=new T.Group();ring.position.set(12,0,34);ring.visible=false;g.add(ring);{const gm=k=>bas({color:0x5cff7a,transparent:true,opacity:.7,fog:false,blending:T.AdditiveBlending,depthWrite:false});"
    "const r0=new T.Mesh(new T.TorusGeometry(10,.45,8,48),gm());ring.add(r0);for(let k=1;k<=4;k++){const r=new T.Mesh(new T.TorusGeometry(10+k*2.5,.3,6,48),gm());r.position.z=k*28;r.userData.k=k;ring.add(r)}"
    "for(let k=0;k<8;k++){const an=k*Math.PI/4,b=new T.Mesh(GEO.box,gm());b.scale.set(1.2,1.2,1.2);b.position.set(Math.cos(an)*10.6,Math.sin(an)*10.6,0);ring.add(b)}"
    "const q=glow(0x7dffb0,30,.75);ring.add(q);const beam=new T.Mesh(GEO.cyl,gm());beam.scale.set(.6,140,.6);beam.rotation.x=Math.PI/2;beam.position.z=70;ring.add(beam)}")
rep("H.ring.visible=S.ph==='dock';if(H.ring.visible)H.ring.material.opacity=.45+.3*Math.sin(S.t*5);",
    "H.ring.visible=S.ph==='dock';if(H.ring.visible)H.ring.children.forEach((c,i)=>{if(c.material&&c.material.opacity!==undefined)c.material.opacity=c.userData.k?.25+.6*Math.max(0,Math.sin(S.t*4-c.userData.k*.9)):.5+.35*Math.sin(S.t*5)});")
# 4) settings: the section headings shared a class name with a floating HUD label (.vh is position:absolute), so they sat on top of the list
rep('#settings .vh{margin:12px 0 4px;', '#settings{width:min(560px,94%)}#settings .vh{position:static;left:auto;right:auto;bottom:auto;text-align:left;text-shadow:none;margin:14px 0 4px;')
# 5) Europa: no red-brown crack lines on the moon (the owner asked to remove them)
rep("   for(const[a,b,k]of[[3.1,1.7,9],[1.3,-2.4,13],[-2.2,0.9,7],[0.4,3.3,11]]){const l=Math.abs(Math.sin((u*a+v*b)*k*6.283/6.283*3+fbm(u*3+a,v*3+b,3)*5));if(l<0.05)c=mix(c,[150,82,58],(0.05-l)/0.05*0.85)}\n","")
# 6) Europa, original icy look: blue-white ice, darker shattered chaos regions, ice ridges and crevasses from ridged noise (no painted lines)
rep("const land=pix(PS,PS,(x,y)=>{const u=x/PS,v=y/PS,h=fbm(u*6+3,v*6+7,5),f=fbm(u*28+1,v*28+5,3);let c=mix([232,228,218],[196,180,156],cl(h*1.4-.35));",
    "const land=pix(PS,PS,(x,y)=>{const u=x/PS,v=y/PS,h=fbm(u*6+3,v*6+7,5),f=fbm(u*28+1,v*28+5,3);let c=mix([238,244,250],[178,198,216],cl(h*1.6-.5));"
    "{const ch=fbm(u*3+11,v*3+2,4);if(ch>.56)c=mix(c,mix([128,148,168],[196,212,226],f),cl((ch-.56)*5))}"
    "{const r=1-Math.abs(fbm(u*9+5,v*9+9,4)*2-1);c=mix(c,[96,128,162],Math.pow(r,16)*.6);const r2=1-Math.abs(fbm(u*31+2,v*31+8,3)*2-1);c=mix(c,[150,182,212],Math.pow(r2,22)*.45);c=mix(c,[255,255,255],Math.pow(r,40)*.3)}")
rep("bas({map:land,color:0x5c6066,fog:false})","bas({map:land,color:0x66717e,fog:false})")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
