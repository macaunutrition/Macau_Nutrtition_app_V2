import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet, Image, Dimensions, Linking } from 'react-native';
const {width} = Dimensions.get('window');
import SelectDropdown from 'react-native-select-dropdown'
import {scale} from 'react-native-size-matters';
import Container from '../../components/Container';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Label from '../../components/Label';
import {appColors, shadow} from '../../utils/appColors';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import {AlertHelper} from '../../utils/AlertHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import "../../translation";
import getData from '../../utils/getData';
import { firebase } from '@react-native-firebase/analytics';

import updateData from '../../utils/updateData';
export default function index({navigation}) {
  const { t, i18n } = useTranslation();
  const [countries, setCountries] = useState([]);

  const languages = ["English", "中文"];
  const currency = ["MOP"]; //'HKD', "RMB"

  const [userInfo, setUserInfo] = useState({});
  const onChnage = (name, text) => {
    setUserInfo({...userInfo, [name]: text});
  };

  const saveUdata =async () => {
    const usermobile = await AsyncStorage.getItem('user');
    const {country,language,currency}=userInfo;
    if(!country) {
      AlertHelper.show("error", t('selectcountry'));
      return;
    }
    if(!language) {
      AlertHelper.show("error",  t('selectlanguage'));
      return;
    }
    if(!currency) {
      AlertHelper.show("error", t('selectcurrency'));
      return;
    }
    await updateData('users', usermobile, {country : country, language: language, currency: currency} );
    if(language == '中文') {
      await AsyncStorage.setItem('lang', 'cn');
      i18n.changeLanguage('cn');
    }else {
      await AsyncStorage.setItem('lang', 'en');
      i18n.changeLanguage('en');
    }
    navigation.navigate('Home');
  };
  const LoadData = async () => {
    if(i18n.language == 'en') {
      setCountries(["Macau", "China", "Hong Kong"]);
    }else {
      setCountries(["Macau", "China", "Hong Kong"]);
    }
    const mobile = await AsyncStorage.getItem('user');
    const getU = await getData('users',mobile );
    if(getU.data()) {
      if(getU.data()['country']) {
        navigation.navigate('Home');
      }
    }
  }
  const addanalytics = async () => {
    await firebase.analytics().setCurrentScreen('SignUp');
  }
  useEffect(() => {
   LoadData();
   addanalytics();
 }, []);
  return (
    <Container isScrollable>
      <View
        style={{
          marginTop: scale(70),
          backgroundColor: appColors.white,
          ...shadow,
          padding: scale(15),
          borderRadius: scale(5),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <Image
          resizeMode='contain'
          style={{width:'100%',height:scale(100)}}
          source={require('../../static/images/logo.jpg')} />
        </View>
        <View style={{paddingVertical: scale(15)}}>
          <Label
            text={t('confirmcounreg')}
            style={{
              fontSize: scale(16),
              //fontWeight: '500',
              color: appColors.black,
            }}
          />
        </View>
        <View style={{paddingVertical: scale(10)}}>
        <SelectDropdown
           data={countries}
           // defaultValueByIndex={1}
           // defaultValue={'Egypt'}
           onSelect={(selectedItem, index) => {
             console.log(selectedItem, index);
             onChnage('country', selectedItem)
           }}
           defaultButtonText={t('country')}
           buttonTextAfterSelection={(selectedItem, index) => {
             return selectedItem;
           }}
           rowTextForSelection={(item, index) => {
             return item;
           }}
           buttonStyle={styles.dropdown1BtnStyle}
           buttonTextStyle={styles.dropdown1BtnTxtStyle}
           renderDropdownIcon={isOpened => {
             return <Feather
               name={isOpened ? 'chevron-up' : 'chevron-down'}
               size={scale(18)}
               color={appColors.black}
             />;
           }}
           dropdownIconPosition={'right'}
           dropdownStyle={styles.dropdown1DropdownStyle}
           rowStyle={styles.dropdown1RowStyle}
           rowTextStyle={styles.dropdown1RowTxtStyle}
         />
        </View>
        <View style={{paddingVertical: scale(10)}}>
          <SelectDropdown
             data={languages}
             // defaultValueByIndex={1}
             // defaultValue={'Egypt'}
             onSelect={(selectedItem, index) => {
               console.log(selectedItem, index);
               onChnage('language', selectedItem)
             }}
             defaultButtonText={t('language')}
             buttonTextAfterSelection={(selectedItem, index) => {
               return selectedItem;
             }}
             rowTextForSelection={(item, index) => {
               return item;
             }}
             buttonStyle={styles.dropdown1BtnStyle}
             buttonTextStyle={styles.dropdown1BtnTxtStyle}
             renderDropdownIcon={isOpened => {
               return <Feather
                 name={isOpened ? 'chevron-up' : 'chevron-down'}
                 size={scale(18)}
                 color={appColors.black}
               />;
             }}
             dropdownIconPosition={'right'}
             dropdownStyle={styles.dropdown1DropdownStyle}
             rowStyle={styles.dropdown1RowStyle}
             rowTextStyle={styles.dropdown1RowTxtStyle}
           />
        </View>
        <View style={{paddingVertical: scale(10)}}>
          <SelectDropdown
             data={currency}
             // defaultValueByIndex={1}
             // defaultValue={'Egypt'}
             onSelect={(selectedItem, index) => {
               onChnage('currency', selectedItem)
             }}
             defaultButtonText={t('currency')}
             buttonTextAfterSelection={(selectedItem, index) => {
               return selectedItem;
             }}
             rowTextForSelection={(item, index) => {
               return item;
             }}
             buttonStyle={styles.dropdown1BtnStyle}
             buttonTextStyle={styles.dropdown1BtnTxtStyle}
             renderDropdownIcon={isOpened => {
               return <Feather
                 name={isOpened ? 'chevron-up' : 'chevron-down'}
                 size={scale(18)}
                 color={appColors.black}
               />;
             }}
             dropdownIconPosition={'right'}
             dropdownStyle={styles.dropdown1DropdownStyle}
             rowStyle={styles.dropdown1RowStyle}
             rowTextStyle={styles.dropdown1RowTxtStyle}
           />
        </View>
        <CustomButton onPress={saveUdata} label={t('next')} />
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
    </Container>
  );
}
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
  saveAreaViewContainer: {flex: 1, backgroundColor: '#FFF'},
  viewContainer: {flex: 1, width, backgroundColor: '#FFF'},
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '10%',
    paddingBottom: '20%',
  },

  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.darkGray,
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},

  dropdown2BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  dropdown2BtnTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dropdown2DropdownStyle: {
    backgroundColor: '#444',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropdown2RowStyle: {backgroundColor: '#444', borderBottomColor: '#C5C5C5'},
  dropdown2RowTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  dropdown3BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#444',
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdown3BtnImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3BtnTxt: {
    color: '#444',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 12,
  },
  dropdown3DropdownStyle: {backgroundColor: 'slategray'},
  dropdown3RowStyle: {
    backgroundColor: 'slategray',
    borderBottomColor: '#444',
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdownRowImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3RowTxt: {
    color: '#F1F1F1',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 12,
  },

  dropdown4BtnStyle: {
    width: '50%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown4BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown4RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown4RowTxtStyle: {color: '#444', textAlign: 'left'},
});
