import {it,expect} from 'vitest';
import {hotkeys} from './hotkeys';
import {commandRows,commandCategories} from './commandsView';
it('includes every live action binding exactly once in the six command categories',()=>{
 const rows=commandRows();expect(new Set(rows.map(r=>r.category))).toEqual(new Set(commandCategories));
 for(const h of hotkeys){const matches=rows.filter(r=>r.action===h.button);expect(matches).toHaveLength(1);expect(matches[0]!.gesture).toBe(h.key);expect(h.label.startsWith(matches[0]!.explanation)).toBe(true);}
 expect(rows.find(r=>r.command==='Zoom')?.gesture).toContain('wheel');
 expect(rows.find(r=>r.command==='Assign / recall group')?.gesture).toContain('1–9');
});
