import React, {useRef, useEffect, useState} from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {scale} from 'react-native-size-matters';
import {AlertHelper} from '../../utils/AlertHelper';
import Container from '../../components/Container';
import Label from '../../components/Label';
import CustomButton from '../../components/CustomButton';
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

// Visual scroll indicator state
const [scrollProgress, setScrollProgress] = useState(0);
const [showScrollIndicator, setShowScrollIndicator] = useState(false);
const listRef = useRef(null);

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

 const handleContinueShopping = () => {
   // Try to go back to previous screen, if not possible go to Home
   if (navigation.canGoBack()) {
     navigation.goBack();
   } else {
     navigation.navigate('Home');
   }
 }

 // Visual scroll indicator function
 const handleScroll = (event) => {
   const offsetY = event.nativeEvent.contentOffset.y;
   const contentHeight = event.nativeEvent.contentSize.height;
   const layoutHeight = event.nativeEvent.layoutMeasurement.height;
   
   // Calculate scroll progress (0 to 1)
   const maxScroll = Math.max(0, contentHeight - layoutHeight);
   const progress = maxScroll > 0 ? offsetY / maxScroll : 0;
   setScrollProgress(progress);
   
   // Show indicator if there's scrollable content
   setShowScrollIndicator(contentHeight > layoutHeight);
 };

  return (
    <>
      <Container >
        <View style={{flex: 1, paddingVertical: scale(8)}}>
          <SwipeListView
          ListEmptyComponent={()=> <Empty  label={t('yourcartisempty')}/> }
          showsVerticalScrollIndicator={false}
            keyExtractor={(item) => `${item.id}}`}
            ItemSeparatorComponent={() => <View style={{padding: scale(4)}} />}
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
      <View style={{backgroundColor: appColors.white, bottom: scale(-4), paddingHorizontal: scale(20), paddingVertical: scale(4)}}>
        {/* Price and Items Info */}
        <View style={{marginBottom: scale(2)}}>
          <Label
            text="TOTAL"
            style={{
              fontSize: scale(14),
              opacity: scale(0.4),
              letterSpacing: scale(2),
            }}
          />
          <Label
            text={t('items')+': '+cartCount()}
            style={{
              fontSize: scale(12),
              letterSpacing: scale(2),
              marginTop: scale(2),
            }}
          />
          <Label
            text={getAmount()}
            style={{
              fontSize: scale(16),
              fontWeight: '800',
              color: appColors.primaryDark,
              marginTop: scale(2),
            }}
          />
        </View>
        
        {/* Dual Button Layout */}
        <View style={{
          flexDirection: 'row', 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: scale(20),
        }}>
          {/* Continue Shopping Button */}
          <CustomButton 
            style={{
              width: scale(150),
              height: scale(40),
              backgroundColor: appColors.lightGray,
              borderWidth: 1,
              borderColor: appColors.primaryDark,
              paddingVertical: scale(3),
              paddingHorizontal: scale(8),
              marginRight: scale(10), // 10px space between buttons
            }}
            labelStyle={{
              color: appColors.black,
              fontSize: scale(12),
              fontWeight: '300',
              textAlign: 'center',
            }}
            onPress={handleContinueShopping} 
            label="CONTINUE SHOPPING"
          />
          
          {/* Checkout Button */}
          <CustomButton 
            style={{
              width: scale(150),
              height: scale(40),
              paddingVertical: scale(3),
              paddingHorizontal: scale(8),
              marginLeft: scale(10), // 10px space between buttons
            }} 
            onPress={()=> CheckEmptyCart()} 
            label={t('checkout')} 
          />
        </View>
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
