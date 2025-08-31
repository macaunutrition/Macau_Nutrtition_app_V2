import React, { useState, useCallback, useRef, useEffect } from 'react';
import {View, Text, Pressable, Image, StyleSheet,TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import {scale} from 'react-native-size-matters';
import {appColors} from '../utils/appColors';
import Feather from 'react-native-vector-icons/Feather';
import Label from './Label';
import { APP_CURRENY } from '../utils/appConfig';
import { useTranslation } from "react-i18next";
import "../translation";
import {connect} from 'react-redux';
import {addToCart, removeFromCart} from '../redux/cartAction';
import ReduxWrapper from '../utils/ReduxWrapper';
import { useSelector, useDispatch } from 'react-redux';
import {AlertHelper} from '../utils/AlertHelper';
import moment from 'moment';
import { firebase } from '@react-native-firebase/analytics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const placeholder = require('../static/images/default-placeholder.png');

export default function ProductCard({ cartItems, navigation, item, onImageLoad = () => {} }) {
  const dispatch = useDispatch();
  const { id, name, qty,averageRating,cname, description, cdescription, variation, price, sellprice, image, isNew, height, createdAt} = item;
  const imgSource = image ? { uri: image } : placeholder;
  const today = moment().unix();
  const startDate = moment().subtract(120, 'days').unix();
  const { t, i18n } = useTranslation();
  const onAddToCart = (item) => {
    if(cartItems.length > 0) {
      const idArr = [];
        cartItems.forEach(doc => {
          idArr.push(doc.id);
        });
        if(idArr.indexOf(item.id) > -1) {
          const addQty = Number(cartItems[idArr.indexOf(item.id)].quantity) + Number(1);
          if( (qty != null) && (Number(addQty) > Number(qty)) ) {
              AlertHelper.show('error',  t('max')+' '+qty+' '+t('youcanbuy'));
              return;
          }
         dispatch(removeFromCart(item.id));
         dispatch(addToCart({...item, quantity:addQty, singleproduct: item}));
         AlertHelper.show('success', t('successfullyadded'));
            return;
        }else {
          //console.warn(item.id);
          if( (qty != null) && (1 > Number(qty)) ) {
              AlertHelper.show('error',  t('max')+' '+qty+' '+t('youcanbuy'));
              return;
          }
          dispatch(addToCart({...item, quantity:1, singleproduct: item}));
          AlertHelper.show('success', t('successfullyadded'));
            return;
        }
    }else {
      if( (qty != null) && (1 > Number(qty)) ) {
          AlertHelper.show('error',  t('max')+' '+qty+' '+t('youcanbuy'));
              return;
      }
       dispatch(addToCart({...item, quantity:1, singleproduct: item}));
       AlertHelper.show('success', t('successfullyadded'));
            return;
    }
  }
  const addtoCartcall = async (item) => {
    if(Number(1) < Number(item.minqty) ) {
        AlertHelper.show('error', t('minimum')+' '+item.minqty+' '+t('youshouldbuy'));
        return;
    }else {
      if(item.stockstatus == 'In Stock') {
          if(item.qty > 0) {
            firebase.analytics().logEvent('add_to_cart', { product_id: item.id });
            onAddToCart(item);
          }else {
            AlertHelper.show('error', t('outofstock'));
            return;
          }
      }else {
        AlertHelper.show('error', t('outofstock'));
        return;
      } 
      
    }
  }
  const _addTocartview = (item) => {
    if(!item.variation) {
      return (
        <View style={styles.gototopbox}>
          <TouchableOpacity style={styles.gototop} onPress={() => addtoCartcall(item)}>
            <Feather name="shopping-cart" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }else {
      return (
        <View style={styles.gototopbox}>
          <TouchableOpacity style={styles.gototop} onPress={() => navigation.navigate('ProductDetails',{pid: id})}>
            <Feather name="eye" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }
  };
  return (
     <>
      <View
        style={{
          //height: height,
           width: '100%',
          //backgroundColor:appColors.lightGray
        }}>
        <Pressable style={{position: 'relative', zIndex: -1}} onPress={() => {
          console.log('ProductCard: Navigating to ProductDetails with pid:', id);
          console.log('ProductCard: Full item data:', item);
          navigation.navigate('ProductDetails',{pid: id});
        }} >
          <FastImage
            style={{ height: height, width: '100%', position: 'relative', zIndex: 1 }}
            source={imgSource}
            resizeMode={FastImage.resizeMode.contain}
            onLoad={onImageLoad}
          />
        </Pressable>
        {sellprice > 0 && (
             <View style={{
               position: 'absolute',
               marginRight: 0,
               top:-10,
               right:0,
               // Add other styles if needed, like width, height, etc.
               width: 25, // Adjust to your needs
               height: 75, // Adjust to your needs
               justifyContent: 'center', // Center the animation
               alignItems: 'center', // Center the animation
               zIndex: 2
             }}>
               <LottieView
                 source={require('../static/sale.json')}
                 autoPlay
                 loop={true}
                 style={{width: 150, height: 150,marginTop:-10}}
               />
             </View>
         )}
        {(createdAt >= startDate || createdAt <= today) && (
          <View
            style={{
              backgroundColor:appColors.yellow,
              position: 'absolute',
              top: scale(-9),
              left: scale(-9),
              padding: scale(3),
              borderRadius: scale(3),
              paddingHorizontal: scale(10),
            }}>

            <Label text="New" style={{fontSize:scale(10), color:appColors.white}} />
          </View>
        )}
      </View>
      {i18n.language == 'en' ? (
        <Pressable onPress={() => navigation.navigate('ProductDetails',{pid: id})} ><View style={{paddingVertical: scale(3)}}>
          <Label text={name?.substring(0,40)} style={{fontSize: scale(13), fontWeight: '500'}} />
        </View></Pressable> ) : (
          <Pressable onPress={() => navigation.navigate('ProductDetails',{pid: id})} ><View style={{paddingVertical: scale(3)}}>
            <Label text={cname?.substring(0,40)} style={{fontSize: scale(13), fontWeight: '500'}} />
          </View></Pressable> )}

          {i18n.language == 'en' ? (
            <Pressable onPress={() => navigation.navigate('ProductDetails',{pid: id})} ><View style={{paddingVertical: scale(2)}}>
              <Label
                text={description?.substring(0, 25)}
                style={{fontSize: scale(11), color: appColors.darkGray}}
              />
            </View></Pressable> ) : (
              <Pressable onPress={() => navigation.navigate('ProductDetails',{pid: id})} ><View style={{paddingVertical: scale(2)}}>
                <Label
                  text={cdescription?.substring(0, 25)}
                  style={{fontSize: scale(11), color: appColors.darkGray}}
                />
              </View></Pressable> )}
          <>
          {averageRating && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star, index) => {
                  const rating = averageRating;
                  const isHalfStar = rating - index > 0 && rating - index < 1;
                  const isFullStar = rating - index >= 1;

                  return (
                    <MaterialCommunityIcons
                      key={index}
                      name={isFullStar ? "star" : isHalfStar ? "star-half-full" : "star-outline"}
                      size={15}
                      color={isFullStar || isHalfStar ? '#FFC107' : '#FFC107'}
                    />
                  );
                })}
              </View>
            </View>
          )}
          </>

          {sellprice > 0 ? (
            <View style={{paddingTop: scale(5)}}>
              <Label
                text={`${APP_CURRENY.symbol} ${price}`}
                style={{
                  fontSize: scale(12),
                  color: appColors.primaryDark,
                  fontWeight: '500',
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                  textDecorationColor: appColors.primaryDark,
                }}
              />
              <Label
                text={`${APP_CURRENY.symbol} ${sellprice}`}
                style={{
                  fontSize: scale(14),
                  color: appColors.red,
                  fontWeight: '500',
                }}
              />
            </View>
          ) : (
            <View style={{paddingTop: scale(5)}}>
              <Label
                text={`${APP_CURRENY.symbol} ${price}`}
                style={{
                  fontSize: scale(14),
                  color: appColors.primaryDark,
                  fontWeight: '500',
                }}
              />
            </View>
          )}
      {_addTocartview(item)}
    </>
  );
}
const styles = StyleSheet.create({
  gototopbox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 0,
  },
  gototop: {
    width: 40, // Adjust the size as needed
    height: 40, // Adjust the size as needed
    borderRadius: 20, // Half of the width/height to make it circular
    backgroundColor: appColors.primary, // Adjust the color as needed
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Adds a shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, // Adds a shadow for iOS
    marginTop: -15,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.primary, 
    padding: scale(5),
    borderRadius: scale(5),
    width: 45,
  },
  ratingStars: {
    fontSize: scale(12),
    color: appColors.white,
    fontWeight: '500',
  },
  
  
});
