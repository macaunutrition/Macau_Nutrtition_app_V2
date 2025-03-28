import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable, FlatList,TouchableOpacity, SafeAreaView} from 'react-native';
import {scale} from 'react-native-size-matters';
import Container from '../../components/Container';
import Feather from 'react-native-vector-icons/Feather';
import {appColors} from '../../utils/appColors';
import Label from '../../components/Label';
import {profileKeys} from '../../utils/MockData';
import AvatarImage from '../../components/AvatarImage'
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import "../../translation";
import i18n from "../../translation";
import getData from '../../utils/getData';
export default function index({navigation}) {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState({});
  const onLogout = ()=>{
     auth().signOut().then( async () => {
       await AsyncStorage.removeItem('user');
    })
    .catch(error => {
        console.log(error);
    })
  }
  const getUser = async () => {
    const mobile = await AsyncStorage.getItem('user');
    const getU = await getData('users',mobile );
    setUserInfo(getU._data);
  }
  useEffect( () => {
   getUser();
 }, [userInfo]);
  const ItemCard = ({item}) => {
    const {lebel, icon,isNew,route} = item;
    return (
        <View style={styles.itemContainer}>
          <View  style={styles.iconContainer}>
             <Pressable onPress={() =>{
              route=="Login"&& onLogout()
              route&& navigation.navigate(route)
              }}>
                <Feather name={icon} size={scale(22)}color={appColors.black}  />
              </Pressable>
          </View>
          <View style={styles.itemInnerContainer}>
            <Pressable onPress={() =>{
              route=="Login"&& onLogout()
              route&& navigation.navigate(route)
              }}>
            <Label text={t(lebel)} />
            </Pressable>
            <Feather name={"chevron-right"} size={scale(18)} />
          </View>
        </View>
      
    );
  };
  return (
    <>
    <SafeAreaView>
      <View style={{paddingTop:scale(20), paddingLeft:scale(20), flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
          <View style={{marginLeft:scale(0)}}>
              <Label text={userInfo?.name ? userInfo.name : t('macauneutrition')} style={{fontSize:scale(28), color:appColors.primary}} />
          </View>
      </View>
      <View style={{paddingBottom:scale(20), paddingLeft:scale(20), flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
          <View style={{marginLeft:scale(0)}}>
              <Label text={t('yourpoins')+": "+userInfo?.rewardpoints} style={{fontSize:scale(18), color:appColors.yellow, fontWeight:"bold"}} />
          </View>
      </View>
    </SafeAreaView>
    <Container isScrollable>
      <Pressable onPress={() =>{
        navigation.navigate('Accountedit')
      }}> 
        <View style={styles.itemContainer}>
            <View  style={styles.iconContainer}>
              <Feather name="edit-3" size={scale(22)}color={appColors.black}  />
            </View>
            <View style={styles.itemInnerContainer}>
              <Label text={t('editprofile')} />
              <Feather name={"chevron-right"} size={scale(18)} />
            </View>
          </View>
      </Pressable>

       <Pressable onPress={() =>{
        navigation.navigate('Orders')
      }}> 
        <View style={styles.itemContainer}>
            <View  style={styles.iconContainer}>
              <Feather name="clock" size={scale(22)}color={appColors.black}  />
            </View>
            <View style={styles.itemInnerContainer}>
              <Label text={t('orderhistory')} />
              <Feather name={"chevron-right"} size={scale(18)} />
            </View>
          </View>
      </Pressable>

       <Pressable onPress={() =>{
        navigation.navigate('WishList')
      }}> 
        <View style={styles.itemContainer}>
            <View  style={styles.iconContainer}>
              <Feather name="heart" size={scale(22)}color={appColors.black}  />
            </View>
            <View style={styles.itemInnerContainer}>
              <Label text={t('wishlist')} />
              <Feather name={"chevron-right"} size={scale(18)} />
            </View>
          </View>
      </Pressable>

      <Pressable onPress={() =>{
        navigation.navigate('Notification')
      }}> 
        <View style={styles.itemContainer}>
            <View  style={styles.iconContainer}>
              <Feather name="bell" size={scale(22)}color={appColors.black}  />
            </View>
            <View style={styles.itemInnerContainer}>
              <Label text={t('notifications')} />
              <Feather name={"chevron-right"} size={scale(18)} />
            </View>
          </View>
      </Pressable>

       <Pressable onPress={() =>{
        onLogout()
      }}> 
        <View style={styles.itemContainer}>
            <View  style={styles.iconContainer}>
              <Feather name="log-out" size={scale(22)}color={appColors.black}  />
            </View>
            <View style={styles.itemInnerContainer}>
              <Label text={t('signout')} />
              <Feather name={"chevron-right"} size={scale(18)} />
            </View>
          </View>
      </Pressable>



    </Container>
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: scale(15),
    width: '100%',
  },
  itemInnerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    borderRadius: scale(5),
    padding: scale(10),
    marginRight: scale(20),
    backgroundColor: appColors.lightGreen,
  },
});
