import {NotificationActions} from "./types";

export const enqueueSnackbar = (notification: Notification) => {
  return {
    notification: notification
  }
}

export const closeSnackbar = (id: string) => ({
  type: NotificationActions.CLOSE_SNACKBAR,
  dismissAll: !id,
  id,
});

export const removeSnackbar = (id: string) => ({
  type: NotificationActions.REMOVE_SNACKBAR,
  id,
});
