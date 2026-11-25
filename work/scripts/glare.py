import sys
from PIL import Image
for f in sys.argv[1:]:
    im=Image.open(f).convert('RGB');w,h=im.size;box=(int(w*.06),int(h*.09),int(w*.94),int(h*.92));im=im.crop(box)
    px=list(im.getdata());n=len(px);white=sum(1 for r,g,b in px if r>235 and g>235 and b>235);lum=sum(.2126*r+.7152*g+.0722*b for r,g,b in px)/n
    print(f"{f}: near-white {100*white/n:.2f}%  mean luminance {lum:.0f}")
