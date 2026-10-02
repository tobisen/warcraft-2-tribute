import { deflateSync } from 'node:zlib';
/** Original integer-pixel brushes. No raster imports or runtime map generation. */
export class Surface {
 constructor(width,height){this.width=width;this.height=height;this.data=new Uint8Array(width*height*4);}
 pixel(x,y,color){x=Math.floor(x);y=Math.floor(y);if(x<0||y<0||x>=this.width||y>=this.height)return;const c=color.replace('#',''),i=(y*this.width+x)*4;this.data[i]=parseInt(c.slice(0,2),16);this.data[i+1]=parseInt(c.slice(2,4),16);this.data[i+2]=parseInt(c.slice(4,6),16);this.data[i+3]=255;}
 rect(x,y,w,h,color){for(let row=Math.floor(y);row<y+h;row++)for(let col=Math.floor(x);col<x+w;col++)this.pixel(col,row,color);}
 ellipse(x,y,rx,ry,color){for(let row=Math.floor(y-ry);row<=y+ry;row++)for(let col=Math.floor(x-rx);col<=x+rx;col++)if(((col-x)/rx)**2+((row-y)/ry)**2<=1)this.pixel(col,row,color);}
 line(x1,y1,x2,y2,color){const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));for(let i=0;i<=steps;i++)this.pixel(x1+(x2-x1)*i/(steps||1),y1+(y2-y1)*i/(steps||1),color);}
 polygon(points,color){const minY=Math.min(...points.map(p=>p[1])),maxY=Math.max(...points.map(p=>p[1]));for(let y=minY;y<=maxY;y++){const xs=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if(a[1]<=y&&b[1]>y||b[1]<=y&&a[1]>y)xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let n=0;n<xs.length;n+=2)for(let x=Math.ceil(xs[n]);x<xs[n+1];x++)this.pixel(x,y,color);}}
 blit(source,x,y){for(let row=0;row<source.height;row++)for(let col=0;col<source.width;col++){const a=(row*source.width+col)*4,b=((row+y)*this.width+col+x)*4;if(source.data[a+3])this.data.set(source.data.subarray(a,a+4),b);}}
}
const crcTable=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
const crc32=data=>{let n=0xffffffff;for(const b of data)n=crcTable[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0;};
export function png(surface){
 const chunk=(name,data)=>{const type=Buffer.from(name),length=Buffer.alloc(4),crc=Buffer.alloc(4);length.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([type,data])));return Buffer.concat([length,type,data,crc]);};
 const header=Buffer.alloc(13);header.writeUInt32BE(surface.width,0);header.writeUInt32BE(surface.height,4);header[8]=8;header[9]=6;
 const raw=Buffer.alloc((surface.width*4+1)*surface.height);for(let y=0;y<surface.height;y++)raw.set(surface.data.subarray(y*surface.width*4,(y+1)*surface.width*4),y*(surface.width*4+1)+1);
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);
}
