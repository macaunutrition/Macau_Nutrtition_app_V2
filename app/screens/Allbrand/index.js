
import React, {useState, useEffect} from 'react';
import {View, FlatList, SafeAreaView, ActivityIndicator, Pressable} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {scale} from 'react-native-size-matters';
import Container from '../../components/Container';
import Label from '../../components/Label';
import TouchableRipple from 'react-native-touch-ripple';
import Feather from 'react-native-vector-icons/Feather';
import {useTranslation} from "react-i18next";
import {appColors, borderwith} from '../../utils/appColors';
import FastImage from 'react-native-fast-image';
import {APP_IMGURL} from '../../utils/appConfig';
import firebase from '@react-native-firebase/app';

const ITEMS_PER_PAGE = 20;

export default function index({navigation}) {
  const {t, i18n} = useTranslation();
  const [brandlist, setBrandlist] = useState([]);
  const [ispageLoading, setIspageLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  
  const getBrandData = async (loadMore = false) => {
    if (!loadMore) {
      setIspageLoading(true);
      setLastDoc(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      let query = firebase.firestore()
        .collection('brands')
        .where('status', '==', 'enable')
        .orderBy('bname', 'asc');

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

      const brnd = snapshot.docs.map(doc => ({
        id: doc.id,
        image: APP_IMGURL + '/brands/' + doc.id + '/' + doc.data()['iconname'],
        ...doc.data()
      }));

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMoreItems(snapshot.docs.length >= ITEMS_PER_PAGE);

      if (loadMore) {
        setBrandlist(prev => [...prev, ...brnd]);
      } else {
        setBrandlist(brnd);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      setHasMoreItems(false);
    } finally {
      setIspageLoading(false);
      setIsLoadingMore(false);
    }
  };
  
  useEffect(() => {
    getBrandData();
  }, []);

  const loadMore = () => {
    if (!isLoadingMore && hasMoreItems && lastDoc) {
      getBrandData(true);
    }
  };

  const refreshData = () => {
    setLastDoc(null);
    setHasMoreItems(true);
    setBrandlist([]);
    getBrandData();
  };
  
  const renderSkeletonItem = () => (
    <View style={{alignItems: 'center', marginRight: scale(10), width: "22.6%"}}>
      <View style={{
        ...borderwith,
        height: scale(70),
        width: scale(70),
        borderRadius: scale(40),
        overflow: 'hidden',
        marginBottom: scale(15)
      }}>
        <SkeletonPlaceholder borderRadius={scale(40)}>
          <SkeletonPlaceholder.Item width={scale(70)} height={scale(70)} />
        </SkeletonPlaceholder>
      </View>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item width={scale(60)} height={scale(14)} />
      </SkeletonPlaceholder>
    </View>
  );

  const renderItem = ({item}) => {
    const {bname, bcname, image} = item;
    return (
      <View style={{alignItems: 'center', marginRight: scale(10), width: "22.6%"}}>
        <TouchableRipple
          onPress={() => navigation.navigate('Brand', {item})}
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
          }}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            style={{height: scale(70), width: scale(70), borderRadius: scale(40)}}
            source={{uri: image}}
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
  };
  useEffect(() => {
    console.log('brandlist updated:', brandlist.length, 'items');
  }, [brandlist]);

  return (
    <>
      <SafeAreaView>
        <View style={{
          flexDirection: 'row',
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
            style={{fontWeight: '500', fontSize: scale(18), color: '#fff'}}
          />
        </View>
      </SafeAreaView>
      <Container>
        <FlatList
          style={{marginTop: scale(15)}}
          numColumns={4}
          showsVerticalScrollIndicator={false}
          data={ispageLoading ? Array(20).fill(0) : brandlist}
          renderItem={ispageLoading ? renderSkeletonItem : renderItem}
          keyExtractor={(item, index) => ispageLoading ? `skeleton-${index}` : item.id}
          ItemSeparatorComponent={() => <View style={{padding: scale(10)}} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => isLoadingMore && (
            <View style={{padding: 20}}>
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
