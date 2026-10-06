import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {Surface} from './pixelArt.mjs';
/** Minimal lossless decoder for our 8-bit RGB/RGBA non-interlaced source sheets. */
export function readRGBA(path){
 const bytes=readFileSync(path),width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20),type=bytes[25],channels=type===6?4:3;
 if(bytes[24]!==8||![2,6].includes(type)||bytes[28]!==0)throw new Error(`Unsupported PNG: ${path}`);
 const chunks=[];for(let at=8;at<bytes.length;){const size=bytes.readUInt32BE(at);if(bytes.subarray(at+4,at+8).toString()==='IDAT')chunks.push(bytes.subarray(at+8,at+8+size));at+=size+12;}
 const raw=inflateSync(Buffer.concat(chunks)),stride=width*channels,data=new Uint8Array(stride*height),out=new Surface(width,height);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){const filter=raw[y*(stride+1)];if(filter>4)throw new Error('Invalid PNG filter');for(let x=0;x<stride;x++){const i=y*stride+x,a=x>=channels?data[i-channels]:0,b=y?data[i-stride]:0,c=y&&x>=channels?data[i-stride-channels]:0;data[i]=(raw[y*(stride+1)+1+x]+(filter===0?0:filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):paeth(a,b,c)))&255;}}
 for(let i=0;i<width*height;i++){out.data.set(data.subarray(i*channels,i*channels+3),i*4);out.data[i*4+3]=channels===4?data[i*channels+3]:255;}
 return out;
}
