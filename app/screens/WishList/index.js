import React, {useRef, useEffect, useState} from 'react';
import { View, Text ,FlatList,SafeAreaView,Pressable} from 'react-native'
import { scale } from 'react-native-size-matters'
import WishListItem from '../../components/WishListItem'
import Container from '../../components/Container'
import ScreenHeader from '../../components/ScreenHeader'
import Label from '../../components/Label'
import { appColors } from '../../utils/appColors'
import Feather from 'react-native-vector-icons/Feather';
import {connect,useDispatch} from 'react-redux';
import ReduxWrapper from '../../utils/ReduxWrapper';
import { clearWhishList } from '../../redux/wishListAction';
import { useTranslation } from "react-i18next";
import "../../translation";
import { firebase } from '@react-native-firebase/analytics';

function index({wishList:{wishItems},navigation}) {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [wishlists, setWishlists] = useState([]);
   const emptyWhishlist = () => {
     dispatch(clearWhishList());
     setWishlists([]);
   };
   const LoadData = async () => {
     setWishlists(wishItems);
   }
   const _renderHeader = () => {
     return (
      <SafeAreaView>
       <View
         style={{
           flexDirection: 'row',
           justifyContent: 'space-between',
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
             text={t('wishlist')}
             style={{fontWeight: '500', color: 'white',fontSize: scale(18)}}
           />
           <Pressable
              onPress={emptyWhishlist}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Feather name="trash" size={scale(20)} color={appColors.white} />
          </Pressable>

       </View>
       </SafeAreaView>
     );
   };
 //console.warn(wishItems);
    const renderBagge= ()=>{
        return <View style={{  backgroundColor:appColors.primary, padding:scale(10), justifyContent:'center', alignItems:'center', borderRadius:scale(3)}}>

            <Label text="In Stock"  style={{fontSize:scale(10), color:appColors.white}}/>
        </View>
    }
  const addanalytics = async () => {
    await firebase.analytics().setCurrentScreen('WishList');
  } 
    useEffect(() => {
     LoadData();
     addanalytics();
   }, [wishItems]);
    return (
      <>
        {_renderHeader()}
        <Container>
           <FlatList ItemSeparatorComponent={()=> <View style={{padding:scale(10)}} />}  data={wishlists} renderItem={({item,index})=> <WishListItem item={item}  navigation={navigation} itemid={item.id} name={item.name} image={item.images[0]} price={item.price} quantity={item.quantity}/>} />
        </Container>
      </>
    )
}
export default ReduxWrapper(index)
