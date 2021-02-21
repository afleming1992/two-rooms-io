import {ActionModalActions} from "./types";

export const openRevealModal = () => {
  return {
    type: ActionModalActions.OPEN_REVEAL_MODAL
  }
}

export const openShareModal = () => {
  return {
    type: ActionModalActions.OPEN_SHARE_MODAL
  }
}

export const openNominateLeaderModal = () => {
  return {
    type: ActionModalActions.OPEN_NOMINATE_LEADER_MODAL
  }
}

export const closeModal = () => {
  return {
    type: ActionModalActions.CLOSE_MODAL
  }
}

const actions = {
  openRevealModal,
  openShareModal,
  closeModal
}

export default actions;