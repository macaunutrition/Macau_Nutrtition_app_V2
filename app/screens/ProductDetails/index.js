import React, {useRef, useCallback,useEffect, useState} from 'react';
import {View, Modal, TouchableOpacity, Text, TextInput, ActivityIndicator, Button, StyleSheet,SafeAreaView, ImageBackground, Pressable, Dimensions, ScrollView, Alert} from 'react-native';
import LottieView from 'lottie-react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Share from 'react-native-share';
import {scale} from 'react-native-size-matters';
import SimpleStepper from 'react-native-simple-stepper';
import Container from '../../components/Container';
import Label from '../../components/Label';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import {appColors} from '../../utils/appColors';
import Feather from 'react-native-vector-icons/Feather';
import TitleComp from '../../components/TitleComp';
import {productDetail} from '../../utils/MockData';
import ReviewComp from '../../components/ReviewComp';
import BottomButtons from '../../components/BottomButtons';
import {connect,useDispatch} from 'react-redux';
import {addToCart, removeFromCart} from '../../redux/cartAction';
import ReduxWrapper from '../../utils/ReduxWrapper';
import getData from '../../utils/getData';
import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { APP_CURRENY, APP_IMGURL } from '../../utils/appConfig';
import {AlertHelper} from '../../utils/AlertHelper';
import SelectDropdown from 'react-native-select-dropdown';
import getAllvariation from '../../utils/getAllvariation';
import { useTranslation } from "react-i18next";
import "../../translation";
const { width } = Dimensions.get('window');
import { removeToWishList } from '../../redux/wishListAction';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { firebase } from '@react-native-firebase/analytics';
import { createOrUpdateRating, getRatings, checkUserRated, checkUserBoughtProduct } from '../../utils/ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';


function index({wishList:{wishItemNames}, cart:{ cartItems },addToWishList$,addToCart$,removeToWishList$,removeFromCart$, navigation,route:{params}}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { pid } = params;
  const [singleproduct, setSingleproduct] = useState([]);
  const [productimages, setProductimages] = useState([]);
  const [voptiond, setVoptiond] = useState([]);
  const [opselected, setOpselected] = useState(false);
  const [dynamicprice, setDynamicprice] = useState(0);
  const [selecoption, setSelecoption] = useState('');
  const [selecoptionall, setSelecoptionall] = useState(Object);
  const [buyqty, setBuyqty] = useState(1);
  const scrollViewRef = useRef(null);
  const ratingViewRef = useRef(null);
  const [ showGoTop, setShowGoTop ] = useState( false );
  const [ selopIndexid, setSelopIndexid ] = useState( '' );
  const [ selsizeindex, setSelsizeindex ] = useState( '' );
  const [outofstock, setOutofstock] = useState(false);

  const [ isLoading, setIsLoading ] = useState( true );
  const [ issizeshow, setIssizeshow ] = useState( false );
  const [ sizeoption, setSizeoption ] = useState( [] );
  const [ sizeslected, setSizeslected ] = useState(false);
  const [ varprice, setVarprice ] = useState(0);
  const [ varqtyn, setVarqtyn ] = useState(0);
  const [ selectedsizeoption, setSelectedsizeoption ] = useState(Object);

  const [selecoptionid, setSelecoptionid] = useState('');
  const [selecoptionname, setSelecoptionname] = useState('');
  const [selecoptionpoint, setSelecoptionpoint] = useState(0);
  const [selecoptionqty, setSelecoptionqty] = useState('1');
  const [selecoptionweig, setSelecoptionweig] = useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isInWishlist, setIsInWishlist] = useState(0);
  const [slides, setSlides] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [userBoughtProduct, setUserBoughtProduct] = useState(false);
  const [allratings, setAllratings] = useState([]);
  const [addreviewmodel, setAddreviewmodel] = useState(false);
  const [myRating, setMyRating] = useState('');
  const [myReview, setMyReview] = useState('');
  const [isreviewloading, setIsreviewloading] = useState(false);
  const loadAllratings = async () => {
    const ratings = await getRatings(pid);
    setAllratings(ratings);
  }
  const loadUserBoughtProduct = async () => {
    const usermobile = await AsyncStorage.getItem('user');
    const userBoughtProduct = await checkUserBoughtProduct(pid, usermobile);
    setUserBoughtProduct(userBoughtProduct);
  }
  const loadUserRated = async () => {
    const usermobile = await AsyncStorage.getItem('user');
    const userRated = await checkUserRated(pid, usermobile);
    if(userRated) {
      setMyRating(userRated.rating);
      setMyReview(userRated.comment);
    }
  }
  const RateProduct = async (ratingnum,comment) => {
    if(ratingnum == '') {
      AlertHelper.show('error', t('pleaseenterrating'));
      return;
    }
    setIsreviewloading(true);
    const usermobile = await AsyncStorage.getItem('user');
    try {
      const rating = await createOrUpdateRating(pid, ratingnum, comment, usermobile);
      AlertHelper.show('success', t('ratingandreviewmsg'));
      loadAllratings();
    } catch (error) {
      AlertHelper.show('error', t('ratingandreviewerr'));
    }
    setIsreviewloading(false);
    setAddreviewmodel(false);
  }
  
  const addReview = () => {
    setAddreviewmodel(true);
  }
  const loadSIngleproducts = async () => {
    setBuyqty(1);
    setSelsizeindex('');
    setSelopIndexid('');
    setIssizeshow(false);
    setSizeoption([]);
    setSizeslected(false);
    setVarprice(0);
    setVarqtyn(0);
    setSelectedsizeoption(Object);

    setIsLoading(true);
    if(wishItemNames?.includes(pid)) {
      setIsInWishlist(true);
    }else {
      setIsInWishlist(false);
    }
    const product = await getData('products',pid);
    let pitem = product.data();
    pitem.pid = pid;
    pitem.id = pid;
    setSingleproduct(pitem);
    setVoptiond([]);
    setSelecoptionall({});
    setOpselected(false);
    setSelecoptionid('');
    setSelopIndexid('');
    if(pitem.sellprice > 0) {
      setDynamicprice(pitem.sellprice);
    }else {
      setDynamicprice(pitem.price);
    }
    setSelecoptionname('');
    setSelecoptionpoint(pitem.totalpoints);
    setSelecoptionqty(pitem.qty);
    setSelecoptionweig('');
    if(pitem.qty == 0) {
      setOutofstock(true);
    }else {
      setOutofstock(false);
    }

    //const {id,name,cname,description,cdescription, manfacid, substock, qty, minqty, detail, price, size, color, image, isFav,rating, stockstatus, ptag, model, totalpoints,variation,variationname,variationcname} = pitem;
    const vopArr = [];
      const vopt = await getAllvariation('selectoptions',pid);
       vopt.forEach(doc => {
          if(doc.data()['vqty'] > 0) {
             vopArr.push({
               vid: doc.id,
       					...doc.data()
       				});
          }
       });
       setVoptiond(vopArr)

      const bannersArr: any[] = [];
      const images = pitem.images;
      const bimgArr: any[] = [];
      let bvideoArr: any = {};
      if(pitem.video) {
        bvideoArr = {
          uri: APP_IMGURL +'/products/video/'+pid+'/'+pitem.video,
          type: 'video',
        };
      }
      images.forEach(doc => {
         bimgArr.push(
            {
              url: APP_IMGURL +'/products/'+pid+'/'+doc,
              type: 'image',
            }
         );
      });
      bannersArr.push(
         {
           images: bimgArr,
           video: bvideoArr,
         }
      );

      setProductimages(bannersArr);

    // Create and set the flattened slides array
    const flattenedSlides = [];

    // Add images
    if (bimgArr.length > 0) {
      flattenedSlides.push(...bimgArr.map(img => ({ type: 'image', content: img })));
    }

    // Add video if it exists
    if (Object.keys(bvideoArr).length > 0) {
      flattenedSlides.push({ type: 'video', content: bvideoArr });
    }

    setSlides(flattenedSlides);

      setIsLoading(false);
  }
  //console.warn(wishItemNames);
  const shareProduct = async () => {
    const url = `https://macaunutrition.com/macaunutrition/productdetails/${singleproduct.pid}`;
    const options = {
     message: `Macau Nutrition: ${singleproduct.name}\nCheck out the product here: ${url}`,
    };
    try {
      await Share.open(options);
    } catch (error) {
      Alert.alert('Error', 'Could not share the product.');
    }
  };
  const byeqtycondition = (value) => {
    if (singleproduct?.variationname) {
      const overallqty = Number(selecoptionqty);
       if(overallqty == value) {
        AlertHelper.show('error', t('maxqtyreached'));
       }
    }else {
      const overallqty = singleproduct.qty;
      if(overallqty == value) {
        AlertHelper.show('error', t('maxqtyreached'));
      }
    }
    setBuyqty(value);
  }
  //console.warn(cartItems.length);
  const onAddToCart = async () => {
    if(cartItems.length > 0) {
        const idArr = [];
        cartItems.forEach(doc => {
          idArr.push(doc.id);
        });
        if(singleproduct?.variationname) {
          singleproduct.id = singleproduct.pid+selopIndexid+selsizeindex;
          if(idArr.indexOf(singleproduct.id) > -1) {
            const addQty = Number(cartItems[idArr.indexOf(singleproduct.id)].quantity) + Number(buyqty);
            if( (selecoptionqty != null) && (Number(addQty) > Number(selecoptionqty)) ) {
              AlertHelper.show('error',  t('max')+' '+selecoptionqty+' '+t('youcanbuy'));
            }else {
              removeFromCart$(singleproduct.id);
              firebase.analytics().logEvent('add_to_cart', { product_id: singleproduct.pid });
              firebase.analytics().logEvent('variation_name', { variation_name: selecoptionname });
              addToCart$({...singleproduct, quantity:addQty,...selecoptionall,sizedetails: selectedsizeoption, singleproduct: singleproduct });
            }

          }else {
            addToCart$({...singleproduct, quantity:buyqty, ...selecoptionall , sizedetails: selectedsizeoption, singleproduct: singleproduct});
          }
        }else {
          if(idArr.indexOf(singleproduct.id) > -1) {
            const addQty = Number(cartItems[idArr.indexOf(singleproduct.id)].quantity) + Number(buyqty);
            if( (selecoptionqty != null) && (Number(addQty) > Number(selecoptionqty)) ) {
              AlertHelper.show('error',  t('max')+' '+selecoptionqty+' '+t('youcanbuy'));
            }else {
              removeFromCart$(singleproduct.id);
              firebase.analytics().logEvent('add_to_cart', { product_id: singleproduct.pid });
              addToCart$({...singleproduct, quantity:addQty,...selecoptionall ,sizedetails: selectedsizeoption, singleproduct: singleproduct});
            }
          }else {
            firebase.analytics().logEvent('add_to_cart', { product_id: singleproduct.pid });
            addToCart$({...singleproduct, quantity:buyqty, ...selecoptionall ,sizedetails: selectedsizeoption, singleproduct: singleproduct});
          }
        }
    }else {
      if(singleproduct?.variationname) {
          singleproduct.id = singleproduct.pid+selopIndexid+selsizeindex;
          firebase.analytics().logEvent('add_to_cart', { product_id: singleproduct.pid });
          firebase.analytics().logEvent('variation_name', { variation_name: selecoptionname });
          addToCart$({...singleproduct, quantity:buyqty, ...selecoptionall,sizedetails: selectedsizeoption, singleproduct: singleproduct});
      }else {
        firebase.analytics().logEvent('add_to_cart', { product_id: singleproduct.pid });
        addToCart$({...singleproduct, quantity:buyqty, ...selecoptionall,sizedetails: selectedsizeoption, singleproduct: singleproduct});
      }
    }
  };
  const onSelect = (selectedItem, index) => {
    setSelectedsizeoption({});
    setSelecoptionall(selectedItem);
    setOpselected(true);
    setSelopIndexid(selectedItem.vid);
    setSelecoptionid(selectedItem.opdpdn);
    setDynamicprice(selectedItem.vprice);
    setSelecoptionname(selectedItem.optionname);
    setSelecoptionpoint(selectedItem.vtotalpoints);
    setSelecoptionqty(selectedItem.vqty);
    setSelecoptionweig(selectedItem.vweight);

    setVarqtyn(selectedItem.vqty);
    if(selectedItem.vqty == 0) {
      setOutofstock(true);
    }else {
      setOutofstock(false);
    }
    setVarprice(selectedItem.vprice);

    let newweght = JSON.parse(selectedItem.vweight)
    if(newweght.length > 0) {
      setSizeoption(newweght);
      setIssizeshow(true);
      // if(newweght[0].sprice != null) {
      //   setDynamicprice(newweght[0].sprice)
      //   console.warn(newweght[0].sweight);
      // }else {
      //   console.warn('newweght[0].sweight');
      // }
    }else {
      setIssizeshow(false);
      setSizeoption([]);
      setSizeslected(false);
      setSelsizeindex('');
    }

    if(selectedItem.vimage) {
      setCurrentIndex(0);
      const bannersArr: any[] = [];
      const bimgArr: any[] = [];
      bimgArr.push(
        {
          url:  APP_IMGURL+'/products/'+selectedItem.productid+'/'+selectedItem.variation+'/'+selectedItem.vimage,
          type: 'image',
        }
      );
      bannersArr.push(
         {
           images: bimgArr,
           video: {},
         }
      );
      setProductimages(bannersArr);
    }

  };
  const onSizeSelect = (selectedItem, index) => {
    setSelectedsizeoption(selectedItem);
    if(selectedItem.sprice != null) {
      setDynamicprice(selectedItem.sprice);
    }else {
      setDynamicprice(varprice);
    }
    if(selectedItem.sqty != null) {
      setSelecoptionqty(selectedItem.sqty);
      if(selectedItem.sqty == 0) {
        setOutofstock(true);
      }else {
        setOutofstock(false);
      }
    }else {
      setSelecoptionqty(varqtyn);
    }
    setSelecoptionweig(selectedItem.sweight);
    setSelsizeindex((selectedItem.sweight).toLowerCase().replace(/\s+/g, ''))
    setSizeslected(true);

  }

  const MediaSliderItem = ({ item }) => {
    const [loaded, setLoaded] = useState(false);
    
    return (
      <>
        {!loaded && (
          <SkeletonPlaceholder borderRadius={0}>
            <SkeletonPlaceholder.Item width={width} height={400} />
          </SkeletonPlaceholder>
        )}
        <ImageZoom
          uri={item.url}
          minScale={1}
          maxScale={5}
          doubleTapScale={3}
          isSingleTapEnabled
          isDoubleTapEnabled
          style={[styles.imageslide, {display: loaded ? 'flex' : 'none'}]}
          resizeMode="cover"
          onLoad={() => setLoaded(true)}
        />
      </>
    );
  };

  const VideoSliderItem = ({ item }) => {
    const [loaded, setLoaded] = useState(false);
    
    return (
      <>
        {!loaded && (
          <SkeletonPlaceholder borderRadius={0}>
            <SkeletonPlaceholder.Item width={width} height={400} />
          </SkeletonPlaceholder>
        )}
        <Video
          source={{ uri: item.uri }}
          style={[styles.media, {display: loaded ? 'flex' : 'none'}]}
          resizeMode="cover"
          controls={true}
          onLoad={() => setLoaded(true)}
        />
      </>
    );
  };

  const renderCarouselItem = useCallback(({ item }) => {
    return (
      <>
        {item.type === 'image' && item.content && typeof item.content === 'object' && (
          <MediaSliderItem key={item.content.url} item={item.content} />
        )}
        {item.type === 'video' && item.content && typeof item.content === 'object' && (
          <VideoSliderItem item={item.content} />
        )}
      </>
    );
  }, []);

  const addtoCart = () => {
    if(Number(buyqty) <= 0) {
      AlertHelper.show('error', t('selectquantity'));
      return;
    }
    if(singleproduct.variation && selecoptionname == '') {
      AlertHelper.show('error', t('select')+' '+singleproduct.variationname);
    }else {
      if(issizeshow) {
        if(!sizeslected) {
          AlertHelper.show('error', t('select')+' '+t('size'));
          return;
        }
      }
      if(Number(buyqty) < Number(singleproduct.minqty) ) {
          AlertHelper.show('error', t('minimum')+' '+singleproduct.minqty+' '+t('youshouldbuy'));
          return;
      }
      if(singleproduct.variation) {
        if( (selecoptionqty !== null) && (Number(buyqty) > Number(selecoptionqty))) {
          AlertHelper.show('error', t('max')+' '+selecoptionqty+' '+t('youcanbuy'));
        }else {
          onAddToCart();
          AlertHelper.show('success', t('successfullyadded'));
        }
      }else {
        if( (selecoptionqty != null) && (Number(buyqty) > Number(selecoptionqty)) ) {
          AlertHelper.show('error',  t('max')+' '+selecoptionqty+' '+t('youcanbuy'));
        }else {
          onAddToCart();
          AlertHelper.show('success',  t('successfullyadded'));
        }
      }
    }
  }
  const buyNow = () => {
    if(Number(buyqty) <= 0) {
      AlertHelper.show('error', t('selectquantity'));
      return;
    }
    if(singleproduct.variation && selecoptionname == '') {
      AlertHelper.show('error', 'Select '+singleproduct.variationname);
    }else {
      if(issizeshow) {
        if(!sizeslected) {
          AlertHelper.show('error', t('select')+' '+t('size'));
          return;
        }
      }
      if(Number(buyqty) < Number(singleproduct.minqty) ) {
          AlertHelper.show('error',  t('minimum')+' '+singleproduct.minqty+' '+t('youshouldbuy'));
          return;
      }
      if(singleproduct.variation) {
        if( (selecoptionqty != null) && (Number(buyqty) > Number(selecoptionqty))) {
          AlertHelper.show('error',  t('max')+' '+selecoptionqty+' '+t('youcanbuy'));
        }else {
          onAddToCart();
          navigation.navigate('Cart');
        }
      }else {
        if( (selecoptionqty != null) && (Number(buyqty) > Number(selecoptionqty)) ) {
          AlertHelper.show('error', t('max')+' '+selecoptionqty+' '+t('youcanbuy'));
        }else {
          onAddToCart();
          navigation.navigate('Cart');
        }
      }
    }
  }
  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeToWishList(singleproduct));
      //removeToWishList$(singleproduct); // Remove from wishlist
    } else {
      addToWishList$({...singleproduct, quantity:buyqty, ...selecoptionall,sizedetails: selectedsizeoption, singleproduct: singleproduct});
    }
    setIsInWishlist(!isInWishlist); // Toggle state
  };
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
        <View>
          <Pressable onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" color={appColors.white} size={scale(25)} />
          </Pressable>
          </View>
        <View style={{  flexDirection: 'row',justifyContent: 'space-between'}}>
          <Pressable
             onPress={toggleWishlist}
             style={{
               marginRight: scale(30),
               justifyContent: 'center',
               alignItems: 'center',
             }}>
             <Feather name="heart" size={scale(25)} color={isInWishlist? appColors.red : appColors.white} />
           </Pressable>
           <Pressable onPress={shareProduct}>
             <Feather name="share-2" color={appColors.white} size={scale(25)} />
           </Pressable>
         </View>
      </View>
      </SafeAreaView>
    );
  };
  const _renderBottom = () => {
    if(showGoTop) {
      if(singleproduct.stockstatus == 'In Stock') {
        if(singleproduct.substock == 'yes') {
          if (selecoptionqty == null) {
            return (
              <View>
                <BottomButtons
                  onPress={buyNow}
                  price={APP_CURRENY.symbol+' '+dynamicprice}
                  buttonLabel={t('buynow')}
                />
              </View>
            );
          }else {
            if(selecoptionqty>0) {
              return (
                <View>
                  <BottomButtons
                    onPress={buyNow}
                    price={APP_CURRENY.symbol+' '+dynamicprice}
                    buttonLabel={t('buynow')}
                  />
                </View>
              );
            }
          }
        }else {
          return (
            <View>
              <BottomButtons
                onPress={buyNow}
                price={APP_CURRENY.symbol+' '+dynamicprice}
                buttonLabel={t('buynow')}
              />
            </View>
          );
        }
      }
    }
  };
  const _addTocartviewTop = () => {
    if(singleproduct.stockstatus == 'In Stock') {
      if(singleproduct.substock == 'yes') {
        if (selecoptionqty == null) {
          return (
            <View>
               <CustomButton onPress={addtoCart} label={t('addtocart')} />
               <CustomButton onPress={buyNow} label={t('buynow')} />
            </View>
          );
        }else {
          if(selecoptionqty>0) {
            return (
              <View>
                 <CustomButton onPress={addtoCart} label={t('addtocart')} />
                 <CustomButton onPress={buyNow} label={t('buynow')} />
              </View>
            );
          }
        }
      }else {
        return (
          <View>
             <CustomButton onPress={addtoCart} label={t('addtocart')} />
             <CustomButton onPress={buyNow} label={t('buynow')} />
          </View>
        );
      }
    }
  };
  const handleVisibleButton = (position) => {
      setShowGoTop( position > 800 )
  }
  const handleScrollUp = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }
  const handleScroll = (event) => {
    const position = event.nativeEvent.contentOffset.y;
    handleVisibleButton(position);
  };
  const _renderGotop = () => {
    if(showGoTop) {
      return (
        <View style={styles.gototopbox}>
          <TouchableOpacity style={styles.gototop} onPress={handleScrollUp}>
            <Feather name="arrow-up" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }
  };
  const nativeAdViewRef = useRef();
  const addanalytics = async () => {
    await firebase.analytics().setCurrentScreen(singleproduct.name);
  }
  const gotToRatingView = () => {
    if (ratingViewRef.current) {
      // Find the ratings section position and scroll to it
      ratingViewRef.current.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current.scrollTo({ y: pageY, animated: true });
      });
    }
  }
  
  useEffect( () => {
    loadSIngleproducts();
    loadUserBoughtProduct();
    loadUserRated();
    loadAllratings();
    addanalytics();
  }, [params]);
  return (
    <>
    {isLoading ? (
      <>
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
        <View>
          <Pressable onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" color={appColors.white} size={scale(25)} />
          </Pressable>
        </View>
        <View style={{  flexDirection: 'row',justifyContent: 'space-between'}}>
          <SkeletonPlaceholder borderRadius={4}>
            <SkeletonPlaceholder.Item width={50} height={20} />
          </SkeletonPlaceholder>
         </View>
      </View>
      </SafeAreaView>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LottieView
          source={require('../../static/bikelotti.json')}
          autoPlay
          loop={true}
          style={{width: 150, height: 150}}
        />
      </View>
        {/*<SkeletonPlaceholder borderRadius={4}>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item marginTop={6} marginBottom={10} width={width/2} height={20} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder borderRadius={0}>
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item width={width} height={300} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder borderRadius={4}>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={120} height={20} />
              <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={240} height={20} />
              <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={width-40} height={20} />
              <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={120} height={20} />
              <SkeletonPlaceholder.Item marginTop={30} marginBottom={10} marginLeft={'auto'}  marginRight={'auto'} width={150} height={40} />
              <SkeletonPlaceholder.Item marginTop={15} marginBottom={10} marginLeft={'auto'}  marginRight={'auto'} width={150} height={40} />
              <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={width-40} height={20} />
              <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={width-40} height={20} />
              <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={width-40} height={20} />
              <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={width-40} height={20} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>*/}
      </>
    ) : (
      <>
        {_renderHeader()}
        <ScrollView ref={scrollViewRef} bodyStyle={{paddingHorizontal: scale(0)}} onScroll={handleScroll} scrollEventThrottle={16}>

          {i18n.language == 'en' ? (
            <View style={{paddingVertical: scale(10),paddingHorizontal: scale(20)}}>
              <Label
                text={singleproduct.name}
                style={{fontWeight: '700', fontSize: scale(18)}}
              />
            </View> ) : (
              <View style={{paddingVertical: scale(10),paddingHorizontal: scale(20)}}>
                <Label
                  text={singleproduct.cname}
                  style={{fontWeight: '700', fontSize: scale(18)}}
                />
              </View> )}
          
            <View>
              <Carousel
                loop
                width={width}
                height={400}
                data={slides}
                autoPlay={false}
                autoPlayInterval={3000}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => setCurrentIndex(index)}
                renderItem={renderCarouselItem}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
                {slides.map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: index === currentIndex ? appColors.primary : 'gray',
                      marginHorizontal: 5,
                    }}
                  />
                ))}
              </View>
            </View>
          <View style={{paddingHorizontal: scale(20), marginBottom: scale(100)}}>
            <View style={{alignItems: "center"}}>
              <>
              {outofstock ? (
                <Label
                  text={t('outofstock')}
                  style={{fontSize: scale(15),color:appColors.primary}}
                />
              ) : (
                <Label
                  text={(singleproduct.stockstatus=='In Stock')? t('instock') : t('outofstock') }
                  style={{fontSize: scale(15),color:appColors.primary}}
                />
              )}
              </>

            </View>
             <View style={{paddingVertical: 20}}>
               <Label
                 text={APP_CURRENY.symbol+' '+dynamicprice}
                 style={{fontWeight: '700', fontSize: scale(20),color:appColors.red}}
               />
               <TouchableOpacity onPress={() => gotToRatingView()} style={{alignSelf:'flex-start',marginTop: scale(10)}}>
                {allratings && allratings.averageRating > 0 && (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 <Text style={{width: 65,textAlign:'center',fontSize: scale(15),color:appColors.white,backgroundColor:appColors.primary,paddingHorizontal: scale(10),paddingVertical: scale(5),borderRadius: scale(5)}}>
                  {allratings.averageRating} <Feather name="star" size={16} color={appColors.white} />
                 </Text>
                 <Text style={{fontSize: scale(12),color:appColors.darkgray,marginLeft: scale(10)}}>{allratings.totalRatings} {t('reviews')}</Text>
                 </View>
                )}
               </TouchableOpacity>
             </View>
             <View>
              { !singleproduct.variation && (
                <View
                  style={{
                    paddingVertical: scale(30),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View>
                    <Label text={t('quantity')} style={{fontSize: scale(15)}} />
                  </View>
                  <View>
                    <SimpleStepper
                    containerStyle={{
                      backgroundColor: appColors.white,
                      flexDirection: 'row',
                      borderRadius: scale(5),
                      overflow: 'hidden',
                      alignItems: 'center',
                      //paddingHorizontal: scale(10),
                      height: scale(45),
                    }}
                    minimumValue={1}
                    maximumValue={singleproduct.qty}
                    initialValue={buyqty}
                    showText={true}
                    renderText={() => <Label style={{paddingHorizontal: scale(10)}} text={buyqty} />}
                    incrementStepStyle={{padding: scale(10), opacity: scale(0.4)}}
                    decrementStepStyle={{padding: scale(10), opacity: scale(0.4)}}
                    incrementImageStyle={{height: scale(20), width: scale(20)}}
                    decrementImageStyle={{height: scale(20), width: scale(20)}}
                    onIncrement={value => byeqtycondition(value)}
                    onDecrement={value => setBuyqty(value)}
                    />
                  </View>
                </View> )}
             </View>
             <View>
               { singleproduct.variation && (
                 <View>
                   {i18n.language == 'en' ? (
                     <Label
                       text={t('select')+' '+singleproduct.variationname}
                       style={{fontWeight: '700', fontSize: scale(20), marginBottom:10}}
                     /> ) : (
                       <Label
                         text={t('select')+'  '+singleproduct.variationcname}
                         style={{fontWeight: '700', fontSize: scale(20), marginBottom:10}}
                       /> )}
                   <SelectDropdown
                      data={voptiond}
                      //defaultValueByIndex={1}
                      //defaultValue={'Egypt'}
                      onSelect={onSelect}
                      defaultButtonText={t('options')}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        if(i18n.language == 'en') {
                          if(selectedItem.vweight) {
                            return selectedItem.optionname
                          }else {
                            return selectedItem.optionname
                          }
                        }else {
                          if(selectedItem.vweight) {
                            return selectedItem.optioncname
                          }else {
                            return selectedItem.optioncname
                          }
                        }


                      }}
                      rowTextForSelection={(item, index) => {
                          if(i18n.language == 'en') {
                            if(item.vweight) {
                              return item.optionname
                            }else {
                              return item.optionname
                            }
                          }else {
                            if(item.vweight) {
                              return item.optioncname
                            }else {
                              return item.optioncname
                            }
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

                    <View>
                    {issizeshow && (
                      <>
                        <Label
                          text={t('select')+' '+t('size')}
                          style={{fontWeight: '700', fontSize: scale(20), marginBottom:10}}
                        />
                        <SelectDropdown
                           data={sizeoption}
                           //defaultValueByIndex={1}
                           //defaultValue={'Egypt'}
                           onSelect={onSizeSelect}
                           defaultButtonText={t('options')}
                           buttonTextAfterSelection={(selectedItem, index) => {
                              return selectedItem.sweight
                           }}
                           rowTextForSelection={(item, index) => {
                               return item.sweight
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
                      </>
                    )}
                    </View>

                    <View
                      style={{
                        paddingVertical: scale(30),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View>
                        <Label text={t('quantity')} style={{fontSize: scale(15)}} />
                      </View>
                      <View>
                        <SimpleStepper
                        containerStyle={{
                          backgroundColor: appColors.white,
                          flexDirection: 'row',
                          borderRadius: scale(5),
                          overflow: 'hidden',
                          alignItems: 'center',
                          //paddingHorizontal: scale(10),
                          height: scale(45),
                        }}
                        minimumValue={1}
                        maximumValue={selecoptionqty}
                        initialValue={buyqty}
                        showText={true}
                        renderText={() => <Label style={{paddingHorizontal: scale(10)}} text={buyqty} />}
                        incrementStepStyle={{padding: scale(10), opacity: scale(0.4)}}
                        decrementStepStyle={{padding: scale(10), opacity: scale(0.4)}}
                        incrementImageStyle={{height: scale(20), width: scale(20)}}
                        decrementImageStyle={{height: scale(20), width: scale(20)}}
                        onIncrement={value => byeqtycondition(value)}
                        onDecrement={value => setBuyqty(value)}
                        disabled={!selecoptionid}
                        />
                      </View>
                    </View>
               </View> )}
             </View>
             <View>
             {_addTocartviewTop()}
             </View>
             <View>
             <Label
               text={singleproduct.ptag}
               style={{fontSize: scale(15)}}
             />
             </View>

            <View
              style={{
                paddingVertical: scale(30),
                //flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              { singleproduct.manfacid && (
                <>
                {i18n.language == 'en' ? (
                  <View style={styles.sizeContainer}>
                    <Label text="Brand" style={{fontSize: scale(15)}} />
                    <Label
                      text={singleproduct.manfac}
                      style={{fontWeight: '700', fontSize: scale(12)}}
                    />
                  </View> ) : (
                    <View style={styles.sizeContainer}>
                      <Label text={t('brand')} style={{fontSize: scale(15)}} />
                      <Label
                        text={singleproduct.cmanfac}
                        style={{fontWeight: '700', fontSize: scale(12)}}
                      />
                    </View> )}
                </>
              )}
              <View style={styles.sizeContainer}>
                <Label text={t('model')} style={{fontSize: scale(15)}} />
                <Label
                  text={singleproduct.model}
                  style={{fontWeight: '700', fontSize: scale(12)}}
                />
              </View>
              <View style={styles.sizeContainer}>
                <Label text={t('getpoint')} style={{fontSize: scale(15)}} />
                <Label
                  text={selecoptionpoint}
                  style={{fontWeight: '700', fontSize: scale(12)}}
                />
              </View>

            </View>
            <View style={{paddingVertical: scale(20)}}>
              <TitleComp heading={t('details')} />
              <View style={{paddingVertical: scale(20)}}>
              {i18n.language == 'en' ? (
                <Label
                  text={singleproduct.description}
                  style={{fontSize: scale(14), lineHeight: scale(25)}}
                /> ) : (
                  <Label
                    text={singleproduct.cdescription}
                    style={{fontSize: scale(14), lineHeight: scale(25)}}
                  /> )}

              </View>
            </View>
            {allratings && allratings.averageRating > 0 && (
            <ScrollView ref={ratingViewRef}>
                <View style={{ paddingVertical: scale(20) }}>
                  <View style={styles.reviewHeader}>
                    <TitleComp heading={t('reviews')} />
                    {userBoughtProduct && (
                      <TouchableOpacity onPress={addReview}>
                        <Text style={styles.addReviewButton}>{t('addreview')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {/* Rating Summary */}
                  {allratings && allratings.averageRating > 0 && (
                  <View style={styles.ratingSummary}>
                    <View style={styles.ratingLeft}>
                      <Text style={styles.averageRating}>{allratings.averageRating} ★</Text>
                      <Text style={styles.ratingCount}>{allratings.totalRatings} {t('reviews')}</Text>
                    </View>

                    <View style={styles.ratingBars}>
                      <View style={styles.ratingBarRow}>
                        <Text style={styles.starLabel}>5★</Text>
                        <View style={styles.barContainer}>
                              <View style={[styles.bar, { width: `${(allratings.rating5 / allratings.totalRatings) * 100}%`, backgroundColor: '#76b729' }]} />
                        </View>
                          <Text style={styles.ratingCount}>{allratings.rating5}</Text>
                      </View>
                      <View style={styles.ratingBarRow}>
                        <Text style={styles.starLabel}>4★</Text>
                        <View style={styles.barContainer}>
                          <View style={[styles.bar, { width: `${(allratings.rating4 / allratings.totalRatings) * 100}%`, backgroundColor: '#76b729' }]} />
                        </View>
                        <Text style={styles.ratingCount}>{allratings.rating4}</Text>
                      </View>
                      <View style={styles.ratingBarRow}>
                        <Text style={styles.starLabel}>3★</Text>
                        <View style={styles.barContainer}>
                          <View style={[styles.bar, { width: `${(allratings.rating3 / allratings.totalRatings) * 100}%`, backgroundColor: '#76b729' }]} />
                        </View>
                        <Text style={styles.ratingCount}>{allratings.rating3}</Text>
                      </View>
                      <View style={styles.ratingBarRow}>
                        <Text style={styles.starLabel}>2★</Text>
                        <View style={styles.barContainer}>
                          <View style={[styles.bar, { width: `${(allratings.rating2 / allratings.totalRatings) * 100}%`, backgroundColor: appColors.yellow }]} />
                        </View>
                        <Text style={styles.ratingCount}>{allratings.rating2}</Text>
                      </View>
                      <View style={styles.ratingBarRow}>
                        <Text style={styles.starLabel}>1★</Text>
                        <View style={styles.barContainer}>
                          <View style={[styles.bar, { width: `${(allratings.rating1 / allratings.totalRatings) * 100}%`, backgroundColor: appColors.red }]} />
                        </View>
                        <Text style={styles.ratingCount}>{allratings.rating1}</Text>
                      </View>
                    </View>
                  </View>
                  )}
                  {allratings && allratings.ratings.length > 0 && (
                    <View>
                      {allratings.ratings.map((rating, index) => (
                        <View key={index} style={styles.ratingItem}>
                          <View style={styles.ratingHeader}>
                            <Text style={styles.ratingStars}>{rating.rating}★</Text>
                            <Text style={styles.ratingTitle}>{rating.title}</Text>
                          </View>
                          <Text style={styles.ratingComment}>{rating.comment}</Text>
                          <View style={styles.ratingFooter}>
                            <Text style={styles.ratingUser}>{rating.user.name},</Text>
                            <Text style={styles.ratingDate}>{rating.date}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
            </ScrollView>
            )}
          </View>
          {userBoughtProduct && (
          <View>
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={addreviewmodel}
                  onRequestClose={() => { setAddreviewmodel(false) }}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <TouchableOpacity style={styles.closeButtonrating} onPress={() => setAddreviewmodel(false)}>
                        <Text style={styles.closeButtonTextrating}>✕</Text>
                      </TouchableOpacity>
                      {/* show 5 start rating */}
                        <View style={styles.ratingContainer}>
                          {[1, 2, 3, 4, 5].map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => setMyRating(item)}
                              style={styles.ratingStarContainer}
                            >
                              <Feather
                                name="star"
                                size={24}
                                color={index < myRating ? appColors.yellow : appColors.darkGray}
                              />
                            </TouchableOpacity>
                          ))}
                        </View>
                      <TextInput
                        placeholder={t('enterreview')}
                        style={[styles.modalInput, { height: scale(100), textAlignVertical: 'top' }]}
                        value={myReview}
                        onChangeText={value => setMyReview(value)}
                      />
                      {isreviewloading ? (
                        <TouchableOpacity style={styles.modalButton}>
                          <ActivityIndicator size="large" color={appColors.white} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={styles.modalButton} onPress={() => RateProduct(myRating, myReview)}>
                          <Text style={[styles.modalButtonText, { textAlign: 'center' }]}>{t('submit')}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Modal>
          </View>
          )}
        </ScrollView>
        {_renderGotop()}
        {_renderBottom()}
      </>
    )}

    </>
  );
}
/*
const mapStateToProps = (state) => ({
   cartItems : state.cart.cartItems
});
const mapDispatchToProps = {
  addToCart$: addToCart,
};
export default connect(mapStateToProps, mapDispatchToProps)(index); */
export default  ReduxWrapper(index)

const styles = StyleSheet.create({
  sizeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: appColors.white,
    padding: scale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(20),
    borderWidth: scale(0.4),
    borderColor: appColors.gray,
    width: '100%',
    marginBottom: scale(10),
  },
  itemColor: {
    height: scale(20),
    width: scale(20),
    backgroundColor: appColors.primary,
    borderRadius: scale(5),
  },
  wrtitle: {
    paddingVertical: scale(10),
    fontSize: scale(14),
    color: appColors.primary,
  },
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
  gototopbox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  gototop: {
    width: 50, // Adjust the size as needed
    height: 50, // Adjust the size as needed
    borderRadius: 30, // Half of the width/height to make it circular
    backgroundColor: appColors.primary, // Adjust the color as needed
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Adds a shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, // Adds a shadow for iOS
    marginBottom:120
  },
  media: {
    width: '100%',
    height: '100%',
  },
    modalContainer: {
     flex: 1,
     justifyContent: 'center', // Center vertically
     alignItems: 'center',     // Center horizontally
     backgroundColor: 'rgba(0, 0, 0, 0.9)', // Dark background for the modal
   },
   imageContainer: {
     width: '100%',
     height: '100%',
     justifyContent: 'center',
     alignItems: 'center',
   },
   image: {
      width: '100%',
      height: '100%',
    },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
  imageslide: {
    height: '100%',
  },
  ratingSummary: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  ratingLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  averageRating: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
  },
  ratingBars: {
    flex: 2,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  starLabel: {
    width: 30,
    fontSize: 12,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    marginHorizontal: 5,
    borderRadius: 4,
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  reviewItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingStars: {
    backgroundColor: '#76b729',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 14,
    color: '#444',
    marginVertical: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reviewerName: {
    fontSize: 12,
    color: '#666',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(10),
  },
  addReviewButton: {
    fontSize: scale(15),
    color: appColors.primary,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: appColors.darkGray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: appColors.primary,
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: appColors.white,
    fontSize: scale(15),
  },
  modalContainerwhite: {
    backgroundColor: appColors.white,
    padding: 20,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    backgroundColor: appColors.white,
    padding: 20,
    borderRadius: 10,
    width: '80%', // Adjust width as needed
  },
  closeButtonrating: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 10,
    backgroundColor: appColors.red,
    paddingBottom: 5,
    borderRadius: 15,
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',

  },
  closeButtonTextrating: {
    color: appColors.white,
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingStarContainer: {
    marginRight: 10,
  },
  ratingItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingStars: {
    backgroundColor: '#76b729',
    color: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 10,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingComment: {
    fontSize: 14,
    color: '#444',
    marginVertical: 8,
  },
  ratingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingUser: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
  },
  ratingLocation: {
    fontSize: 12,
    color: '#666',
    marginRight: 5,
  },
  ratingDate: {
    fontSize: 12,
    color: '#666',
  },
});
