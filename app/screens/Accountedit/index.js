import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, SafeAreaView, Pressable, StyleSheet, Image, Dimensions, Linking, Alert } from 'react-native';
const {width} = Dimensions.get('window');
import SelectDropdown from 'react-native-select-dropdown'
import ScreenHeader from '../../components/ScreenHeader';
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


import updateData from '../../utils/updateData';
import deleteUser from '../../utils/deleteUser';
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
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    const usermobile = await AsyncStorage.getItem('user');
    const {name,email,country,currency,language,contactphone,fulldeliveryaddress}=userInfo;
    if(!name) {
      AlertHelper.show("error", t('entername'));
      return;
    }
    if(!language) {
      AlertHelper.show("error", t('selectlanguage'));
      return;
    }
    if(!email) {
      AlertHelper.show("error", t('enteremail'));
      return;
    }
    if (!validateEmail(email)) {
      AlertHelper.show('error', t('enteremail')); 
      return;
    }
    if(!currency) {
      AlertHelper.show("error", t('selectcurrency'));
      return;
    }
    if(!country) {
      AlertHelper.show("error", t('selectcountry'));
      return;
    }
    await updateData('users', usermobile, {name : name, language: language, currency: currency, country: country, email: email, contactphone: contactphone ? contactphone : '', fulldeliveryaddress: fulldeliveryaddress ? fulldeliveryaddress : ''} );
    if(language == '中文') {
      await AsyncStorage.setItem('lang', 'cn');
      i18n.changeLanguage('cn');
    }else {
      await AsyncStorage.setItem('lang', 'en');
      i18n.changeLanguage('en');
    }

    AlertHelper.show("success", t('successfullysaved'));
  };
   const deleteUserdata =async () => {
      const usermobile = await AsyncStorage.getItem('user');
        Alert.alert(
          t('confdel'),
          t('delconf'),
          [
              {
                  text: t('cancel'),
                  style: "cancel"
              },
              {
                  text: t('delete'),
                  onPress: async () => {
                      await deleteUser('users', usermobile);
                      const user = auth().currentUser; 
                      user.delete().then( async () => {
                        await AsyncStorage.removeItem('user');
                        auth().signOut();
                      }).catch((error) => {
                           Alert.alert("Error", error.message);
                           //Alert.alert("Error", t('faildel'));
                      });
                  },
                  style: "destructive"
              }
          ]
      );
   };
  const getUser = async () => {
    if(i18n.language == 'en') {
      setCountries(["Macau", "China", "Hong Kong"]);
    }else {
      setCountries(["Macau", "China", "Hong Kong"]);
    }
    const mobile = await AsyncStorage.getItem('user');
    const getU = await getData('users',mobile );
    setUserInfo(getU._data);
  }
  useEffect( () => {
   getUser();
 }, []);
  return (
    <>
    <SafeAreaView>
    <View
      style={{
        flexDirection: 'row',
        //justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: scale(15),
        paddingHorizontal: scale(10),
        backgroundColor: '#76b729',
        marginBottom: scale(5),
      }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" color={appColors.white} size={scale(25)} />
        </Pressable>
        <Label
          text={t('editprofile')}
          style={{fontWeight: '500', color: 'white',fontSize: scale(18)}}
        />
    </View>
    </SafeAreaView>
      <Container isScrollable>
        <View
        >

          <View style={{paddingVertical: scale(10)}}>
          <View style={{paddingBottom: scale(20)}}>
              <TextInput
               value={userInfo.name}
               style={{
                  ...styles.dropdown1BtnStyle,
                  paddingHorizontal: 15,
                  fontSize: 16,
                  color: '#000'
               }}
               placeholder={t('fullname')}
               maxLength={40}
               onChangeText={value => onChnage('name', value)}
               selectionColor="#000"
            />
          </View>
          <View style={{paddingBottom: scale(10)}}>
              <TextInput
               value={userInfo.email}
               style={{
                  ...styles.dropdown1BtnStyle,
                  paddingHorizontal: 15,
                  fontSize: 16,
                  color: '#000'
               }}
               placeholder={t('emailid')}
               keyboardType="email-address"
               maxLength={40}
               onChangeText={value => onChnage('email', value)}
               selectionColor="#000"
            />
          </View>
          <View style={{paddingTop: scale(10),paddingBottom: scale(20)}}>
            <TextInput
              value={userInfo.contactphone}
              style={{
                ...styles.dropdown1BtnStyle,
                paddingHorizontal: 15,
                fontSize: 16,
                color: '#000'
              }}
              placeholder={t('contactphone')}
              keyboardType="numeric"
              onChangeText={value => onChnage('contactphone', value)}
              selectionColor="#000"
            />
          </View>
          <SelectDropdown
             data={countries}
             // defaultValueByIndex={1}
             defaultValue={userInfo.country}
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
               defaultValue={userInfo.language}
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
               defaultValue={userInfo.currency}
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
          <View style={{paddingVertical: scale(10)}}>
            <TextInput
              value={userInfo.fulldeliveryaddress}
              style={{
                ...styles.dropdown1BtnStyle,
                paddingHorizontal: 15,
                height: scale(100),
                fontSize: 16,
                color: '#000',
                textAlignVertical: 'top',
              }}
              placeholder={t('fulldeliveryaddress')}
              onChangeText={value => onChnage('fulldeliveryaddress', value)}
              selectionColor="#000"
            />
          </View>
          <CustomButton onPress={saveUdata} label={t('save')} />
        </View>
        <View style={styles.langcontainer}>
        <View style={styles.bottomView}>
          <Text style={{color:appColors.red,fontSize:15,marginBottom:10}} onPress={() => deleteUserdata() }>{t('deleteaccount')}</Text>
        </View>
      </View>
      </Container>
    </>
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
