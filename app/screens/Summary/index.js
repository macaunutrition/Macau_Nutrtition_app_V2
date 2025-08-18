import React ,{useEffect,useState,useCallback}from 'react';
import {View, Text,FlatList, TextInput, ActivityIndicator, Modal, TouchableWithoutFeedback} from 'react-native';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {scale} from 'react-native-size-matters';
import Container from '../../components/Container';
import ScreenHeader from '../../components/ScreenHeader';
import SelectAble from '../../components/SelectAble';
import Divider from '../../components/Divider';
import CustomButton from '../../components/CustomButton';
import ProductCard from '../../components/ProductCard';
import {bestSellersList} from '../../utils/MockData';
import TitleComp from '../../components/TitleComp';
import Feather from 'react-native-vector-icons/Feather';
import CheckBox from '../../components/CheckBox';
import Label from '../../components/Label';
import {AlertHelper} from '../../utils/AlertHelper';
import paymentHelper from '../../services/paymentHelper';
import ReduxWrapper from '../../utils/ReduxWrapper';
import {clearCart} from '../../redux/cartAction';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getData from '../../utils/getData';
import axios from 'axios';
import { APP_CURRENY, APIURL } from '../../utils/appConfig';
import writeData from '../../utils/writeData';
import updateData from '../../utils/updateData';
import getCoupons from '../../utils/getCoupons';
import updateQty from '../../utils/updateQty';
import getCouponscount from '../../utils/getCouponscount';
import { appColors } from '../../utils/appColors';
import { useTranslation } from "react-i18next";
import "../../translation";
import {updateSalesCount} from '../../utils/getAllProducts';
import FastImage from 'react-native-fast-image';
import sendPush from '../../utils/sendPush';

function index({route:{params}, navigation}) {
  const { t, i18n } = useTranslation();
  const [couponused, setCouponused] = useState('');
  const [couponamount, setCouponamount] = useState('');
  const [coupontype, setCoupontype] = useState('');
  const [origialamount, setOrigialamount] = useState(0);
  const [shippingamount, setShippingamount] = useState(0);
  const [iscouponloading, setIscouponloading] = useState(false);
  const [ispayloading, setIspayloading] = useState(false);
  const [ispageloading, setIspageloading] = useState(true);
  const [iscouponapplied, setIscouponapplied] = useState(false);
  const [discountamounts, setDiscountamounts] = useState(0);
  const dispatch = useDispatch();
  const [dynamicprice, setDynamicprice] = useState(params.updatedprice);
  const cartItems = params.cartItems;
  const [userInfo, setUserInfo] = useState({});
  const [setting, setSetting] = useState({});
  const gets = params.gets;
  const getc = params.getc;
  const getp =params.getp;
  const getn = params.getn;
  const gete = params.gete;
  const reminpoins= params.rempoint;
  const getAmount = ()=>{
    let amount =0
    cartItems?.map(item=>{
      const {price, vprice, quantity} =item;
      if(item.variationname) {
        if( Object.entries(item.sizedetails).length > 0) {
          if(item.sizedetails.sprice != null) {
            amount+= Number( item.sizedetails.sprice )*Number(quantity);
          }else {
            amount+= Number( vprice )*Number(quantity);
          }
        }else {
          amount+= Number( vprice )*Number(quantity);
        }
      }else {
        amount+= Number( price )*Number(quantity);
      }
    })
    return  `${parseFloat(amount).toFixed(2)}`

  }
  const getPoin = ()=>{
    let poin =0
    cartItems?.map(item=>{
      const {totalpoints, variationcname, vtotalpoints} =item;
      if(variationcname) {
        poin+= Number( vtotalpoints );
      }else {
        poin+= Number(totalpoints );
      }
    })
    return  `${parseFloat(poin).toFixed(2)}`

  }
  const [street, setStreet] = useState('');
  const [user, setUser] = useState('');
  const RenderTitle = ({heading, rightLabel}) => {
    return <TitleComp heading={heading} rightLabel={rightLabel} />;
  };
  const UpdateQty = async () => {
      if(cartItems.length > 0) {
        cartItems.forEach( async(doc) => {
          if(doc?.variationname) {
            if(doc.vsubstock == 'yes') {
              if(Object.entries(doc.sizedetails).length > 0) {
                let newqty = Number(doc.sizedetails.sqty)-Number(doc.quantity);
                if(newqty < 0) {
                  newqty = 0;
                }
                const updatedItems =  JSON.parse(doc.vweight).map(item =>
                  item.sweight === doc.sizedetails.sweight ? { ...item, sqty: newqty } : item
                );
                await updateQty('selectoptions', doc.vid, {vweight:  JSON.stringify(updatedItems)},'variation');
              }else {
                let newqty = Number(doc.vqty)-Number(doc.quantity);
                if(newqty < 0) {
                  newqty = 0;
                }
                await updateQty('selectoptions', doc.vid, {vqty: newqty},'variation');
              }
            }
          }else {
            if(doc.substock == 'yes') {
              if(doc.qty != null) {
                  let newqty = Number(doc.qty)-Number(doc.quantity);
                  if(newqty < 0) {
                    newqty = 0;
                  }
                  await updateQty('products', doc.id, {qty: newqty},'simple');
              }
            }
          }
        });
      }
  };
  const saveOrder = async (transationid,mpaytid,mpaytno) => {
    const pusd = Number(userInfo.rewardpoints) - Number(params.rempoint);
    await writeData('orders', transationid, {
        transationid: transationid,
        mpaytransactionid: mpaytid,
        mpaytransactionno: mpaytno,
        user: user,
        description: 'Order at Macau Nutrition',
        currency: APP_CURRENY.currency,
        amount: parseFloat(parseFloat(dynamicprice)+parseFloat(shippingamount)).toFixed(2),
        name: 'Macau Nutrition',
        cartItems: JSON.stringify(cartItems),
        shipping: {
          name: getn,
          email:gete,
          phone: getp,
          address: gets,
          comment: getc,
        },
        shippingamount:shippingamount,
        originalamount: getAmount(),
        afterpoint:origialamount,
        couponcode: couponused,
        couponamount: couponamount,
        coupontype: coupontype,
        poinget: getPoin(),
        poinused: `${parseFloat(pusd).toFixed(2)}`,
        status:'Placed',
        createat: Date.now()
      } );
      await updateSalesCount(cartItems);
      const updateRp = Number(params.rempoint) + Number( getPoin());
      await updateData('users', userInfo.mobile, {rewardpoints : `${parseFloat(updateRp).toFixed(2)}`} )
      await axios.post(`${APIURL}sendordermail`, {
        id: transationid
      });
      // Push notification to the user's device if token exists
      if (userInfo?.fcmtoken) {
        const title = t('orderplacesucc');
        const body = `Congratulation your order # ${transationid} is Placed`;
        sendPush(userInfo.fcmtoken, title, body, { orderId: transationid });
      }
  };
 
  const onPaymentDone = async (info) => {
    setIspayloading(false);
    const {error, data, transationid, mpaytid, mpaytno} = info;
    if (!error) {
      await saveOrder(transationid,mpaytid,mpaytno);
      await UpdateQty();
      dispatch(clearCart());
      AlertHelper.show('success', t('orderplacesucc'));
      navigation.navigate('Orders');
    } else {
      AlertHelper.show('error', data);
    }
  };
  const onPay = async () => {
    if (ispayloading) return; // Prevent multiple payment attempts
    setIspayloading(true);
    
    try {
      await paymentHelper(
        {
          description: 'Order at Macau Nutrition',
          currency: APP_CURRENY.currency,
          amount: parseFloat(parseFloat(dynamicprice)+parseFloat(shippingamount)).toFixed(2),
          name: 'Macau Nutrition',
          cartItems: cartItems,
          user: user,
          shipping: {
            name: getn,
            phone: getp,
            address: gets,
            comment: getc,
          }
        },
        onPaymentDone,
      );
    } catch (error) {
      setIspayloading(false);
      AlertHelper.show('error', t('paymentfailed'));
    }
  };
  const Loadshiping = async () => {
      setIspageloading(true);
      setOrigialamount(params.updatedprice);
      setDynamicprice(params.updatedprice);
      const mobile = await AsyncStorage.getItem('user');
        setUser(mobile);
      const getU = await getData('users',mobile );
      setUserInfo(getU._data);
      const settings =  await getData('settings','rewardsettings')
      setSetting(settings._data);

      const shipping = settings.data();
      if(parseFloat(params.updatedprice) < parseFloat(shipping.orderamount)) {
        setShippingamount(parseFloat(shipping.shipamount).toFixed(2));
      }else {
        setShippingamount(0);
      }
      setIspageloading(false);
  }
  const applyCoupon = async () => {
    if(iscouponapplied) {
      setDynamicprice(params.updatedprice);
      setIscouponapplied(false);
      setDiscountamounts(0);
      AlertHelper.show('success', t('couponremovemsg'));
      setCouponused('');
      return;
    }
    if(!couponused) {
      setDynamicprice(params.updatedprice)
      AlertHelper.show('error', t('plzencoupon'));
      return;
    }
    setIscouponloading(true);
    const coupondetails = await getCoupons('coupons', couponused);
    let cpdet= {};
    coupondetails.forEach(doc => {
      cpdet = {...doc.data()};

       // cat.push({
       //     id: doc.id,
       //     image: 'http://24.199.118.232:8000/upload/categories/'+doc.id+'/'+doc.data()['iconname'],
       //     ...doc.data()
       //   });
     });
    setIscouponloading(false);
    if(Object.keys(cpdet).length > 0) {
      const startDate = new Date(cpdet.startdate); // Example start date
      const endDate = new Date(cpdet.enddate);   // Example end date
      const today = new Date();
      if (startDate <= today && today <= endDate) {
        //console.log('Valid');
      }else {
        AlertHelper.show('error', t('notsorend'));
        return;
      }
      if(cpdet.overallused != null){
        const getallorders = await getCouponscount('orders',cpdet.code,'','overall');
        const totalusedcount = getallorders.size;
        if(totalusedcount >= cpdet.overallused) {
          AlertHelper.show('error', t('cpnexpire'));
          return;
        }
      }
      if(cpdet.perused != null){
        const mobile = await AsyncStorage.getItem('user');
        const getsinguserorders = await getCouponscount('orders',cpdet.code,mobile,'user');
        const totalusedcountsingle = getsinguserorders.size;
        if(totalusedcountsingle >= cpdet.perused) {
          AlertHelper.show('error', t('youalready')+' '+cpdet.perused+' '+t('youused'));
          return;
        }
      }


      if(cpdet.category != null){
        let foundcat = false;
        cartItems?.map(item=>{
          const hasCommonKey = item.category.some(key => cpdet.category.includes(key));
          if(hasCommonKey) {
            foundcat = true;
          }
        })
        if (!foundcat) {
            AlertHelper.show('error', t('notappcat'));
            return;
        }
      }
      if(cpdet.products != null){
          let foundproduct = false;
          cartItems?.map(item=>{
            console.warn(item.pid);
            const hasCommonPro = cpdet.products.includes(item.pid);
            if(hasCommonPro) {
              foundproduct = true;
            }
          })
          if (!foundproduct) {
              AlertHelper.show('error', t('notapppro'));
              return;
          }
      }
      setCoupontype(cpdet.type);
      if(cpdet.type == 'Percentage') {
        const discounamount = parseFloat((cpdet.off / 100)*params.updatedprice).toFixed(2);
        const neP = parseFloat(params.updatedprice - discounamount).toFixed(2);
        setDynamicprice(neP);
        setCouponamount(cpdet.off);
        setDiscountamounts(discounamount);
      }else {
        const neP = parseFloat(params.updatedprice - cpdet.off).toFixed(2);
        if(neP < 0) {
          setDynamicprice(0.00);
          setDiscountamounts(cpdet.off);
        }else {
          setDynamicprice(neP);
          setDiscountamounts(neP);
        }
        setCouponamount(cpdet.off);
      }
      setIscouponapplied(true);
      AlertHelper.show('success', t('couponapplied'));

    }else {
      setDynamicprice(params.updatedprice)
      AlertHelper.show('error', t('invldcoup'));
      setCouponused('');
    }
  }
  

  useEffect(() => {
    Loadshiping();
    return () => {};
  }, [params]);
  return (
    <>
      { ispageloading ? (
        <>
          <Container>
            <ScreenHeader label={t('summary')} navigation={navigation} />
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
          <Container isScrollable>
            <ScreenHeader label={t('summary')} navigation={navigation} />
            <SelectAble
              item={{
                label: `${t('shippingdetails')}`,
                name:getn,
                email:gete,
                phone: getp,
                subLabel: gets,
              }}
              selected
            />
            {getc && (
              <SelectAble
                item={{
                  label: `${t('deliverycomment')}`,
                  subLabel:
                    getc,
                }}
                selected
              /> )}
              <View style={{flex: 1,paddingVertical:scale(0)}}>
                <TitleComp heading={t('paymethod')} />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{flex: 1, paddingVertical:scale(10)}}>
                    <FastImage
                      style={{height:scale(100), width:scale(100)}}
                      source={require('../../static/images/MPaylogo.png')}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <CheckBox isChecked="true"  />
                  </View>
                </View>
              </View>
            <Divider isDark />
            <View style={{paddingVertical: scale(20)}}>
                <TextInput
                 value={couponused}
                 style={{
                   width: '100%',
                   height: 50,
                   backgroundColor: '#FFF',
                   borderRadius: 8,
                   borderWidth: 1,
                   borderColor: appColors.darkGray,
                    paddingHorizontal: 15,
                    fontSize: 16,
                    color: '#000'
                 }}
                 placeholder={t('entercouponcode')}
                 onChangeText={value => setCouponused(value)}
                 selectionColor="#000"
              />
              {iscouponapplied ? (
                <>
                  <CustomButton isLoading={iscouponloading} style={{backgroundColor: appColors.red}} onPress={applyCoupon} label={t('removecoupon')} />
                </>
              ) : (
                <>
                <CustomButton isLoading={iscouponloading} style={{backgroundColor: appColors.yellow}} onPress={applyCoupon} label={t('applycoupon')} />
                </>
              )}
            </View>
            <Divider isDark />
            <View style={{paddingVertical: scale(10)}}>
            <RenderTitle  heading={t('amount')} rightLabel={APP_CURRENY.symbol+' '+getAmount()} />
            </View>
            {(Number(userInfo.rewardpoints) - Number(params.rempoint)) > 0 && (
              <>
              <View style={{paddingVertical: scale(10)}}>
              <RenderTitle  heading={t('applied')} rightLabel={Number(userInfo.rewardpoints) - Number(params.rempoint)+' '+t('pints')} />
              </View>
              <View style={{paddingVertical: scale(10)}}>
              <RenderTitle  heading={t('saved')} rightLabel={APP_CURRENY.symbol+' '+(getAmount()-origialamount)} />
              </View>
              </>
            )}
            <>
            {iscouponapplied && (
              <>
              <View style={{paddingVertical: scale(10)}}>
              <RenderTitle heading={t('discount')} rightLabel={ APP_CURRENY.symbol+' '+discountamounts } />
              </View>
              </>
            )}
            </>
            <View style={{paddingVertical: scale(10)}}>
            <RenderTitle heading={t('shipping')} rightLabel={ shippingamount > 0 ? APP_CURRENY.symbol+' '+shippingamount : t('free')} />
            </View>
            <Divider isDark />
            <View style={{paddingVertical: scale(10)}}>
            <RenderTitle style={{fontSize:scale(15)}} heading={t('total')} rightLabel={APP_CURRENY.symbol+' '+parseFloat(parseFloat(dynamicprice)+parseFloat(shippingamount)).toFixed(2)} />
            </View>
            {/* <SelectAble
              item={{
                label: 'Shipping Address',
                subLabel:
                  '21, Alex Davidson Avenue, Opposite Omegatron, Vicent Smith Quarters, Victoria Island, Lagos, Nigeria',
              }}
              selected
            /> */}
               <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: scale(0),
                  marginTop: scale(10),
                  bottom: scale(10),
                }}>
                <CustomButton
                  onPress={() => navigation.navigate("CheckOutSteper", {cartItems})}
                  label={t('back')}
                  unFilled
                />
                { dynamicprice > 0 && (
                   <CustomButton isDisabled={ispayloading} onPress={onPay} label={t('pay')} /> )}
                 { dynamicprice <= 0 && (
                    <CustomButton isDisabled={ispayloading} onPress={onPay} label={t('pay')} /> )}
               </View>
          </Container>
         
        </>
      )}
    </>
  );
}

export default ReduxWrapper(index);
