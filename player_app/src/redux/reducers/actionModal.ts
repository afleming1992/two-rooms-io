import {ActionModalActions} from "../actions/types";

export enum ActionMode {
  NOT_SELECTED,
  SHARE,
  REVEAL
}

export interface ActionModalState {
  isActionModalOpen: boolean,
  actionType: ActionMode
}

const initialState = {
  isActionModalOpen: false,
  actionType: ActionMode.NOT_SELECTED
}

const actionModalReducer = (state: ActionModalState = initialState, action: any) => {
  switch( action.type ) {
    case ActionModalActions.OPEN_SHARE_MODAL:
      return {...state, actionType: ActionMode.SHARE, isActionModalOpen: true}
    case ActionModalActions.OPEN_REVEAL_MODAL:
      return {...state, actionType: ActionMode.REVEAL, isActionModalOpen: true}
    case ActionModalActions.CLOSE_MODAL:
      return {...state, actionType: ActionMode.NOT_SELECTED, isActionModalOpen: false}
    default:
      return state;
  }
}

export default actionModalReducer;