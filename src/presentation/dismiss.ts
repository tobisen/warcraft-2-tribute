import type {DismissProposal} from '../gameplay/dismiss';
export function dismissMessage(p:DismissProposal):string {
 return `Dismiss ${p.count} own unit${p.count===1?'':'s'}?${p.passengers?` Includes ${p.passengers} embarked passenger${p.passengers===1?'':'s'}.`:''} Carried resources will be lost. No refund or kill credit.`;
}
