import React, {useRef, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView, Pressable} from 'react-native';
import {scale} from 'react-native-size-matters';
import Container from '../../components/Container';
import Label from '../../components/Label';
import ScreenHeader from '../../components/ScreenHeader';
import Feather from 'react-native-vector-icons/Feather';
import {appColors, shadow} from '../../utils/appColors';
import {orderList} from '../../utils/MockData';
import getNotification from '../../utils/getNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import "../../translation";
import { firebase } from '@react-native-firebase/analytics';

export default function index({navigation}) {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState('');
  const [notiList, setNotilist] = useState([]);
  const  LoadOrders = async () => {
    const notiArr: any[] = [];
    const mobile = await AsyncStorage.getItem('user');
    setUser(mobile);
    const getnotif = await getNotification('notifications');
    getnotif.forEach(doc => {
     notiArr.push({
         id: doc.id,
         ...doc.data()
       });
   });
   setNotilist(notiArr);
  };
  const addanalytics = async () => {
    await firebase.analytics().setCurrentScreen('Notification');
  }
  useEffect(() => {
    addanalytics();
    LoadOrders();
  }, [notiList]);

  const OrderCard = ({item}) => {
    const {createdAt, title, subject} = item;
    const datetime = new Date(createdAt).toLocaleDateString();
    const time = new Date(createdAt).toLocaleTimeString();
    return (
      <View style={styles.contentContiner}>
        <View>
          <Label
            text={title}
            style={{fontSize: scale(16), fontWeight: '800',color: appColors.primary,   marginBottom: 15}}
          />
          <Label
            text={subject}
            style={{fontSize: scale(14), fontWeight: '500',   marginBottom: 15,}}
          />
        </View>

      </View>
    );
  };
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
          text={t('notofication')}
          style={{fontWeight: '500', color: 'white',fontSize: scale(18)}}
        />
    </View>
    </SafeAreaView>
    <Container  >
      <View style={{flex:1, paddingVertical:scale(20)}}>
        <FlatList

          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{padding: scale(5)}} />}
          data={notiList}
          renderItem={({item, index}) => <OrderCard key={index} item={item} />}
        />
      </View>
    </Container>
    </>
  );
}

const styles = StyleSheet.create({
  contentContiner: {
    paddingVertical: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: appColors.white,
    paddingHorizontal: scale(10),
    width: '100%',
    ...shadow,
  },
});
