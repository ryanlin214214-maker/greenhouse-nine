import json,struct,sys
for f in sys.argv[1:]:
  b=open(f,'rb').read();jl=struct.unpack('<I',b[12:16])[0];j=json.loads(b[20:20+jl])
  tri=0;attrs=set();mn=[1e9]*3;mx=[-1e9]*3
  for me in j['meshes']:
    for p in me['primitives']:
      a=j['accessors'][p['indices']]['count'] if 'indices' in p else j['accessors'][p['attributes']['POSITION']]['count'];tri+=a//3;attrs|=set(p['attributes'])
  # world bounds through node transforms are skipped; report node count and scene structure
  nodes=j.get('nodes',[])
  names=[n.get('name','') for n in nodes]
  mats=j.get('materials',[])
  print('==',f.split('/')[-1],'| nodes',len(nodes),'meshes',len(j['meshes']),'triangles',tri,'| materials',len(mats),'| textures',len(j.get('textures',[])),'images',len(j.get('images',[])),'| attrs',sorted(attrs),'| ext',j.get('extensionsUsed'))
  print('   materials:',', '.join(m.get('name','?')+('*' if m.get('emissiveFactor') and any(m['emissiveFactor']) else '') for m in mats))
  import collections
  pre=collections.Counter(n.split('.')[0].split('_')[0] for n in names)
  print('   part names (first 40):',', '.join(names[:40]))
