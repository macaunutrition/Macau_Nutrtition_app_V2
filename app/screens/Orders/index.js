import React, {useRef, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity,SafeAreaView,Pressable} from 'react-native';
import LottieView from 'lottie-react-native';
import {scale} from 'react-native-size-matters';
import Container from '../../components/Container';
import Feather from 'react-native-vector-icons/Feather';
import Label from '../../components/Label';
import ScreenHeader from '../../components/ScreenHeader';
import {appColors, shadow} from '../../utils/appColors';
import {orderList} from '../../utils/MockData';
import getOrders from '../../utils/getOrders';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import "../../translation";
import { firebase } from '@react-native-firebase/analytics';

export default function index({navigation}) {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState('');
  const [ isLoading, setIsLoading ] = useState( true );
  const [orderlist, setOrderlist] = useState([]);
  const  LoadOrders = async () => {
    const orderArr: any[] = [];
    const mobile = await AsyncStorage.getItem('user');
    setUser(mobile);
    const getorders = await getOrders('orders', mobile);
    getorders.forEach(doc => {
     orderArr.push({
         id: doc.id,
         ...doc.data()
       });
   });
   setOrderlist(orderArr);
    setIsLoading(false);
  };
  const addanalytics = async () => {
    await firebase.analytics().setCurrentScreen('Orders');
  }
  useEffect(() => {
    addanalytics();
    LoadOrders();
  }, [orderlist]);

  const OrderCard = ({item}) => {
    const {amount, currency, status, createat, id, mpaytransactionno, mpaytransactionid} = item;
    const datetime = new Date(createat).toLocaleDateString();
    const time = new Date(createat).toLocaleTimeString();
    return (
      <TouchableOpacity onPress={() => navigation.navigate('OrdersDetails',{orderid:item.transationid})} >
        <View style={styles.contentContiner}>
          <View>
          <Label
            text={currency + amount}
            style={{
              fontWeight: 'bold',
              color: appColors.primary,
              paddingVertical: scale(0),
              fontSize: scale(18),
              //alignSelf: 'center',
            }}
          />
          <Label
            text={t('status')+': '+status}
            style={{
              fontWeight: 'bold',
              paddingVertical: scale(0),
              fontSize: scale(11),
              //alignSelf: 'center',
              marginBottom: 5,
            }}
          />
          <Label
            text={'# '+id}
            style={{fontSize: scale(16), fontWeight: '500',   marginBottom: 5}}
          />
            {/*<Label
              text={t('id')+': '+id}
              style={{fontSize: scale(16), fontWeight: '500',   marginBottom: 15}}
            />
            <Label
              text={t('transaction')+': '+mpaytransactionno}
              style={{fontSize: scale(14), fontWeight: '500',   marginBottom: 15,}}
            />
            <Label
              text={t('reference')+': '+mpaytransactionid}
              style={{fontSize: scale(14), fontWeight: '500', marginBottom: 15}}
            />*/}
            <Label
              text={datetime+' '+time}
              style={{fontSize: scale(12), fontWeight: '500',  paddingVertical: scale(0),color: appColors.primary}}
            />
          </View>

        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      {isLoading ? (
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
              text={t('orderhistory')}
              style={{fontWeight: '500', color: 'white',fontSize: scale(18)}}
            />
        </View>
        </SafeAreaView>
          <Container>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <LottieView
              source={require('../../static/bikelotti.json')}
              autoPlay
              loop={true}
              style={{width: 150, height: 150}}
            />
          </View>
            </Container>
        </>
      ) : (
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
              text={t('orderhistory')}
              style={{fontWeight: '500', color: 'white',fontSize: scale(18)}}
            />
        </View>
        </SafeAreaView>
          <Container  >
            <View style={{flex:1, paddingVertical:scale(20)}}>
              <FlatList

                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={{padding: scale(5)}} />}
                data={orderlist}
                keyboardShouldPersistTaps={'handled'}
                renderItem={({item, index}) => <OrderCard key={index} item={item} />}
              />
            </View>
          </Container>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  contentContiner: {
    paddingVertical: scale(10),
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: appColors.white,
    paddingHorizontal: scale(10),
    width: '100%',
    ...shadow,
  },
});
