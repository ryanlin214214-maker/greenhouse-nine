import sys,glob,os
from PIL import Image
def st(f):
    im=Image.open(f).convert('RGB');w,h=im.size;im=im.crop((int(w*.06),int(h*.09),int(w*.94),int(h*.92))).resize((300,200))
    px=list(im.getdata());n=len(px);wh=sum(1 for r,g,b in px if r>235 and g>235 and b>235)/n*100;lu=sum(.2126*r+.7152*g+.0722*b for r,g,b in px)/n
    return lu,wh
a,b=sys.argv[1],sys.argv[2]
for f in sorted(glob.glob(a+'_*.png')):
    k=f[len(a)+1:];g=b+'_'+k
    if not os.path.exists(g):continue
    l1,w1=st(f);l2,w2=st(g);print('%-14s lum %5.1f -> %5.1f (%+5.1f%%)   near-white %5.2f%% -> %5.2f%%'%(k,l1,l2,(l2/l1-1)*100,w1,w2))
