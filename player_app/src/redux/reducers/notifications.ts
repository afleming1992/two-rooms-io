import {NotificationActions} from "../actions/types";
import AppNotification from "../../domain/AppNotification";
import {Listeners} from "../actions/listeners";

export interface NotificationsState {
  notifications: Array<AppNotification>
}

const initialState: NotificationsState = {
  notifications: new Array<AppNotification>()
}

const removeNotification = (notifications: Array<AppNotification>, idToBeRemoved: string ) => {
  let updatedEvents = [...notifications];

  updatedEvents = updatedEvents.filter( notification => notification.id !== idToBeRemoved)

  return updatedEvents;
}

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
  // Notification Actions
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

  // Notification Creation Actions
  switch( action.type ) {
    case Listeners.JOIN_GAME_SUCCESS:
      return addNotification(state, new AppNotification("Joined Game Successfully", {
        variant: "success"
      }));
    case Listeners.CARD_UPDATE:
      return addNotification(state, new AppNotification(`Your card has changed!`, {
        variant: "warning"
      }))
    case Listeners.REQUEST_SHARE_SUCCESS:
      return addNotification(state, new AppNotification(`Share Request Sent!`, {
        variant: "success"
      }));
    case Listeners.SHARE_REQUEST_RECEIVED:
      return addNotification(state, new AppNotification( `New Share Request Received`, {
        variant: 'info'
      }))
    case Listeners.JOIN_GAME_ERROR:
    case Listeners.REQUEST_SHARE_ERROR:
      return addNotification(state, new AppNotification(`${action.data.message}`, {
        variant: "error"
      }));
    default:
      return state;
  }
}

export default notificationsReducer;