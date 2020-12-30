import ShareReveal from "../../domain/ShareReveal";
import {Listeners} from "../actions/listeners";
import {RevealActions} from "../actions/types";

export interface ShareState {
  shares: Map<string, ShareReveal>,
  showRevealModal: boolean
  currentShare: ShareReveal | undefined
}

const initialState: ShareState = {
  shares: new Map<string, ShareReveal>(),
  showRevealModal: false,
  currentShare: undefined
}

export default function shareReducer(state: ShareState = initialState, action: any) {
    let shares = state.shares;
    switch( action.type ) {
      case Listeners.PRIVATE_REVEAL_RECEIVED:
        shares.set(action.data.id, buildShare( action.data, action.data.userToken ) )
        return {...state, shares}
      case Listeners.CARD_SHARE_ACCEPTED:
        shares.set(action.data.id, buildShare( action.data, action.data.userToken ) );
        return {...state, shares}
      case RevealActions.DO_REVEAL:
        return {...state, currentShare: shares.get( action.data.eventId ), showRevealModal: true}
      case RevealActions.CLEAR_REVEAL:
        shares.delete(action.data.eventId)
        return {...state, shares, currentShare: undefined, showRevealModal: false}
      default:
        return state;
    }
}

const buildShare = ( data: any, player: string ) => {
  let share: ShareReveal;

  if ( data.type === "ROLE" ) {
    share = ShareReveal.roleReveal( data.id, player, data.role );
  } else {
    share = ShareReveal.colourReveal( data.id, player, data.team );
  }

  return share;
}