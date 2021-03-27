import {NotificationActions} from "../actions/types";
import AppNotification from "../../domain/AppNotification";
import {Listeners} from "../actions/listeners";

export interface NotificationsState {
  notifications: Array<AppNotification>
}

const initialState: NotificationsState = {
  notifications: new Array<AppNotification>()
}

const errorNotificationListeners = [
  Listeners.CREATE_GAME_ERROR,
  Listeners.JOIN_GAME_ERROR,
  Listeners.START_GAME_ERROR,
  Listeners.END_ROUND_ERROR,
  Listeners.RELOAD_GAME_SESSION_ERROR,
  Listeners.START_NEXT_ROUND_ERROR,
  Listeners.START_TIMER_ERROR,
  Listeners.PAUSE_TIMER_ERROR,
  Listeners.RESTART_TIMER_ERROR,
  Listeners.REVEAL_CARD_ASSIGNMENT_ERROR,
  Listeners.REQUEST_SHARE_ERROR,
  Listeners.ANSWER_SHARE_ERROR,
  Listeners.NOMINATE_HOSTAGE_ERROR,
  Listeners.NOMINATE_LEADER_ERROR,
  Listeners.ABDICATE_LEADER_ERROR,
  Listeners.ANSWER_LEADERSHIP_OFFER_ERROR,
  Listeners.USURP_LEADER_ERROR,
  Listeners.USURP_VOTE_ERROR
]

const addNotification = (state: NotificationsState, notification: AppNotification) => {
  return {
    ...state,
    notifications: [
      ...state.notifications,
      notification
    ]
  }
};

const notificationsReducer = (state: NotificationsState = initialState, action: any) => {
  // Notification GameAction
  switch( action.type ) {
    case NotificationActions.CLOSE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.map(notification => (
          ( action.dismissAll || notification.id === action.id )
            ? { ...notification, dismissed: true }
            : { ...notification }
        )),
      }
    case NotificationActions.REMOVE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.id,
        ),
      };
  }

  // Notification Creation GameAction
  switch( action.type ) {
    case Listeners.JOIN_GAME_SUCCESS:
      return addNotification(state, new AppNotification("Joined Game Successfully", {
        variant: "success"
      }));
    case Listeners.REQUEST_SHARE_SUCCESS:
      return addNotification(state, new AppNotification(`Share Request Sent!`, {
        variant: "success"
      }));
    case Listeners.SHARE_REQUEST_RECEIVED:
      return addNotification(state, new AppNotification( `New Share Request Received`, {
        variant: 'info'
      }))
    default:
      if(Object.values(errorNotificationListeners).includes(action.type)){
        return addNotification(state, new AppNotification(`${action.data.message}`, {
          variant: "error"
        }));
      } else {
        return state;
      }
  }
}

export default notificationsReducer;