/**
 * @description List of routes for Tabs Navigator and Stack navigator, Along addational  Option for Tabs
 */
import React from 'react';
import Home from '../screens/Home';
import ProductDetails from '../screens/ProductDetails';

import WriteReview from '../screens/WriteReview';
import Cart from '../screens/Cart';
import Checkout from '../screens/Checkout';
import Filters from '../screens/Filter';
import Search from '../screens/Search';
import CheckoutDelivery from '../screens/Checkout/CheckoutDelivery';
import CheckOutSteper from '../screens/Checkout/CheckOutSteper';
import Summary from '../screens/Summary';
import Account from '../screens/Account';
import Accountedit from '../screens/Accountedit';
import WishList from '../screens/WishList';

import Notification from '../screens/Notification';

import Orders from '../screens/Orders';
import Address from '../screens/Address';
import Feather from 'react-native-vector-icons/dist/Feather';
import {appColors} from '../utils/appColors';
import {scale} from 'react-native-size-matters';
import Category from '../screens/Category';
import Brand from '../screens/Brand';
import Allcat from '../screens/Allcat';
import Allbrand from '../screens/Allbrand';
import Terms from '../screens/termsncondition';
import OrdersDetails from '../screens/OrdersDetails';
import Subcategory from '../screens/Subcategory';
import Allproducts from '../screens/Allproducts';
import PrivacyPolicy from '../screens/privacypolicy';


import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Verification from '../screens/Verification';

// Tab routes - only the main tabs
export const TabRoutes = [
  {
    name: 'Home',
    component: Home,
    options: {
      tabBarIcon: (props) => (
        <Feather
          name={'home'}
          size={scale(20)}
          color={appColors.primary}
          {...props}
        />
      ),
      tabBarLabel: 'Home',
    },
  },
  {
    name: 'Search',
    component: Search,
    options: {
      tabBarIcon: (props) => (
        <Feather
          name={'search'}
          size={scale(20)}
          color={appColors.primary}
          {...props}
        />
      ),
      tabBarLabel: 'Search',
    },
  },
  {
    name: 'Cart',
    component: Cart,
    options: {
      tabBarIcon: (props) => (
        <Feather
          name={'shopping-cart'}
          size={scale(20)}
          color={appColors.primary}
          {...props}
        />
      ),
      tabBarLabel: 'Cart',
    },
  },
  {
    name: 'Account',
    component: Account,
    options: {
      tabBarIcon: (props) => (
        <Feather
          name={'user'}
          size={scale(20)}
          color={appColors.primary}
          {...props}
        />
      ),
      tabBarLabel: 'Account',
    },
  },
  {
    name: 'Login',
    component: Login,
    options: {
      tabBarIcon: (props) => (
        <Feather
          name={'user'}
          size={scale(20)}
          color={appColors.primary}
          {...props}
        />
      ),
      tabBarLabel: 'Account',
    },
  },
];

// Stack routes - all other screens
export const StackRoutes = [
  {
    name: 'ProductDetails',
    component: ProductDetails,
  },
  {
    name: 'WriteReview',
    component: WriteReview,
  },
  {
    name: 'Checkout',
    component: Checkout,
  },
  {
    name: 'Category',
    component: Category,
  },
  {
    name: 'Subcategory',
    component: Subcategory,
  },
  {
    name: 'Brand',
    component: Brand,
  },
  {
    name: 'Allcat',
    component: Allcat,
  },
  {
    name: 'Allbrand',
    component: Allbrand,
  },
  {
    name: 'Filters',
    component: Filters,
  },
  {
    name: 'CheckoutDelivery',
    component: CheckoutDelivery,
  },
  {
    name: 'CheckOutSteper',
    component: CheckOutSteper,
  },
  {
    name: 'Summary',
    component: Summary,
  },
  {
    name: 'Accountedit',
    component: Accountedit,
  },
  {
    name: 'Orders',
    component: Orders,
  },
  {
    name: 'OrdersDetails',
    component: OrdersDetails,
  },
  {
    name: 'Notification',
    component: Notification,
  },
  {
    name: 'Address',
    component: Address,
  },
  {
    name: 'WishList',
    component: WishList,
  },
  {
    name: 'SignUp',
    component: SignUp,
  },
  {
    name: 'Verification',
    component: Verification,
  },
  {
    name: 'Termsncondition',
    component: Terms,
  },
  {
    name: 'Allproducts',
    component: Allproducts,
  },
  {
    name: 'Privacy',
    component: PrivacyPolicy,
  },
];

// Keep the original RoutesList for backward compatibility
export const RoutesList = [...TabRoutes, ...StackRoutes.map(route => ({
  ...route,
  options: {
    tabBarButton: (props) => null,
    tabBarVisible: false,
    tabBarLabel: route.name,
  }
}))];
