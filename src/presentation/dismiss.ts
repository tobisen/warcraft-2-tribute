import type {DismissProposal} from '../gameplay/dismiss';
export function dismissMessage(p:DismissProposal):string {
 if(p.building)return `Demolish this own building? Construction, production and dependent research will stop. No refund.${p.lastBase?' Warning: demolishing this main building can end the match in defeat.':''}`;
 return `Dismiss ${p.count} own unit${p.count===1?'':'s'}?${p.passengers?` Includes ${p.passengers} embarked passenger${p.passengers===1?'':'s'}.`:''} Carried resources will be lost. No refund or kill credit.`;
}
