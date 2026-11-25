import sys
from PIL import Image
names=sys.argv[2:];tiles=[]
for n in names:
    im=Image.open(n+'.png').convert('RGB');w,h=im.size;tiles.append(im.crop((int(w*.06),int(h*.09),int(w*.94),int(h*.93))).resize((640,380)))
rows=(len(tiles)+1)//2;sheet=Image.new('RGB',(1280,rows*380))
for i,t in enumerate(tiles):sheet.paste(t,((i%2)*640,(i//2)*380))
sheet.save(sys.argv[1])
