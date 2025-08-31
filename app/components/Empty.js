import {View, Text, Image} from 'react-native';
import OptimizedLottie from './OptimizedLottie';
import React from 'react';
import Label from './Label';
import {scale} from 'react-native-size-matters';
import ICEmpty from '../Icons/ICEmpty';

export default function Empty({label}) {
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center' }}>
    { label&& <Label style={{fontSize:scale(23), paddingVertical:scale(20)}} text={label} />}
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <OptimizedLottie
        source={require('../static/emptycart.json')}
        autoPlay
        loop={true}
        style={{width: 150, height: 150}}
        pauseOnBackground={true}
      />
    </View>
    </View>
  );
}
