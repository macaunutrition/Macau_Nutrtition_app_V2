import React from 'react';
import {View, Text, FlatList, TextInput,KeyboardAvoidingView } from 'react-native';
import Container from '../../components/Container';
import {bestSellersList} from '../../utils/MockData';
import CheckOutItem from '../../components/CheckOutItem';
import {scale} from 'react-native-size-matters';
import {appColors} from '../../utils/appColors';
import Label from '../../components/Label';
import CustomButton from '../../components/CustomButton';
import {addToCart} from '../../redux/cartAction';
import ReduxWrapper from '../../utils/ReduxWrapper';
import { APP_CURRENY } from '../../utils/appConfig';
import { useTranslation } from "react-i18next";
import "../../translation";

export default function index({route:{params}, navigation}) {
  const { t, i18n } = useTranslation();
  const cartItems = params.cartItems;
  const getAmount = ()=>{
    let amount =0
    cartItems?.map(item=>{
      const {price, vprice, quantity} =item;
      if(item.variationname) {
        amount+= Number( vprice )*Number(quantity);
      }else {
        amount+= Number( price )*Number(quantity);
      }
    })
    return  `${APP_CURRENY.symbol} ${amount}`

  }
  return (
    <>
    <KeyboardAvoidingView style={{flex:1}}>
      <Container
        isScrollable
        bodyStyle={{
          flex: 1,
          paddingHorizontal: scale(0),
          paddingVertical: scale(20),
        }}>
        <View
          style={{paddingHorizontal: scale(20), paddingVertical: scale(20)}}>
          <FlatList
          showsVerticalScrollIndicator={false}
            data={cartItems}
            ItemSeparatorComponent={() => <View style={{padding: scale(10)}} />}
            renderItem={({item, index}) => (
              <CheckOutItem
                noBg
                itemid={item.id}
                name={item.name}
                image={item.image}
                price={item.price}
                quantity={item.quantity}
                variation={item.variation}
                variationname={item.variationname}
                optionid={item.optionid}
                optionname={item.optionname}
                wieght={item.wieght}
                getpoint={item.getpoint}
              />
            )}
          />
        </View>
        <View
          style={{
            borderColor: appColors.lightGray,
            /*  bottom:scale(130),  */ borderBottomWidth: scale(2),
            borderTopWidth: scale(2),
          }}>
          <View
            style={{
              paddingVertical: scale(20),
              paddingHorizontal: scale(20),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Label
              text={t('subtotal')}
              style={{fontWeight: '400', fontSize: scale(18)}}
            />
            <View
              style={{
                borderRadius: scale(1),
                borderWidth: scale(0.5),
                borderStyle: 'dashed',
                width: '50%',
              }}
            />
            <Label text={getAmount()} style={{fontWeight: '800'}} />
          </View>


        </View>



        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: scale(20),
            paddingVertical: scale(30),
          }}>
          <CustomButton label={t('checkout')} onPress={()=> navigation.navigate("CheckOutSteper", {cartItems})} />
        </View>
      </Container>
    </KeyboardAvoidingView>
    </>
  );
}
