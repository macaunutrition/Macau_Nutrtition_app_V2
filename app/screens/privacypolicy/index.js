import React, {useEffect} from 'react'
import { View, Text, Linking } from 'react-native'
import Container from '../../components/Container'
import ScreenHeader from '../../components/ScreenHeader'
import SelectAble from '../../components/SelectAble'
import CustomButton from '../../components/CustomButton'
import { scale } from 'react-native-size-matters'
import {appColors, shadow} from '../../utils/appColors';
import { useTranslation } from "react-i18next";
import "../../translation";
import { firebase } from '@react-native-firebase/analytics';

export default function index() {
    const { t, i18n } = useTranslation();
    const addanalytics = async () => {
      await firebase.analytics().setCurrentScreen('PrivacyPolicy');
    }
    useEffect(() => {
      addanalytics();
    }, []);
    return (
        <>
        {i18n.language == 'en' ? (
          <Container isScrollable>
              <ScreenHeader label="Privacy Policy"  />
              <View style={{fontSize:16}}>
                <Text style={{fontSize:16,marginBottom:15}}>
                  Macau Nutrition is committed to maintaining the strictest protection of your personal data, including your email, phone number, name, and any other customer information. This information will not be disclosed or shared with any third-party entities without your consent, except as necessary to provide services or products requested by you, or as required by law. We adhere to all applicable privacy laws and regulations, including but not limited to those that regulate the collection, use, handling, and disclosure of personal information.
                </Text>
                <Text style={{fontSize:16,marginBottom:15}}>
                  By using the Macau Nutrition Online App Store, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use, Disclaimer, and our Privacy Policy. We reserve the right, at our discretion, to modify these terms at any time. Continued use of the App Store following the posting of any changes means acceptance of those changes.
                </Text>
                <Text style={{fontSize:16,marginBottom:15,lineHeight:25}}>
                  If you have any questions, please contact us at <Text style={{color:appColors.primary,fontWeight:'bold'}} onPress={() => Linking.openURL('mailto:info@macaunutrition.com')}>info@macaunutrition.com</Text>
                </Text>
              </View>
          </Container> ) : (
            <Container isScrollable>
                <ScreenHeader label="隱私政策"  />
                <View style={{fontSize:16}}>
                  <Text style={{fontSize:16,marginBottom:15}}>
                  澳門健美營養致力於嚴格保護您的個人資料，包括您的電郵、電話號碼、姓名及任何其他客戶信息。未經您的同意，我們不會向任何第三方披露或共享該等信息，除非為了向您提供所請求的服務或產品，或法律所需。我們遵守所有適用的隱私法律及規定，包括但不限於那些規範個人資料收集、使用、處理及披露的法規。
                  </Text>
                  <Text style={{fontSize:16,marginBottom:15}}>
                    通過使用澳門健美營養流動應用程式(APP)，確認您已閱讀、理解並同意接受這些使用條款、免責聲明以及我們的隱私政策所約束。我們保留隨時修改這些條款的權利。繼續使用應用程式(APP)即表示您接受這些變更。
                  </Text>
                  <Text style={{fontSize:16,marginBottom:15,lineHeight:25}}>
                    如果您有任何疑問，請通過 <Text style={{color:appColors.primary,fontWeight:'bold'}} onPress={() => Linking.openURL('mailto:info@macaunutrition.com')}>info@macaunutrition.com</Text> 與我們聯繫
                  </Text>
                </View>
            </Container> )}

        </>
    )
}
