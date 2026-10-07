import {createClassicMatch} from './testHelpers/classicMatch';
import {it,expect} from 'vitest';
import {createMatch} from './match';
import {encodeSave,decodeSave} from './save';
import {mapResources} from '../config/maps';
import {resourceNodes} from './gathering';
import {matchStats} from './matchStats';
const view={camera:{x:0,y:0},building:null};
function legacyDocument(m:ReturnType<typeof createMatch>){
 const doc=JSON.parse(encodeSave(m,view)),resources=mapResources(m.map.id!,m.map.resourceLayout,m.map.worldLayout,m.map.design);
 delete doc.state.gathering.expandedGoldStock;
 for(const n of [doc.state.gathering.gold,...doc.state.gathering.extraNodes])if(n.resource==='gold')n.remaining-=resources.find(r=>r.id===n.id)!.amount*.9;
 for(const n of doc.state.enemyKnowledge?.nodes??[])if(n.resource==='gold')n.remaining-=resources.find(r=>r.id===n.id)!.amount*.9;
 return doc;
}
it('adds extra unextracted stock to every legacy mine, including depleted mines, exactly once',()=>{
 const m=createMatch('skirmish','normal',undefined,'coast'),doc=legacyDocument(m),oldPrimary=m.gathering.gold!.remaining/10;
 doc.state.gathering.gold.remaining=0;doc.state.gathering.goldBalance+=oldPrimary;
 const loaded=decodeSave(JSON.stringify(doc));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(!loaded.ok)throw Error(loaded.error);
 expect(loaded.match.gathering.gold!.remaining).toBe(oldPrimary*9);expect(loaded.match.gathering.expandedGoldStock).toBe(true);
 expect(matchStats(loaded.match).player.gold).toEqual({gathered:oldPrimary,delivered:oldPrimary,spent:0});
 expect(resourceNodes(loaded.match.gathering).filter(n=>n.resource==='gold'&&n.id!=='gold-1').map(n=>n.remaining)).toEqual(resourceNodes(m.gathering).filter(n=>n.resource==='gold'&&n.id!=='gold-1').map(n=>n.remaining));
 const again=decodeSave(encodeSave(loaded.match,view));expect(again.ok).toBe(true);if(again.ok){expect(again.match.gathering.gold!.remaining).toBe(oldPrimary*9);expect(matchStats(again.match).player.gold).toEqual(matchStats(loaded.match).player.gold);}
});
it('updates remembered gold stock without revealing hidden extraction, and rejects malformed migration markers',()=>{
 const m=createMatch('skirmish'),doc=legacyDocument(m),gold=doc.state.gathering.gold;
 doc.state.enemyKnowledge.nodes=[{...gold}];const index=Math.floor(gold.position.y/32)*doc.state.fog.columns+Math.floor(gold.position.x/32);doc.state.fog.teams.enemy.explored[index]=true;
 const loaded=decodeSave(JSON.stringify(doc));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok)expect(loaded.match.enemyKnowledge!.nodes[0].remaining).toBe(3000);
 for(const flag of [false,1,'true']){const invalid=JSON.parse(encodeSave(m,view));invalid.state.gathering.expandedGoldStock=flag;expect(decodeSave(JSON.stringify(invalid)).ok).toBe(false);}
 const invalid=legacyDocument(m);invalid.state.gathering.gold.remaining=301;expect(decodeSave(JSON.stringify(invalid)).ok).toBe(false);
});
it('new matches and saves keep their expanded stock and do not count it as mined income',()=>{
 const m=createMatch('skirmish');expect(matchStats(m).player.gold.gathered).toBe(0);
 const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.gathering.gold!.remaining).toBe(m.gathering.gold!.remaining);expect(matchStats(loaded.match).player.gold.gathered).toBe(0);}
});

it('allows the AI to save legitimately mined gold from multiple enlarged mines on legacy map layouts',()=>{
 const m=createClassicMatch('skirmish','normal',undefined,'coast'),extra=m.gathering.extraNodes!.find(n=>n.resource==='gold')!,amount=m.gathering.gold!.remaining+extra.remaining;
 m.gathering.gold!.remaining=0;extra.remaining=0;m.enemyProduction!.gold+=amount;m.enemyProduction!.extracted!.gold+=amount;
 const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);
 if(loaded.ok){expect(loaded.match.enemyProduction!.gold).toBe(m.enemyProduction!.gold);expect(matchStats(loaded.match).player.gold.gathered).toBe(0);}
});
