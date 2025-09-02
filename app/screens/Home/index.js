import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, Spinner, Image, Pressable,SafeAreaView, Dimensions, ActivityIndicator} from 'react-native';
import {} from 'react-native-gesture-handler';
import {categoriesList, bestSellersList} from '../../utils/MockData';
import {appColors, shadow, borderwith} from '../../utils/appColors';
import TouchableRipple from 'react-native-touch-ripple';
import Label from '../../components/Label';
import Container from '../../components/Container';
import Product from '../../components/ProductCard';
import {scale} from 'react-native-size-matters';
import SearchBox from '../../components/SearchBox';
import TitleComp from '../../components/TitleComp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AlertHelper} from '../../utils/AlertHelper';

import ReduxWrapper from '../../utils/ReduxWrapper';

import getAllData from '../../utils/getAllData';
import getAllCategories from '../../utils/getAllCategories';
import getAllBanner from '../../utils/getAllBanner';
import getData from '../../utils/getData';
import {fetchProducts, fetchMoreProducts } from '../../utils/infinityScroll';
import {fetchNewproducts, fetchBestseller, fetchPopular} from '../../utils/getAllProducts';
import { SliderBox } from "react-native-image-slider-box";

const { width } = Dimensions.get("window");
const columnWidth = (width - 10) / 2 - 10;
import MasonryFlatlist from 'react-native-masonry-grid';

import SelectDropdown from 'react-native-select-dropdown'
import { useTranslation } from "react-i18next";
import "../../translation";
import { APP_IMGURL } from '../../utils/appConfig';

import FastImage from 'react-native-fast-image';
const placeholder = require('../../static/images/default-placeholder.png');
import { firebase } from '@react-native-firebase/analytics';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LottieView from 'lottie-react-native';
import OptimizedImage from '../../components/OptimizedImage';
import { ImageOptimizer, ImagePriority, CacheStrategy } from '../../utils/ImageOptimizer';
import { PerformanceOptimizer } from '../../utils/PerformanceOptimizer';



function Home({cart:{ cartItems },navigation}) {
  const languages = [{label: 'English', value: 'en'},{label: '中文', value: 'cn'}];
  const { t, i18n } = useTranslation();
  const [productlist, setProductlist] = useState([]);
  const [bestsellerlist, setBestsellerlist] = useState([]);
  const [popularlist, setPopularlist] = useState([]);
  const [postPerload] = useState(6);
  const [startAfter, setStartAfter] = useState(Object);
  const [lastItem, setLastItem] = useState(false);

  const [categorylist, setCategorylist] = useState([]);
  const [brandlist, setBrandlist] = useState([]);
  const [bannerlist, setBannerlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [bestsellerLoading, setBestsellerLoading] = useState(true);
  const [popularLoading, setPopularLoading] = useState(true);
  const [bannerLoading, setBannerLoading] = useState(true);

  const getProductsList = async () => {
    try {
      setProductsLoading(true);
      const protodos: any[] = [];
      const bannersArr: any[] = [];
       const getp = await fetchNewproducts('products',postPerload);
       let last = (getp.querySnapshot).size;
       let index = 0;
       (getp.querySnapshot).forEach(doc => {
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
           pid: doc.id,
           height: height,
           image: APP_IMGURL +'/products/'+doc.id+'/'+doc.data()['images'][0],
  					...doc.data()
  				});
         index++;
     });
     setProductlist([...productlist, ...protodos]);
     setProductsLoading(false);

     setCategoriesLoading(true);
     const getcat = await getAllCategories('categories','parent',8);
     const cat: any[] = [];
     getcat.forEach(doc => {
        cat.push({
            id: doc.id,
            image: APP_IMGURL +'/categories/'+doc.id+'/'+doc.data()['iconname'],
            ...doc.data()
          });
      });
     setCategorylist(cat);
     setCategoriesLoading(false);

     setBrandsLoading(true);
     const getbrnd = await getAllData('brands',8,0);
     const brnd: any[] = [];
     getbrnd.forEach(doc => {
        brnd.push({
            id: doc.id,
            image: APP_IMGURL +'/brands/'+doc.id+'/'+doc.data()['iconname'],
            ...doc.data()
          });
      });
     setBrandlist(brnd);
     setBrandsLoading(false);

     setBannerLoading(true);
     const getbanners = await getAllBanner('banners');
     getbanners.forEach(doc => {
       bannersArr.push(
           APP_IMGURL+'/banners/'+doc.data()['name']
         );
     });
     setBannerlist(bannersArr);
     setBannerLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setProductsLoading(false);
      setCategoriesLoading(false);
      setBrandsLoading(false);
      setBannerLoading(false);
    }
  }

  const getBestseller = async () => {
    try {
      setBestsellerLoading(true);
      const protodos: any[] = [];
      const bannersArr: any[] = [];
       const getp = await fetchBestseller('products',postPerload);
       let last = (getp.querySnapshot).size;
       let index = 0;
       (getp.querySnapshot).forEach(doc => {
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
           pid: doc.id,
           height: height,
           image: APP_IMGURL +'/products/'+doc.id+'/'+doc.data()['images'][0],
  					...doc.data()
  				});
        index++;
    });
    setBestsellerlist([...protodos]);
    setBestsellerLoading(false);
    } catch (error) {
      console.error("Error loading bestsellers:", error);
      setBestsellerLoading(false);
    }
  }

  const getPopular = async () => {
    try {
      setPopularLoading(true);
      const protodos: any[] = [];
      const bannersArr: any[] = [];
       const getp = await fetchPopular('products',postPerload);
       let last = (getp.querySnapshot).size;
       let index = 0;
       (getp.querySnapshot).forEach(doc => {
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
           pid: doc.id,
           height: height,
           image: APP_IMGURL +'/products/'+doc.id+'/'+doc.data()['images'][0],
  					...doc.data()
  				});
        index++;
    });
    setPopularlist([...protodos]);
    setPopularLoading(false);
    } catch (error) {
      console.error("Error loading popular products:", error);
      setPopularLoading(false);
    }
  }

  const addtoCart = (item) => {
    if(Number(1) < Number(item.minqty) ) {
        AlertHelper.show('error', t('minimum')+' '+item.minqty+' '+t('youshouldbuy'));
        return;
    }else {
      onAddToCart(item);
      AlertHelper.show('success', t('successfullyadded'));
    }
  }
  const nativeAdViewRef = useRef();
  useEffect( () => {
    // Initialize performance optimizer
    PerformanceOptimizer.initialize();
    PerformanceOptimizer.startScreenLoad('Home');
    
    setTimeout(() => {
      setInitialLoading(false);
      setLoading(false);
      PerformanceOptimizer.endScreenLoad('Home');
    }, 1000);
    
    async function fetchData() {
      setLoading(true);
      setInitialLoading(true);
      firebase.analytics().setCurrentScreen('Home');
      
      // Use performance optimizer for heavy operations
      await PerformanceOptimizer.deferHeavyOperation(async () => {
        const value = await AsyncStorage.getItem('user');
        const getU = await getData('users',value );
           if(getU.data()) {
            if(getU.data()['country']) {
            }else {
             navigation.navigate('SignUp');
            }
           }else {
             navigation.navigate('SignUp');
           }
      });
    }
    
    fetchData();
    
    // Batch data fetching for better performance
    PerformanceOptimizer.batchOperations([
      () => getProductsList(),
      () => getBestseller(),
      () => getPopular()
    ]);
  }, []);

  const RenderTitle = ({heading, rightLabel}) => {
    return <TitleComp heading={heading} rightLabel={rightLabel} />;
  };
  const ProductCard = ({item,cartItems}) => {
    return <Product navigation={navigation} item={item} cartItems={cartItems}/>;
  };
  // const onPress = () => {
  //   console.warn('i am clicked');
  // };

  // Skeleton loaders
  const BannerSkeleton = () => (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item width={Dimensions.get('window').width-45} height={180} borderRadius={15} marginTop={5} />
    </SkeletonPlaceholder>
  );
  
  const CategorySkeleton = () => (
    <View style={{paddingVertical: scale(30)}}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" justifyContent="space-between">
          <SkeletonPlaceholder.Item width={100} height={20} borderRadius={4} />
          <SkeletonPlaceholder.Item width={60} height={20} borderRadius={4} />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item flexDirection="row" marginTop={40} justifyContent="space-between">
          {[...Array(4)].map((_, index) => (
            <SkeletonPlaceholder.Item key={index} alignItems="center">
              <SkeletonPlaceholder.Item width={scale(70)} height={scale(70)} borderRadius={scale(40)} />
              <SkeletonPlaceholder.Item marginTop={15} width={scale(60)} height={scale(14)} borderRadius={4} />
            </SkeletonPlaceholder.Item>
          ))}
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
  
  const ProductSkeleton = () => (
    <View>
      <View style={{paddingVertical: scale(25)}}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" justifyContent="space-between">
            <SkeletonPlaceholder.Item width={100} height={20} borderRadius={4} />
            <SkeletonPlaceholder.Item width={60} height={20} borderRadius={4} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
          <SkeletonPlaceholder.Item width={columnWidth} height={200} borderRadius={10} marginBottom={10} />
          <SkeletonPlaceholder.Item width={columnWidth} height={200} borderRadius={10} marginBottom={10} />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
          <SkeletonPlaceholder.Item width={columnWidth} height={200} borderRadius={10} marginBottom={10} />
          <SkeletonPlaceholder.Item width={columnWidth} height={200} borderRadius={10} marginBottom={10} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );



  return (
    <>
      <SafeAreaView>
        <View style={styles.homwsearchpdning}>
          <SearchBox isEditable={false} autoFocus={'false'} />
        </View>
      </SafeAreaView>
      <Container isScrollable style={styles.container}>
        {bannerLoading ? (
          <BannerSkeleton />
        ) : (
          <View>
            <SliderBox
              images={bannerlist}
              sliderBoxHeight={180}
              parentWidth={Dimensions.get('window').width - 45}
              dotColor="#76b729"
              inactiveDotColor="#90A4AE"
              paginationBoxVerticalPadding={0}
              autoplay
              autoplayInterval={5000}
              circleLoop
              resizeMethod={'resize'}
              resizeMode={'cover'}
              paginationBoxStyle={{
                position: "absolute",
                bottom: 0,
                padding: 0,
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
                paddingVertical: 10
              }}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 0,
                padding: 0,
                margin: 0,
                backgroundColor: "rgba(128, 128, 128, 0.92)"
              }}
              ImageComponentStyle={{ borderRadius: 15, width: '100%', marginTop: 5 }}
              imageLoadingColor="#76b729"
            />
          </View>
        )}
        {categoriesLoading ? (
          <CategorySkeleton />
        ) : (
          <View style={{ paddingVertical: scale(30) }}>
            <Pressable onPress={() => {
              navigation.navigate('Allcat');
            }}>
              <RenderTitle heading={t('categories')} rightLabel={t('seeall')} />
            </Pressable>
            <FlatList
              style={{ marginTop: scale(40) }}
              numColumns='4'
              showsVerticalScrollIndicator={true}
              Vertical
              data={categorylist}
              nestedScrollEnabled={true}
              ItemSeparatorComponent={() => <View style={{ padding: scale(10) }} />}
              renderItem={({ item, index }) => {
                const { id, name, cname, Icon, image } = item;
                const imgSource = image ? { uri: image } : placeholder;
                return (
                  <View key={index} style={{ alignItems: 'center', marginRight: scale(10), width: "22.6%" }}>
                    <TouchableRipple
                      onPress={() => {
                        navigation.navigate('Category', { item });
                      }}
                      rippleColor={appColors.primary}
                      rippleContainerBorderRadius={scale(40)}
                      rippleDuration={800}
                      style={{
                        ...borderwith,
                        height: scale(70),
                        width: scale(70),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: scale(40),
                      }}>
                      <FastImage
                        style={{ height: scale(70), width: scale(70), borderRadius: scale(40) }}
                        source={imgSource}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </TouchableRipple>
                    {i18n.language == 'en' ? (
                      <View style={{ marginTop: scale(15) }}>
                        <Label text={name} style={{ fontSize: scale(14), textAlign: 'center', }} />
                      </View>) : (
                      <View style={{ marginTop: scale(15) }}>
                        <Label text={cname} style={{ fontSize: scale(14), textAlign: 'center', }} />
                      </View>)}
                  </View>
                );
              }}
            />
          </View>
        )}
        {brandsLoading ? (
          <CategorySkeleton />
        ) : (
          <View style={{ paddingVertical: scale(30) }}>
            <Pressable onPress={() => {
              navigation.navigate('Allbrand');
            }}>
              <RenderTitle heading={t('brands')} rightLabel={t('seeall')} />
            </Pressable>
            <FlatList
              style={{ marginTop: scale(40) }}
              numColumns='4'
              showsVerticalScrollIndicator={false}
              Vertical
              data={brandlist}
              nestedScrollEnabled={true}
              ItemSeparatorComponent={() => <View style={{ padding: scale(10) }} />}
              renderItem={({ item, index }) => {
                const { id, bname, bcname, Icon, image } = item;
                const imgSource2 = image ? { uri: image } : placeholder;
                return (
                  <View key={index} style={{ alignItems: 'center', marginRight: scale(10), width: "22.6%" }}>
                    <TouchableRipple
                      onPress={() => {
                        navigation.navigate('Brand', { item });
                      }}
                      rippleColor={appColors.primary}
                      rippleContainerBorderRadius={scale(40)}
                      rippleDuration={800}
                      style={{
                        ...borderwith,
                        height: scale(70),
                        width: scale(70),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: scale(40),
                      }}>
                      <FastImage
                        style={{ height: scale(70), width: scale(70), borderRadius: scale(40) }}
                        source={imgSource2}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </TouchableRipple>
                    {i18n.language == 'en' ? (
                      <View style={{ marginTop: scale(15) }}>
                        <Label text={bname} style={{ fontSize: scale(14), textAlign: 'center' }} />
                      </View>) : (
                      <View style={{ marginTop: scale(15) }}>
                        <Label text={bcname} style={{ fontSize: scale(14), textAlign: 'center' }} />
                      </View>)}
                  </View>
                );
              }}
            />
          </View>
        )}
        {productsLoading ? (
          <ProductSkeleton />
        ) : (
          <View>
            <View style={{ paddingVertical: scale(25) }}>
              <Pressable onPress={() => {
                navigation.navigate('Allproducts', { 'type': 'newproducts' })
              }}>
                <RenderTitle heading={t('new')} rightLabel={t('seeall')} />
              </Pressable>
            </View>
            <MasonryFlatlist
              data={productlist}
              numColumns={2} // for number of columns
              initialColToRender={10}
              columnWrapperStyle={styles.columnWrapperStyle}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.masonryFlatlist}
              loading={true}
              //onEndReached={getMoreProducts()}
              //onEndReachedThreshold={0.5}
              nestedScrollEnabled={true}
              //scrollEventThrottle={150}
              renderItem={({ item, index }) => {
                if (index % 2 == 0) {
                  return <View style={styles.ProductCardodd}><ProductCard key={index} navigation={navigation} item={item} cartItems={cartItems} /></View>;
                } else {
                  return <View style={styles.ProductCardeven}><ProductCard key={index} navigation={navigation} item={item} cartItems={cartItems} /></View>;
                }

              }}
              ListFooterComponent={() =>
                !lastItem && <Spinner />
              }
            />

          </View>
        )}
        {bestsellerLoading ? (
          <ProductSkeleton />
        ) : (
          <View>
            <View style={{ paddingVertical: scale(25) }}>
              <Pressable onPress={() => {
                navigation.navigate('Allproducts', { 'type': 'bestseller' })
              }}>
                <RenderTitle heading={t('bestseller')} rightLabel={t('seeall')} />
              </Pressable>
            </View>
            <MasonryFlatlist
              data={bestsellerlist}
              numColumns={2} // for number of columns
              initialColToRender={10}
              columnWrapperStyle={styles.columnWrapperStyle}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.masonryFlatlist}
              loading={true}
              //onEndReached={getMoreProducts()}
              //onEndReachedThreshold={0.5}
              nestedScrollEnabled={true}
              //scrollEventThrottle={150}
              renderItem={({ item, index }) => {
                if (index % 2 == 0) {
                  return <View style={styles.ProductCardodd}><ProductCard key={index} navigation={navigation} item={item} cartItems={cartItems} /></View>;
                } else {
                  return <View style={styles.ProductCardeven}><ProductCard key={index} navigation={navigation} item={item} cartItems={cartItems} /></View>;
                }

              }}
              ListFooterComponent={() =>
                !lastItem && <Spinner />
              }
            />

          </View>
        )}
        {popularLoading ? (
          <ProductSkeleton />
        ) : (
          <View>
            <View style={{ paddingVertical: scale(25) }}>
              <Pressable onPress={() => {
                navigation.navigate('Allproducts', { 'type': 'promotion' })
              }}>
                <RenderTitle heading={t('promotion')} rightLabel={t('seeall')} />
              </Pressable>
            </View>
            <MasonryFlatlist
              data={popularlist}
              numColumns={2} // for number of columns
              initialColToRender={10}
              columnWrapperStyle={styles.columnWrapperStyle}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.masonryFlatlist}
              loading={true}
              //onEndReached={getMoreProducts()}
              //onEndReachedThreshold={0.5}
              nestedScrollEnabled={true}
              //scrollEventThrottle={150}
              renderItem={({ item, index }) => {
                if (index % 2 == 0) {
                  return <View style={styles.ProductCardodd}><ProductCard key={index} navigation={navigation} item={item} cartItems={cartItems} /></View>;
                } else {
                  return <View style={styles.ProductCardeven}><ProductCard key={index} navigation={navigation} item={item} cartItems={cartItems} /></View>;
                }

              }}
              ListFooterComponent={() =>
                !lastItem && <Spinner />
              }
            />

          </View>
        )}
      </Container>
    </>
  );
}

export default ReduxWrapper(Home);
const styles = StyleSheet.create({
  homwsearchpdning:{
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: appColors.primary,
    alignItems: 'center',
    borderBottomWidth: 12,
    borderBottomColor: '#ddd',
  },
  headerText: {
    color: 'white',
    fontSize: 25,
    padding: 20,
    margin: 20,
    textAlign: 'center',
  },
  TitleText: {
    fontSize: 25,
    // padding: 20,
    marginVertical: 20,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
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
  columnWrapperStyle: {
  },
  masonryFlatlist: {

  },
  lottieContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
});
