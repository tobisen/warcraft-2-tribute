/** Construct the pre-141 enemy wire format for historical migration tests.
 * Never use this adapter in production or to rewrite already paid modern army jobs. */
export function legacyEnemyFixture(doc:any):void{
 delete doc.state.enemyProduction?.roster;
 const enemies=[...(doc.state.combat.enemies??[]),...(doc.state.enemyNaval?.passengers??[])];
 for(const e of enemies){
  if(e.role)throw Error('A modern roster is not a historical enemy fixture');
  delete e.legacyProfile;delete e.typeId;
  if(e.kind==='base')e.hp=Math.min(e.hp,240);
 }
}
