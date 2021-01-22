import ShareReveal from "../../domain/ShareReveal";
import {Listeners} from "../actions/listeners";
import {RevealActions} from "../actions/types";

export interface ShareState {
  shares: ShareReveal[],
  showRevealModal: boolean
  currentShare: ShareReveal | undefined
}

const initialState: ShareState = {
  shares: [],
  showRevealModal: false,
  currentShare: undefined
}

export default function shareReducer(state: ShareState = initialState, action: any) {
    let shares = state.shares;
    switch( action.type ) {
      case Listeners.PRIVATE_REVEAL_RECEIVED:
        shares.push(buildShare( action.data, action.data.userToken ));
        return {...state, shares: shares}
      case Listeners.CARD_SHARE_ACCEPTED:
        shares.push(buildShare( action.data, action.data.userToken ));
        return {...state, shares: shares}
      case RevealActions.DO_REVEAL:
        return {
          ...state,
          currentShare: shares.filter(
            (share) => share.id === action.data.eventId
          )[0],
          showRevealModal: true
        }
      case RevealActions.CLEAR_REVEAL:
        return {
          ...state,
          shares: shares.filter(
            (share) => share.id !== action.data.eventId
          ),
          currentShare: undefined,
          showRevealModal: false
        }
      default:
        return state;
    }
}

const buildShare = ( data: any, player: string ) => {
  let share: ShareReveal;

  if ( data.type === "ROLE" ) {
    share = ShareReveal.roleReveal( data.requestId, player, data.role );
  } else {
    share = ShareReveal.colourReveal( data.requestId, player, data.team );
  }

  return share;
}