import {pixelParts} from './humans.mjs';import {factionColors} from './faction-people.mjs';
/** Preserve accepted base imagery; higher tiers add material-matched buttresses/turrets and heraldry. */
export function baseLevelFrames(Surface,p,frames){const added=[];
 for(const f of frames.filter(f=>f.buildingType==='base'))for(const level of [2,3]){const image=new Surface(128,128);image.data=new Uint8Array(f.image.data);const c=factionColors(p,f.faction,f.owner),colors={...c,cloth:c.team,clothDark:c.team,clothLight:c.teamLight};
 if(f.stage!=='foundation')for(const x of [9,105]){pixelParts.masonry(image,x,66,14,30,colors);image.rect(x,64,14,3,c.goldDark);image.line(x+1,64,x+12,64,c.goldLight);pixelParts.banner(image,x+3,75,8,13,colors);if(level===3){pixelParts.tower(image,x,42,14,24,colors);image.rect(x+5,38,4,8,c.gold);}}
 if(f.stage==='damaged'){image.rect(10,68,6,9,c.ink);image.line(110,50,114,61,c.ink);}if(level===3&&f.stage!=='foundation'){image.rect(57,11,14,4,c.goldDark);image.line(58,11,69,11,c.goldLight);for(const x of [57,63,69])image.rect(x,6,2,6,c.gold);}
 added.push({...f,id:f.id.replace('base-','base-level'+level+'-'),image,x:((frames.length+added.length)%8)*128,y:Math.floor((frames.length+added.length)/8)*128});}
 return added;}
