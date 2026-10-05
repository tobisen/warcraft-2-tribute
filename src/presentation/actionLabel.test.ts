import {expect,it} from 'vitest';
import {setActionLabel} from './actionLabel';
it('preserves the pressed button text and other children across repeated labels and countdown updates',()=>{
 const node={nodeType:3,textContent:'Upgrading: 20s [I]'},icon={nodeType:1};
 const button={id:'upgrade-base',childNodes:[icon,node],appendChild(){throw Error('Must preserve existing children');}} as unknown as HTMLButtonElement;
 for(let i=0;i<20;i++)setActionLabel(button,'Upgrading: 20s');
 expect(button.childNodes[1]).toBe(node);expect(button.childNodes[0]).toBe(icon);
 setActionLabel(button,'Upgrading: 19s');expect(node.textContent).toBe('Upgrading: 19s [I]');expect(button.childNodes[1]).toBe(node);
 setActionLabel(button,'Upgrading: 19s [I]');expect(node.textContent).toBe('Upgrading: 19s [I]');
});
