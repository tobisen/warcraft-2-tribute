/** Alpha-weighted area reduction keeps thin equipment and material shading at native size. */
export function reduceSprite(source,width,height){
 const out=new Uint8ClampedArray(width*height*4),sx=source.width/width,sy=source.height/height;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const x0=x*sx,x1=(x+1)*sx,y0=y*sy,y1=(y+1)*sy;let alpha=0,r=0,g=0,b=0;
  for(let yy=Math.floor(y0);yy<Math.ceil(y1);yy++)for(let xx=Math.floor(x0);xx<Math.ceil(x1);xx++){
   const area=(Math.min(x1,xx+1)-Math.max(x0,xx))*(Math.min(y1,yy+1)-Math.max(y0,yy)),i=((source.y+yy)*source.sheet.width+source.x+xx)*4,a=source.sheet.data[i+3]/255*area;
   alpha+=a;r+=source.sheet.data[i]*a;g+=source.sheet.data[i+1]*a;b+=source.sheet.data[i+2]*a;
  }
  const i=(y*width+x)*4,coverage=alpha/(sx*sy);if(coverage<.35)continue;
  out.set([r/alpha,g/alpha,b/alpha,Math.min(255,coverage*320)],i);
 }
 return out;
}
