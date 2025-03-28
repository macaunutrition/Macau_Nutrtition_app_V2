import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import RNBootSplash from "react-native-bootsplash";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
  RNBootSplash.hide({ fade: true })
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginTop:-20,}}>
      <LottieView
        source={require('../../static/bikelotti.json')}
        autoPlay
        loop={true}
        style={{width: 320, height: 320}}
      />
    </View>
  );
};


export default SplashScreen;
