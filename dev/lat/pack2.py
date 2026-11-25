import json,struct,sys,base64
import numpy as np
F='/home/user/greenhouse-nine/assets/models/lattice/files/'
def load(src):
    d=open(src,'rb').read();L=struct.unpack('<I',d[12:16])[0];J=json.loads(d[20:20+L]);boff=20+L;BL=struct.unpack('<I',d[boff:boff+4])[0];BIN=d[boff+8:boff+8+BL]
    A=J['accessors'];BV=J['bufferViews']
    def acc(i):
        a=A[i];v=BV[a['bufferView']];n={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']];dt={5126:np.float32,5125:np.uint32,5123:np.uint16,5121:np.uint8}[a['componentType']]
        o=v.get('byteOffset',0)+a.get('byteOffset',0);arr=np.frombuffer(BIN,dtype=dt,count=a['count']*n,offset=o);return arr.reshape(a['count'],n) if n>1 else arr
    def qmat(q):
        x,y,z,w=q;return np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])
    root=[n for n in J['nodes'] if 'children' in n][0];parts={};P={}
    mats=[m['name'] for m in J['materials']]
    for ni in root['children']:
        n=J['nodes'][ni];t=np.array(n.get('translation',[0,0,0]));R=qmat(n.get('rotation',[0,0,0,1]));s=np.array(n.get('scale',[1,1,1]));nm=n.get('name','');P[nm]=t
        if 'mesh' not in n:continue
        pr=J['meshes'][n['mesh']]['primitives'];assert len(pr)==1;pr=pr[0]
        pos=acc(pr['attributes']['POSITION']).astype(np.float64)*s@R.T+t;idx=acc(pr['indices']).astype(np.uint32)
        parts[nm]=(mats[pr.get('material',0)],pos,idx)
    M=[]
    for m in J['materials']:
        pb=m.get('pbrMetallicRoughness',{});em=m.get('emissiveFactor',[0,0,0]);es=m.get('extensions',{}).get('KHR_materials_emissive_strength',{}).get('emissiveStrength',1)
        M.append({'n':m['name'],'c':[round(v,4) for v in pb.get('baseColorFactor',[1,1,1,1])[:3]],'m':pb.get('metallicFactor',1),'r':pb.get('roughnessFactor',1),'e':[round(v*es,4) for v in em]})
    return parts,P,M
V={k:load(F+f) for k,f in[('reformed','Lattice.glb'),('warden','Lattice_Warden.glb'),('revenant','Lattice_Revenant.glb')]}
base=V['reformed'][0];P=V['reformed'][1]
def same(a,b):return a[0]==b[0] or True if (len(a[1])==len(b[1]) and np.abs(a[1]-b[1]).max()<1e-4) else False
common=[nm for nm in base if all(nm in V[k][0] and len(V[k][0][nm][1])==len(base[nm][1]) and np.abs(V[k][0][nm][1]-base[nm][1]).max()<1e-4 for k in('warden','revenant'))]
print('common',len(common),'of',len(base))
side={}
for sd in 'LR':
    g=lambda k:P[sd+' '+k];dig=[base[n][1] for n in base if n.startswith(sd+' digital')];toe=[base[n][1] for n in base if n.startswith(sd+' toe')]
    side[sd]=dict(hip=g('hip axle'),kn=g('knee bearing'),an=g('ankle bearing'),sh=g('shoulder axle'),el=g('elbow swivel'),hand=np.concatenate(dig).mean(0),toe=np.concatenate(toe).mean(0))
def segd(p,a,b):
    ab=b-a;t=np.clip(((p-a)@ab)/(ab@ab),0,1);return float(np.linalg.norm(p-(a+t*ab)))
def segof(nm,pos):
    c=pos.mean(0)
    if nm[:2] not in('L ','R '):return 'tor'
    S=side[nm[0]];cands={'th':segd(c,S['hip'],S['kn']),'sh':min(segd(c,S['kn'],S['an']),segd(c,S['an'],S['toe'])),'ua':segd(c,S['sh'],S['el']),'fa':segd(c,S['el'],S['hand'])}
    k=min(cands,key=cands.get);low=nm.lower()
    if any(w in low for w in('horn','cheek','brow','auditory','occipital','mandible','respirator','chest','collar','rib','intercostal','pectoral','spinal','vertebr','hip skirt','waist','reactor','keel','crest','feed','furnace','cryo')):k=None
    if any(w in low for w in('pauldron','shoulder','heatsink','fin ','hook')):k='ua'
    return k+nm[0] if k and cands[k]<1.25 else 'tor'
allp=np.concatenate([p for _,p,_ in base.values()]+[p for k in('warden','revenant') for _,p,_ in V[k][0].values()]);mn=allp.min(0)-.01;mx=allp.max(0)+.01;sc=(mx-mn)/65535
blob=bytearray()
def pack(partlist):
    by={}
    for nm,(mat,pos,idx) in partlist:by.setdefault((segof(nm,pos),mat),[]).append((pos,idx))
    out=[]
    for (seg,mat),L2 in by.items():
        pos=np.concatenate([q[0] for q in L2]);ids=[];o=0
        for q in L2:ids.append(q[1]+o);o+=len(q[0])
        ids=np.concatenate(ids);vq=np.round((pos-mn)/sc).astype(np.uint16);it=np.uint16 if len(pos)<65536 else np.uint32
        while len(blob)%4:blob.append(0)
        g={'s':seg,'m':mat,'v':len(pos),'i':len(ids),'o':len(blob),'w':4 if it==np.uint32 else 2};blob.extend(vq.tobytes())
        while len(blob)%4:blob.append(0)
        g['oi']=len(blob);blob.extend(ids.astype(it).tobytes());out.append(g)
    return out
head={'mn':mn.tolist(),'sc':sc.tolist(),'piv':{},'common':pack([(n,base[n]) for n in common]),'own':{},'mats':{}}
for sd in 'LR':
    S=side[sd];head['piv'].update({'th'+sd:S['hip'].round(4).tolist(),'sh'+sd:S['kn'].round(4).tolist(),'ua'+sd:S['sh'].round(4).tolist(),'fa'+sd:S['el'].round(4).tolist()})
for k in V:
    parts=V[k][0];own=[(n,parts[n]) for n in parts if n not in common];head['own'][k]=pack(own);head['mats'][k]=V[k][2];print(k,'own parts',len(own))
open('lat.bin','wb').write(bytes(blob));open('lat.json','w').write(json.dumps(head,separators=(',',':')))
print('bytes',len(blob),'b64',len(base64.b64encode(bytes(blob))),'json',len(json.dumps(head)))
print([ (g['s'],g['m'][:8],g['v']) for g in head['own']['warden']][:20])
