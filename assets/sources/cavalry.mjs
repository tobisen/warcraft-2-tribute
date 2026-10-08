/** Original repository-authored mounted pixel sprites and stable structures. CC0. */
export function cavalryFrames(Surface){const frames=[],races=['crown','clans','elves','dwarves','goblins'],dirs=['e','se','s','sw','w','nw','n','ne'];
for(const [r,race] of races.entries())for(const owner of ['player','enemy']){
 const team=owner==='player'?'#659bbb':'#bb6761',coat=['#99754e','#878b88','#b09260','#c1b8a0','#765343'][r],prefix=r===0?'':race+'-';
 for(const [d,dir] of dirs.entries())for(const state of ['idle','walk','attack','death'])for(let f=0;f<(state==='idle'?1:4);f++){
 const s=new Surface(64,64),a=d*Math.PI/4,dx=Math.cos(a),dy=Math.sin(a),stride=state==='walk'?[0,3,0,-3][f]:0,dead=state==='death',y=dead?49:40;
 s.ellipse(32,51,24,5,'#29352d');s.ellipse(32,y,19,9,'#252c2a');s.ellipse(32,y-1,17,8,coat);
 for(const x of [-12,12]){s.rect(32+x+stride/2,y+3,4,10,coat);s.rect(32+x+stride/2,y+12,5,2,'#303132');}
 const hx=Math.round(32+dx*18),hy=Math.round(y+dy*5-8);s.ellipse(hx,hy,7,7,coat);s.rect(hx-2,hy-9,3,5,coat);s.pixel(hx+Math.sign(dx)*4,hy-2,'#141d20');
 if(r===1){s.line(hx+4,hy+2,hx+9,hy+3,'#ded6b6');s.line(hx-4,hy+2,hx-9,hy+3,'#ded6b6');}if(r===2){s.line(hx-3,hy-4,hx-9,hy-16,'#dec890');s.line(hx+3,hy-4,hx+9,hy-16,'#dec890');s.line(hx-7,hy-11,hx-13,hy-13,'#dec890');}if(r===3){s.ellipse(hx-5,hy-4,5,5,'#d8bb76');s.ellipse(hx-5,hy-4,2,2,'#756a53');}if(r===4){s.rect(hx-4,hy+4,8,4,'#af9483');s.line(hx+4,hy+4,hx+8,hy,'#e6d9b0');}
 s.rect(23,y-7,18,6,team);if(!dead){s.rect(27,20,10,17,'#303a41');s.rect(29,20,7,15,team);s.ellipse(32,15,6,6,r===1?'#79976c':r===4?'#93a36b':'#d7b993');s.rect(26,8,12,5,r===2?'#60916d':'#abb7b9');s.rect(28,35,4,7,'#273334');const swing=state==='attack'?[0,5,9,2][f]:0;s.line(37,26,47+swing,11,'#d4dcdc');s.line(36,27,40,30,'#ceb265');}
 frames.push({id:`${prefix}cavalry-${owner}-${dir}-${state}-${f}`,image:s});
 }
 for(const stage of ['foundation','building','complete','damaged']){const s=new Surface(96,96);s.ellipse(48,75,37,9,'#29352d');s.rect(16,42,64,32,'#544b3c');s.rect(19,43,58,29,['#9e855f','#795b49','#759070','#8b949a','#89694b'][r]);s.rect(20,72,57,4,'#3b4542');s.rect(33,51,22,21,'#252e29');s.rect(34,52,4,20,'#bc9970');s.rect(54,52,4,20,'#bc9970');s.rect(61,49,11,8,'#273b35');s.polygon([[10,43],[48,18],[86,43]],'#303b3d');s.polygon([[14,40],[48,21],[82,40]],['#887a63','#8b4e3c','#4e7954','#778593','#8c743f'][r]);s.rect(43,27,9,13,team);s.ellipse(45,52,6,5,coat);s.rect(50,47,4,8,coat);s.line(47,60,47,70,'#c6b48f');s.line(63,69,80,69,'#c6b48f');for(const x of [63,70,80])s.rect(x,63,2,12,'#c6b48f');
 if(stage==='foundation'){s.rect(10,16,76,40,'#39443b');s.rect(16,20,64,34,'#84715a');}if(stage==='building'){for(const x of [14,79])s.rect(x,29,3,46,'#be996d');s.rect(13,42,70,3,'#be996d');}if(stage==='damaged'){s.line(62,42,56,50,'#272c2a');s.line(56,50,61,61,'#272c2a');}
 frames.push({id:`${prefix}stable-${owner}-${stage}`,image:s});}
}return frames;}
