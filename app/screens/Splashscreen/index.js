import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import OptimizedLottie from '../../components/OptimizedLottie';
import RNBootSplash from "react-native-bootsplash";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
  RNBootSplash.hide({ fade: true })
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginTop:-20,}}>
      <OptimizedLottie
        source={require('../../static/bikelotti.json')}
        autoPlay
        loop={true}
        style={{width: 320, height: 320}}
        pauseOnBackground={false}
      />
    </View>
  );
};


export default SplashScreen;
