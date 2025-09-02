import React,{useState,useEffect} from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import auth from '@react-native-firebase/auth';
import ReduxWrapper from '../../utils/ReduxWrapper';
import AppIntroSlider from 'react-native-app-intro-slider';
import Feather from 'react-native-vector-icons/Feather';
import {appColors, shadow} from '../../utils/appColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import OptimizedLottie from '../../components/OptimizedLottie';
import "../../translation";
function Index({loginUser$, navigation, onIntroComplete}) {
  const { t, i18n } = useTranslation();
  const slides = [
    {
      key: 1,
      title: `${t('macauneutrition')}`,
      text: `${t('intro1')}`,
      image: require('../../static/images/intro/in1.jpeg'),
      backgroundColor: '#ffffff',
    },
    {
      key: 2,
      title: `${t('macauneutrition')}`,
      text: `${t('intro2')}`,
      lottie: require('../../static/delivery_motorbike.json'),
      backgroundColor: '#ffffff',
    },
    {
      key: 3,
      title: `${t('macauneutrition')}`,
      text: `${t('intro3')}`,
      lottie: require('../../static/coupon_discount.json'),
      backgroundColor: '#ffffff',
    }
  ];
  const _renderItem = ({ item }) => {
      return (
        <View style={styles.mainbox}>
          <View style={styles.imageContainer}>
            {item.lottie ? (
              <OptimizedLottie
                source={item.lottie}
                autoPlay
                loop={true}
                style={styles.lottieAnimation}
                pauseOnBackground={false}
              />
            ) : (
              <Image style={styles.logoImage} source={item.image} />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.centeredText}>
              {item.key === 2 ? 'SAME DAY DELIVERY' : 
               item.key === 3 ? 'MEMBERS DISCOUNT & PROMOTIONS' : 
               'WORLD TOP SUPPLEMENTS BRANDS'}
            </Text>
          </View>
        </View>
      );
    }
    
  const _renderNextButton = () => {
      return (
        <View style={styles.buttonCircle}>
          <Feather
            name="chevron-right"
            color="rgba(255, 255, 255, .9)"
            size={24}
          />
        </View>
      );
    };
    
  const _renderDoneButton = () => {
      return (
        <View style={styles.buttonCircle}>
          <Feather
            name="check"
            color="rgba(255, 255, 255, .9)"
            size={24}
          />
        </View>
      );
    };
    
  const _onDone = async () => {
      await AsyncStorage.setItem('isIntro', 'yes');
      // Call the callback to hide intro and show main app
      if (onIntroComplete) {
        onIntroComplete();
      }
    }
    
  const loadData = async () => {
      const intro = await AsyncStorage.getItem('isIntro');
      if(intro == 'yes') {
        // If intro was already shown, call callback to show main app
        if (onIntroComplete) {
          onIntroComplete();
        }
      }
    }
    
    useEffect( () => {
     loadData()
   }, []);
    return (
        <AppIntroSlider
          dotStyle={{backgroundColor:'#CCCCCC'}}
          activeDotStyle={{backgroundColor:appColors.primary}}
          renderItem={_renderItem}
          data={slides}
          renderDoneButton={_renderDoneButton}
          renderNextButton={_renderNextButton}
          onDone={_onDone}
          />
    )
}

export default ReduxWrapper(Index)

const styles = StyleSheet.create({
  mainbox:{
    backgroundColor:'#ffffff',
    height:'100%',
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inerbox: {
    alignItems:'center',
    marginVertical: 50,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: appColors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 400,
    margin:'auto',
  },
  decrip: {
    color: '#fff',
    fontSize:20,
    lineHeight: 30,
    paddingHorizontal:30,
    marginTop:50
  },
  centeredText: {
    color: '#000000',
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  imageContainer: {
    height: '70%',
    width: '100%',
    marginTop: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    height: '30%',
    width: '100%',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 50,
    paddingTop: 20,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  lottieAnimation: {
    width: '100%', // Full width to match image container
    height: '100%', // Full height to match image container
  }
});
