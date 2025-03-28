import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Pressable, TextInput, FlatList, SafeAreaView, ActivityIndicator, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import {scale} from 'react-native-size-matters';
import Badge from '../../components/Badge';
import Container from '../../components/Container';
import SearchBox from '../../components/SearchBox';
import TitleComp from '../../components/TitleComp';
import TouchableRipple from 'react-native-touch-ripple';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from "react-i18next";
import "../../translation";
import {appColors} from '../../utils/appColors';
import searchData from '../../utils/searchData';
import Product from '../../components/ProductCard';
const { width } = Dimensions.get("window");
const columnWidth = (width - 10) / 2 - 10;
import MasonryFlatlist from 'react-native-masonry-grid';
import { useSelector } from 'react-redux';
import { APP_IMGURL } from '../../utils/appConfig';
import { firebase } from '@react-native-firebase/analytics';

export default function index({navigation}) {
  const cartItems = useSelector(state => state.cart.cartItems);
  const { t, i18n } = useTranslation();
  const [productlist, setProductlist] = useState([]);
  const [searchquery, setSearchquery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const SearchProduct = async ()=>{
    setProductlist([]);
    if(searchquery == '') {
      return;
    }
    setIsLoading(true);
    firebase.analytics().logEvent('search', { search_query: searchquery });
    const protodos: any[] = [];
     const getp = await searchData('products',searchquery,i18n.language);
     let last = getp.length
     let index = 0;
     getp.forEach(doc => {
       let height = 180
      if (index === 0) {
        //console.log(index, ":", 150)
      } else if (last % 2 == 0) {
        //console.log(index, ":", 150)
      }
      else {
        //console.log(index, ":", 250)
        height = 210
      }

      protodos.push({
					id: doc.id,
          height: height,
          image: APP_IMGURL+'/products/'+doc.id+'/'+doc.images[0],
					...doc
				});
        index++;
    });
    setIsLoading(false);
    setProductlist(protodos);
  }
  const RenderTitle = ({heading, rightLabel}) => {
    return <TitleComp heading={heading} rightLabel={rightLabel} />;
  };
  const ProductCard = ({item,cartItems}) => {
    return <Product navigation={navigation} item={item} cartItems={cartItems}/>;
  };
  const addanalytics = async () => {
    await firebase.analytics().setCurrentScreen('Search');
  }
  useEffect( () => {
    addanalytics();
   }, [productlist]);
  return (
    <>
    <SafeAreaView>
    <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems:'center',paddingTop:20, paddingHorizontal:20}}>
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
            onChangeText={value => setSearchquery(value)}
            value={searchquery}
             autoFocus={true}
          style={{flex: 1, paddingLeft: scale(10)}}
        />
      </View>
      <View>
        <TouchableRipple
          rippleColor={appColors.primary}
          onPress={()=> SearchProduct()}
          rippleDuration={800}
          style={[styles.container]}>

          <Feather
            name="search"
            size={scale(20)}
            color={appColors.white}
          />
        </TouchableRipple>
      </View>
    </View>
    </SafeAreaView>
    {isLoading ? (
      <>
      <Container>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={require('../../static/bikelotti.json')}
            autoPlay
            loop={true}
            style={{width: 100, height: 100}}
          />
        </View>
      </Container>
      </>
    ) : (
      <>
        <Container isScrollable>
          <View>
            <View style={{paddingVertical: scale(25)}}>
              {productlist.length > 0 && (
              <RenderTitle heading={t('search')+': '+searchquery} rightLabel={productlist.length} />
              )}
            </View>
            <MasonryFlatlist
               data={productlist}
               numColumns={2} // for number of columns
               //columnWrapperStyle={styles.columnWrapperStyle}
               showsVerticalScrollIndicator={false}
               //style={styles.masonryFlatlist}
               loading= {true}
               renderItem={({ item, index }) => {
                  if (index % 2 == 0) {
                    return <View style={styles.ProductCardodd}><ProductCard   key={index} item={item} cartItems={cartItems} /></View>;
                  }else {
                    return <View style={styles.ProductCardeven}><ProductCard  key={index} item={item} cartItems={cartItems} /></View>;
                  }

               }}
             />
            {productlist.length == 0 && !isLoading && (
              <View style={{flex:1,alignItems: 'center',paddingTop:scale(200)}}>
                <Text>{t('noproducts')}</Text>
              </View>
            )}
          </View>
        </Container>
      </>
    )}

    </>
  );
}
const styles = StyleSheet.create({
  container: {
    height: scale(35),
    backgroundColor: appColors.primary,
    borderRadius: scale(5),
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: scale(0),
    paddingHorizontal: scale(20),
    marginLeft: scale(10),
  },
  label: {
    fontSize: scale(16),
    fontWeight: '300',
    color: appColors.white,
    letterSpacing: scale(2),
  },
  ProductCardodd: {
      backgroundColor: 'white',
      width:'95%',
      marginBottom: 10,
      borderRadius:10,
      padding:10,
      marginRight:100,
  },
  ProductCardeven: {
      backgroundColor: 'white',
      width:'100%',
      marginBottom: 10,
      borderRadius:10,
      padding:10,
  },
});
