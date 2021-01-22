import {ActionModalActions} from "./types";

const openRevealModal = () => {
  return {
    type: ActionModalActions.OPEN_REVEAL_MODAL
  }
}

const openShareModal = () => {
  return {
    type: ActionModalActions.OPEN_SHARE_MODAL
  }
}

const closeModal = () => {
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