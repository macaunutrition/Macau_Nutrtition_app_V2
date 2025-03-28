/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React ,{useEffect,useState,useRef}from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import { StatusBar, PermissionsAndroid,Platform,View,Text, Alert,Linking} from 'react-native';
import storePre from './app/redux/store';
import DropdownAlert from 'react-native-dropdownalert';
import {AlertHelper} from './app/utils/AlertHelper';
import {PersistGate} from 'redux-persist/integration/react';
import TabNavigationStack from './app/routing/TabNavigationStack';
import TabNavigationStack2 from './app/routing/TabNavigationStack2';
import {navigationTypeTabs} from './app.json';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { registerNotificationListeners, setNavigator } from './app/services/NotificationHandler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Splashscreen from './app/screens/Splashscreen';



import AsyncStorage from '@react-native-async-storage/async-storage';
import getData from './app/utils/getData';
import updateData from './app/utils/updateData';
import { useTranslation } from "react-i18next";
import i18n from "./app/translation";

MaterialIcons.loadFont()
Ionicons.loadFont()
FontAwesome.loadFont()
Feather.loadFont()
MaterialCommunityIcons.loadFont()
const Stack = createStackNavigator();
const App: () => React$Node = () => {
  const {t} = useTranslation();
   const navigationRef = useRef(null);
  const {persistor, store} = storePre;
  const [isGuest, setIsGuest] = useState('0');
  const [isLoadingpage, setIsLoadingpage] = useState(true);
  const [user, setUser] = useState();
  const getUser = async (mobile) => {
    const getU = await getData('users',mobile );
    if(getU._data?.language == '中文') {
      await AsyncStorage.setItem('lang', 'cn');
      i18n.changeLanguage('cn');
    }else {

      await AsyncStorage.setItem('lang', 'en');
      i18n.changeLanguage('en');
    }
  }
  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted for Android');
        } else {
          Alert.alert(
            t('notificationpermission'),
            t('notificationpermissionmessage'),
            [
              {text: t('cancel'), style: 'cancel'},
              {text: t('settings'), onPress: () => Linking.openSettings()},
            ]
          );
          console.log('Notification permission denied for Android');
        }
      } catch (e) {
        console.error('Error requesting Android permission:', e);
      }
    } else if (Platform.OS === 'ios') {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Notification permission granted for iOS');
        } else {
          Alert.alert(
            t('notificationpermission'),
            t('notificationpermissionmessage'),
            [
              {text: t('cancel'), style: 'cancel'},
              {text: t('settings'), onPress: () => Linking.openURL('app-settings:')},
            ]
          );
        }
      } catch (e) {
        console.error('Error requesting iOS permission:', e);
      }
    }
  };
  const requestFCMPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      return null;
    }

    return await messaging().getToken();
  };
  useEffect(() => {
   setIsLoadingpage(true);
   setNavigator(navigationRef.current);
   auth().onAuthStateChanged( async (user) => {
      try {
       if (user) {
         let mobile = user.phoneNumber;
         getUser(mobile);
         await AsyncStorage.setItem('user', mobile);
         const getU = await getData('users',mobile );
         if(getU.data()) {
           if(getU.data()['country']) {
             setIsGuest('2');
             setIsLoadingpage(false);
           }else {
             setIsGuest('2');
             setIsLoadingpage(false);
           }
         }else {
           setIsGuest('2');
           setIsLoadingpage(false);
         }
         checkApplicationPermission();
          const fcmToken = await requestFCMPermission();
          if(fcmToken) {
            await updateData('users', mobile, {fcmtoken : fcmToken} );
          }
          console.log('FCM Token ', fcmToken);
         
       } else {
         await AsyncStorage.removeItem('user');
         setIsGuest('0');
         setIsLoadingpage(false);
       }
      } catch (error) {
        setIsLoadingpage(false);
      } finally {
        setIsLoadingpage(false);
      }
   });
   registerNotificationListeners();
   const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Received in foreground Mail', remoteMessage);
      // Handle the foreground message if needed
    });
 }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* navigationTypeTabs ? <TabNavigationStack/> : <MainStack /> */}
        {isLoadingpage ? (
          <>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Splashscreen" screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="Splashscreen" component={Splashscreen} />
            </Stack.Navigator>
          </NavigationContainer>
          </>
        ) : (
          <>
              {(isGuest == '0') ? <TabNavigationStack2/> : (isGuest == '1') ? <TabNavigationStack2/> : <TabNavigationStack/>}
          </>
        )}
        <DropdownAlert
          defaultContainer={{
            padding: 8,
            paddingTop: StatusBar.currentHeight,
            flexDirection: 'row',
          }}
          ref={(ref) => AlertHelper.setDropDown(ref)}
          onClose={() => AlertHelper.invokeOnClose()}
        />
      </PersistGate>
    </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
