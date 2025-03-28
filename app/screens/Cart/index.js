import React, {useRef, useEffect, useState} from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {scale} from 'react-native-size-matters';
import {AlertHelper} from '../../utils/AlertHelper';
import Container from '../../components/Container';
import Label from '../../components/Label';
import {appColors} from '../../utils/appColors';
import SimpleStepper from 'react-native-simple-stepper';
import {bestSellersList} from '../../utils/MockData';
import BottomButtons from '../../components/BottomButtons';
import {SwipeListView} from 'react-native-swipe-list-view';
import Feather from 'react-native-vector-icons/Feather';
import CheckOutItem from '../../components/CheckOutItem';
import {connect,useDispatch} from 'react-redux';
import ReduxWrapper from '../../utils/ReduxWrapper';
import { APP_CURRENY } from '../../utils/appConfig';
import Empty from '../../components/Empty';
import auth from '@react-native-firebase/auth';
import { removeToWishList } from '../../redux/wishListAction';

import { useTranslation } from "react-i18next";
import "../../translation";

function index({wishList:{wishItemNames},removeToWishList$, addToWishList$,removeFromCart$,cart:{cartItems} ,navigation}) {
const { t, i18n } = useTranslation();
const dispatch = useDispatch();
 const getAmount = ()=>{
   let amount =0
   cartItems?.map(item=>{
     const {price, vprice, quantity} =item;
     if(item.variationname) {
       if( Object.entries(item.sizedetails).length > 0) {
         if(item.sizedetails.sprice != null) {
           amount+= Number( item.sizedetails.sprice )*Number(quantity);
         }else {
           amount+= Number( vprice )*Number(quantity);
         }
       }else {
         amount+= Number( vprice )*Number(quantity);
       }
     }else {
       amount+= Number( price )*Number(quantity);
     }
   })
   return  `${APP_CURRENY.symbol} ${parseFloat(amount).toFixed(2)}`

 }
 const cartCount = ()=>{
   let cartCount =0;
   if(cartItems) {
     cartItems?.map(item=>{
       const {quantity} =item
       cartCount+= Number(quantity);
     })
   }
   return  `${cartCount}`

 }
 const onDeletePress = (item)=>{
  removeFromCart$(item?.id)
 }
 const isInWishList = (item)=>{
   return wishItemNames?.includes(item?.pid)
 }
 const onAddToWishListPress = (item)=>{
   if(!isInWishList(item) ){
    addToWishList$(item)
   }else{
     dispatch(removeToWishList(item));
   }

 }

 const CheckEmptyCart = ()=>{
   if(cartItems.length > 0) {
    const user = auth().currentUser;
    if (user) {
      navigation.navigate("CheckOutSteper", {cartItems})
    }else {
      navigation.navigate("Login")
    }
   }else {
       AlertHelper.show('error', t('additemoncart'));
   }
 }

  const ItemCard = ({item}) => {
    const {id, name, description, price, images, quantity, variation, variationname, optionid, optionname, wieght, getpoint} = item;
  //  console.warn(item);
    return ( <CheckOutItem item={item} navigation={navigation} itemid={id} name={name} image={images[0]} price={price} quantity={quantity} /> );
  };
  return (
    <>
      <Container >
        <View style={{flex: 1, paddingVertical: scale(30)}}>
          <SwipeListView
          ListEmptyComponent={()=> <Empty  label={t('yourcartisempty')}/> }
          showsVerticalScrollIndicator={false}
            keyExtractor={(item) => `${item.id}}`}
            ItemSeparatorComponent={() => <View style={{padding: scale(10)}} />}
            data={cartItems || []}
            renderItem={({item, index}) => <ItemCard item={item} />}
            renderHiddenItem={(data, rowMap) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Pressable
                  onPress={()=>onAddToWishListPress(data?.item)}
                  style={{
                    left: scale(-15),
                    flex: scale(0.3),
                    backgroundColor: wishItemNames?.includes(data?.item?.pid) ? appColors.red : appColors.primary,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Feather
                    name={'star' }
                    size={scale(25)}
                    color={wishItemNames?.includes(data?.item?.pid) ? appColors.white :  appColors.white}
                  />
                </Pressable>
                <Pressable
                onPress={()=>onDeletePress(data?.item)}
                  style={{
                    left: scale(15),
                    flex: scale(0.3),
                    backgroundColor: appColors.redOrange,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Feather
                    name={'trash'}
                    size={scale(25)}
                    color={appColors.white}
                  />
                </Pressable>
              </View>
            )}
            leftOpenValue={scale(85)}
            rightOpenValue={scale(-85)}
          />
        </View>
      </Container>
      <View style={{backgroundColor: 'red', bottom: scale(-15)}}>
        <BottomButtons onPress={()=> CheckEmptyCart() } buttonLabel={t('checkout')} count={t('items')+': '+cartCount()} price={getAmount()} />
      </View>
    </>
  );
}
/*
const mapStateToProps = (state) => ({
  cartItems : state.cart.cartItems
});
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(index); */
export default ReduxWrapper(index)
