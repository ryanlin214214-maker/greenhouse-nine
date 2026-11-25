s=open('hub82.js').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]);s=s.replace(a,b)
# dim light materials: lamps read as light without big flat white slabs that bloom
rep("lt=bas({color:0xffe2b0}),lw=bas({color:0xf2f6ff}),","lt=bas({color:0xffe2b0}),lw=bas({color:0xf2f6ff}),lwD=bas({color:0x5e6a76}),cyD=bas({color:0x2a7088}),amD=bas({color:0x9a5a24}),afl=P({color:0x22272c,roughness:.28,metalness:.6},['plates',{rep:1,ns:.45}]),")
rep("const UVM=new Set([iv,iv2,gd,st,st2,dk,dk2,gm,dfl,hfM,ofl]);","const UVM=new Set([iv,iv2,gd,st,st2,dk,dk2,gm,dfl,hfM,ofl,afl]);")
# hangar ceiling panels: dimmer
rep("A(gm,12,.5,4,x,63.4,z);A(lw,11,.1,3,x,63.1,z)","A(gm,12,.5,4,x,63.4,z);A(lwD,11,.1,3,x,63.1,z)")
# armoury floor: dark polished plate tiles with seams, a gold inlay border and a red runner (was flat diamond plate)
rep("A(dfl,49,.04,86,-37.5,.02,1029);","A(afl,49,.04,86,-37.5,.02,1029);for(let x=-60;x<-14;x+=3)A(dk2,.05,.012,86,x,.045,1029);for(let z=988;z<1072;z+=3)A(dk2,49,.012,.05,-37.5,.045,z);"
    "for(const x of[-61.2,-13.8])A(gd,.25,.014,84,x,.05,1029);for(const z of[987.6,1071.4])A(gd,47,.014,.25,-37.5,.05,z);A(rd,4,.016,60,-37.5,.052,1035);for(const s of[-1,1])A(gd,.12,.018,60,-37.5+s*2.1,.054,1035);")
rep("A(lw,5.6,.1,1.6,x,29.35,z)","A(lwD,5.6,.1,1.6,x,29.35,z)")
# gun wall: dark lit-by-lamps backing per bay, a thin warm strip under each gun instead of white bars
rep("A(bk,2.55,1.9,.05,-59.2+c*2.8,2.47+r*2.15,1071.75);A((c+r)%4?lw:am,2.4,.04,.05,-59.2+c*2.8,1.56+r*2.15,1071.6);",
    "A(dk,2.55,1.9,.05,-59.2+c*2.8,2.47+r*2.15,1071.75);A(gm,2.5,.08,.25,-59.2+c*2.8,1.62+r*2.15,1071.6);A((c+r)%4?amD:cyD,2.2,.02,.03,-59.2+c*2.8,1.58+r*2.15,1071.46);")
# workbench: a pegboard with tools instead of a white panel
rep("A(lw,.1,2,6,-61.6,2.4,1056);","A(dk,.1,2,6,-61.6,2.4,1056);for(let k=0;k<7;k++)A(k%3?gm:hz,.06,.25+(k%3)*.18,.1,-61.5,2.5,1053.4+k*.85);A(amD,.05,.03,5.6,-61.5,3.45,1056);")
# test range lanes: thin edge lines, not 18 m white strips
rep("A(lw,4.6,.05,18,x,.12,999)","for(const o of[-2.3,2.3])A(hz,.1,.02,18,x+o,.1,999)")
# outfitter floor: stone tiles with gold inlay seams and a blue runner (no glowing cyan lines)
rep("for(let z=990;z<1072;z+=6)A(cy,48,.02,.06,37.5,.045,z);","for(let z=990;z<1072;z+=6)A(gd,48,.012,.06,37.5,.045,z);for(let x=19;x<60;x+=6)A(gd,.06,.012,84,x,.045,1029);A(nv,4,.016,60,37.5,.052,1035);for(const s of[-1,1])A(gd,.12,.018,60,37.5+s*2.1,.054,1035);")
rep("for(let x=18;x<60;x+=8)A(lw,5,.1,1.2,x,31.5,1030);","for(let x=18;x<60;x+=8)A(lwD,5,.1,1.2,x,31.5,1030);")
rep("a(GEO.tor,lw,5,5,.6,x,15,z,1.571,0,0);","a(GEO.tor,gd,5,5,.6,x,15,z,1.571,0,0);a(GEO.tor,amD,4.7,4.7,.3,x,14.9,z,1.571,0,0);")
# helmet wall: dark backboard with a gold frame and a thin warm strip under each shelf (was a 13 x 4.6 m white slab)
rep("for(const y of[2.1,4.1])A(gm,13,.15,1.1,25,y,987.6);A(lw,13,4.6,.05,25,3.3,987.1);",
    "for(const y of[2.1,4.1]){A(gm,13,.15,1.1,25,y,987.6);A(amD,12.6,.03,.03,25,y-.1,988.12)}A(dk2,13.6,5,.1,25,3.3,987.1);for(const y of[.8,5.8])A(gd,14,.18,.2,25,y,987.2);for(const x of[18.1,31.9])A(gd,.18,5.2,.2,x,3.3,987.2);")
open('hub82.js','w').write(s);print('ok')
