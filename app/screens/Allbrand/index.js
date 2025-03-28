import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, SafeAreaView, Spinner, Image, Pressable, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {scale} from 'react-native-size-matters';
import Badge from '../../components/Badge';
import Container from '../../components/Container';
import SearchBox from '../../components/SearchBox';
import TitleComp from '../../components/TitleComp';
import Label from '../../components/Label';
import TouchableRipple from 'react-native-touch-ripple';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from "react-i18next";
import "../../translation";
import {appColors, shadow, borderwith} from '../../utils/appColors';

const { width } = Dimensions.get("window");
const columnWidth = (width - 10) / 2 - 10;
import MasonryFlatlist from 'react-native-masonry-grid';
import { useSelector } from 'react-redux';
import getAllData from '../../utils/getAllData';
import { APP_IMGURL } from '../../utils/appConfig';

export default function index({navigation}) {
  const { t, i18n } = useTranslation();
  const [categorylist, setCategorylist] = useState([]);
  const [brandlist, setBrandlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ispageLoading, setIspageLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  
  const getcatData = async () => {
    setIspageLoading(true);
    const getbrnd = await getAllData('brands');
    const brnd: any[] = [];
    getbrnd.forEach(doc => {
       brnd.push({
           id: doc.id,
           image: APP_IMGURL +'/brands/'+doc.id+'/'+doc.data()['iconname'],
           ...doc.data()
         });
     });
    setBrandlist(brnd);
    setIspageLoading(false);
  }
  
  useEffect(() => {
    getcatData()
  }, []);
  
  useEffect(() => {
    // Check if all images are loaded
    if (brandlist.length > 0 && Object.keys(imagesLoaded).length > 0) {
      const allLoaded = brandlist.every(item => imagesLoaded[item.id]);
      setAllImagesLoaded(allLoaded);
    }
  }, [imagesLoaded, brandlist]);

  const handleImageLoad = (id) => {
    setImagesLoaded(prev => ({
      ...prev,
      [id]: true
    }));
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
          marginBottom: scale(5),
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" color={appColors.white} size={scale(25)} />
        </Pressable>

        <Label
          text={t('brands')}
          style={{fontWeight: '500', fontSize: scale(18),color:'#fff'}}
        />
      </View>
      </SafeAreaView>
    );
  };
  
  const renderSkeletonItem = () => {
    return (
      <View style={{ alignItems: 'center', marginRight: scale(10), width: "22.6%" }}>
        <View style={{
          ...borderwith,
          height: scale(70),
          width: scale(70),
          borderRadius: scale(40),
          overflow: 'hidden',
          marginBottom: scale(15)
        }}>
          <SkeletonPlaceholder borderRadius={scale(40)}>
            <SkeletonPlaceholder.Item 
              width={scale(70)} 
              height={scale(70)} 
            />
          </SkeletonPlaceholder>
        </View>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item width={scale(60)} height={scale(14)} />
        </SkeletonPlaceholder>
      </View>
    );
  };
  
  const RenderTitle = ({heading, rightLabel}) => {
    return <TitleComp heading={heading} rightLabel={rightLabel} />;
  };
  
  const ProductCard = ({item,cartItems}) => {
    return <Product navigation={navigation} item={item} cartItems={cartItems}/>;
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
            {brandlist.length > 0 && !allImagesLoaded ? (
              <FlatList
                style={{marginTop: scale(15)}}
                numColumns='4'
                showsVerticalScrollIndicator={false}
                Vertical
                data={Array(20).fill(0)}
                ItemSeparatorComponent={() => <View style={{padding: scale(10)}} />}
                renderItem={() => renderSkeletonItem()}
                keyExtractor={(_, index) => `skeleton-${index}`}
              />
            ) : (
              <FlatList
                style={{marginTop: scale(15)}}
                numColumns='4'
                showsVerticalScrollIndicator={false}
                Vertical
                data={brandlist}
                ItemSeparatorComponent={() => <View style={{padding: scale(10)}} />}
                renderItem={({item, index}) => {
                  const {id, bname, bcname, Icon, image} = item;
                  return (
                    <View key={index} style={{alignItems: 'center', marginRight: scale(10),width:"22.6%"}}>
                      <TouchableRipple
                        onPress={() => {
                          navigation.navigate('Brand', {item});
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
                          overflow: 'hidden',
                          position: 'relative',
                        }}>
                        <Image
                          resizeMode='contain'
                          style={{height:scale(70), width:scale(70),borderRadius: scale(40)}}
                          source={{uri:image}} 
                        />
                      </TouchableRipple>
                      <View style={{marginTop: scale(15)}}>
                        <Label 
                          text={i18n.language == 'en' ? bname : bcname} 
                          style={{fontSize: scale(14), textAlign: 'center'}} 
                        />
                      </View>
                    </View>
                  );
                }}
              />
            )}
            
            {/* Hidden images to preload */}
            {brandlist.map(item => (
              <Image
                key={`preload-${item.id}`}
                source={{ uri: item.image }}
                style={{ width: 0, height: 0 }}
                onLoad={() => handleImageLoad(item.id)}
              />
            ))}
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
