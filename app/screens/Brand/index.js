import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet,View, Text, FlatList, Pressable,RefreshControl, SafeAreaView, ActivityIndicator,Dimensions} from 'react-native';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReduxWrapper from '../../utils/ReduxWrapper';
const { width } = Dimensions.get('window');

import {fetchBrandProducts, fetchMoreBrandProducts } from '../../utils/infinityScroll';

import MasonryFlatlist from 'react-native-masonry-grid';
import { APP_IMGURL } from '../../utils/appConfig';

import { useTranslation } from "react-i18next";
import "../../translation";

function index({cart:{ cartItems }, navigation, route: {params}}) {
  const { t, i18n } = useTranslation();
    const {id, name, Icon, image} = params;
   const [productlist, setProductlist] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [ispageLoading, setIspageLoading] = useState(true);
   const [imagesLoaded, setImagesLoaded] = useState(false);
   const [loadingImages, setLoadingImages] = useState(0);
   const [totalImages, setTotalImages] = useState(0);
   const [catname, setCatname] = useState("");
   const [page, setPage] = useState(0);
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const [hasMoreItems, setHasMoreItems] = useState(true);
   const ITEMS_PER_PAGE = 10;

   const getProductsList = async (isLoadMore = false) => {
     if (!isLoadMore) {
       setIspageLoading(true);
       setImagesLoaded(false);
       setLoadingImages(0);
       setProductlist([]);
       setPage(0);
     } else {
       setIsLoadingMore(true);
     }

     if(i18n.language == 'cn') {
       setCatname(params.item.bcname);
     } else {
       setCatname(params.item.bname);
     }

     const currentPage = isLoadMore ? page + 1 : 0;
     const protodos = [];
     const getp = await fetchBrandProducts('products', params.item.id, ITEMS_PER_PAGE * (currentPage + 1));
     
     let last = getp.querySnapshot.size;
     setHasMoreItems(last === ITEMS_PER_PAGE * (currentPage + 1));

     const startIndex = isLoadMore ? ITEMS_PER_PAGE * currentPage : 0;
     const docs = getp.querySnapshot.docs.slice(startIndex);
     
     let indexi = 0;
     docs.forEach(doc => {
       let height = 180;
       if (indexi === 0) {
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
         image: APP_IMGURL+'/products/'+doc.id+'/'+doc.data()['images'][0],
         ...doc.data()
       });
       indexi++;
     });

     if (!isLoadMore) {
       setProductlist([...protodos]);
       setTotalImages(protodos.length);
       setIspageLoading(false);
     } else {
       setProductlist(prevList => [...prevList, ...protodos]);
       setTotalImages(prev => prev + protodos.length);
       setIsLoadingMore(false);
     }

     if (isLoadMore) {
       setPage(currentPage);
     }
   };

   const loadMore = () => {
     if (!isLoadingMore && hasMoreItems) {
       getProductsList(true);
     }
   };

   useEffect(() => {
     getProductsList();
   }, [params]);

   const handleImageLoaded = () => {
     setLoadingImages(prev => {
       const newCount = prev + 1;
       if (newCount >= totalImages && totalImages > 0) {
         setImagesLoaded(true);
       }
       return newCount;
     });
   };

   const _renderHeader = () => {
     return (
       <SafeAreaView>
       <View
         style={{
           flexDirection: 'row',
           //justifyContent: 'space-between',
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
           text={catname}
           style={{fontWeight: '500', color: 'white',fontSize: scale(18)}}
         />
       </View>
       </SafeAreaView>
     );
   };

   const renderSkeletonGrid = () => {
     return (
       <SkeletonPlaceholder borderRadius={10}>
         <SkeletonPlaceholder.Item style={{flexDirection: 'row', alignItems:'center',justifyContent: 'space-between',marginBottom:scale(20)}}>
           <SkeletonPlaceholder.Item width={width/2.4} marginRight={10} height={300} />
           <SkeletonPlaceholder.Item width={width/2.4} height={300} />
         </SkeletonPlaceholder.Item>
         <SkeletonPlaceholder.Item style={{flexDirection: 'row', alignItems:'center',justifyContent: 'space-between',marginBottom:scale(20)}}>
           <SkeletonPlaceholder.Item width={width/2.4} marginRight={10} height={300} />
           <SkeletonPlaceholder.Item width={width/2.4} height={300} />
         </SkeletonPlaceholder.Item>
         <SkeletonPlaceholder.Item style={{flexDirection: 'row', alignItems:'center',justifyContent: 'space-between',marginBottom:scale(20)}}>
           <SkeletonPlaceholder.Item width={width/2.4} marginRight={10} height={300} />
           <SkeletonPlaceholder.Item width={width/2.4} height={300} />
         </SkeletonPlaceholder.Item>
         <SkeletonPlaceholder.Item style={{flexDirection: 'row', alignItems:'center',justifyContent: 'space-between',marginBottom:scale(20)}}>
           <SkeletonPlaceholder.Item width={width/2.4} marginRight={10} height={300} />
           <SkeletonPlaceholder.Item width={width/2.4} height={300} />
         </SkeletonPlaceholder.Item>
       </SkeletonPlaceholder>
     );
   };

   const renderEmptyState = () => {
     return (
       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
         <Feather name="alert-circle" color={appColors.primary} size={scale(50)} />
       </View>
     );
   };

   return (
     <>
     {ispageLoading ? (
       <>
       {_renderHeader()}
       <Container>
          {renderSkeletonGrid()}
       </Container>
       </>
     ) : (
       <>
         {_renderHeader()}
         <Container>
           {productlist.length === 0 ? (
             renderEmptyState()
           ) : (
             <>
               <View style={{flex: 1, marginBottom:scale(0), alignItems:'center'}}>
                 <MasonryFlatlist
                   data={productlist}
                   numColumns={2}
                   initialColToRender={10}
                   columnWrapperStyle={styles.columnWrapperStyle}
                   showsVerticalScrollIndicator={false}
                   style={styles.masonryFlatlist}
                   onEndReached={loadMore}
                   onEndReachedThreshold={0.7}
                   scrollEventThrottle={16}
                   keyExtractor={(item) => item.id}
                   renderItem={({ item, index }) => {
                     if (index % 2 == 0) {
                       return (
                         <View style={styles.ProductCardodd}>
                           <ProductCard 
                             navigation={navigation} 
                             key={index} 
                             item={item} 
                             cartItems={cartItems}
                             onImageLoad={() => {
                               console.log('Image loaded callback for index:', index);
                               handleImageLoaded();
                             }}
                           />
                         </View>
                       );
                     } else {
                       return (
                         <View style={styles.ProductCardeven}>
                           <ProductCard 
                             navigation={navigation} 
                             key={index} 
                             item={item} 
                             cartItems={cartItems}
                             onImageLoad={() => {
                               console.log('Image loaded callback for index:', index);
                               handleImageLoaded();
                             }}
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
