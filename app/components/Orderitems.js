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

export default function CheckOutItem({ navigation, renderBagge, hideSteper,noBg, image, item, itemid, name, price, quantity}) {
  const { t, i18n } = useTranslation();
const [buyqty, setBuyqty] = useState(quantity);
const dispatch = useDispatch();
const singleProduct = item.singleproduct;
//console.warn(singleProduct);
const updatecart = (itemid, qty) => {
  setBuyqty(qty);
  dispatch(updateCartItem(itemid,qty))
}
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor:  'white',
        //borderRadius: scale(  5 )
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
            source={{uri:APP_IMGURL+'/products/'+item.pid+'/'+item.variation+'/'+item.vimage} }
          />  )}

      </Pressable>

      <View
        style={{
          marginLeft: scale(10),
          justifyContent: 'space-between',
          paddingVertical: scale(10),
        }}>
        <>
        {i18n.language == 'en' ? (
          <Label text={name?.substring(0,20)} style={{fontWeight: '600' ,}} />) : (
            <Label text={item.cname?.substring(0,20)} style={{fontWeight: '600' ,}} /> )}
        </>

        { !item.variationname  && (
          <Label
          text={`${APP_CURRENY.symbol} ${item.price}`}
          style={{
            fontSize: scale(18),
            fontWeight: '500',
            color: appColors.primary,
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
                      color: appColors.primary,
                    }}/>
                  </>
                ) : (
                  <>
                  <Label
                  text={`${APP_CURRENY.symbol} ${item.vprice}`}
                  style={{
                    fontSize: scale(18),
                    fontWeight: '500',
                    color: appColors.primary,
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
                  color: appColors.primary,
                }}/>
              </>
            )}

        </>)}
        { item.variationname  && (
          <>
          {i18n.language == 'en' ? (
            <Label
              text={item.variationname+' : '+item.optionname}
              style={{
                fontSize: scale(11),
                fontWeight: '500',
                color: appColors.black,
              }}
            />) : (
              <Label
                text={item.variationcname+' : '+item.optioncname}
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
              <Label
                text={t('quantity')+' : '+buyqty}
                style={{
                  fontSize: scale(11),
                  fontWeight: '500',
                  color: appColors.black,
                }}
              />
          

        {renderBagge&&renderBagge()}
      </View>
    </View>
  );
}
