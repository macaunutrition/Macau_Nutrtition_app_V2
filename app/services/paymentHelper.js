import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import {AlertHelper} from '../utils/AlertHelper';
import { rsaSign,  rsaVerify, generateKeys } from '../utils/encryption';
import axios from 'axios';
import { httpFactory } from '../utils/httpFactory';
import { APIURL } from '../utils/appConfig';

let currentSuccessListener = null;
let currentFailureListener = null;
let hasShownError = false;
let paymentTimeoutRef = null;

const cleanupListeners = () => {
  if (currentSuccessListener) {
    currentSuccessListener.remove();
    currentSuccessListener = null;
  }
  if (currentFailureListener) {
    currentFailureListener.remove();
    currentFailureListener = null;
  }
  if (paymentTimeoutRef) {
    clearTimeout(paymentTimeoutRef);
    paymentTimeoutRef = null;
  }
  hasShownError = false;
};

export default async (info, callBack) => {

  const { MpayModule } = NativeModules;
  const mpayEmitter = new NativeEventEmitter(MpayModule);

  // Cleanup any existing listeners before starting new payment
  cleanupListeners();

  // const generateRandomString = (length) => {
  //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   let result = '';
  //   const charactersLength = characters.length;
  //   for (let i = 0; i < length; i++) {
  //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //   }
  //   return result;
  // };

  const generateRandomString = (length = 32) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
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
  // const getQurydata = async (ranstring,orderid,currentTimestamp)=>{
  //   let beforesingqryinfo = JSON.stringify({
  //     channel_type:'1',
  //     format: 'JSON',
  //     nonce_str:ranstring,
  //     org_id: '888535812230114',
  //     out_trans_id: orderid,
  //     service: 'mpay.trade.mobile.pay',
  //     timestamp: currentTimestamp.toString(),
  //     version:'1.1.0',
  //   });
  //   const getdataq = await httpFactory.get(`/getsignature/alldata?data=${beforesingqryinfo}`);
  //   if (getdataq?.status === 200) {
  //       if(getdataq?.data) {
  //         const sign = getdataq?.data?.sign;
  //         let qryinfo = JSON.stringify({
  //             channel_type:'1',
  //             format: 'JSON',
  //             nonce_str:ranstring,
  //             org_id: '888535812230114',
  //             out_trans_id: orderid,
  //             service: 'mpay.trade.mobile.pay',
  //             sign:sign,
  //             sign_type: 'RSA2',
  //             timestamp:currentTimestamp.toString(),
  //             version:'1.1.0',
  //         });
  //         return MpayModule.transacQapi(qryinfo)
  //         .then(response => {
  //           //console.warn(response);
  //           return response;
  //         })
  //         .catch(error => {
  //           //console.warn(error);
  //           return '';
  //         });
  //       }
  //   }else {
  //     return '';
  //   }
  // }
  // const callagain = async (ranstring,orderid,currentTimestamp)=>{
  //   let interval = 3000;
  //   let data = await getQurydata(ranstring,orderid,currentTimestamp);
  //   //console.warn(data);
  //   if(data !='') {
  //      try {
  //        data = JSON.parse(data);
  //        //console.log(data);
  //        if(data.data.trans_status == 'UNKNOW') {
  //          // call again
  //         setTimeout(() => {
  //           callagain(ranstring,orderid,currentTimestamp);
  //         }, interval)
  //        }else if(data.data.trans_status == 'SUCCESS') {
  //          callBack && callBack({error: false, data: data.data.result_msg, transationid: data.data.out_trans_id, mpaytid: data.data.trans_id, mpaytno: data.data.trade_no});
  //        }else {
  //          callBack && callBack({error: true, data: data.data.result_msg, transationid: '', mpaytid:'',mpaytno:''});
  //        }
  //      }catch (e) {
  //         callBack && callBack({error: true, data: 'Payment Failed. Try Again.', transationid: '',mpaytid:'',mpaytno:''});
  //     }

  //   }else {
  //     callBack && callBack({error: true, data: 'Payment Failed. Try Again.', transationid: '',mpaytid:'',mpaytno:''});
  //   }
  // };
  //console.warn('info.cartItems');
    MpayModule.setEnvironmentType("PROD")
    .then(response => {
      console.log('Environment set to PROD:', response);
    })
    .catch(error => {
      console.error('Failed to set environment:', error);
    });
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
            notify_url: `${APIURL}mpaynotify`,
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
                notify_url: `${APIURL}mpaynotify`,
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
                // Payment initiated successfully
              })
              .catch(error => {
                cleanupListeners();
                if (!hasShownError) {
                  hasShownError = true;
                  console.log(error.message);
                  callBack && callBack({error: true, data: error.message, transationid: '',mpaytid:'',mpaytno:''});
                }
              });
              
                currentSuccessListener = mpayEmitter.addListener(
                  'onPaymentSuccess',
                  async (order) => {
                    cleanupListeners();
                    callBack && callBack({error: false, data: '', transationid: orderid, mpaytid: '', mpaytno: ''});
                  }
                );

                currentFailureListener = mpayEmitter.addListener(
                  'onPaymentFailure',
                  async (errorInfo) => {
                    cleanupListeners();
                    if (!hasShownError) {
                      hasShownError = true;
                      console.log('onPaymentFailure',errorInfo);
                      callBack && callBack({error: true, data: errorInfo.errorInfo, transationid: '', mpaytid:'',mpaytno:''});
                    }
                  }
                );

                // Fallback timeout: if no success/failure arrives, fail gracefully
                paymentTimeoutRef = setTimeout(() => {
                  cleanupListeners();
                  if (!hasShownError) {
                    hasShownError = true;
                    callBack && callBack({
                      error: true,
                      data: 'Payment timed out. Please check MPay and try again.',
                      transationid: '',
                      mpaytid:'',
                      mpaytno:''
                    });
                  }
                }, 180000);
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


// import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
// import { httpFactory } from '../utils/httpFactory';

// // Constants
// const PAYMENT_EVENTS = {
//   SUCCESS: 'onPaymentSuccess',
//   FAILURE: 'onPaymentFailure'
// };

// const NETWORK_ERROR_CODE = '6002';
// const MAX_RETRIES = 2;
// const RETRY_DELAY = 1000;

// let currentListeners = {
//   success: null,
//   failure: null
// };
// let paymentRetryCount = 0;
// let paymentInProgress = false;

// const cleanupListeners = () => {
//   Object.keys(currentListeners).forEach(key => {
//     if (currentListeners[key]) {
//       currentListeners[key].remove();
//       currentListeners[key] = null;
//     }
//   });
//   paymentInProgress = false;
// };

// const generateRandomString = (length = 32) => {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   return Array.from({ length }, () => 
//     characters.charAt(Math.floor(Math.random() * characters.length))
//   ).join('');
// };

// const generateOrderId = () => {
//   const timestamp = Date.now().toString().slice(-6);
//   const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//   return `ORD-${timestamp}-${random}`;
// };

// const setupPaymentListeners = (callback, orderId) => {
//   const { MpayModule } = NativeModules;
//   const mpayEmitter = new NativeEventEmitter(MpayModule);

//   cleanupListeners();

//   currentListeners.success = mpayEmitter.addListener(
//     PAYMENT_EVENTS.SUCCESS,
//     (order) => {
//       console.log('Payment success:', order);
//       cleanupListeners();
//       callback({
//         error: false,
//         data: 'Payment successful',
//         transactionId: orderId,
//         mpaytid: order.mpaytid || '',
//         mpaytno: order.mpaytno || ''
//       });
//     }
//   );

//   currentListeners.failure = mpayEmitter.addListener(
//     PAYMENT_EVENTS.FAILURE,
//     (errorInfo) => {
//       console.log('Payment error:', errorInfo);
//       cleanupListeners();
      
//       const isNetworkError = errorInfo.errorCode === NETWORK_ERROR_CODE;
//       const errorMessage = isNetworkError 
//         ? 'Network error, please check your connection' 
//         : errorInfo.errorInfo || 'Payment failed';

//       callback({
//         error: true,
//         data: errorMessage,
//         transactionId: isNetworkError ? orderId : '',
//         mpaytid: '',
//         mpaytno: ''
//       });
//     }
//   );
// };

// const initiatePayment = async (paymentInfo, callback, orderId) => {
//   const { MpayModule } = NativeModules;
  
//   try {
//     console.log('Initiating payment with order:', orderId);
//     await MpayModule.allPay(paymentInfo);
//   } catch (error) {
//     console.error('Payment initiation error:', error);
    
//     if (error.code === NETWORK_ERROR_CODE && paymentRetryCount < MAX_RETRIES) {
//       paymentRetryCount++;
//       console.log(`Retrying payment (attempt ${paymentRetryCount})...`);
//       setTimeout(() => initiatePayment(paymentInfo, callback, orderId), RETRY_DELAY);
//     } else {
//       cleanupListeners();
//       callback({
//         error: true,
//         data: error.message || 'Payment failed',
//         transactionId: '',
//         mpaytid: '',
//         mpaytno: ''
//       });
//     }
//   }
// };

// export const processMPayPayment = async (paymentInfo, callback) => {
//   if (paymentInProgress) {
//     callback({
//       error: true,
//       data: 'Another payment is already in progress',
//       transactionId: '',
//       mpaytid: '',
//       mpaytno: ''
//     });
//     return;
//   }

//   paymentInProgress = true;
//   paymentRetryCount = 0;
//   const orderId = generateOrderId();

//   try {
//     // Initialize SDK
//     await NativeModules.MpayModule.setEnvironmentType("PROD");
    
//     // Prepare payment data
//     const merchantInfo = {
//       store_id: '0001',
//       store_name: '筷子基店',
//       sub_merchant_id: '888535812230114',
//       sub_merchant_industry: '5812',
//       sub_merchant_name: 'MACAU NUTRITION',
//     };

//     const goodsDetails = paymentInfo.cartItems.map(item => ({
//       goods_id: item.id,
//       goods_name: item.name,
//       price: parseFloat(item.price).toFixed(2),
//       quantity: item.quantity,
//     }));

//     const paymentData = {
//       body: paymentInfo.description,
//       channel_type: '1',
//       currency: paymentInfo.currency,
//       extend_params: merchantInfo,
//       format: 'JSON',
//       goods_detail: goodsDetails,
//       it_b_pay: '5m',
//       nonce_str: generateRandomString(32),
//        notify_url: 'http://24.199.118.232/api/mpaynotify',
//       org_id: '888535812230114',
//       out_trans_id: orderId,
//       pay_channel: 'mpay',
//       product_code: 'MP_APP_PAY',
//       service: 'mpay.trade.mobile.pay',
//       subject: paymentInfo.name,
//       timestamp: Math.floor(Date.now() / 1000).toString(),
//       total_fee: parseFloat(paymentInfo.amount).toFixed(2),
//       version: '1.1.0',
//     };

//     // Get signature from server
//     const signatureResponse = await httpFactory.get(
//       `/getsignature/alldata?data=${JSON.stringify(paymentData)}`
//     );

//     if (!signatureResponse?.data?.sign) {
//       throw new Error('Failed to get payment signature');
//     }

//     const signedPaymentData = {
//       ...paymentData,
//       sign: signatureResponse.data.sign,
//       sign_type: 'RSA2'
//     };

//     // Set up listeners and initiate payment
//     setupPaymentListeners(callback, orderId);
//     await initiatePayment(JSON.stringify(signedPaymentData), callback, orderId);

//   } catch (error) {
//     console.error('Payment processing error:', error);
//     cleanupListeners();
//     callback({
//       error: true,
//       data: error.message || 'Payment processing failed',
//       transactionId: '',
//       mpaytid: '',
//       mpaytno: ''
//     });
//   }
// };