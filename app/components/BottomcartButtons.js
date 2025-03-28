import React from 'react'
import { View, Text } from 'react-native'
import { scale } from 'react-native-size-matters'
import { appColors } from '../utils/appColors'
import CustomButton from '../components/CustomButton'
import Label from './Label'
export default function BottomButtons({buttonLabel,priceLabel, price,onPress}) {
    return (
        <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          bottom: scale(15),
          paddingHorizontal: scale(0),
        }}>

        <CustomButton style={{  width: '100%'}} onPress={onPress&&onPress} label={buttonLabel} />
      </View>
    )
}
