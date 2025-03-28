import React,{useState,useEffect} from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import auth from '@react-native-firebase/auth';
import ReduxWrapper from '../../utils/ReduxWrapper';
import AppIntroSlider from 'react-native-app-intro-slider';
import Feather from 'react-native-vector-icons/Feather';
import {appColors, shadow} from '../../utils/appColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import "../../translation";
function Index({loginUser$,navigation}) {
  const { t, i18n } = useTranslation();
  const slides = [
    {
      key: 1,
      title: `${t('macauneutrition')}`,
      text: `${t('intro1')}`,
      image: require('../../static/images/intro/in1.jpeg'),
      backgroundColor: '#59b2ab',
    },
    {
      key: 2,
      title: `${t('macauneutrition')}`,
      text: `${t('intro2')}`,
    image: require('../../static/images/intro/in2.jpeg'),
      backgroundColor: '#febe29',
    },
    {
      key: 3,
      title: `${t('macauneutrition')}`,
      text: `${t('intro3')}`,
      image: require('../../static/images/intro/in3.jpeg'),
      backgroundColor: '#22bcb5',
    }
  ];
   _renderItem = ({ item }) => {
      return (
        <View style={styles.mainbox}>
          <View style={styles.inerbox}>
            <Image style={styles.image} source={item.image} />
          </View>
          <Text style={styles.decrip}>{item.text}</Text>
        </View>
      );
    }
    _renderNextButton = () => {
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
    _renderDoneButton = () => {
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
    _onDone = async () => {
      await AsyncStorage.setItem('isIntro', 'yes');
      navigation.navigate('Login');
    }
    loadData = async () => {
      const intro = await AsyncStorage.getItem('isIntro');
      if(intro == 'yes') {
        navigation.navigate('Login');
      }
    }
    useEffect( () => {
     loadData()
   }, []);
    return (
        <AppIntroSlider
          dotStyle={{backgroundColor:'#fff'}}
          activeDotStyle={{backgroundColor:appColors.primary}}
          renderItem={this._renderItem}
          data={slides}
          renderDoneButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
          onDone={this._onDone}

          />
    )
}

export default ReduxWrapper(Index)

const styles = StyleSheet.create({
  mainbox:{
    backgroundColor:'#000',
    height:'100%',
    width:'100%',
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
  }
});
