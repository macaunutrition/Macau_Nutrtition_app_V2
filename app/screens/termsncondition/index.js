import React, {useEffect} from 'react'
import { View, Text } from 'react-native'
import Container from '../../components/Container'
import ScreenHeader from '../../components/ScreenHeader'
import SelectAble from '../../components/SelectAble'
import CustomButton from '../../components/CustomButton'
import { scale } from 'react-native-size-matters'
import { useTranslation } from "react-i18next";
import "../../translation";
import { firebase } from '@react-native-firebase/analytics';

export default function index() {
  const { t, i18n } = useTranslation();
  const addanalytics = async () => {
    await firebase.analytics().setCurrentScreen('TermsAndConditions');
  }
  useEffect(() => {
    addanalytics();
  }, []);
  return (
        <>
        {i18n.language == 'en' ? (
          <Container isScrollable>
              <ScreenHeader label="Terms and conditions"  />
              <View style={{fontSize:16}}>
                <Text style={{fontSize:18,marginBottom:15}}>
                  Disclaimer:
                </Text>
                <Text style={{paddingBottom:20,fontWeight:'bold',fontSize:20}}>
                  All products available through the Macau Nutrition Online App Store are nutritional supplements. None of the products sold are intended to treat, cure, diagnose, or prevent any known disease. The information and advice provided by Macau Nutrition are for informative purposes only and should not be considered as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare providers with any questions you may have regarding a medical condition.
                </Text>
                <Text style={{fontSize:18,marginBottom:15}}>
                  Terms of Use:
                </Text>
                <Text style={{fontSize:16,marginBottom:15}}>
                  1. Account Responsibility: Customers are responsible for maintaining the confidentiality of their account details and are liable for all activities that occur under their account.
                </Text>
                <Text style={{fontSize:16,marginBottom:15}}>
                  2. Product Information: Product descriptions on the Macau Nutrition Online App Store are not meant to substitute for the advice provided by your own physician or other medical professional.
                </Text>
                <Text style={{fontSize:16,marginBottom:15}}>
                  3. Purchases: All sales are subject to our return and exchange policy. Products that have been purchased and their package has been opened will not be eligible for exchange or refund. However, if the product delivered has damaged packaging, an exchange or refund may be requested.
                </Text>
                <Text style={{fontSize:16,marginBottom:15}}>
                  4. Product Use: The consumer assumes all risks and responsibilities for the use of any products purchased from Macau Nutrition Online App Store.
                </Text>
                <Text style={{fontSize:16,marginBottom:15}}>
                  5. Termination: Macau Nutrition reserves the right to terminate your account and restrict access to the online app store, at its sole discretion.
                </Text>
                <Text style={{fontSize:16,marginBottom:15}}>
                  6. Limitation of Liability: Under no circumstances shall Macau Nutrition be liable for any direct, indirect, incidental, special, or consequential damages that result from the use of, or inability to use the online app store.
                </Text>
              </View>
          </Container> ) : (
            <Container isScrollable>
                <ScreenHeader label="使用之條款及細則"  />
                <View style={{fontSize:16}}>
                  <Text style={{fontSize:18,marginBottom:15}}>
                    免責聲明：
                  </Text>
                  <Text style={{paddingBottom:20,fontWeight:'bold',fontSize:20}}>
                    澳門健美營養流動應用程式(APP)所提供的所有產品為營養補充品。所售賣的產品並非用於治療、治癒、診斷或預防任何已知疾病。澳門健營養提供的信息及建議僅供參考，不應視之為專業醫學建議、診斷或治療。如有任何醫療狀況問題，請務必諮詢您的醫生.
                  </Text>
                  <Text style={{fontSize:18,marginBottom:15}}>
                    使用條款：
                  </Text>
                  <Text style={{fontSize:16,marginBottom:15}}>
                    1. 帳戶責任：客戶負責保持其帳戶詳情的機密性，並對其帳戶下發生的所有活動負責。
                  </Text>
                  <Text style={{fontSize:16,marginBottom:15}}>
                    2. 產品信息：澳門健美營養流動應用程式(APP)的產品描述不能替代醫生或其他醫療專業人員提供嘅建議。
                  </Text>
                  <Text style={{fontSize:16,marginBottom:15}}>
                    3. 購買：所有銷售均受我們退換貨政策約束。一旦產品包裝被打開，將不符合換貨或退款條件。然而，如收到的產品包裝有損壞，可以要求換貨或退款。
                  </Text>
                  <Text style={{fontSize:16,marginBottom:15}}>
                    4. 產品使用：消費者須對購自澳門健美營養網上應用商店的任何產品嘅使用承擔所有風險和責任。
                  </Text>
                  <Text style={{fontSize:16,marginBottom:15}}>
                    5. 終止：澳門健美營養可隨時終止您的帳戶遊覽或使用流動應用程式(APP)的權利，而不一定需給用戶通知。
                  </Text>
                  <Text style={{fontSize:16,marginBottom:15}}>
                    6. 責任限制：在任何情況下，澳門健美營養均不對因使用或無法使用網上應用商店而導致的任何直接、間接、附帶、特別或相應而生嘅損害承擔責任。
                  </Text>
                </View>
            </Container> )}



        </>
    )
}
