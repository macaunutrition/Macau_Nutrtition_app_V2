import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { TabRoutes, StackRoutes } from './routes';
import { appColors } from '../utils/appColors';
import { useSelector, useDispatch } from 'react-redux';
import Feather from 'react-native-vector-icons/dist/Feather';
import { scale } from 'react-native-size-matters';
import { clearCart } from '../redux/cartAction';
import { useTranslation } from "react-i18next";
import "../translation";
import { Linking } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const navigationRef = createNavigationContainerRef();

// Create stack navigators for each tab
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={TabRoutes.find(r => r.name === 'Home').component} />
    {StackRoutes.map((route, index) => (
      <Stack.Screen key={index} name={route.name} component={route.component} />
    ))}
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SearchScreen" component={TabRoutes.find(r => r.name === 'Search').component} />
    {StackRoutes.map((route, index) => (
      <Stack.Screen key={index} name={route.name} component={route.component} />
    ))}
  </Stack.Navigator>
);

const CartStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CartScreen" component={TabRoutes.find(r => r.name === 'Cart').component} />
    {StackRoutes.map((route, index) => (
      <Stack.Screen key={index} name={route.name} component={route.component} />
    ))}
  </Stack.Navigator>
);

const AccountStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AccountScreen" component={TabRoutes.find(r => r.name === 'Account').component} />
    {StackRoutes.map((route, index) => (
      <Stack.Screen key={index} name={route.name} component={route.component} />
    ))}
  </Stack.Navigator>
);

const LoginStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LoginScreen" component={TabRoutes.find(r => r.name === 'Login').component} />
    {StackRoutes.map((route, index) => (
      <Stack.Screen key={index} name={route.name} component={route.component} />
    ))}
  </Stack.Navigator>
);

const linking = {
  prefixes: ['https://macaunutrition.com', 'macaunutrition://'],
  config: {
    screens: {
      Home: {
        screens: {
          ProductDetails: 'productdetails/:pid',
          OrdersDetails: 'order/:orderid',
        }
      }
    },
    initialRouteName: 'Home',
  }
};

export default function TabNavigationStack({ isAuth }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  
  // Add ref for tab navigator
  const tabNavigatorRef = React.useRef(null);
  
  const cartCount = () => {
    let cartCount = 0
    if (cartItems.length > 0) {
      cartItems?.map(item => {
        const { quantity } = item;
        cartCount += Number(quantity);
      })
    }
    return `${cartCount}`
  }

  // Function to reset stack when tab is pressed
  const handleTabPress = (e, route) => {
    const isFocused = tabNavigatorRef.current?.isFocused();
    
    // Prevent default action
    e.preventDefault();
    
    // If tab is already focused, reset the stack to first screen
    if (isFocused) {
      const event = navigationRef.current?.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      
      if (!event.defaultPrevented) {
        // Reset the stack to first screen based on tab name
        switch(route.name) {
          case 'Home':
            navigationRef.current?.navigate('HomeScreen');
            break;
          case 'Search':
            navigationRef.current?.navigate('SearchScreen');
            break;
          case 'Cart':
            navigationRef.current?.navigate('CartScreen');
            break;
          case 'Account':
            navigationRef.current?.navigate('AccountScreen');
            break;
        }
      }
    } else {
      // If not focused, just navigate to the tab
      navigationRef.current?.navigate(route.name);
    }
  };

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Tab.Navigator
        ref={tabNavigatorRef}
        screenOptions={{
          headerShown: false,
        }}
        tabBarOptions={{
          activeTintColor: appColors.primaryDark,
          inactiveTintColor: appColors.darkGray,
        }}
        listeners={({ navigation, route }) => ({
          tabPress: e => handleTabPress(e, route),
        })}>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: (props) => (
              <Feather
                name={'home'}
                size={scale(20)}
                color={appColors.primaryDark}
                {...props}
              />),
            tabBarLabel: `${t('home')}`,
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={{
            tabBarIcon: (props) => (
              <Feather
                name={'search'}
                size={scale(20)}
                color={appColors.primaryDark}
                {...props}
              />),
            tabBarLabel: `${t('search')}`,
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartStack}
          options={{
            tabBarBadge: cartCount() > 0 ? cartCount() : null,
            tabBarIcon: (props) => (
              <Feather
                name={'shopping-cart'}
                size={scale(20)}
                color={appColors.primaryDark}
                {...props}
              />),
            tabBarLabel: `${t('cart')}`,
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountStack}
          options={{
            tabBarIcon: (props) => (
              <Feather
                name={'user'}
                size={scale(20)}
                color={appColors.primaryDark}
                {...props}
              />),
            tabBarLabel: `${t('account')}`,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Helper function to navigate from anywhere
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
