import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet, View, Pressable, TextInput} from 'react-native';
import {scale} from 'react-native-size-matters';
import {appColors} from '../utils/appColors';
import Feather from 'react-native-vector-icons/Feather';
import SelectDropdown from 'react-native-select-dropdown'
import { useTranslation } from "react-i18next";
import "../translation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
export default function SearchBox({autoFocus,onFoucs, isEditable,onChangeText, hideCamra, onRightIconPress,rightIcon}) {
  const navigation = useNavigation(); 
  const [selectlang, setSelectlang] = useState({});
  const languages = [{label: 'English', value: 'en'},{label: '中文', value: 'cn'}];
  const { t, i18n } = useTranslation();
  const getLang = async () => {
    const sellang = await AsyncStorage.getItem('lang');
    if(sellang == 'cn') {
      setSelectlang({label: '中文', value: 'cn'});
    }else {
      setSelectlang({label: 'English', value: 'en'});
    }

  }
  const handleFocus = () => {
    // When the TextInput is focused, navigate to a new screen (e.g., 'Search')
    navigation.navigate('Search'); 
  };
  useEffect( () => {
   getLang();
 }, [selectlang]);
  return (
    <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems:'center',paddingVertical:20}}>
      <View
        style={{
          flex:1,
          paddingHorizontal: scale(20),
          borderRadius: scale(20),
          alignItems: 'center',
          backgroundColor: appColors.lightGray,
          //width: '100%',
          flexDirection: 'row',
          height: scale(40),
        }}>
        <Feather name="search" size={scale(20)} color={appColors.black} />
        
        <TextInput
        autoFocus={autoFocus}
          onFocus={handleFocus}
          editable={isEditable}
          style={{flex: 1, paddingLeft: scale(10)}}
        />
      </View>
      <View>
        <SelectDropdown
           data={languages}
           //defaultValueByIndex={0}
           defaultValue={selectlang}
           onSelect={async (selectedItem, index) => {
             console.log(selectedItem, index);
             await AsyncStorage.setItem('lang', selectedItem.value);
             i18n.changeLanguage(selectedItem.value)
           }}
           defaultButtonText={'Language'}
           buttonTextAfterSelection={(selectedItem, index) => {
               return selectedItem.label
           }}
           rowTextForSelection={(item, index) => {
               return item.label
           }}
           buttonStyle={styles.dropdown1BtnStyle}
           buttonTextStyle={styles.dropdown1BtnTxtStyle}
           dropdownStyle={styles.dropdown1DropdownStyle}
           rowStyle={styles.dropdown1RowStyle}
           rowTextStyle={styles.dropdown1RowTxtStyle}
         />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  dropdownItemStyle: {
     width: '100%',
     flexDirection: 'row',
     paddingHorizontal: 12,
     justifyContent: 'center',
     alignItems: 'center',
     paddingVertical: 8,
   },
  dropdown1BtnStyle: {
    width: 80,
    height: 40,
    backgroundColor: appColors.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: appColors.primary,
    marginBottom: 10,
    marginTop: 10,
    marginRight:10
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
