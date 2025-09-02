import React, {useState, useRef, useEffect} from 'react';
import {View, Text, Pressable, SafeAreaView, SectionList, TextInput,Image, TouchableOpacity,StyleSheet, Linking} from 'react-native';
import {scale} from 'react-native-size-matters';
import Container from '../../components/Container';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Label from '../../components/Label';
import {appColors, shadow} from '../../utils/appColors';
import auth from '@react-native-firebase/auth';
import {AlertHelper} from '../../utils/AlertHelper';
import {CommonActions} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import color from 'color';


import writeData from '../../utils/writeData';
import getData from '../../utils/getData';
import ReduxWrapper from '../../utils/ReduxWrapper';

import PhoneInput from "react-native-phone-number-input";
import { useTranslation } from "react-i18next";
import "../../translation";
import { firebase } from '@react-native-firebase/analytics';


function index({getProductsList$,loginUser$, navigation}) {
  const refRBSheet = useRef();
  const { t, i18n } = useTranslation();
  const [credentials, setCredentials] = useState({});
  const [isloading, setisloading] = useState(false)

  const [user, setUser] = useState(null);

  const [mobile, setMobile] = useState(null);
  const [mobileCode, setMobileCode] = useState('MO');
  const [callingCode, setCallingCode] = useState('853');
  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');

  const phoneInput = useRef(null);

  const [resendTimer, setResendTimer] = useState(30); // 30 seconds countdown
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (confirm && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [confirm, resendTimer]);

  const changelanguage = (lang) => {
     i18n.changeLanguage(lang);
     refRBSheet.current.close()
  }
  const closesheet = () => {
    refRBSheet.current.close();
  }
  const signInWithMobileNumber = async () => {
    if(mobile) {
      setisloading(true);

      try {
        const confirmation = await auth().signInWithPhoneNumber('+'+callingCode+mobile);
        setConfirm(confirmation);
      } catch (e) {
        AlertHelper.show('error', e.message);
        console.log(e);
      }
      setisloading(false);
    }else {
      AlertHelper.show('error', t('mobilenumberisrequired'));
    }
  };

  const confirmCode = async () => {
    setisloading(true);
    try {
      await confirm.confirm(code);
      setisloading(false);
      const getU = await getData('users','+'+callingCode+mobile );
      if(getU.data()) {
        if(getU.data()['country']) {
          if(getU.data()['rewardpoints']) {
            AlertHelper.show('success', t('youhave')+' '+getU.data()['rewardpoints']+' '+ t('rewardpoints'));
          }
          navigation.navigate('Home');
        }else {
          if(getU.data()['rewardpoints']) {
            AlertHelper.show('success', t('youhave')+' '+getU.data()['rewardpoints']+' '+ t('rewardpoints'));
          }
          navigation.navigate('SignUp');
        }
      }else {
        const getnewr = await getData('settings','rewardsettings');
        const newreward = getnewr.data()['newuser'];
        await writeData('users','+'+callingCode+mobile, {mobile : '+'+callingCode+mobile, rewardpoints: newreward} );
        AlertHelper.show('success', t('yougot')+' '+newreward+' '+t('rewardpoints'));
        navigation.navigate('SignUp');
      }


    } catch (error) {
      setisloading(false);
      AlertHelper.show('error', t('invalidcode'));
    }
  };
  const gototerms = async () => {
    navigation.navigate('Termsncondition');
    //navigation.navigate('SignUp');
  };
  const gotoprivacy = async () => {
    navigation.navigate('Privacy');
  }

  // const onLogin = async () => {
  //   //auth().signOut()
  //   const {mobile} = credentials;
  //
  //   try {
  //       if(mobile){
  //         setisloading(true)
  //         const {user,additionalUserInfo} = await auth().signInWithEmailAndPassword(
  //         email?.toLowerCase(),
  //         password?.toLowerCase(),
  //       );
  //       console.log(user);
  //       if (user?.uid) {
  //         if(additionalUserInfo?.isNewUser){
  //           const {providerId,profile} =additionalUserInfo
  //         //create new user and login
  //         await writeData('users',{email :user?.email, name: user?.displayName  , uid:user?.uid  ,photoURL : user?.photoURL  ,providerId,profile} )
  //         }
  //         loginUser$({email:user?.email, name: user?.displayName ? user?.displayName : "User", uid: user?.uid } );
  //         getProductsList$()
  //         AlertHelper.show('success', 'Welcome to Macau Nutrition');
  //         navigation.navigate('Home');
  //       }
  //     }else{
  //       setisloading(false)
  //       AlertHelper.show('error', 'Email and password is required!!');
  //     }
  //
  //   } catch (error) {
  //     AlertHelper.show('error', 'Something went woring');
  //   }
  // };

  const onChangeText = (name, text) => {
    if(text) {
      setMobile(text)
    }else {
      setisloading(false);
      setConfirm('');
    }

    //setCredentials({...credentials, [name]: text});
  };
  const addanalytics = async () => {
    await firebase.analytics().setCurrentScreen('Login');
  }
  useEffect(() => {
    addanalytics();
  }, []);

  const resendCode = async () => {
    if (callingCode && mobile && canResend) {
      setisloading(true);
      try {
        const confirmation = await auth().signInWithPhoneNumber('+'+callingCode+mobile);
        setConfirm(confirmation);
        setResendTimer(30); // Reset the timer
        setCanResend(false);
        AlertHelper.show('success', t('codesent'));
      } catch (e) {
        AlertHelper.show('error', e.message);
        console.log(e);
      }
      setisloading(false);
    } else {
      AlertHelper.show('error', t('mobilenumberisrequired'));
    }
  };

  const backToMobileNumber = () => {
    setConfirm(null);
    setCode('');
    setResendTimer(30); // Reset the timer
    setCanResend(false);
  };

  return (
    <Container isScrollable>
      <View
        style={{
          marginTop: scale(50),
          backgroundColor: appColors.white,
          ...shadow,
          padding: scale(15),
          borderRadius: scale(5),
        }}>
        <Image
        resizeMode='contain'
        style={{width:'100%',height:scale(100)}}
        source={require('../../static/images/logo.jpg')} />

        <Text style={{width: '100%',textAlign:"center",fontSize:20,marginTop:0}}>{t('signprob')}</Text>
        <Text style={{width: '100%',justifyContent: 'space-between',display:'block',fontSize:14,marginTop:15,marginBottom:30}}>
          {t('entaccountyou')}
        </Text>
        <View style={{paddingVertical: scale(10)}}>
             {!confirm ? (
               <>
               <PhoneInput
                ref={phoneInput}
                defaultValue={mobile}
                defaultCode={mobileCode}
                onChangeCountry={ (value) => {
                  setMobileCode(value.cca2);
                  setCallingCode(value.callingCode);
                }}
                onChangeText={ (puremobile) => {
                  onChangeText('mobile', puremobile)
                }}
                placeholder={t('mobilenumber')}
                containerStyle={{borderRadius:6}}
                textContainerStyle={{paddingVertical:5, backgroundColor:appColors.lightGray,borderTopRightRadius:6,borderBottomRightRadius:6}}
                withDarkTheme
                withShadow
                autoFocus
              />
                 <CustomButton isLoading={isloading}  onPress={signInWithMobileNumber} label={t('continue')} />
                 <Text styles={{paddingTop:100}}>
                    {t('termtxt1')} <Text style={{color: appColors.primary}} onPress={gototerms}>{t('termsandconditions')}</Text> {t('and')} <Text onPress={gotoprivacy} style={{color: appColors.primary}}>{t('privacypolicy')}</Text>
                 </Text>
               </>
             ) : (
               <>
               <CustomInput
                 value={code}
                 onChangeText={e => setCode(e)}
                 placeholder={t('code')}
                 keyboardType="numeric"
                 label=""
               />
                <CustomButton isLoading={isloading}  onPress={confirmCode} label={t('confirmcode')} />
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                  <TouchableOpacity onPress={backToMobileNumber}>
                    <Text style={{color: appColors.primary}}>{t('backtomobile')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={resendCode} disabled={!canResend}>
                    <Text style={{color: canResend ? appColors.primary : appColors.gray}}>
                      {canResend ? t('resendcode') : `${t('resendcodein')} ${resendTimer}s`}
                    </Text>
                  </TouchableOpacity>
                </View>
               </>
             )}
       </View>
       </View>
       <View style={{
         marginTop: scale(50),
         padding: scale(15),
         borderRadius: scale(5),
         alignItems:'center'
       }}>
          <Text style={{fontSize:16,fontWeight:'bold'}}>{t('problem')}</Text>
          <Feather style={{color:appColors.primary,marginTop:30}} name={"headphones"} size={scale(30)} onPress={ ()=>{ Linking.openURL('https://macaunutrition.com/macaunutritiona.html')}} />
       </View>
       <View style={styles.langcontainer}>
        {/* Other content */}
        <View style={styles.bottomView}>
          <Text style={{color:appColors.primary,fontSize:15,marginBottom:10}} onPress={() => refRBSheet.current.open()}>語言 Language</Text>
          <Text style={{fontSize:scale(11)}}>Version 1.3.1</Text>
        </View>
      </View>
       <RBSheet
        ref={refRBSheet}
        openDuration={250}
        closeOnDragDown={true}
        closeOnPressMask={true}
         height={200}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
          container: {
            borderTopRightRadius:scale(20),
            borderTopLeftRadius: scale(20),
          }
        }}
        customModalProps={{
          animationType: 'fade',
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}>
        <View
          style={{
            flexDirection: 'row',
            //justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: scale(15),
            paddingHorizontal: scale(10),
            //backgroundColor: '#76b729',
            marginBottom: scale(5),
            borderBottomColor:color(appColors.black).alpha(0.2).rgb().string(),
            borderBottomWidth:scale(1),
          }}>
          <Pressable onPress={() => refRBSheet.current.close()}>
            <Feather name="x" color={appColors.primary} size={scale(25)} />
          </Pressable>

          <Label
            text={t('selectlanguage')}
            style={{fontWeight: '500', fontSize: scale(18),color:appColors.primary,marginLeft:scale(20)}}
          />
        </View>
        <Text onPress={() => changelanguage('cn')} style={{fontSize:scale(15),paddingVertical:scale(15),paddingHorizontal:scale(10),borderBottomColor:color(appColors.black).alpha(0.2).rgb().string(),borderBottomWidth:scale(1),}}>中文</Text>
        <Text onPress={() => changelanguage('en')}  style={{fontSize:scale(15),paddingVertical:scale(15),paddingHorizontal:scale(10)}}>English</Text>
      </RBSheet>
    </Container>
  );

}
const styles = StyleSheet.create({
  langcontainer: {
    flex: 1,
    justifyContent: 'flex-end', // Moves the view to the bottom
    alignItems:'center',
  },
  bottomView: {
    paddingTop: 50,
    alignItems:'center',
  },
});
export default ReduxWrapper(index);
