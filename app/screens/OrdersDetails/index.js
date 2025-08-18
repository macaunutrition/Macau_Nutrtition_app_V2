import React, {useRef, useEffect, useState} from 'react';
import color from 'color';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import {View, Text, Alert, StyleSheet, FlatList, Pressable, PermissionsAndroid, Platform, SafeAreaView, Linking, Modal} from 'react-native';
import {AlertHelper} from '../../utils/AlertHelper';
import LottieView from 'lottie-react-native';
import {scale} from 'react-native-size-matters';
import Divider from '../../components/Divider';
import TitleComp from '../../components/TitleComp';
import Container from '../../components/Container';
import Feather from 'react-native-vector-icons/Feather';
import Label from '../../components/Label';
import ScreenHeader from '../../components/ScreenHeader';
import Orderitems from '../../components/Orderitems'
import {appColors, shadow} from '../../utils/appColors';
import getOrders from '../../utils/getOrders';
import getData from '../../utils/getData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import "../../translation";
import { APP_IMGURL } from '../../utils/appConfig';
import { firebase } from '@react-native-firebase/analytics';

export default function index({navigation,route:{params}}) {
  const { orderid } = params;
  const { t, i18n } = useTranslation();
  const [item, setItem] = useState(Object);
  const [ ispageLoading, setIspageLoading ] = useState( true );
  const [ isPdfLoading, setIsPdfLoading ] = useState(false);
  const loadData = async () => {
    setIspageLoading(true);
    const order = await getData('orders',orderid);
    let orderitem = order.data();
    setItem(orderitem);
    setIspageLoading(false)
  }
 
  const generatePDF = async () => {
    setIsPdfLoading(true);
    const fileName = `order_${item.transationid}.pdf`;
    let filePath;

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      // 📌 Android 13+ saves directly in Downloads
      filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
    } else {
      // 📌 iOS & Android 10-12 → Save in DocumentDir
      filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/${fileName}`;
    }


    let options = {
      html: `
        <h1 style="text-align:center;padding:15px 20px;margin: 0px">${item.currency + item.amount}</h1>
        <h2 style="text-align:center;padding:15px 20px;color:${appColors.black};margin: 0px">${t('status')+': '+item.status}</h2>
        <div style="width:100%;vertical-align:top;">
          <div style="width:48%;display:inline-block;vertical-align:top;">
            <h4 style="padding:10px 20px;font-size:22px">${t('details')}</h4>
            <h4 style="padding:10px 20px;">${t('id')+': '+item.transationid}</h4>
            <h4 style="padding:10px 20px;">${t('transaction')+': '+item.mpaytransactionno}</h4>
            <h4 style="padding:10px 20px;">${t('reference')+': '+item.mpaytransactionid}</h4>
          </div>
          <div style="width:49%;display:inline-block;padding-left:15px;vertical-align:top;">
            <h4 style="padding:10px 20px;font-size:22px">${t('shipto')}</h4>
            <h4 style="padding:5px 20px;">${item.shipping.name}</h4>
            <h4 style="padding:5px 20px;">${item.shipping.phone}</h4>
            <h4 style="padding:5px 20px;">${item.shipping.email}</h4>
            <h4 style="padding:5px 20px;">${item.shipping.address}</h4>
          </div>
        </div>
        <div style="width:100%;height:1px;background-color:${color(appColors.black).alpha(0.2).rgb().string()};margin-bottom:15px"></div>
        <div style="width:100%">
          <div style="width:48%;display:inline-block">
            <h4 style="padding:10px 20px">${t('amount')}</h4>
          </div>
          <div style="width:49%;display:inline-block;text-align:right">
            <h4 style="font-weight:bold;padding:10px 20px">${item.currency+item.originalamount}</h4>
          </div>
        </div>
        <div style="width:100%">
          <div style="width:48%;display:inline-block">
            <h4 style="padding:10px 20px">${t('applied')}</h4>
          </div>
          <div style="width:49%;display:inline-block;text-align:right">
            <h4 style="font-weight:bold;padding:10px 20px">${Number(item.poinused).toFixed(0)+' '+t('pints')}</h4>
          </div>
        </div>
        <div style="width:100%">
          <div style="width:48%;display:inline-block">
            <h4 style="padding:10px 20px">${t('saved')}</h4>
          </div>
          <div style="width:49%;display:inline-block;text-align:right">
            <h4 style="font-weight:bold;padding:10px 20px">${item.currency+' '+(item.originalamount-item.afterpoint)}</h4>
          </div>
        </div>

        <div style="width:100%">
          <div style="width:48%;display:inline-block">
            <h4 style="padding:10px 20px">${t('shipping')}</h4>
          </div>
          <div style="width:49%;display:inline-block;text-align:right">
            <h4 style="font-weight:bold;padding:10px 20px">${item.currency+item.shippingamount}</h4>
          </div>
        </div>
        <div style="width:100%;height:1px;background-color:${color(appColors.black).alpha(0.2).rgb().string()};margin-bottom:15px"></div>
        <div style="width:100%">
          <div style="width:48%;display:inline-block">
            <h4 style="padding:10px 20px">${t('total')}</h4>
          </div>
          <div style="width:49%;display:inline-block;text-align:right">
            <h4 style="font-weight:bold;padding:10px 20px">${item.currency+item.amount}</h4>
          </div>
        </div>
        <div style="position: absolute; bottom: 0; width: 100%; text-align: center;">
          <h4>${t('thankorder')}</h4>
          <img src="${APP_IMGURL+'/products/b2492f67b17544dcafcb/1726137134830.jpg'}" style="width: 200px; height: auto;" />
        </div>
      `,
      fileName: fileName.replace('.pdf', ''),
      directory: Platform.OS === 'android' && Platform.Version >= 33 ? 'Download' : 'Documents',
    };

    try {
      setIsPdfLoading(false);
      const pdf = await RNHTMLtoPDF.convert(options);
      await FileViewer.open(pdf.filePath);
      //AlertHelper.show('success', t('pdfgenerated'));
      //Alert.alert('PDF Generated', `File saved at: ${pdf.filePath}`);
    } catch (error) {
      setIsPdfLoading(false);
      AlertHelper.show('error', t('pdferror'));
    }
  };
  const addanalytics = async () => {
    await firebase.analytics().setCurrentScreen('OrdersDetails');
  }
  useEffect(() => {
    addanalytics();
    loadData();
  }, [params]);
  const RenderTitle = ({heading, rightLabel}) => {
    return <TitleComp heading={heading} rightLabel={rightLabel} />;
  };
  return (
    <>
    {ispageLoading ? (
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
          <Pressable onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" color={appColors.white} size={scale(25)} />
          </Pressable>
          <Label
            text={t('orderdetails')}
            style={{fontWeight: '500', color: 'white',fontSize: scale(18)}}
          />
      </View>
      </SafeAreaView>
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
        {/* PDF Loading Modal */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={isPdfLoading}
          onRequestClose={() => {}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <LottieView
                source={require('../../static/bikelotti.json')}
                autoPlay
                loop={true}
                style={{width: 150, height: 150}}
              />
            </View>
          </View>
        </Modal>

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
              <Pressable onPress={() => navigation.goBack()}>
                <Feather name="chevron-left" color={appColors.white} size={scale(25)} />
              </Pressable>
              <Label
                text={t('orderdetails')}
                style={{fontWeight: '500', color: 'white',fontSize: scale(18)}}
              />
              <Pressable
                 onPress={generatePDF}
                 disabled={isPdfLoading}
                 style={{
                   justifyContent: 'center',
                   alignItems: 'center',
                 }}>
                 <Feather name="save" size={scale(20)} color={appColors.white} />
             </Pressable>
          </View>
        </SafeAreaView>
          <Container isScrollable >
            <View style={{flex:1, paddingVertical:scale(20)}}>
            <Label
              text={item.currency + item.amount}
              style={{
                fontWeight: 'bold',
                color: appColors.primary,
                marginBottom: scale(5),
                fontSize: scale(22),
                alignSelf: 'center',
              }}
            />
            <Label
              text={t('status')+': '+item.status}
              style={{
                fontWeight: 'bold',
                paddingVertical: scale(0),
                fontSize: scale(12),
                alignSelf: 'center',
                marginBottom: 15,
              }}
            />
            <Divider style={{marginBottom:scale(10)}} isDark />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{width:'50%'}}>
                <RenderTitle   heading={t('details')} />
                <Label
                  text={t('id')+': '+item.transationid}
                  style={{fontSize: scale(11), fontWeight: '500', marginTop:15,  marginBottom: 15}}
                />
                <Label
                  text={t('transaction')+': '+item.mpaytransactionno}
                  style={{fontSize: scale(11), fontWeight: '500',   marginBottom: 15,}}
                />
                <Label
                  text={t('reference')+': '+item.mpaytransactionid}
                  style={{fontSize: scale(11), fontWeight: '500', marginBottom: 15}}
                />
              </View>
              <View style={{width:'50%',paddingLeft:scale(10)}}>
                  <RenderTitle   heading={t('shipto')} />
                  <Label
                    text={item.shipping.name}
                    style={{fontSize: scale(11), fontWeight: '500',  marginTop:15,marginBottom: 5}}
                  />
                  <Label
                    text={item.shipping.phone}
                    style={{fontSize: scale(11), fontWeight: '500', marginBottom: 5}}
                  />
                  <Label
                    text={item.shipping.email}
                    style={{fontSize: scale(11), fontWeight: '500', marginBottom: 5}}
                  />
                  <Label
                    text={item.shipping.address}
                    style={{fontSize: scale(11), fontWeight: '500', marginBottom: 5}}
                  />
              </View>
            </View>

              <Divider style={{marginBottom:scale(10)}} isDark />
              <View style={{marginBottom:scale(10)}}>
                <RenderTitle   heading={t('amount')} rightLabel={item.currency+item.originalamount} />
              </View>
              {Number(item.poinused) > 0 && (
                <>
                <View style={{paddingVertical: scale(10)}}>
                  <RenderTitle  heading={t('applied')} rightLabel={Number(item.poinused).toFixed(0)+' '+t('pints')} />
                </View>
                <View style={{paddingVertical: scale(10),marginBottom:scale(10)}}>
                  <RenderTitle  heading={t('saved')} rightLabel={item.currency+' '+(item.originalamount-item.afterpoint)} />
                </View>
                </>
              )}

              {/*<View style={{marginBottom:scale(10)}}>
                <RenderTitle   heading={t('afterpointused')} rightLabel={item.currency+item.afterpoint} />
              </View>*/}
              <View style={{marginBottom:scale(10)}}>
                <RenderTitle  heading={t('shipping')} rightLabel={item.currency+item.shippingamount} />
              </View>
              <Divider style={{marginBottom:scale(10)}} isDark />
              <View style={{marginBottom:scale(10)}}>
                <RenderTitle  heading={t('total')} rightLabel={item.currency+item.amount} />
              </View>
              <Divider style={{marginBottom:scale(10)}} isDark />
              <View style={{marginBottom:scale(10)}}>
                <RenderTitle   heading={t('items')} />
              </View>
              <View>
                 <FlatList ItemSeparatorComponent={()=> <View style={{padding:scale(10)}} />}  data={JSON.parse(item.cartItems)} renderItem={({item,index})=> <Orderitems item={item}  navigation={navigation} itemid={item.id} name={item.name} image={item.images[0]} price={item.price} quantity={item.quantity}/>} />
              </View>
            </View>
          </Container>
      </>
    )}
  </>
  );
}

const styles = StyleSheet.create({
  contentContiner: {
    paddingVertical: scale(10),
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: appColors.white,
    paddingHorizontal: scale(10),
    width: '100%',
    ...shadow,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalText: {
    marginTop: 15,
    fontSize: scale(16),
    fontWeight: '500',
    textAlign: 'center',
  },
});
