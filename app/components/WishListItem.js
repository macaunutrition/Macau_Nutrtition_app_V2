import React, {useRef, useEffect, useState} from 'react';
import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native'; 
import {scale} from 'react-native-size-matters';
import {appColors} from '../utils/appColors';
import Label from './Label';
import SimpleStepper from 'react-native-simple-stepper';
import { APP_CURRENY } from '../utils/appConfig';
import {connect} from 'react-redux';
import {addToCart, removeFromCart, updateCartItem} from '../redux/cartAction';
import ReduxWrapper from '../utils/ReduxWrapper';
import { useSelector, useDispatch } from 'react-redux';
import { APP_IMGURL } from '../utils/appConfig';
import { useTranslation } from "react-i18next";
import "../translation";
import Icon from 'react-native-vector-icons/FontAwesome';
import { removeToWishList } from '../redux/wishListAction';


export default function WishListItem({ navigation, renderBagge, hideSteper,noBg, image, item, itemid, name, price, quantity}) {
  const { t, i18n } = useTranslation();
const [buyqty, setBuyqty] = useState(quantity);
const dispatch = useDispatch();
const singleProduct = item.singleproduct;
//console.warn(singleProduct);
const updatecart = (itemid, qty) => {
  setBuyqty(qty);
  dispatch(updateCartItem(itemid,qty))
}
const onRemove = (item) => {
  dispatch(removeToWishList(item.singleproduct));
}
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        //borderRadius: scale(  5 )
        justifyContent: 'space-between', // Add this to position the trash icon
        alignItems: 'center', // Center items vertically
      }}>
      <View style={{ flexDirection: 'row' }}>
        <Pressable onPress={() => navigation.navigate('ProductDetails', { pid: singleProduct.pid })} >
          <Image
            style={{
              height: scale(60),
              width: scale(60),
              borderRadius: scale(noBg ? 5 : 0),
              //backgroundColor:appColors.darkGray
            }}
            source={{ uri: APP_IMGURL + '/products/' + item.pid + '/' + image }}
          />
        </Pressable>

        <View
          style={{
            marginLeft: scale(10),
            justifyContent: 'space-between',
            paddingVertical: scale(10),
          }}>
          <>
            {i18n.language == 'en' ? (
              <Pressable onPress={() => navigation.navigate('ProductDetails', { pid: singleProduct.pid })} ><Label text={name?.substring(0, 20)} style={{ fontWeight: '600', }} /></Pressable>) : (
              <Pressable onPress={() => navigation.navigate('ProductDetails', { pid: singleProduct.pid })} ><Label text={item.cname?.substring(0, 15)} style={{ fontWeight: '600', }} /></Pressable>)}
          </>
          <Label
            text={`${APP_CURRENY.symbol} ${item.price}`}
            style={{
              fontSize: scale(14),
              fontWeight: '500',
              color: appColors.primary,
            }}
          />
          {renderBagge && renderBagge()}
        </View>
      </View>

      {/* Trash icon for removing items */}
      <TouchableOpacity
        onPress={() => onRemove && onRemove(item)}
        style={{
          padding: scale(10),
          marginRight: scale(5)
        }}
      >
        <Icon name="trash" size={scale(20)} color={appColors.red} />
      </TouchableOpacity>
    </View>
  );
}
