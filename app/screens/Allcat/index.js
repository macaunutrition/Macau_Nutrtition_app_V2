import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Spinner, Image, Pressable, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { scale } from 'react-native-size-matters';
import Badge from '../../components/Badge';
import Container from '../../components/Container';
import SearchBox from '../../components/SearchBox';
import TitleComp from '../../components/TitleComp';
import Label from '../../components/Label';
import TouchableRipple from 'react-native-touch-ripple';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from "react-i18next";
import "../../translation";
import { appColors, shadow, borderwith } from '../../utils/appColors';
import FastImage from 'react-native-fast-image';
import getAllCategories from '../../utils/getAllCategories';
import { APP_IMGURL } from '../../utils/appConfig';
import firebase from '@react-native-firebase/app';

const { width } = Dimensions.get("window");
const columnWidth = (width - 10) / 2 - 10;
import MasonryFlatlist from 'react-native-masonry-grid';
import { useSelector } from 'react-redux';
import getAllData from '../../utils/getAllData';

const ITEMS_PER_PAGE = 20;

export default function index({ navigation }) {
  const { t, i18n } = useTranslation();
  const [categorylist, setCategorylist] = useState([]);
  const [brandlist, setBrandlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ispageLoading, setIspageLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  const getCategoryData = async (loadMore = false) => {
    if (!loadMore) {
      setIspageLoading(true);
      setLastDoc(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      let query = firebase.firestore()
        .collection('categories')
        .where('parent', '==', null)
        .where('status', '==', 'enable')
        .orderBy('name', 'asc');

      if (!loadMore) {
        query = query.limit(ITEMS_PER_PAGE);
      } 
      else if (lastDoc) {
        query = query.startAfter(lastDoc).limit(ITEMS_PER_PAGE);
      }

      const snapshot = await query.get();
      console.log('Fetched items:', snapshot.docs.length);
      
      if (snapshot.empty) {
        setHasMoreItems(false);
        return;
      }

      const cats = snapshot.docs.map(doc => ({
        id: doc.id,
        image: APP_IMGURL + '/categories/' + doc.id + '/' + doc.data()['iconname'],
        ...doc.data()
      }));

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMoreItems(snapshot.docs.length >= ITEMS_PER_PAGE);

      if (loadMore) {
        setCategorylist(prev => [...prev, ...cats]);
      } else {
        setCategorylist(cats);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setHasMoreItems(false);
    } finally {
      setIspageLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);



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
            text={t('categories')}
            style={{ fontWeight: '500', fontSize: scale(18), color: '#fff' }}
          />
        </View>
      </SafeAreaView>
    );
  };
  const RenderTitle = ({ heading, rightLabel }) => {
    return <TitleComp heading={heading} rightLabel={rightLabel} />;
  };
  const ProductCard = ({ item, cartItems }) => {
    return <Product navigation={navigation} item={item} cartItems={cartItems} />;
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

  const loadMore = () => {
    if (!isLoadingMore && hasMoreItems && lastDoc) {
      getCategoryData(true);
    }
  };

  const refreshData = () => {
    setLastDoc(null);
    setHasMoreItems(true);
    setCategorylist([]);
    getCategoryData();
  };

  const renderItem = ({ item }) => {
    const { id, name, cname, image } = item;
    return (
      <View style={{ alignItems: 'center', marginRight: scale(10), width: "22.6%" }}>
        <TouchableRipple
          onPress={() => navigation.navigate('Category', { item })}
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
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            style={{ height: scale(70), width: scale(70), borderRadius: scale(40) }}
            source={{ uri: image }}
          />
        </TouchableRipple>
        <View style={{ marginTop: scale(15) }}>
          <Label 
            text={i18n.language == 'en' ? name : cname} 
            style={{ fontSize: scale(14), textAlign: 'center' }} 
          />
        </View>
      </View>
    );
  };
  useEffect(() => {
    console.log('catlist updated:', categorylist.length, 'items');
  }, [categorylist]);

  return (
    <>
      {_renderHeader()}
      <Container>
        <FlatList
          style={{ marginTop: scale(15) }}
          numColumns={4}
          showsVerticalScrollIndicator={false}
          data={ispageLoading ? Array(20).fill(0) : categorylist}
          renderItem={ispageLoading ? renderSkeletonItem : renderItem}
          keyExtractor={(item, index) => ispageLoading ? `skeleton-${index}` : item.id}
          ItemSeparatorComponent={() => <View style={{ padding: scale(10) }} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => isLoadingMore && (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="large" color={appColors.primary} />
            </View>
          )}
          refreshing={false}
          onRefresh={refreshData}
        />
      </Container>
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
    width: '95%',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    marginRight: 100,
  },
  ProductCardeven: {
    backgroundColor: 'white',
    width: '100%',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
  },
});
