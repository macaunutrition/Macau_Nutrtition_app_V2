import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet,View, ScrollView,Button,Text, TouchableOpacity,FlatList, Pressable,RefreshControl,SafeAreaView, ActivityIndicator, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {scale} from 'react-native-size-matters';
import Container from '../../components/Container';
import Label from '../../components/Label';
import ProductCard from '../../components/ProductCard';
import TitleComp from '../../components/TitleComp';
import {bestSellersList,topBrands} from '../../utils/MockData';
import Feather from 'react-native-vector-icons/Feather';
import {appColors} from '../../utils/appColors';
import BottomButtons from '../../components/BottomButtons';
import CustomButton from '../../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReduxWrapper from '../../utils/ReduxWrapper';
import Modal from "react-native-modal";
const { width } = Dimensions.get('window');
import getAllCategories from '../../utils/getAllCategories';

import { fetchAllproducts, fetchBestseller, fetchPopular} from '../../utils/getAllProducts';

import MasonryFlatlist from 'react-native-masonry-grid';
import { APP_IMGURL } from '../../utils/appConfig';
import { useTranslation } from "react-i18next";
import "../../translation";

function index({cart:{ cartItems }, navigation, route: {params}}) {
  const { t, i18n } = useTranslation();
    const {id, name, Icon, image} = params;
   const [productlist, setProductlist] = useState([]);

   const [ ispageLoading, setIspageLoading ] = useState( true );
   const [subcat, setSubcat] = useState([]);
   const [imagesLoaded, setImagesLoaded] = useState(false);
   const [showLottie, setShowLottie] = useState(true);

   const [refreshing, setRefreshing] = useState(false);
   const ITEMS_PER_PAGE = 10; // Define items per page constant

   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const [hasMoreItems, setHasMoreItems] = useState(true);

   const [page, setPage] = useState(0);

   const getProductsList = async (isLoadMore = false) => {  
     if (!isLoadMore) {
       setIspageLoading(true);
       setShowLottie(true);
       setProductlist([]);
       setPage(0);
     } else {
       setIsLoadingMore(true);
     }

     const protodos = [];
     let getp;
     const currentPage = isLoadMore ? page + 1 : 0;

     if(params.type == 'newproducts') {
       getp = await fetchAllproducts('products', ITEMS_PER_PAGE * (currentPage + 1));
     }
     if (params.type == 'bestseller') {
       getp = await fetchBestseller('products', ITEMS_PER_PAGE * (currentPage + 1));
     }
     if (params.type == 'promotion') {
       getp = await fetchPopular('products', ITEMS_PER_PAGE * (currentPage + 1));
     }

     let last = getp.querySnapshot.size;
     
     setHasMoreItems(last === ITEMS_PER_PAGE * (currentPage + 1));

     let index = 0;
     const startIndex = isLoadMore ? ITEMS_PER_PAGE * currentPage : 0;
     const docs = getp.querySnapshot.docs.slice(startIndex);

     docs.forEach(doc => {
       let height = 180;
       if (index === 0) {
         height = 180;
       } else if (last % 2 == 0) {
         height = 180;
       } else {
         height = 210;
       }
       protodos.push({
         id: doc.id,
         pid: doc.id,
         height: height,
         image: APP_IMGURL +'/products/'+doc.id+'/'+doc.data()['images'][0],
         ...doc.data()
       });
       index++;
     });

     if (!isLoadMore) {
       setProductlist([...protodos]);
       setIspageLoading(false);
       setTimeout(() => {
         setShowLottie(false);
       }, 1000);
       setTimeout(() => {
         setImagesLoaded(true);
       }, 2000);
     } else {
       setProductlist(prevList => [...prevList, ...protodos]);
       setIsLoadingMore(false);
     }

     if (isLoadMore) {
       setPage(currentPage);
     }
   }

   const loadMore = () => {
     console.log("loadMore", isLoadingMore, hasMoreItems);
     if (!isLoadingMore && hasMoreItems) {
       getProductsList(true);
     }
   };

   const nativeAdViewRef = useRef();
  useEffect( () => {
     getProductsList()
   }, [params]);

  const _renderHeader = () => {
    return (
      <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: scale(15),
          paddingHorizontal: scale(10),
          backgroundColor: '#76b729',
          marginBottom: scale(10),
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" color={appColors.white} size={scale(25)} />
        </Pressable>

        <Label
        text={params.type == 'newproducts' ?  t('new') : params.type == 'bestseller' ? t('bestseller') : t('promotion')}
          style={{fontWeight: '500', color: 'white',fontSize: scale(18)}}
        />
      </View>
      </SafeAreaView>
    );
  };

  return (
    <>
    {ispageLoading ? (
      <>
      {_renderHeader()}
      <Container>
            <View style={{ flex: 1 }}>
              <SkeletonPlaceholder borderRadius={10}>
                <SkeletonPlaceholder.Item style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: scale(20) }}>
                  <SkeletonPlaceholder.Item width={width / 2.4} marginRight={10} height={300} />
                  <SkeletonPlaceholder.Item width={width / 2.4} height={300} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: scale(20) }}>
                  <SkeletonPlaceholder.Item width={width / 2.4} marginRight={10} height={300} />
                  <SkeletonPlaceholder.Item width={width / 2.4} height={300} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: scale(20) }}>
                  <SkeletonPlaceholder.Item width={width / 2.4} marginRight={10} height={300} />
                  <SkeletonPlaceholder.Item width={width / 2.4} height={300} />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            </View>
      </Container>
      </>
    ) : (
      <>
        {_renderHeader()}
        <Container>
          {!imagesLoaded ? (
            <View style={{flex: 1}}>
              
              <SkeletonPlaceholder borderRadius={10}>
                <SkeletonPlaceholder.Item style={{flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', marginBottom:scale(20)}}>
                  <SkeletonPlaceholder.Item width={width/2.4} marginRight={10} height={300} />
                  <SkeletonPlaceholder.Item width={width/2.4} height={300} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item style={{flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', marginBottom:scale(20)}}>
                  <SkeletonPlaceholder.Item width={width/2.4} marginRight={10} height={300} />
                  <SkeletonPlaceholder.Item width={width/2.4} height={300} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item style={{flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', marginBottom:scale(20)}}>
                  <SkeletonPlaceholder.Item width={width/2.4} marginRight={10} height={300} />
                  <SkeletonPlaceholder.Item width={width/2.4} height={300} />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            </View>
          ) : (
            <>
            <View  style={{flex: 1, marginBottom:scale(0), alignItems:'center'}}>
              <MasonryFlatlist
                data={productlist}
                numColumns={2}
                initialColToRender={10}
                columnWrapperStyle={styles.columnWrapperStyle}
                showsVerticalScrollIndicator={false}
                style={styles.masonryFlatlist}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                scrollEventThrottle={16}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                  if (index % 2 == 0) {
                    return (
                      <View style={styles.ProductCardodd}>
                        <ProductCard 
                          navigation={navigation} 
                          key={item.id} 
                          item={item} 
                          cartItems={cartItems}
                        />
                      </View>
                    );
                  } else {
                    return (
                      <View style={styles.ProductCardeven}>
                        <ProductCard 
                          navigation={navigation} 
                          key={item.id} 
                          item={item} 
                          cartItems={cartItems}
                        />
                      </View>
                    );
                  }
                }}
                ListFooterComponent={() => (
                  isLoadingMore && (
                    <View style={{ padding: 20, width: '100%' }}>
                      <ActivityIndicator size="large" color={appColors.primary} />
                    </View>
                  )
                )}
              />
                {isLoadingMore && (
                  <View style={{backgroundColor:'transparent', width:'100%', alignItems:'center', justifyContent:'center'}}>
                    <ActivityIndicator size="large" color={appColors.primary} />
                  </View>
                )}
            </View>
            </>
          )}
        </Container>
      </>
    )}
    </>

  );
}
export default ReduxWrapper(index)
const styles = StyleSheet.create({
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
  columnWrapperStyle: {
  },
  masonryFlatlist: {

  },
});
