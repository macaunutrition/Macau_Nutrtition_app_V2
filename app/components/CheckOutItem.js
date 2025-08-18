import React, {useRef, useEffect, useState} from 'react';
import {View, Text, Image, Pressable} from 'react-native';
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
import {AlertHelper} from '../utils/AlertHelper';

export default function CheckOutItem({ navigation, renderBagge, hideSteper,noBg, image, item, itemid, name, price, quantity}) {
  const { t, i18n } = useTranslation();
const [buyqty, setBuyqty] = useState(quantity);
const dispatch = useDispatch();
const singleProduct = item.singleproduct;
//console.warn(singleProduct);
const updatecart = (itemid, qty) => {
  if(item?.variationname) {
      if(Object.entries(item.sizedetails).length > 0) {
        const maxqty = item.sizedetails.sqty;
        if(qty > maxqty) {
            AlertHelper.show('error',  t('max')+' '+maxqty+' '+t('youcanbuy'));
            return;
        }
      }else {
        const maxqty = item.vqty;
        if(qty > maxqty) {
            AlertHelper.show('error',  t('max')+' '+maxqty+' '+t('youcanbuy'));
            return;
        }
      }
  }else {
    const maxqty = item.qty;
    if(qty > maxqty) {
        AlertHelper.show('error',  t('max')+' '+maxqty+' '+t('youcanbuy'));
        return;
    }
  }
  setBuyqty(qty);
  dispatch(updateCartItem(itemid,qty))
}
const truncateText = (text,limit) => {
  if(typeof text === 'string') {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  }
  return text;
};
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor:  'white',
      }}>
      <Pressable onPress={() => navigation.navigate('ProductDetails',{pid: singleProduct.pid})} >
      { !item.variationname  && (
        <Image
          style={{
            height: scale(130),
            width: scale(130),
             borderRadius:  scale(noBg ? 5 : 0),
            //backgroundColor:appColors.darkGray
          }}
          source={{uri:APP_IMGURL+'/products/'+item.pid+'/'+image} }
        />  )}
        { item.variationname  && (
          <Image
            style={{
              height: scale(130),
              width: scale(130),
               borderRadius:  scale(noBg ? 5 : 0),
              //backgroundColor:appColors.darkGray
            }}
            source={{ uri: item.vimage ? APP_IMGURL + '/products/' + item.pid + '/' + item.variation + '/' + item.vimage : APP_IMGURL + '/products/' + item.pid + '/' + image } }
          />  )}

      </Pressable>

      <View
        style={{
          marginLeft: scale(0),
          justifyContent: 'space-between',
          paddingVertical: scale(10),
          paddingHorizontal: scale(5),
        }}>
        <>
        {i18n.language == 'en' ? (
          <Label text={truncateText(item.name,15)} style={{fontWeight: '600' ,}} />) : (
            <Label text={truncateText(item.cname,10)} style={{fontWeight: '600' ,}} /> )}
        </>

        { !item.variationname  && (
          <Label
          text={`${APP_CURRENY.symbol} ${item.price}`}
          style={{
            fontSize: scale(18),
            fontWeight: '500',
            color: appColors.primaryDark,
          }}
        />  )}
        { item.variationname  && (
          <>
            { Object.entries(item.sizedetails).length > 0 ? (
              <>
                {item.sizedetails.sprice != null ? (
                  <>
                    <Label
                    text={`${APP_CURRENY.symbol} ${item.sizedetails.sprice}`}
                    style={{
                      fontSize: scale(18),
                      fontWeight: '500',
                      color: appColors.primaryDark,
                    }}/>
                  </>
                ) : (
                  <>
                  <Label
                  text={`${APP_CURRENY.symbol} ${item.vprice}`}
                  style={{
                    fontSize: scale(18),
                    fontWeight: '500',
                    color: appColors.primaryDark,
                  }}/>
                  </>
                )}
              </>
            ) : (
              <>
                <Label
                text={`${APP_CURRENY.symbol} ${item.vprice}`}
                style={{
                  fontSize: scale(18),
                  fontWeight: '500',
                  color: appColors.primaryDark,
                }}/>
              </>
            )}

        </>)}
        { item.variationname  && (
          <>
          {i18n.language == 'en' ? (
            <Label
              text={item.variationname+' : '+truncateText(item.optionname,20)}
              style={{
                fontSize: scale(11),
                fontWeight: '500',
                color: appColors.black,
              }}
            />) : (
              <Label
                text={item.variationcname+' : '+truncateText(item.optioncname,10)}
                style={{
                  fontSize: scale(11),
                  fontWeight: '500',
                  color: appColors.black,
                }}
              /> )}
          </>
           )}
          {  item.sizedetails && Object.entries(item.sizedetails).length > 0 && (
            <>
            {item.sizedetails.sweight != undefined && (
              <Label
                text={t('weight')+' : '+item.sizedetails.sweight}
                style={{
                  fontSize: scale(11),
                  fontWeight: '500',
                  color: appColors.black,
                }}
              />
            )}
            </>)}
            { item.manfacid && (
              <>
              {i18n.language == 'en' ? (
                <Label
                  text={t('brand')+' : '+item.manfac}
                  style={{
                    fontSize: scale(11),
                    fontWeight: '500',
                    color: appColors.black,
                  }}
                /> ) : (
                  <Label
                    text={t('brand')+' : '+item.cmanfac}
                    style={{
                      fontSize: scale(11),
                      fontWeight: '500',
                      color: appColors.black,
                    }}
                  /> )}
              </>
              )}

            <View
              style={{
                paddingTop: scale(10),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: scale(175),
                marginRight: scale(10),
              }}>
              <View style={{width:scale(70)}}>
                <Label text={t('quantity')} style={{fontSize: scale(12),fontWeight: '500'}} />
              </View>
              <View style={{ flex: 1 }}>
                <SimpleStepper
                containerStyle={{
                  backgroundColor: appColors.lightGray,
                  flexDirection: 'row',
                  borderRadius: scale(5),
                  overflow: 'hidden',
                  alignItems: 'center',
                  height: scale(25),
                  maxWidth: scale(100),
                }}
                minimumValue={1}
                maximumValue={item.variationname ? item.vqty : item.qty}
                initialValue={buyqty}
                showText={true}
                renderText={() => <Label style={{paddingHorizontal: scale(10)}} text={buyqty} />}
                incrementStepStyle={{padding: scale(5), opacity: scale(0.4)}}
                decrementStepStyle={{padding: scale(5), opacity: scale(0.4)}}
                incrementImageStyle={{height: scale(20), width: scale(20)}}
                decrementImageStyle={{height: scale(20), width: scale(20)}}
                valueChanged={value => updatecart(itemid,value)}
                />
              </View>
            </View>

        {renderBagge&&renderBagge()}
      </View>
    </View>
  );
}
