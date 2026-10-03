import {text as uiText} from '../text';
import { findRoute } from './navigation';
import { spawnCandidates, hasSpawnExit } from './spawning';
import type { WorldMap } from './map';
import type { Footprint } from './placement';
import type { Position } from './movement';
import type { ProductionState } from './production';

/** Reject invalid rally commands without replacing the last accepted destination. */
export function setRally(production:ProductionState, target:Position, map:WorldMap,
  footprint:Footprint|null, kind:'base'|'barracks'):ProductionState {
  if (!footprint) return {...production,rallyError:uiText.buildingMissing};
  const candidates=spawnCandidates(map,footprint,kind).filter(p=>hasSpawnExit(map,p));
  const routes=candidates.map(p=>findRoute(map,p,target));
  if (!routes.some(r=>r.ok)) return {...production,rallyError:uiText.theRallyDestinationIsBlockedOrUnreachable};
  return {...production,rally:{...target},rallyError:undefined};
}
