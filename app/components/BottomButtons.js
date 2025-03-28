import React from 'react'
import { View, Text } from 'react-native'
import { scale } from 'react-native-size-matters'
import { appColors } from '../utils/appColors'
import CustomButton from '../components/CustomButton'
import Label from './Label'
export default function BottomButtons({buttonLabel,priceLabel, price,onPress,icon,count}) {
    return (
        <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          bottom: scale(15),
          paddingHorizontal: scale(20),
          backgroundColor: appColors.white,
        }}>
        <View style={{justifyContent:'center', alignItems:'left'}}>
          <Label
            text={priceLabel ? priceLabel :"PRICE"}
            style={{
              fontSize: scale(14),
              opacity: scale(0.4),
              letterSpacing: scale(2),
            }}
          />
          {count && <Label
            text={count}
            style={{
              fontSize: scale(12),
              letterSpacing: scale(2),
            }}
          />}
          {price && <Label
            text={price}
            style={{
              fontSize: scale(16),
              fontWeight: '800',
              color: appColors.primaryDark,
              marginTop: scale(7),
            }}
          />}
        </View>
        <CustomButton style={{width:175,fontSize:16, paddingHorizontal:10}} onPress={onPress&&onPress} label={buttonLabel} />
      </View>
    )
}
