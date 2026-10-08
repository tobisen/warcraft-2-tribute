/** First worker contributes 1; additional reachable workers contribute 0.5, 0.25, ... . */
export const constructionConfig={assistantContribution:0.5,diminishingFactor:0.5};
export function constructionRate(workers:number){let rate=workers>0?1:0,contribution=constructionConfig.assistantContribution;for(let i=1;i<workers;i++){rate+=contribution;contribution*=constructionConfig.diminishingFactor;}return rate;}
