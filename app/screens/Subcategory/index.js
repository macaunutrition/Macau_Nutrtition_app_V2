import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet,View, ScrollView,Button,Text, TouchableOpacity,FlatList, Pressable,RefreshControl, SafeAreaView, ActivityIndicator, Dimensions} from 'react-native';
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
import { firebase } from '@react-native-firebase/analytics';

import {fetchCatProducts, fetchMoreCatProducts } from '../../utils/infinityScroll';

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
  const [isModalVisible, setModalVisible] = useState(false);
  const [subcat, setSubcat] = useState([]);
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
      setSubcat([]);
      setPage(0);
    } else {
      setIsLoadingMore(true);
    }

    if(i18n.language == 'cn') {
      setCatname(params.item.cname);
    } else {
      setCatname(params.item.name);
    }

    // Get subcategories (only on initial load)
    if (!isLoadMore) {
      const getsubcat = await getAllCategories('categories', params.item.id);
      const subcatArray = [];
      getsubcat.forEach(doc => {
        subcatArray.push({
          id: doc.id,
          image: APP_IMGURL + '/categories/' + doc.id + '/' + doc.data()['iconname'],
          ...doc.data()
        });
      });
      setSubcat(subcatArray);
    }

    const currentPage = isLoadMore ? page + 1 : 0;
    const protodos = [];
    const getp = await fetchCatProducts('products', params.item.id, ITEMS_PER_PAGE * (currentPage + 1));
    
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
        image: APP_IMGURL + '/products/' + doc.id + '/' + doc.data()['images'][0],
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const nativeAdViewRef = useRef();
  const addanalytics = async () => {
    await firebase.analytics().setCurrentScreen('Category '+catname);
  }
  useEffect( () => {
     getProductsList()
     addanalytics();
   }, [params]);

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
          marginBottom: scale(10),
        }}>
        <Pressable  onPress={() => {
            navigation.navigate('Category', {'item': params.maincat});
          }}>
          <Feather name="chevron-left" color={appColors.white} size={scale(25)} />
        </Pressable>

        <Label
          text={catname}
          style={{fontWeight: '500', color: 'white',fontSize: scale(18)}}
        />
        <Pressable onPress={toggleModal}>
          <Feather name="alert-circle" color={appColors.white} size={scale(25)} />
        </Pressable>
      </View>
      </SafeAreaView>
    );
  };
  const _renderSubcat = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ marginBottom: scale(15) }}>
        {subcat.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('Category', { item })}  // Navigate on press
            style={{
              paddingTop: 10,
              paddingBottom:10,
              paddingRight:10,
              paddingLeft:10,
              borderColor: appColors.lightGray,
              borderWidth: scale(1),  // Corrected typo here
              backgroundColor: '#fff',
              borderRadius: scale(8),
              marginRight: scale(10)  // Optional: Add spacing between items
            }}
          >
            <Text style={{ fontSize: 14, textAlign: 'center' }}>
              {i18n.language === 'en' ? item.name : item.cname}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
  const handleImageLoaded = () => {
    setLoadingImages(prev => {
      const newCount = prev + 1;
      if (newCount >= totalImages && totalImages > 0) {
        setImagesLoaded(true);
      }
      return newCount;
    });
  };
   
  useEffect(() => {
    // Reset image loading state when product list changes
    setImagesLoaded(false);
    setLoadingImages(0);
  }, [productlist]);

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
        {_renderHeader()}
        <Container isScrollable>
          <View>
              {_renderSubcat()}
          </View>
          
          {productlist.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {(!imagesLoaded) && (
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
              )}
              
              <View style={{flex: 1, marginBottom:scale(0), alignItems:'center', display: !imagesLoaded ? 'none' : 'flex'}}>
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
                      return <View style={styles.ProductCardodd}>
                        <ProductCard 
                          onImageLoad={handleImageLoaded} 
                          navigation={navigation} 
                          key={index} 
                          item={item} 
                          cartItems={cartItems}
                        />
                      </View>;
                    } else {
                      return <View style={styles.ProductCardeven}>
                        <ProductCard 
                          onImageLoad={handleImageLoaded} 
                          navigation={navigation} 
                          key={index} 
                          item={item} 
                          cartItems={cartItems}
                        />
                      </View>;
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
          
          <Modal isVisible={isModalVisible}  >
            <ScrollView>
              <View style={{ flex: 1,backgroundColor: appColors.white, borderRadius:6, padding: 15 }} >
              <Pressable onPress={toggleModal} style={{alignSelf: 'flex-end'}}>
                <Feather name="x-circle" color={appColors.primary} size={scale(25)} />
              </Pressable>
              {i18n.language == 'en' ? (
                <Label
                  text={params.item.description}
                  style={{fontSize: scale(14), lineHeight: scale(25)}}
                /> ) : (
                  <Label
                    text={params.item.cdescription}
                    style={{fontSize: scale(14), lineHeight: scale(25)}}
                  /> )}
                <CustomButton onPress={toggleModal} label={t('close')} />
              </View>
            </ScrollView>
          </Modal>
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
