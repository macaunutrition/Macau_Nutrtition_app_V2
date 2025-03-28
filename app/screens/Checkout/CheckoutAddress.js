import React, {useRef, useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import CheckBox from '../../components/CheckBox';
import Label from '../../components/Label';
import CustomInput from '../../components/CustomInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import "../../translation";
import {appColors} from '../../utils/appColors';
import auth from '@react-native-firebase/auth';
import getData from '../../utils/getData';
import { firebase } from '@react-native-firebase/analytics';
export default function CheckoutAddress() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [comment, setComment] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const setititalData = async () => {
    const user = auth().currentUser;
    const mobile = user.phoneNumber;
    const getU = await getData('users', mobile);
    const gets = await AsyncStorage.getItem('orderstreet');
    const getc = await AsyncStorage.getItem('ordercomment');
    const getn = await AsyncStorage.getItem('ordername');
    const getp = await AsyncStorage.getItem('orderphone');
    const gete = await AsyncStorage.getItem('orderemail');
    if( gete == '' || gete == null) {
      const userEmail = getU.data().email; 
      setEmail(userEmail);
      await AsyncStorage.setItem('orderemail', userEmail);
    }
    if (getn == '' || getn == null) {
      const userName = getU.data().name;
      setName(userName);
      await AsyncStorage.setItem('ordername', userName);
    }
    if (getp == '' || getp == null) {
      const userPhone = getU.data().contactphone;
      setPhone(userPhone);
      await AsyncStorage.setItem('orderphone', userPhone);
    }
    if (gets == '' || gets == null) {
      const userAddress = getU.data().fulldeliveryaddress;
      setStreet(userAddress);
      await AsyncStorage.setItem('orderstreet', userAddress);
    }
  }

  const saveName = async (value) => {
      setName(value);
      await AsyncStorage.setItem('ordername', value);

  };
  const saveEmail = async (value) => {
      setEmail(value);
      await AsyncStorage.setItem('orderemail', value);

  };
  const savePhone = async (value) => {
      setPhone(value);
      await AsyncStorage.setItem('orderphone', value);

  };
  const saveStreet = async (value) => {
      setStreet(value);
      await AsyncStorage.setItem('orderstreet', value);

  };
  const saveComment = async (value) => {
      setComment(value);
      await AsyncStorage.setItem('ordercomment', value);
  };
  const getSavedetails = async () => {
    const getn = await AsyncStorage.getItem('ordername');
    setName(getn);
    const gete = await AsyncStorage.getItem('orderemail');
    setEmail(gete);
    const getp = await AsyncStorage.getItem('orderphone');
    setPhone(getp);

    const gets = await AsyncStorage.getItem('orderstreet');
    setStreet(gets);
    const getc = await AsyncStorage.getItem('ordercomment');
    setComment(getc);

    const termsel = await AsyncStorage.getItem('terms');
    if(!termsel) {
      setIsChecked(false);
      await AsyncStorage.setItem('terms', 'no');
    }else {
        if(termsel == 'no') {
          setIsChecked(false);
        }else {
          setIsChecked(true);
        }
    }
  }
  const gototerms = async () => {
    //console.warn(navigation.navigate('Termsncondition'));
    navigation.navigate('Termsncondition');
    //navigation.navigate('SignUp');
  };
  const termncondiCheck = async () => {
    if(isChecked) {
      await AsyncStorage.setItem('terms', 'no');
      setIsChecked(false);
    }else {
      await AsyncStorage.setItem('terms', 'yes');
      setIsChecked(true);
    }
  };
  const addanalytics = async () => {
    await firebase.analytics().setCurrentScreen('Checkout Address');
  } 
  useEffect(  () => {
    getSavedetails();
    setititalData();
    addanalytics();
  }, []);
  return (
    <View style={{paddingVertical: scale(30)}}>
      <View style={{paddingVertical: scale(10)}}>
           <CustomInput containerStyle={{backgroundColor: 'transparent'}} onChangeText={value => saveName(value)} value={name} label={t('fullname')}  />
      </View>
      <View style={{paddingVertical: scale(10)}}>
           <CustomInput containerStyle={{backgroundColor: 'transparent'}} onChangeText={value => saveEmail(value)} value={email} label={t('emailid')}  />
      </View>
      <View style={{paddingVertical: scale(10)}}>
           <CustomInput keyboardType={"numeric"} containerStyle={{backgroundColor: 'transparent'}} onChangeText={value => savePhone(value)} value={phone} label={t('phonenumber')}   />
      </View>
      <View style={{paddingVertical: scale(10)}}>
           <CustomInput containerStyle={{backgroundColor: 'transparent'}} onChangeText={strettext => saveStreet(strettext)} value={street} label={t('fulldeliveryaddress')}   />
      </View>
      <View style={{paddingVertical: scale(10)}}>
           <CustomInput containerStyle={{backgroundColor: 'transparent'}} onChangeText={commenttext => saveComment(commenttext)} value={comment} label={t('deliverycomment')}   />
      </View>
      <View style={{paddingVertical: scale(10)}}>
         <View style={{flex:1,  flexDirection: 'row', justifyContent: 'space-around', alignItems:'center'}}>
            <Pressable
              onPress={() => termncondiCheck()}
              style={[
                {
                  borderRadius: scale(15),
                  borderColor: appColors.white,
                  height: scale(20),
                  width: scale(20),
                  marginLeft:scale(1)
                },
                isChecked ? styles.checked : styles.unChecked,
              ]}>
              </Pressable>
              <View style={{paddingLeft:scale(10)}}>
                <Text onPress={() => termncondiCheck()}>
                   {t('termtxt1')} <Text style={{color: appColors.primary}} onPress={gototerms}>{t('termsandconditions')}</Text>
                </Text>
              </View>

            </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  checked: {
    borderWidth: scale(5),
    backgroundColor: appColors.primary,
    borderColor: appColors.white,
  },
  unChecked: {
    backgroundColor: appColors.gray,
  },
});
