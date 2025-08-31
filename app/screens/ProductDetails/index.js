import React, {useRef, useCallback,useEffect, useState} from 'react';
import {View, Modal, Image,TouchableOpacity, Text, TextInput, ActivityIndicator, Button, StyleSheet,SafeAreaView, ImageBackground, Pressable, Dimensions, ScrollView, Alert, FlatList} from 'react-native';
import LottieView from 'lottie-react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Share from 'react-native-share';
import {scale} from 'react-native-size-matters';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



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
  const flavorSelectorRef = useRef(null);
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
  
  // New state for quantity selector modal
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantityModalType, setQuantityModalType] = useState('regular'); // 'regular' or 'variation'
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

  // Get maximum available quantity in stock
  const getMaxQuantity = () => {
    if (singleproduct?.variationname) {
      return parseInt(selecoptionqty) || 0;
    } else {
      return parseInt(singleproduct.qty) || 0;
    }
  };

  // Get stock information for display
  const getStockInfo = () => {
    const maxQty = getMaxQuantity();
    if (maxQty === 0) {
      return t('outOfStock') || 'Out of Stock';
    } else if (maxQty <= 5) {
      return `${t('only')} ${maxQty} ${t('left')}` || `Only ${maxQty} left`;
    } else {
      return `${t('inStock')} ${maxQty}` || `In Stock: ${maxQty}`;
    }
  };

  // Calculate total price for selected quantity
  const calculateTotalPrice = (quantity) => {
    const currentPrice = singleproduct?.variationname ? dynamicprice : singleproduct.price;
    return (currentPrice * quantity).toFixed(2);
  };

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
    
    // Reset quantity to 1 when loading new product or clearing variations
    setBuyqty(1);
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
    const url = `https://macaunutrition.com/productdetails/${singleproduct.pid}`;
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
              return 'error';
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
              return 'error';
            }else {
              if( (selecoptionqty != null) && (Number(addQty) > Number(selecoptionqty)) ) {
                AlertHelper.show('error',  t('max')+' '+selecoptionqty+' '+t('youcanbuy'));
                return 'error';
              }
              removeFromCart$(singleproduct.id);
              firebase.analytics().logEvent('add_to_cart', { product_id: singleproduct.pid });
              addToCart$({...singleproduct, quantity:addQty,...selecoptionall ,sizedetails: selectedsizeoption, singleproduct: singleproduct});
            }
          }else {
            if( (selecoptionqty != null) && (Number(buyqty) > Number(selecoptionqty)) ) {
                AlertHelper.show('error',  t('max')+' '+selecoptionqty+' '+t('youcanbuy'));
                return 'error';
            }
            firebase.analytics().logEvent('add_to_cart', { product_id: singleproduct.pid });
            addToCart$({...singleproduct, quantity:buyqty, ...selecoptionall ,sizedetails: selectedsizeoption, singleproduct: singleproduct});
          }
        }
    }else {
      if(singleproduct?.variationname) {
          if( (selecoptionqty != null) && (Number(buyqty) > Number(selecoptionqty)) ) {
            AlertHelper.show('error',  t('max')+' '+selecoptionqty+' '+t('youcanbuy'));
            return 'error';
          }else {
            singleproduct.id = singleproduct.pid+selopIndexid+selsizeindex;
            firebase.analytics().logEvent('add_to_cart', { product_id: singleproduct.pid });
            firebase.analytics().logEvent('variation_name', { variation_name: selecoptionname });
            addToCart$({...singleproduct, quantity:buyqty, ...selecoptionall,sizedetails: selectedsizeoption, singleproduct: singleproduct});
          }
      }else {
        firebase.analytics().logEvent('add_to_cart', { product_id: singleproduct.pid });
        if( (selecoptionqty != null) && (Number(buyqty) > Number(selecoptionqty)) ) {
          AlertHelper.show('error',  t('max')+' '+selecoptionqty+' '+t('youcanbuy'));
          return 'error';
        }else {
         addToCart$({...singleproduct, quantity:buyqty, ...selecoptionall,sizedetails: selectedsizeoption, singleproduct: singleproduct});
        }
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

    // Reset quantity to 1 when changing variation/flavor
    setBuyqty(1);

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

    // Reset quantity to 1 when changing size option
    setBuyqty(1);

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
        <Image
          source={{ uri: item.url }}
          style={{ width: '100%', height: 400, display: loaded ? 'none' : '' }}
          onLoad={() => setLoaded(true)}
        />
        {loaded && (
          <ImageZoom
            uri={item.url}
            minScale={1}
            maxScale={5}
            doubleTapScale={3}
            isSingleTapEnabled
            isDoubleTapEnabled
            style={styles.imageslide}
            resizeMode="cover"
          />
        )}
      </>
    );
  };

  const VideoSliderItem = ({ item }) => {
    const [loaded, setLoaded] = useState(false);
    
    return (
      <>
        <Video
          source={{ uri: item.uri }}
          style={[styles.media, {display: loaded ? 'flex' : 'none'}]}
          resizeMode="cover"
          controls={true}
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
      // Auto-scroll to flavor selector after showing error
      setTimeout(() => {
        scrollToFlavorSelector();
      }, 500); // Small delay to ensure error message is visible
      return;
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
          if((onAddToCart())._j != 'error') {
            AlertHelper.show('success', t('successfullyadded'));
            return;
          }
        }
      }else {
        if( (selecoptionqty != null) && (Number(buyqty) > Number(selecoptionqty)) ) {
          AlertHelper.show('error',  t('max')+' '+selecoptionqty+' '+t('youcanbuy'));
        }else {
          if((onAddToCart())._j != 'error') {
            AlertHelper.show('success', t('successfullyadded'));
            return;
          }
        }
      }
    }
  }
  // Helper function to scroll to flavor selector
  const scrollToFlavorSelector = () => {
    if (flavorSelectorRef.current && scrollViewRef.current) {
      flavorSelectorRef.current.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          // Scroll to the flavor selector and center it on screen
          const screenHeight = Dimensions.get('window').height;
          const scrollPosition = Math.max(0, y - (screenHeight / 2));
          scrollViewRef.current.scrollTo({
            y: scrollPosition,
            animated: true,
          });
        },
        () => {
          // Fallback: scroll to a reasonable position
          scrollViewRef.current.scrollTo({
            y: 400,
            animated: true,
          });
        }
      );
    }
  };

  const buyNow = () => {
    if(Number(buyqty) <= 0) {
      AlertHelper.show('error', t('selectquantity'));
      return;
    }
    if(singleproduct.variation && selecoptionname == '') {
      AlertHelper.show('error', 'Select '+singleproduct.variationname);
      // Auto-scroll to flavor selector after showing error
      setTimeout(() => {
        scrollToFlavorSelector();
      }, 500); // Small delay to ensure error message is visible
      return;
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
          if(onAddToCart() != 'error') {
             navigation.navigate('Cart');
          }
        }
      }else {
        if( (selecoptionqty != null) && (Number(buyqty) > Number(selecoptionqty)) ) {
          AlertHelper.show('error', t('max')+' '+selecoptionqty+' '+t('youcanbuy'));
        }else {
          if(onAddToCart() != 'error') {
            navigation.navigate('Cart');
          }
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
  const renderSkeletonGrid = () => {
    return (
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item marginTop={6} marginBottom={10} width={width / 2} height={20} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item width={width} height={300} />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={120} height={20} />
            <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={240} height={20} />
            <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={width - 40} height={20} />
            <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={120} height={20} />
            <SkeletonPlaceholder.Item marginTop={30} marginBottom={10} marginLeft={'auto'} marginRight={'auto'} width={150} height={40} />
            <SkeletonPlaceholder.Item marginTop={15} marginBottom={10} marginLeft={'auto'} marginRight={'auto'} width={150} height={40} />
            <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={width - 40} height={20} />
            <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={width - 40} height={20} />
            <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={width - 40} height={20} />
            <SkeletonPlaceholder.Item marginTop={10} marginBottom={10} width={width - 40} height={20} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  };

  
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
        <View>
          <SkeletonPlaceholder borderRadius={4}>
            <SkeletonPlaceholder.Item width={50} height={20} />
          </SkeletonPlaceholder>
         </View>
      </View>
      </SafeAreaView>
      <View>
        {renderSkeletonGrid()}
      </View>
     
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
                 style={{fontWeight: '700', fontSize: scale(20),color:appColors.primaryDark}}
               />
               <TouchableOpacity onPress={() => gotToRatingView()} style={{alignSelf:'flex-start',marginTop: scale(10)}}>
                {allratings && allratings.averageRating > 0 && (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {[1, 2, 3, 4, 5].map((star, index) => {
                            const rating = allratings.averageRating;
                            const isHalfStar = rating - index > 0 && rating - index < 1;
                            const isFullStar = rating - index >= 1;

                            return (
                              <MaterialCommunityIcons
                                key={index}
                                name={isFullStar ? "star" : isHalfStar ? "star-half-full" : "star-outline"}
                                size={25}
                                color={isFullStar || isHalfStar ? '#FFC107' : '#FFC107'}
                              />
                            );
                          })}
                        </View>
                        <Text
                          style={{
                            fontSize: scale(18),
                            color: appColors.primaryDark,
                            marginLeft: scale(8),
                            textDecorationLine: 'underline'
                          }}
                        >
                          {allratings.totalRatings}
                        </Text>
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
                  <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    {/* Stock Information - Above "Select Quantity" */}
                    <View style={{marginBottom: scale(5), alignItems: 'flex-start'}}>
                      <Label 
                        text={getStockInfo()} 
                        style={{
                          fontSize: scale(10),
                          fontWeight: '400',
                          color: getMaxQuantity() === 0 ? '#FF0000' : getMaxQuantity() <= 5 ? '#FF6B00' : appColors.gray,
                          textAlign: 'left',
                        }} 
                      />
                    </View>
                    
                    {/* Select Quantity and Selector on same horizontal line */}
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                      <Label text="Select Quantity" style={{fontSize: scale(15)}} />
                      
                      {/* Quantity Selector - 50% bigger with same horizontal padding as buttons */}
                      <TouchableOpacity
                        onPress={() => {
                          setQuantityModalType('regular');
                          setShowQuantityModal(true);
                        }}
                        style={{
                          backgroundColor: appColors.lightGray,
                          borderRadius: scale(6), // 50% bigger from 4 to 6
                          paddingHorizontal: scale(10.5), // 50% bigger from 7 to 10.5
                          paddingVertical: scale(4.5), // 50% bigger from 3 to 4.5
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minWidth: scale(39), // 50% bigger from 26 to 39
                          width: scale(57), // 50% bigger from 38 to 57
                          marginRight: scale(12), // Same horizontal padding as Container (scale(12))
                        }}
                      >
                        <Label 
                          text={buyqty.toString()} 
                          style={{
                            fontSize: scale(16.5), // 50% bigger from 11 to 16.5
                            fontWeight: '500',
                            color: appColors.black,
                          }} 
                        />
                        <MaterialCommunityIcons
                          name="chevron-down"
                          size={scale(18)} // 50% bigger from 12 to 18
                          color={appColors.black}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View> )}
             </View>
                          <View>
               { singleproduct.variation && (
                 <View ref={flavorSelectorRef}>
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
                      <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                        {/* Stock Information - Above "Select Quantity" */}
                        <View style={{marginBottom: scale(5), alignItems: 'flex-start'}}>
                          <Label 
                            text={getStockInfo()} 
                            style={{
                              fontSize: scale(10),
                              fontWeight: '400',
                              color: getMaxQuantity() === 0 ? '#FF0000' : getMaxQuantity() <= 5 ? '#FF6B00' : appColors.gray,
                              textAlign: 'left',
                            }} 
                          />
                        </View>
                        
                        {/* Select Quantity and Selector on same horizontal line */}
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                          <Label text="Select Quantity" style={{fontSize: scale(15)}} />
                          
                          {/* Quantity Selector - 50% bigger with same horizontal padding as buttons */}
                          <TouchableOpacity
                            onPress={() => {
                              setQuantityModalType('variation');
                              setShowQuantityModal(true);
                            }}
                            style={{
                              backgroundColor: appColors.lightGray,
                              borderRadius: scale(6), // 50% bigger from 4 to 6
                              paddingHorizontal: scale(10.5), // 50% bigger from 7 to 10.5
                              paddingVertical: scale(4.5), // 50% bigger from 3 to 4.5
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              minWidth: scale(39), // 50% bigger from 26 to 39
                              width: scale(57), // 50% bigger from 38 to 57
                              marginRight: scale(12), // Same horizontal padding as Container (scale(12))
                              opacity: !selecoptionid ? 0.5 : 1,
                            }}
                            disabled={!selecoptionid}
                          >
                            <Label 
                              text={buyqty.toString()} 
                              style={{
                                fontSize: scale(16.5), // 50% bigger from 11 to 16.5
                                fontWeight: '500',
                                color: appColors.black,
                              }} 
                            />
                            <MaterialCommunityIcons
                              name="chevron-down"
                              size={scale(18)} // 50% bigger from 12 to 18
                              color={appColors.black}
                            />
                          </TouchableOpacity>
                        </View>
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

        {/* Quantity Selection Modal */}
        <Modal
          visible={showQuantityModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowQuantityModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: scale(10),
              padding: scale(20),
              minWidth: scale(250),
              maxHeight: scale(400),
            }}>
              <Label 
                text={t('selectQuantity')} 
                style={{
                  fontSize: scale(16),
                  fontWeight: '600',
                  marginBottom: scale(15),
                  textAlign: 'center',
                }}
              />
              <FlatList
                data={Array.from({length: getMaxQuantity()}, (_, i) => i + 1)}
                keyExtractor={(item) => item.toString()}
                renderItem={({item: qty}) => (
                  <TouchableOpacity
                    style={[
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: scale(15),
                        borderBottomWidth: 1,
                        borderBottomColor: appColors.lightGray,
                      },
                      buyqty === qty && {
                        backgroundColor: appColors.lightGray,
                        borderRadius: scale(5),
                      }
                    ]}
                    onPress={() => {
                      setBuyqty(qty);
                      setShowQuantityModal(false);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Label
                        text={`Qty: ${qty}`}
                        style={{
                          fontSize: scale(14),
                          color: appColors.black,
                          fontWeight: buyqty === qty ? '600' : '400',
                        }}
                      />
                      <Label
                        text={`${APP_CURRENY.symbol} ${calculateTotalPrice(qty)}`}
                        style={{
                          fontSize: scale(12),
                          color: appColors.gray,
                          marginTop: scale(2),
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: appColors.primary,
                  padding: scale(12),
                  borderRadius: scale(5),
                  marginTop: scale(15),
                  alignItems: 'center',
                }}
                onPress={() => setShowQuantityModal(false)}
              >
                <Label 
                  text="Cancel" 
                  style={{
                    fontSize: scale(14),
                    color: appColors.white,
                    fontWeight: '500',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
