import {readRGBA} from '../../../scripts/read-rgba-png.mjs';
import {Surface} from '../../../scripts/pixelArt.mjs';
import {reduceSprite} from './sample.mjs';
const sheet=readRGBA(new URL('./resources-205.png',import.meta.url)),cache=new Map();
// Reviewed bounds: the mine's cart extends beyond an equally divided column.
function crop(column,row){
 const bounds=[0,520,1150,sheet.width],x0=bounds[column],x1=bounds[column+1],y0=row*512,y1=y0+512;let left=x1,top=y1,right=-1,bottom=-1;
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(sheet.data[(y*sheet.width+x)*4+3]>=96){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
 if(right<0)throw new Error('Empty resource source');return {sheet,x:left,y:top,width:right-left+1,height:bottom-top+1};
}
export function resourceSprite(kind,width,height,variant=0){
 const key=`${kind}/${width}/${height}/${variant}`;if(cache.has(key))return cache.get(key);
 const column=kind==='tree'||kind==='stump'?0:kind.startsWith('mine')?1:2,row=kind==='stump'||kind==='mine-empty'||kind==='chest-open'?1:0,src=crop(column,row);
 const limit=kind==='stump'?{width:width-6,height:height*.5}:kind.startsWith('mine')?{width:width-6,height:height*.88}:{width:width-4,height:height-4};
 const scale=Math.min(limit.width/src.width,limit.height/src.height),w=Math.round(src.width*scale),h=Math.round(src.height*scale),pixels=reduceSprite(src,w,h),out=new Surface(width,height),left=Math.floor((width-w)/2),top=height-2-h;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+(variant%2?w-1-x:x))*4,j=((top+y)*width+left+x)*4;out.data.set(pixels.subarray(i,i+4),j);}
 cache.set(key,out);return out;
}
