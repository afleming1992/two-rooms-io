import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../redux/reducers";
import {useSnackbar} from 'notistack';
import AppNotification from "../domain/AppNotification";
import {removeSnackbar} from "../redux/actions/notificationActions";

let displayed: string[] = [];

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector<AppState, AppNotification[]>(store => store.notifications.notifications || []);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id: string) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: string) => {
    displayed = [...displayed.filter(key => id !== key)]
  }

  React.useEffect(() => {
    notifications.forEach(({ id, text, options = {}, dismissed = false }) => {
      if( dismissed ) {
        closeSnackbar(id);
      }

      if (displayed.includes(id)) return;

      enqueueSnackbar(text, {
        id,
        ...options,
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        onClose: (event, reason, myKey) => {
          if(options.onClose) {
            options.onClose(event, reason, myKey)
          }
        },
        onExited: (event, myKey: string) => {
          dispatch(removeSnackbar(id));
          removeDisplayed(myKey);
        }
      });

      storeDisplayed(id);
    });
  }, [notifications, enqueueSnackbar, closeSnackbar, dispatch, notifications.length])

  return null;
}

export default Notifications;