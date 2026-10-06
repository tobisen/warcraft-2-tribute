/** Tight opaque bounds avoid shrinking portraits around an atlas cell's empty padding. */
export function spriteCrop(data:Uint8ClampedArray,width:number,height:number){
 let left=width,top=height,right=-1,bottom=-1;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(data[(y*width+x)*4+3]>=96){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
 return right<0?{x:0,y:0,width,height}:{x:left,y:top,width:right-left+1,height:bottom-top+1};
}
