import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import {AlertHelper} from '../utils/AlertHelper';
import { rsaSign,  rsaVerify, generateKeys } from '../utils/encryption';
import axios from 'axios';
import { httpFactory } from '../utils/httpFactory';



export default async (info, callBack) => {

  const { MpayModule } = NativeModules;
  if (Platform.OS === 'ios') {
    const mpayEmitter = new NativeEventEmitter(MpayModule);
  }
  

  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const generateOrderid = (length) => {
    const characters = '0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const getQurydata = async (ranstring,orderid,currentTimestamp)=>{
    let beforesingqryinfo = JSON.stringify({
      channel_type:'1',
      format: 'JSON',
      nonce_str:ranstring,
      org_id: '888535812230114',
      out_trans_id: orderid,
      service: 'mpay.trade.query',
      timestamp:currentTimestamp.toString(),
      version:'1.1.0',
    });
    const getdataq = await httpFactory.get(`/getsignature/alldata?data=${beforesingqryinfo}`);
    if (getdataq?.status === 200) {
        if(getdataq?.data) {
          const sign = getdataq?.data?.sign;
          let qryinfo = JSON.stringify({
              channel_type:'1',
              format: 'JSON',
              nonce_str:ranstring,
              org_id: '888535812230114',
              out_trans_id: orderid,
              service: 'mpay.trade.query',
              sign:sign,
              sign_type: 'RSA2',
              timestamp:currentTimestamp.toString(),
              version:'1.1.0',
          });
          return MpayModule.transacQapi(qryinfo)
          .then(response => {
            //console.warn(response);
            return response;
          })
          .catch(error => {
            //console.warn(error);
            return '';
          });
        }
    }else {
      return '';
    }
  }
  const callagain = async (ranstring,orderid,currentTimestamp)=>{
    let interval = 3000;
    let data = await getQurydata(ranstring,orderid,currentTimestamp);
    //console.warn(data);
    if(data !='') {
       try {
         data = JSON.parse(data);
         //console.log(data);
         if(data.data.trans_status == 'UNKNOW') {
           // call again
          setTimeout(() => {
            callagain(ranstring,orderid,currentTimestamp);
          }, interval)
         }else if(data.data.trans_status == 'SUCCESS') {
           callBack && callBack({error: false, data: data.data.result_msg, transationid: data.data.out_trans_id, mpaytid: data.data.trans_id, mpaytno: data.data.trade_no});
         }else {
           callBack && callBack({error: true, data: data.data.result_msg, transationid: '', mpaytid:'',mpaytno:''});
         }
       }catch (e) {
          callBack && callBack({error: true, data: 'Payment Failed. Try Again.', transationid: '',mpaytid:'',mpaytno:''});
      }

    }else {
      callBack && callBack({error: true, data: 'Payment Failed. Try Again.', transationid: '',mpaytid:'',mpaytno:''});
    }
  };
  //console.warn('info.cartItems');
  if (Platform.OS === 'ios') {
     MpayModule.setEnvironmentType("Prod")
     .then(response => {
       console.log(response);
     })
     .catch(error => {
       console.error(error);
     });
  }else {
    MpayModule.setEnvironmentType(0)
     .then(response => {
       console.log(response);
     })
     .catch(error => {
       console.error(error);
     });
  }
    // MpayModule.setMPayAppId(2)
    // .then(response => {
    //   console.log('APP set',response);
    // })
    // .catch(error => {
    //   console.error('APP set',error);
    // });
    try {
        const entraInfo ={
            store_id: '0001',
            store_name: '筷子基店',
            sub_merchant_id: '888535812230114',
            sub_merchant_industry: '5812',
            sub_merchant_name: 'MACAU NUTRITION',
        };
        const goods_detail = [];
        info.cartItems.forEach(item => {
          goods_detail.push({
            goods_id: item.id,
            goods_name: item.name,
            price:  `${parseFloat(item.price).toFixed(2)}`,
            quantity: item.quantity,
          });
        });
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const ranstring = generateRandomString(100);
        const orderid = generateOrderid(10);
        let beforeSignpaymentInfo = JSON.stringify({
            body: info.description,
            channel_type:'1',
            currency: info.currency,
            extend_params: entraInfo,
            format: 'JSON',
            goods_detail: goods_detail,
            it_b_pay: '5m',
            nonce_str:ranstring,
            notify_url:'http://24.199.118.232/api/mpaynotify',
            org_id: '888535812230114',
            out_trans_id: orderid,
            pay_channel:'mpay',
            product_code:'MP_APP_PAY',
            service: 'mpay.trade.mobile.pay',
            subject:info.name,
            timestamp:currentTimestamp.toString(),
            total_fee:  `${parseFloat(info.amount).toFixed(2)}`,
            version:'1.1.0',
        });
        //console.warn(beforeSignpaymentInfo);
        const getdata = await httpFactory.get(`/getsignature/alldata?data=${beforeSignpaymentInfo}`);
        if (getdata?.status === 200) {
          if(getdata?.data) {
            const sign = getdata?.data?.sign;
            paymentInfo = JSON.stringify({
                body: info.description,
                channel_type:'1',
                currency: info.currency,
                extend_params: entraInfo,
                format: 'JSON',
                goods_detail: goods_detail,
                it_b_pay: '5m',
                nonce_str:ranstring,
                notify_url:'http://24.199.118.232/api/mpaynotify',
                org_id: '888535812230114',
                out_trans_id: orderid,
                pay_channel:'mpay',
                product_code:'MP_APP_PAY',
                service: 'mpay.trade.mobile.pay',
                sign:sign,
                sign_type: 'RSA2',
                subject:info.name,
                timestamp:currentTimestamp.toString(),
                total_fee:  `${parseFloat(info.amount).toFixed(2)}`,
                version:'1.1.0',
            });
            if(info.amount > 0) {
              MpayModule.allPay(paymentInfo)
              .then( async(response) => {
                //await callagain(ranstring,orderid,currentTimestamp);
                callBack && callBack({error: false, data: '', transationid: orderid, mpaytid: '', mpaytno: ''});
              })
              .catch(error => {
                callBack && callBack({error: true, data: error.message, transationid: '',mpaytid:'',mpaytno:''});
              });
              if (Platform.OS === 'ios') {
                const onTransactionSuccessListener = mpayEmitter.addListener(
                  'onPaymentSuccess',
                  async (order) => {
                    //await callagain(ranstring,orderid,currentTimestamp);
                    callBack && callBack({error: false, data: '', transationid: orderid, mpaytid: '', mpaytno: ''});
                  }
                );

                const onTransactionFailureListener = mpayEmitter.addListener(
                  'onPaymentFailure',
                  async (errorInfo) => {
                    callBack && callBack({error: true, data: errorInfo.errorInfo, transationid: '', mpaytid:'',mpaytno:''});
                  }
                );
              }
            }else {
                callBack && callBack({error: false, data: 'response', transationid: orderid, mpaytid:'',mpaytno:''});
            }

          }else {
            callBack && callBack({error: true, data: 'Oops !! Something went wrong !', transationid: '',mpaytid:'',mpaytno:''});
          }
        }
    } catch (error) {
        callBack && callBack({error: true, data: 'Oops !! Something went wrong !', transationid: '',mpaytno:''});
    }

};
