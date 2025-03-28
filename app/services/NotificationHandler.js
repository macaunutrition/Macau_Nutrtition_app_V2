// NotificationHandler.js
import { CommonActions } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

let navigator;

export function setNavigator(nav) {
  navigator = nav;
}

export function handleNotification(notification) {
  const { data } = notification;
  const routeName = data?.route;

  if (routeName && navigator) {
    navigator.dispatch(
      CommonActions.navigate({
        name: routeName
      })
    );
  }
}

export function registerNotificationListeners() {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background state:', remoteMessage);
    handleNotification(remoteMessage);
  });

  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      console.log('Notification caused app to open from quit state:', remoteMessage);
      handleNotification(remoteMessage);
    }
  });

  messaging().onMessage(async remoteMessage => {
    console.log('Received a message in the foreground! KLAS', remoteMessage);
    // Handle the foreground message here if needed
    handleNotification(remoteMessage);
  });
}
