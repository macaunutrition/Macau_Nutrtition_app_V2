import React,{useState,useEffect, useRef} from 'react';
import {View, Text,TextInput,FlatList,Pressable,Image,StyleSheet} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {AlertHelper} from '../../utils/AlertHelper';
import { scale } from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import { appColors } from '../../utils/appColors';
import { paymentMethods } from '../../utils/MockData';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CheckBox from 'react-native-check-box';
import Label from '../../components/Label';
import { color } from 'react-native-reanimated';
import { APP_CURRENY } from '../../utils/appConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import "../../translation";
import { firebase } from '@react-native-firebase/analytics';
export default function CheckoutPayment(cartItemsget) {
    const { t, i18n } = useTranslation();
     const dropdownRef = useRef(null);
    const [selectedMethod, setSelectedMethod] = useState("credit-card");
    const cartItems = cartItemsget.cartItems;
    const userInfo = cartItemsget.userInfo;
    const settings = cartItemsget.settings;
    const [pointused, setPointused] = useState(false);
    const [pointRemain, setPointRemain] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

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
      return  `${parseFloat(amount).toFixed(2)}`

    }

    const onCheckbox = async (value) => {
      if(pointused) {
        setPointused(false);
        setTotalPrice(getAmount());
        setPointRemain(userInfo.rewardpoints);
        await AsyncStorage.setItem('remainingpoint', `${userInfo.rewardpoints}`);
        await AsyncStorage.setItem('updatedprice',  `${getAmount()}`);
      }else {
        setPointused(true);
        const convl = parseFloat(userInfo.rewardpoints/settings.reddemconv).toFixed(2);
        if(Number(convl) > Number(getAmount()) ) {
            const remcon = convl-getAmount();
            setPointRemain(remcon*settings.reddemconv);
            await AsyncStorage.setItem('remainingpoint', `${remcon*settings.reddemconv}`);
            await AsyncStorage.setItem('updatedprice', '0.00');
            setTotalPrice(0.00);
        }else {
          const newPrice = parseFloat(getAmount()-convl).toFixed(2);
            setTotalPrice(newPrice);
            await AsyncStorage.setItem('remainingpoint', '0');
            await AsyncStorage.setItem('updatedprice',  `${newPrice}`);
            setPointRemain(0);
        }
      }
    };
    const onSelect = async (selectedItem, index) => {
      if (selectedItem.point === t('selectpoint')) {
        if (dropdownRef.current) {
          dropdownRef.current.reset();
        }
        setPointRemain(userInfo.rewardpoints);
        setTotalPrice(getAmount());
      }else {
        if(Number(selectedItem.point) > Number(userInfo.rewardpoints) ) {
          if (dropdownRef.current) {
            dropdownRef.current.reset();
          }
          setPointRemain(userInfo.rewardpoints);
          setTotalPrice(getAmount());
          AlertHelper.show('error', t('lesspoint'));
          return;
        }else {
          const deductamout = parseFloat(selectedItem.mop).toFixed(2);
          const deductpoint = selectedItem.point;
          const newPrice = parseFloat(getAmount()-deductamout).toFixed(2);
          const newpoit = userInfo.rewardpoints-deductpoint;
          if(newPrice < 0) {
            await AsyncStorage.setItem('updatedprice', '0.00');
            setTotalPrice(0.00);
          }else {
            setTotalPrice(newPrice);
            await AsyncStorage.setItem('updatedprice',  `${newPrice}`);
          }
          await AsyncStorage.setItem('remainingpoint', `${newpoit}`);
          setPointRemain(newpoit);
          AlertHelper.show('success',  t('successfullyadded'));
        }
      }
    }
  const addanalytics = async () => {
    await firebase.analytics().setCurrentScreen('Checkout Point');
  }
    useEffect( () => {
      async function fetchData() {
        setTotalPrice(getAmount());
        setPointRemain(userInfo.rewardpoints);
        await AsyncStorage.setItem('remainingpoint', `${userInfo.rewardpoints}`);
        await AsyncStorage.setItem('updatedprice', `${getAmount()}`);
      }
      fetchData();
      addanalytics();
   }, []);
  const SquareCard = ({item}) => {
    return (
      <Pressable onPress={()=> setSelectedMethod(item)} style={{width:scale(100),height:scale(100), justifyContent:'center', alignItems:'center'}}>
        <Image
        resizeMode='contain'
        style={{width:'100%',height:scale(100)}}
        source={require('../../static/images/MPaylogo.png')} />
      </Pressable>
    );
  };
  return (
    <>
    <View style={{
      paddingVertical: scale(50),
      alignItems: 'center',
    }}>
    <Label text={t('youhave')+" "+userInfo.rewardpoints+" "+t('pointsuseit')} style={{fontSize: scale(16), color: appColors.primary,fontWeight:'bold',marginBottom: scale(15) }} />
    <SelectDropdown
       ref={dropdownRef}
       data={[{ point: t('selectpoint'), mop: '' }, ...settings.reddemconv]}
       //defaultValueByIndex={1}
       //defaultValue={'Egypt'}
       onSelect={onSelect}
       defaultButtonText={t('selectpoint')}
       buttonTextAfterSelection={(selectedItem, index) => {
         if (selectedItem.point === t('selectpoint')) {
            return t('selectpoint');
         }else {
             return selectedItem.point+' '+t('points')+' (MOP'+selectedItem.mop+')'
         }
       }}
       rowTextForSelection={(item, index) => {
          if (item.point === t('selectpoint')) {
             return t('selectpoint');
          }else {
             return item.point+' '+t('points')+' (MOP'+item.mop+')'
          }
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

    <View style={{
      paddingVertical: scale(50),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <View style={{flexDirection: 'row',width:'50%'}}>
          <FlatList   showsHorizontalScrollIndicator={false} ItemSeparatorComponent={()=> <View style={{padding:scale(5)}} /> } horizontal data={paymentMethods}  renderItem={({item,index})=> <SquareCard  item={item}/>} />
      </View>
      <View>
        <Label
          text={APP_CURRENY.symbol+' '+totalPrice}
          style={{fontSize: scale(20),fontWeight:'500'}}
        />
      </View>

    </View>
    </>
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
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.darkGray,
    marginBottom: 10,
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
