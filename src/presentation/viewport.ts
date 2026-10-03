/** Camera remains at 1:1 world pixels; surplus window area frames the finite map. */
export function viewportGeometry(width:number,height:number,map:{width:number;height:number}){
 const canvas={width:Math.max(1,Math.floor(width)),height:Math.max(1,Math.floor(height))};
 const camera={width:Math.min(canvas.width,map.width),height:Math.min(canvas.height,map.height)};
 return {canvas,camera:{...camera,x:Math.floor((canvas.width-camera.width)/2),y:Math.floor((canvas.height-camera.height)/2)}};
}
