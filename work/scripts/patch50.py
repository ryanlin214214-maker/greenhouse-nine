p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep("function walkerRig(g,v){","""// two-bone arm solver: finds shoulder (x, z) and elbow (x) angles that put the hand on a target point, in the torso's space
const IKC={},GX=.17,GY=.30,UL=.384,FL=.40;
// where each gun sits (z = how far in front of the chest) and where the hands grip it: r = right hand, l = left hand (null = left arm keeps its other job)
const GH={d:{gz:.56,r:[0,-.14,.06],l:[0,-.07,-.06]},1:{gz:.43,r:[0,-.15,.04],l:null},3:{gz:.65,r:[0,-.07,-.05],l:[0,-.07,-.12]},4:{gz:.56,r:[0,-.14,.06],l:null},6:{gz:.45,r:[0,-.08,-.1],l:[0,-.1,.1]},8:{gz:.43,r:[0,-.14,.06],l:[0,-.08,.08]}};
function ikArm(S,T){const fk=a=>{const[ax,az,ex]=a,cz=Math.cos(az),sz=Math.sin(az),cx=Math.cos(ax),sx=Math.sin(ax),py=-UL-FL*Math.cos(ex),pz=-FL*Math.sin(ex),x1=-py*sz,y1=py*cz;return[S[0]+x1,S[1]+y1*cx-pz*sx,S[2]+y1*sx+pz*cx]};
  const clampA=a=>{a[2]=Math.min(-.05,Math.max(-2.6,a[2]));a[1]=Math.min(1.1,Math.max(-1.1,a[1]));return a},err=a=>{const q=fk(a);return(q[0]-T[0])**2+(q[1]-T[1])**2+(q[2]-T[2])**2};
  let best=null,be=1e9;for(const st0 of[[-1.2,-.4,-.6],[-.8,.2,-1],[-1.4,.4,-1.2],[-.5,-.3,-.4],[-1.6,0,-.2],[-1,.6,-1.6]]){let a=clampA(st0.slice()),e=err(a),st=.5;for(let it=0;it<220;it++){let imp=false;for(let i=0;i<3;i++)for(const d of[st,-st]){const b=a.slice();b[i]+=d;clampA(b);const eb=err(b);if(eb<e){a=b;e=eb;imp=true}}if(!imp)st*=.6;if(st<1e-4)break}if(e<be){be=e;best=a}}
  return{a:best,e:Math.sqrt(be)}}
function walkerRig(g,v){""")
# longer arms (about 20%) so both hands can reach a gun held in front of the chest
rep("put(sh,n+'UA',a=>{a(GEO.box,A1,.17,.34,.19,0,-.15,0);a(GEO.box,A2,.19,.06,.21,0,-.3,0)});\n    const el=J(sh,0,-.32,0);","put(sh,n+'UA',a=>{a(GEO.box,A1,.17,.41,.19,0,-.18,0);a(GEO.box,A2,.19,.06,.21,0,-.36,0)});\n    const el=J(sh,0,-.384,0);")
rep("a(GEO.box,A2,.15,.3,.17,0,-.14,0);a(GEO.box,A2,.13,.12,.15,0,-.33,.02);","a(GEO.box,A2,.15,.36,.17,0,-.17,0);a(GEO.box,A2,.13,.12,.15,0,-.40,.02);")
rep("a(GEO.cone,AM,.035,.55,.035,0,-.62,.05,Math.PI,0,0)","a(GEO.cone,AM,.035,.55,.035,0,-.7,.05,Math.PI,0,0)")
# the gun sits in front of the body, and each arm is solved onto its grip
rep("gun=J(tor,.14,.22,.22);put(gun,n+'G',a=>{","gun=J(tor,GX,GY,(GH[v]||GH.d).gz);put(gun,n+'G',a=>{")
rep("  const legs=[];for(const s of[-1,1]){const hip=J(root,s*.15,-.16,0);put(hip,n+'Th'","""  let HR=null,HL=null,GZ=.56;if(gun){const G=GH[v]||GH.d;GZ=G.gz;let c=IKC[v];if(!c){c={HR:ikArm([.4,.5,0],[GX+G.r[0],GY+G.r[1],G.gz+G.r[2]]),HL:G.l?ikArm([-.4,.5,0],[GX+G.l[0],GY+G.l[1],G.gz+G.l[2]]):null};IKC[v]=c}HR=c.HR.a;HL=c.HL?c.HL.a:null}
  const legs=[];for(const s of[-1,1]){const hip=J(root,s*.15,-.16,0);put(hip,n+'Th'""")
rep("arms[1][0].rotation.set(-.55-k*.3,0,-.45);arms[1][1].rotation.x=-.9+k*.2;arms[0][0].rotation.set(-1.15-k*.2,0,.7);arms[0][1].rotation.x=-.55;gun.position.z=.22-k*.08;gun.rotation.x=-k*.15}","""arms[1][0].rotation.set(HR[0]-k*.1,0,HR[1]);arms[1][1].rotation.x=HR[2]+k*.1;
      if(HL){arms[0][0].rotation.set(HL[0]-k*.1,0,HL[1]);arms[0][1].rotation.x=HL[2]+k*.1}else{arms[0][0].rotation.set(-1.15-k*.2,0,.7);arms[0][1].rotation.x=-.55}
      gun.position.z=GZ-k*.05;gun.rotation.x=-k*.1}""")
rep("pbSword.position.set(0,-.38,.02)","pbSword.position.set(0,-.44,.02)")
open(p,'w').write(s);print('ok')
