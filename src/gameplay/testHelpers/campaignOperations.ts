import {playExpandedCampaign} from './expandedCampaign';
import type {CampaignMissionId} from '../../config/campaign';
/** Paid commands and phase-boundary saves; not a human play-duration measurement. */
export function playCampaignOperation(id:CampaignMissionId){return playExpandedCampaign(id);}
