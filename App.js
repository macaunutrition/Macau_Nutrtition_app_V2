/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { StatusBar, PermissionsAndroid, Platform, View, Text, Alert, Linking } from 'react-native';
import storePre from './app/redux/store';
import DropdownAlert from 'react-native-dropdownalert';
import { AlertHelper } from './app/utils/AlertHelper';
import { PersistGate } from 'redux-persist/integration/react';
import TabNavigationStack from './app/routing/TabNavigationStack';
import TabNavigationStack2 from './app/routing/TabNavigationStack2';
import { navigationTypeTabs } from './app.json';
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
import Welcome from './app/screens/Welcome';



import AsyncStorage from '@react-native-async-storage/async-storage';
import getData from './app/utils/getData';
import updateData from './app/utils/updateData';
import firestore from '@react-native-firebase/firestore';
import { getOrCreateSessionId } from './app/utils/sessionId';
import { useTranslation } from "react-i18next";
import i18n from "./app/translation";

MaterialIcons.loadFont()
Ionicons.loadFont()
FontAwesome.loadFont()
Feather.loadFont()
MaterialCommunityIcons.loadFont()
const Stack = createStackNavigator();
const App: () => React$Node = () => {
  const { t } = useTranslation();
  const navigationRef = useRef(null);
  const { persistor, store } = storePre;
  const [isGuest, setIsGuest] = useState('0');
  const [isLoadingpage, setIsLoadingpage] = useState(true);
  const [user, setUser] = useState();
  const [showIntro, setShowIntro] = useState(false);
  const [showPostIntroSplash, setShowPostIntroSplash] = useState(false);
  
  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowPostIntroSplash(true);
    
    // Preload critical app data during splash screen
    preloadAppData();
    
    // Show splash screen for 3 seconds after intro completion
    setTimeout(() => {
      setShowPostIntroSplash(false);
    }, 3000);
  };
  
  const preloadAppData = async () => {
    try {
      // Preload critical data here
      console.log('Preloading app data...');
      
      // You can add preloading logic here like:
      // - Preload critical images
      // - Initialize Firebase connections
      // - Load user preferences
      // - Cache frequently used data
      
    } catch (error) {
      console.log('Preload error:', error);
    }
  };
  
  const getUser = async (mobile) => {
    const getU = await getData('users', mobile);
    if (getU._data?.language == '中文') {
      await AsyncStorage.setItem('lang', 'cn');
      i18n.changeLanguage('cn');
    } else {

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
              { text: t('cancel'), style: 'cancel' },
              { text: t('settings'), onPress: () => Linking.openSettings() },
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
              { text: t('cancel'), style: 'cancel' },
              { text: t('settings'), onPress: () => Linking.openURL('app-settings:') },
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
     let userDocUnsubscribe = null;
     let splashScreenTimer = null;
     
     // Show splash screen for minimum 2 seconds
     const showSplashScreen = async () => {
       await new Promise(resolve => setTimeout(resolve, 2000));
       setIsLoadingpage(false);
     };
     
     splashScreenTimer = showSplashScreen();
     
     // Check if intro should be shown
     const checkIntro = async () => {
       const introShown = await AsyncStorage.getItem('isIntro');
       if (!introShown || introShown !== 'yes') {
         setShowIntro(true);
       }
     };
     
     checkIntro();
     auth().onAuthStateChanged( async (user) => {
        try {
         if (user) {
           let mobile = user.phoneNumber;
           getUser(mobile);
           await AsyncStorage.setItem('user', mobile);
           const sessionId = await getOrCreateSessionId();
           await updateData('users', mobile, { sessionId });
           const getU = await getData('users',mobile );
           if(getU.data()) {
             if(getU.data()['country']) {
               setIsGuest('2');
             }else {
               setIsGuest('2');
             }
           }else {
             setIsGuest('2');
           }
           checkApplicationPermission();
            const fcmToken = await requestFCMPermission();
            if(fcmToken) {
              await updateData('users', mobile, {fcmtoken : fcmToken} );
            }
            console.log('FCM Token ', fcmToken);

            // Real-time listener to enforce single active session per user
            if (userDocUnsubscribe) {
              userDocUnsubscribe();
            }
            userDocUnsubscribe = firestore()
              .collection('users')
              .doc(mobile)
              .onSnapshot(async (doc) => {
                try {
                  const remote = doc.data();
                  if (remote && remote.sessionId && remote.sessionId !== sessionId) {
                    console.log('Session takeover detected. Signing out this device.');
                    await auth().signOut();
                  }
                } catch (e) {
                  // ignore listener errors
                }
              });

         } else {
           await AsyncStorage.removeItem('user');
           setIsGuest('0');
           if (userDocUnsubscribe) {
             userDocUnsubscribe();
             userDocUnsubscribe = null;
           }
         }
        } catch (error) {
          // Error handling - splash screen will still show for minimum time
        } finally {
          // Splash screen timer will handle setIsLoadingpage(false)
        }
     });
     registerNotificationListeners();
     const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('Received in foreground Mail', remoteMessage);
        // Handle the foreground message if needed
      });
     return () => {
       if (userDocUnsubscribe) {
         userDocUnsubscribe();
         userDocUnsubscribe = null;
       }
       if (splashScreenTimer) {
         splashScreenTimer = null;
       }
       unsubscribe && unsubscribe();
     };
   }, []);

  // useEffect(() => {
  //   const mockMobile = '+861234567890'; // Replace with test number
  //   const mockUser = { phoneNumber: mockMobile };

  //   const init = async () => {
  //     try {
  //       setNavigator(navigationRef.current);
  //       await AsyncStorage.setItem('user', mockMobile);
  //       await getUser(mockMobile);
  //       const getU = await getData('users', mockMobile);
  //       if (getU?.data()) {
  //         setIsGuest('2'); // Mark user as logged in
  //       } else {
  //         setIsGuest('2');
  //       }

  //       checkApplicationPermission();
  //       const fcmToken = await requestFCMPermission();
  //       if (fcmToken) {
  //         await updateData('users', mockMobile, { fcmtoken: fcmToken });
  //         console.log('FCM Token', fcmToken);
  //       }
  //     } catch (error) {
  //       console.error('Mock login error:', error);
  //       setIsGuest('0');
  //     } finally {
  //       setIsLoadingpage(false);
  //     }

  //     registerNotificationListeners();

  //     messaging().onMessage(async remoteMessage => {
  //       console.log('Received in foreground Mail', remoteMessage);
  //     });
  //   };

  //   init();
  // }, []);


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
          ) : showIntro ? (
            <>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome" screenOptions={{
                  headerShown: false,
                }}>
                  <Stack.Screen name="Welcome">
                    {(props) => <Welcome {...props} onIntroComplete={handleIntroComplete} />}
                  </Stack.Screen>
                </Stack.Navigator>
              </NavigationContainer>
            </>
          ) : showPostIntroSplash ? (
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
              {(isGuest == '0') ? <TabNavigationStack2 /> : (isGuest == '1') ? <TabNavigationStack2 /> : <TabNavigationStack />}
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
