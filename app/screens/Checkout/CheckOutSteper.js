import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Container from '../../components/Container';
import Stepper from 'react-native-stepper-ui';
import CheckoutDelivery from './CheckoutDelivery';
import {appColors} from '../../utils/appColors';
import CustomButton from '../../components/CustomButton';
import {scale} from 'react-native-size-matters';
import ScreenHeader from '../../components/ScreenHeader';
import CheckoutHeader from '../../components/checkoutHeader';
import CheckoutAddress from './CheckoutAddress';
import CheckoutPayment from './CheckoutPayment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AlertHelper} from '../../utils/AlertHelper';
import { useTranslation } from "react-i18next";
import "../../translation";
import i18n from "../../translation";
import getData from '../../utils/getData';
const {height} = Dimensions.get('window');

export default function CheckOutSteper({route:{params}, navigation}) {
  const { t, i18n } = useTranslation();
  const [userInfo, setUserInfo] = useState({});
  const [setting, setSetting] = useState({});
  const [active, setActive] = useState(0);
  const cartItems = params.cartItems;
  const actives = params.active;
  const onFinish = async () => {
    const gets = await AsyncStorage.getItem('orderstreet');
    const getc = await AsyncStorage.getItem('ordercomment');
    const getn = await AsyncStorage.getItem('ordername');
    const getp = await AsyncStorage.getItem('orderphone');
    const gete = await AsyncStorage.getItem('orderemail');

    const rempoint = await AsyncStorage.getItem('remainingpoint');
    const updatedprice = await AsyncStorage.getItem('updatedprice');
    navigation.navigate("Summary", {cartItems,gets,getc,getn,getp,gete,rempoint,updatedprice})
     //Summary
  };
  const onNext = async () => {
    const gets = await AsyncStorage.getItem('orderstreet');
    const getn = await AsyncStorage.getItem('ordername');
    const getp = await AsyncStorage.getItem('orderphone');
    const gete = await AsyncStorage.getItem('orderemail');
    const termsel = await AsyncStorage.getItem('terms');
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    if(!getn) {
      AlertHelper.show('error', t('pleaseentername'));
      return;
    }
    if(!gete) {
      AlertHelper.show('error', t('enteremail'));
      return;
    }
    if (!validateEmail(gete)) {
      AlertHelper.show('error', t('enteremail')); 
      return;
    }
    if(!getp) {
      AlertHelper.show('error', t('pleaseenterphonenumber'));
      return;
    }
    if(!gets) {
      AlertHelper.show('error', t('pleaseenteraddress'));
      return;
    }
    if(!termsel) {
      AlertHelper.show('error', t('readandagree'));
      return;
    }else {
      if(termsel == 'no') {
        AlertHelper.show('error', t('readandagree'));
        return;
      }
    }
    setActive((p) => p + 1)
  }
  const getUser = async () => {
    const mobile = await AsyncStorage.getItem('user');
    const getU = await getData('users',mobile );
    setUserInfo(getU._data);
    const seting =  await getData('settings','rewardsettings')
    setSetting(seting._data);
  }
  useEffect( () => {
    setActive((p) => 0)
   getUser();
 }, [params]);
  return (
    <Container isScrollable>
      <CheckoutHeader label={t('checkout')} navigation={navigation} />

      <Stepper
        stepStyle={styles.stepStyle}
        active={active}
        onFinish={onFinish}
        content={[
          <CheckoutAddress />,
          <CheckoutPayment cartItems={cartItems} userInfo={userInfo} settings={setting}/>,
        ]}
        //showButton={false}
        onNext={onNext}
        onBack={() => setActive((p) => p - 1)}
        buttonStyle={styles.buttonStyle}
        buttonTextStyle={styles.buttonTextStyle}
        wrapperStyle={styles.wrapperStyle}
        nextText={t('next')}  // Custom Next Button Text
        backText={t('back')}            // Custom Back Button Text
        finishText={t('finish')}   
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  stepStyle: {
    backgroundColor: appColors.primary,
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  buttonTextStyle: {
    fontSize: scale(16),
    fontWeight: '300',
    color: appColors.white,
    letterSpacing: scale(2),
    textTransform: 'uppercase',
  },
  buttonStyle: {
    /*  padding: 10,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginRight: 10,
    backgroundColor: appColors.primary, */
    //top: scale(height / 9),
    height: scale(50),
    backgroundColor: appColors.primary,
    borderRadius: scale(5),
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: scale(10),
    paddingHorizontal: scale(50),
    //position:'absolute',
    bottom: scale( 0)


  },
  wrapperStyle: {},
});
